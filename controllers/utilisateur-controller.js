const Utilisateur = require("../models/Utilisateur");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
  getUtilisateurs(req, res) {
    Utilisateur.find().then((utilisateurs) => {
      res.send(utilisateurs);
    });
  },
  getUtilisateur(req, res) {
    const { id } = req.params;
    Utilisateur.findById(id).then((utilisateur) => {
      res.send(utilisateur);
    });
  },
  connexionTutilisateur(req, res) {
    const { email } = req.body;
    const { mdp } = req.body;
    Utilisateur.findOne({ email: email }).then((utilisateur) => {
      if (utilisateur) {
        utilisateur.compareMotDePasse(mdp, function (err, estCorrect) {
          if (err) throw err;
          if (estCorrect) {
            return res.json({
              token: jwt.sign(
                {
                  email: utilisateur.email,
                  nom: utilisateur.nom,
                  _id: utilisateur._id,
                  prenom : utilisateur.prenom,
                  mobile: utilisateur.mobile,
                  date_creation : utilisateur.date_creation,
                  addresse_physique : utilisateur.addresse_physique,
                  address_livraison : utilisateur.adresse_Livraison
                },
                process.env.SECRET,
                { expiresIn: process.env.EXPIRATION }
              ),
              expiration: process.env.EXPIRATION,
            });
          } else {
            return res
              .status(401)
              .json({ error: "vérifier votre mot de passe" });
          }
        });
      } else {
        return res
          .status(401)
          .json({ error: "vérifier les informations sur l'utilisateur" });
      }
    });
  },
  deleteUtilisateur(req, res) {
    const { id } = req.params;
    Utilisateur.findByIdAndRemove(id).then((utilisateur) => {
      res.send(utilisateur);
    });
  },
  postUtilisateur(req, res, next) {
    const body = req.body;
    const { nom } = body;
    const { prenom } = body;
    const { email } = body;
    const { mobile } = body;
    const { mdp } = body;
    const utilisateur = new Utilisateur({
      nom: nom,
      prenom: prenom,
      email: email,
      mobile: mobile,
      mot_de_passe: mdp,
    });
    utilisateur.save().then(() => {
      res.send(utilisateur);
      next();
    });
  },
  profile(req, res, next) {
    if (req.utilisateur) {
      res.send(req.utilisateur);
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  },
  async putUtilisateur(req, res) {
    console.log(req.body);
    //var//
    const { id, nom, prenom, email, mobile } = req.body;

    //update//
    const filter = { _id: id };
    const update = {
      nom: nom,
      prenom: prenom,
      email: email,
      mobile: mobile,
    };

    let utilisateur = await Utilisateur.findByIdAndUpdate(filter, update);
    console.log(product);
    utilisateur.save().then(async () => {
      res.send(utilisateur);
    });
  },
};
