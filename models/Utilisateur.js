const mongoose = require('mongoose'); // Erase if already required
var bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;
// Declare the Schema of the Mongo model
var utilisateurSchema = new mongoose.Schema({
    nom:{
        type:String,
        required:true,
    },
    prenom : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    mot_de_passe: {
        hased_password : {type:String,required:true},
        reset_in_progress : Boolean,
        reset_code : String,
        // reset_expires : Date,
        active : Boolean
    },
    verifie:String,
    date_creation : { type: Date, default: Date.now },
    addresse_physique : {
        ville: String,
        commune : String,
        quartier : String,
        rue : String,
    },
    addresse_livraison:{
        ville: String,
        commune : String,
        quartier : String,
        description : String
    },
    refreshToken : []
});

utilisateurSchema.pre('save', function(next){
    var utilisateur = this;
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(utilisateur.mot_de_passe.hased_password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            utilisateur.mot_de_passe.hased_password = hash;
            next();
        });
    });
})

utilisateurSchema.pre('findOneAndUpdate',async function(next){
    var utilisateur = await this.model.findOne(this.getQuery());
    console.log("dans findUpdate");
    console.log(utilisateur);
    console.log("fin findUdpate");
    if(utilisateur.reset_code)
    {
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(utilisateur.mot_de_passe.hased_password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            utilisateur.mot_de_passe.hased_password = hash;

            console.log("XXXAPRESXXXX MAJ");
            console.log(utilisateur.mot_de_passe);
            next();
        });
    });
    }
})

utilisateurSchema.methods.compareMotDePasse = function(utilisateurMotDePasse, cb) {
    console.log(utilisateurMotDePasse);
    bcrypt.compare(utilisateurMotDePasse, this.mot_de_passe.hased_password, function(err, estCorrect) {
        if (err) return cb(err);
        cb(null, estCorrect);
    });
};
//Export the model
module.exports = mongoose.model('Utilisateur', utilisateurSchema);