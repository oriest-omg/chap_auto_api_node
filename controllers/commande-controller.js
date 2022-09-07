const Commande = require("../models/Commande");
const mailController = require("../controllers/mail-controller.js");

module.exports = {
  getCommandes(req, res) {
    Commande.find()
      .sort({ _id: -1 })
      .populate([
        {
          path: "utilisateur",
          model: "Utilisateur",
        },
        {
          path: "ligneCommande",
          model: "LigneCommande",
          populate: {
            path: "voiture",
            model: "Voiture",
          },
        },
      ])
      .then((commandes) => {
        res.send(commandes);
      });
  },
  postCommande(req,res){
      const body = req.body;
      const {code,utilisateur,paiementStatus} = body;
      const commande = new Commande({
        code : code,
        utilisateur: utilisateur,
        paiementStatus : paiementStatus,
        totalPrix : 0
      });
      commande.save().then(()=>{
        res.send(commande);
      })
  },
  getCommandeAndSendMail(req,res){
    const {id} = req.params;
    Commande.findById(id).populate([
      {
        path: "utilisateur",
        model: "Utilisateur",
      },
      {
        path: "ligneCommande",
        model: "LigneCommande",
        populate: {
          path: "voiture",
          model: "Voiture",
        },
      },
    ]).then((commande)=>{
        mailController.commandeMail(commande);
    })
}
};
