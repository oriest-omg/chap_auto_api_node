const Utilisateur = require('../models/Utilisateur');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
require('dotenv').config();

module.exports={
    sendSMS(req,res,next){
        body = req.body;
        const {email} = body;
        Utilisateur.findOne({ email: email }).then((utilisateur)=>{
            console.log("smsenvoyé");
            client.messages
            .create({
               body: 'Inscription reussi '+utilisateur.nom+' '+utilisateur.prenom+'voici votre code '+utilisateur.verifie,
               messagingServiceSid: 'MGb12d367739dfde52191b7b77650ef319',      
               to: '+225'+utilisateur.mobile
             })
            .then(message => console.log(message.sid));
            next();
        });

    }
}
