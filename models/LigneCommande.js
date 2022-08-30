const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ligneCommandeSchema = new mongoose.Schema({
    commande:{
        type: Schema.Types.ObjectId,
        ref: 'commande'
    },
    voiture:{
        type:Schema.Types.ObjectId,
        ref:'voiture'
    },
    quantite:Number,
    prixVente:Number
});
module.exports = mongoose.model('LigneCommande',ligneCommandeSchema);