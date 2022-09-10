const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const route = require('./routes/index');
const fixture = require('./fixtures/faker');
const PORT = 3000;
const server = express();
const authGuard = require('./guards/authGuard');
var path = require("path");
require('dotenv').config();


mongoose.Promise = global.Promise;

server.use(bodyParser.json());

//veifier token
server.use(authGuard.verificationToken);
server.use(express.static(path.join(__dirname, 'files')));
route(server);

//verifier route
server.use(authGuard.verificationRoute);


server.listen(process.env.PORT || PORT,async(req, res) => {
    fixture.fausseDonne();
    //  fixture.voitureFixture();
    //  fixture.commandeFixture();
    //  fixture.ligneCommandeFixture();

    console.log("serveur exécuter sur http://localhost:" + PORT)

    mongoose.connect('mongodb://localhost:27017/chapAuto')
    // mongoose.connect('mongodb+srv://oriesta:azerty77@cluster0.iczkn.mongodb.net/chapAuto?retryWrites=true&w=majority')

    mongoose.connection
        .once('open', () => console.log('Connexion est établie'))
        .on('error', (error) => {
            console.warn('Erreur durant la connexion', error)
        })
})


