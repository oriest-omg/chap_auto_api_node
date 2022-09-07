const LigneCommande = require("../models/LigneCommande");
const Commande = require("../models/Commande");

module.exports = {
    async postLigneCommande(req,res){
        const body = req.body;
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