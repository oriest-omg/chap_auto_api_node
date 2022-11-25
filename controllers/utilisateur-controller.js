const Utilisateur = require("../models/Utilisateur");

const mailController = require("../controllers/mail-controller.js");
const jwt = require("jsonwebtoken");
const Commande = require("../models/Commande");
require("dotenv").config();


function genRand(len){
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
}
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
                  prenom: utilisateur.prenom,
                  mobile: utilisateur.mobile,
                  date_creation: utilisateur.date_creation,
                  addresse_physique: utilisateur.addresse_physique,
                  address_livraison: utilisateur.adresse_Livraison,
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
  async verifierCode(req, res) {
    const { code } = req.body;
    console.log(code);
    Utilisateur.findOne({ verifie: code }).then(async (user) => {
      console.log(user);
      const filter = { _id: user._id };
      const update = {
        verifie: "verifie",
      };
      let utilisateur = await Utilisateur.findByIdAndUpdate(filter, update);
      utilisateur.save().then(async () => {
        res.send(utilisateur);
      });
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

    console.log(genRand(4));
    const codeValidation = genRand(4);
    const utilisateur = new Utilisateur({
      nom: nom,
      prenom: prenom,
      email: email,
      mobile: mobile,
      mot_de_passe: { 
        hased_password: mdp,        
        reset_in_progress:false,
        reset_code: "0000",
        active:true },
      verifie: codeValidation,
    });
    utilisateur.save().then(() => {
      res.send(utilisateur);
      next();
    });
  },
  profile(req, res, next) {
    if (req.utilisateur) {
      res.send(req.utilisateur)
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

  //génération du code permettant le changement de mot de passe
  async putCodeMotDePasseUtilisateur(req, res, next) {
    console.log("envoyer code pour changer mot de passe");
    const { mail } = req.body;
    const user = await Utilisateur.findOne({ email: mail });
    console.log("AVANT XXXXXXXXXXX");
    console.log(user);
    console.log("APRES XXXXXXXXXXX");
    //update//
    const filter = { _id: user._id };
    const update = {
      mot_de_passe: {
        hased_password: user.mot_de_passe.hased_password,
        reset_in_progress:true,
        reset_code: genRand(10),
        active:false,
        // reset_expires:Date.now()+2
      },
    };
    let utilisateur = await Utilisateur.findByIdAndUpdate(
      filter,
      update,
      { new: true },
    );
    utilisateur.save().then(async () => {
      res.send(utilisateur);
    });
    mailController.mailPourUnNouveauMdp(utilisateur);
  },


    //génération du code permettant le changement de mot de passe
    async putMotDePasseUtilisateur(req, res, next) {
      console.log("envoyer code pour changer mot de passe");
      const { mail } = req.body;
      const {pass} = req.body;
      console.log(mail,pass);
      const user = await Utilisateur.findOne({ email: mail });
      console.log("AVANT XXXXXXXXXXX");
      console.log(user);
      console.log("APRES XXXXXXXXXXX");
      //update//
      const filter = { _id: user._id };
      const update = {
        mot_de_passe: {
          hased_password: pass,
          reset_in_progress:false,
          reset_code: 0000,
          active:true,
          // reset_expires:Date.now()+2
        },
      };
      let utilisateur = await Utilisateur.findByIdAndUpdate(
        filter,
        update,
        { new: true },
      );
      utilisateur.save().then(async () => {
        res.send(utilisateur);
      });
      mailController.mailPourUnNouveauMdp(utilisateur);
    },
    //obtenir l'historique des commandes d'un utilisateur
    // async getHistorique(req,res,next){
    //   const {utilisateur} = req.body;
    //   const commande = await Commande.find({ utilisateur: utilisateur });

    // }
};
