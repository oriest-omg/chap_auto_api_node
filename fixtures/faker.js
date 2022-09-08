const { faker } = require('@faker-js/faker');
const Commande = require('../models/Commande');
const LigneCommande = require('../models/LigneCommande');
const Marque = require('../models/Marque');
const Utilisateur = require("../models/Utilisateur");
const Voiture = require('../models/Voiture');
const flog = console.log;

async function fausseDonne()
{
    await utilisateurFixture();
    await marqueFixture();
    await voitureFixture();
    commandeFixture();
    ligneCommandeFixture();
}
async function utilisateurFixture() {
    await Utilisateur.deleteMany({});
    let quartier = '';
    const commune = faker.helpers.arrayElement(['cocody', 'yopougon', 'marcory'])
    if (commune == 'cocody') {
        quartier = faker.helpers.arrayElement(['angre', 'palmeraie', 'rivera'])
    }
    const utilisateur = new Utilisateur({
        nom: "Djelloh",
        prenom: "oriest",
        email: "ori@gmail.com",
        mobile: "0705020309",
        mot_de_passe: "1234",
        addresse_physique: {
            ville: "Abidjan",
            commune: commune,
            quartier: quartier,
            rue: "",
        }
    })
     utilisateur.save();
    //fake
    for (i = 0; i <= 10; i++) {
        let quartier = '';
        const commune = faker.helpers.arrayElement(['cocody', 'yopougon', 'marcory'])
        if (commune == 'cocody') {
            quartier = faker.helpers.arrayElement(['angre', 'palmeraie', 'rivera'])
        }
        const utilisateur = new Utilisateur({
            nom: faker.name.firstName(),
            prenom: faker.name.lastName(),
            email: faker.internet.email(),
            mobile: faker.phone.number(),
            mot_de_passe: faker.internet.password(),
            addresse_physique: {
                ville: "Abidjan",
                commune: commune,
                quartier: quartier,
                rue: String,
            }
        })
         utilisateur.save();
    }
}
async function marqueFixture(){
    await Marque.deleteMany({});
    const _marque = ['BMW', 'AUDI', 'DACIA']
    for (i = 0; i < _marque.length; i++) {
        const marque = new Marque({
            _id: _marque[i],
            image:"logobm.png"
        });
        marque.save();
    }
}
async function voitureFixture() {
   await  Voiture.deleteMany({});
    for (i = 0; i <= 10; i++) {
        let modele = '';
        let statut = faker.helpers.arrayElement(['disponible', 'location'])
        let marques; 
        await  Marque.find().then((data)=>{
            marques = data;
        }) 
        const marque = faker.helpers.arrayElement(marques);
        if (marque._id == 'BMW') {
            modele = faker.helpers.arrayElement(['I3', 'I4', 'I8', 'IX', 'SERIE 6'])
        }
        if (marque._id == 'AUDI') {
            modele = faker.helpers.arrayElement(['A1', 'A3', 'A4', 'A5', 'A6'])
        }
        if (marque._id == 'DACIA') {
            modele = faker.helpers.arrayElement(['JOGGER', 'DUSTER', 'BIGSTER', 'DOKKER', 'LOGAN'])
        }
        var couleurs = ['0xff000000','0xffffffff','0xffe0d040','0xff2a22a2'];
        var objCouleur = [];

        for (c = 0; c <= 3; c++) {
        objCouleur.push({
                valeur: couleurs[c],
                quantite: faker.random.numeric(1)
            });
            // couleurs.push(faker.color.human())
        }

        //calcul quantite
        var qte = 0;
        for(qtee of objCouleur)
        {
            qte = qte+ parseInt(qtee.quantite);
        }
        const voiture = new Voiture({
            marque: marque,
            modele: modele,
            image: "voiture-1.jpg",
            image_miniature: "/image-miniature/" + marque + "-" + modele,
            prix: faker.random.numeric(5),
            type_annonce: "location",
            couleurs:objCouleur,
            quantite:qte,
            statut: statut
        })
        voiture.save();
    }
}

async function commandeFixture(){
    await Commande.deleteMany({});

    let utilisateurs;
    await  Utilisateur.find().then((data)=>{
        utilisateurs = data;
    })

    for (i = 0; i <= 10; i++) {
    const utilisateur  = faker.helpers.arrayElement(utilisateurs); 
    const commande = new Commande({
        code:"CHAP"+i,
        utilisateur: utilisateur._id,
        paiementStatus:faker.helpers.arrayElement(['paye','annule','en cours']),
        adress:{
            ville:utilisateur.addresse_physique.ville,
            commune:utilisateur.addresse_physique.commune,
            quartier:utilisateur.addresse_physique.quartier
        }
    });
    commande.save();
    }
}
async function ligneCommandeFixture(){
    await LigneCommande.deleteMany({});

    let voitures;
    await Voiture.find().then((data)=>{
        voitures = data;
    });
    let commandes;
    await Commande.find().then((data)=>{
        commandes = data;
    })
    for(i = 0; i <= 10; i++){
        //créeation de ligne commande
        const voiture  = faker.helpers.arrayElement(voitures); 
        const commande  = faker.helpers.arrayElement(commandes); 
        const quantite = faker.random.numeric(1);
        const prixVente = quantite*voiture.prix;
        const ligneCommande = new LigneCommande({
            commande:commande._id,
            voiture: voiture._id,
            quantite:quantite,
            prixVente:prixVente
        });
        ligneCommande.save();
    }
    for(i = 0; i <= 10; i++){
        //mise à jour de commande
        const cmd = faker.helpers.arrayElement(commandes);
        const ligneCommande = await LigneCommande.find({"commande":cmd._id});
        //update//

        //calcul total commande
        var totalPrix = 0;
        for(cmmd of ligneCommande)
        {
            totalPrix = totalPrix+cmmd.prixVente;
        }
        const filter = {"_id": cmd._id};
        const update = {
            "ligneCommande": ligneCommande,
            "totalPrix":totalPrix
        };
        const commandeSave = await Commande.findByIdAndUpdate(filter,update);
        commandeSave.save();
    }

}
module.exports = { 
    "utilisateurFixture": utilisateurFixture,
     "voitureFixture": voitureFixture,
     "commandeFixture": commandeFixture,
    "ligneCommandeFixture":ligneCommandeFixture,
    "fausseDonne":fausseDonne }