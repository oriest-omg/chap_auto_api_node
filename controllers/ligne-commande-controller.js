const LigneCommande = require("../models/LigneCommande");
const Commande = require("../models/Commande");
const Voiture = require("../models/Voiture");

module.exports = {
    async postLigneCommande(req,res){
        
        const body = req.body;
        const {couleurchoisie} = body;
        const {commande,voiture,quantite,prixVente} = body;
        const ligneCommande = new LigneCommande({
            commande : commande,
            voiture: voiture,
            quantite: parseInt(quantite),
            prixVente: parseInt(prixVente)
        });
        ligneCommande.save().then((ligneCommande)=>{
            res.send(ligneCommande);
        });

        //maj quantité voiture
        const hex = couleurchoisie.toString(16);
        const voitureMAJ = await Voiture.findById(voiture);
        for(clr of voitureMAJ.couleurs)
        {
            if(clr.valeur == "0x"+hex)
            {
                const filterVoiture = {
                                        "_id":voiture,
                                        "couleurs._id":clr._id.valueOf()
                                        };
                const updateVoiture = {
                                        $set:{
                                            "quantite":voitureMAJ.quantite - parseInt(quantite),
                                            "couleurs.$.quantite": clr.quantite - parseInt(quantite)
                                            }
                                    };
            const voitureSave = await Voiture.findOneAndUpdate(filterVoiture,updateVoiture);
            voitureSave.save();
            }
        }
        //maj commande

        

        //calcul total commande
        console.log("commande à mettre à jour",commande);
        const cmd = await Commande.findById(commande);
        totalPrix = cmd.totalPrix+ligneCommande.prixVente*ligneCommande.quantite;
        const filter = {"_id": commande};
        const update = {
        $push: { "ligneCommande" : ligneCommande },totalPrix:totalPrix };

        const commandeSave = await Commande.findByIdAndUpdate(filter,update);
        commandeSave.save();
    },
}