const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
var commandeSchema = new mongoose.Schema({
    code:String,
    utilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'utilisateur'
    },
    paiementStatus: String,
    totalPrix: Number,
    ligneCommande: [{
            type: Schema.Types.ObjectId,
            ref: 'ligneCommande'
    }],
    adress:{
        ville:String,
        commune:String,
        quartier:String,
        description:String
    }
});

//Export the model
module.exports = mongoose.model('Commande', commandeSchema);