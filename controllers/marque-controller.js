const Marque = require("../models/Marque");
module.exports = {
    getMarques(req,res){
        Marque.find()
        .sort({_id: -1 })
        .then((marque)=>{
            res.send(marque);
        })
    }
}