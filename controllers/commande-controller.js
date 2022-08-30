const Commande = require("../models/Commande");

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
};
