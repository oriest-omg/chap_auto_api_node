//Controller
const utilisateurController = require("../controllers/utilisateur-controller");
const voitureController = require("../controllers/voiture-controller");
const commandeController = require("../controllers/commande-controller");
const ligneCommandeController = require("../controllers/ligne-commande-controller");

//Guards
const authGuard = require("../guards/authGuard");
//Mail
const mailController = require("../controllers/mail-controller.js");
//uplod
const telechargementController = require("../controllers/telechargement-controller");
module.exports = (server) => {
  //utilisateur
  server.post("/api/connexion", utilisateurController.connexionTutilisateur);
  server.post(
    "/api/inscription",
    utilisateurController.postUtilisateur,
    mailController.inscription
  );
  server.get("/api/utilisateurs", utilisateurController.getUtilisateurs);
  server.get("/api/utilisateur/:id", utilisateurController.getUtilisateur);
  server.delete(
    "/api/utilisateur/:id",
    utilisateurController.deleteUtilisateur
  );
  server.put("/api/utilisateur", utilisateurController.putUtilisateur);
  //test jwt
  server.post(
    "/profile",
    authGuard.loginRequired,
    utilisateurController.profile
  );

  //Voiture
  server.get("/api/voitures", voitureController.getVoitures);
  server.get("/api/voiture/:id", voitureController.getVoiture);
  server.post("/api/voiture",voitureController.postVoiture);
  server.delete("/api/voiture/:id",voitureController.deleteVoiture);
  //Commande
  server.get("/api/commandes", commandeController.getCommandes);
  server.post("/api/commande",commandeController.postCommande);
  //ligneCommande
  server.post("/api/ligneCommande",ligneCommandeController.postLigneCommande);
  //telechargement
  server.post("/api/telechargement",telechargementController.upload);
};
