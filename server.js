const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const route = require('./routes/index');
const fixture = require('./fixtures/faker');
const PORT = 3000;
const server = express();
const fs = require('fs');
const authGuard = require('./guards/authGuard');
var path = require("path");
require('dotenv').config();

var {google} = require('googleapis');
var MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
var SCOPES = [MESSAGING_SCOPE];

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./files/images/swagger.json');
const customCss = fs.readFileSync((process.cwd()+"/files/images/swagger.css"), 'utf8');

mongoose.Promise = global.Promise;

server.use(bodyParser.json());
// let express to use this
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

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


