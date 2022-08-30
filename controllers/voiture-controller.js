const Voiture = require("../models/Voiture")
module.exports={
    getVoitures(req,res){
        Voiture.find().sort({'_id':1}).then((voitures) =>{
            res.send(voitures);
        })
    },
    getVoiture(req,res){
        const {id} = req.params;
        Voiture.findById(id).then((voiture)=>{
            res.send(voiture);
        });
    },
    // getFile (req, res) {
    //     const {id} = req.params;
    //     Voiture.findById(id).then((image)=>{
    //         res.sendFile(path.resolve(image.source));
    //     })
    // },
    postVoiture(req,res){
        const body = req.body;
        const {marque,modele,prix,couleurs,image,image_miniature} = body;
        let quantite = 0;
        console.log(couleurs);
        try{
            couleurs.forEach(couleur => {
                quantite = quantite+ parseInt(couleur.quantite);
            });
        }catch{

        }
        const voiture = new Voiture({
            marque:marque,
            modele:modele,
            image:image,
            image_miniature:image_miniature,
            prix:prix,
            couleurs:couleurs,
            quantite:quantite,
            statut:'disponible'
        })
        voiture.save().then(()=>{
            res.send(voiture);
        });
    },
    deleteVoiture(req, res) {
        const { id } = req.params;
        Voiture.findByIdAndRemove(id).then((voiture) => {
          res.send(voiture);
        });
      },
}
