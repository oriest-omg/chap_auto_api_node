//Controller
const utilisateurController = require("../controllers/utilisateur-controller");
const voitureController = require("../controllers/voiture-controller");
const commandeController = require("../controllers/commande-controller");
const ligneCommandeController = require("../controllers/ligne-commande-controller");
const marqueController = require("../controllers/marque-controller");
//Guards
const authGuard = require("../guards/authGuard");
//Mail
const mailController = require("../controllers/mail-controller.js");
//uplod
const telechargementController = require("../controllers/telechargement-controller");
//notification
const pushNotificationController = require("../controllers/push-notification-controller");
//sms
const smsController = require("../controllers/sms-controller");
module.exports = (server) => {
  //utilisateur
  server.post("/api/connexion", utilisateurController.connexionTutilisateur);
  server.post(
    "/api/inscription",
    utilisateurController.postUtilisateur,
    smsController.sendSMS,
    mailController.inscription
  );
  server.get("/api/utilisateurs", utilisateurController.getUtilisateurs);
  server.get("/api/utilisateur/:id", utilisateurController.getUtilisateur);
  server.delete(
    "/api/utilisateur/:id",
    utilisateurController.deleteUtilisateur
  );
  server.put("/api/utilisateur", utilisateurController.putUtilisateur);
  //nouveau mdp
  server.post("/api/nouveauMdp",utilisateurController.putCodeMotDePasseUtilisateur);
  server.post("/api/changementMotDePasse",utilisateurController.putMotDePasseUtilisateur);
  //test jwt
  server.post(
    "/profile",
    authGuard.loginRequired,
    utilisateurController.profile
  );
  //verifier code 
  server.post("/api/verificationMobile",utilisateurController.verifierCode);
  //Marque
  server.get("/api/marques",marqueController.getMarques)
  //Voiture
  server.get("/api/voitures", voitureController.getVoitures);
  server.get("/api/voiture/:id", voitureController.getVoiture);
  server.post("/api/voiture",voitureController.postVoiture);
  server.delete("/api/voiture-delete/:id",voitureController.deleteVoiture);
  //Commande
  server.get("/api/commandes", commandeController.getCommandes);
  server.post("/api/commande",commandeController.postCommande);
  server.get("/api/commande/:id", commandeController.getCommandeAndSendMail);
  //ligneCommande
  server.post("/api/ligneCommande",ligneCommandeController.postLigneCommande);
  //telechargement
  server.post("/api/telechargement",telechargementController.upload);
  //notification
  // server.get("/api/sendNotification",pushNotificationController.SendNotification);
  // server.post("/api/sendNotificationToDevice",pushNotificationController.SendNotificationToDevice);
  server.post("/api/notif",pushNotificationController.sendNotification);
};
