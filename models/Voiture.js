const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var voitureSchema = new mongoose.Schema({
    marque: {
        type: String,
        require: true
    },
    modele: {
        type: String,
        require: true
    },
    image:{
        type:String
    },
    image_miniature:[{
        type:String
    }],
    prix: { 
        type: Number,
        require:true
     },
    type_annonce: { type: String },
    kilometrage: {type:Number},
    energie:{type:String},
    carrosseries:[],
    couleurs: [{
        valeur:String,
        quantite:Number
    }],
    quantite:Number,
    equipements:[],
    ville:String,
    description:String,
    statut:String,
    date_ajout:{ type: Date, default: Date.now }

});

//Export the model
module.exports = mongoose.model('Voiture', voitureSchema);