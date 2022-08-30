
const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();

module.exports = {
    //Applicaqué sur le serveur
    
    /**
     * Permet au serveur de vérifier le header de la route appelée
     * et de savoir si il contient un token valide
     * 
     * @param  {} req paramètre de requête
     * @param  {} res paramètre de response
     * @param  {} next fonction permmettant de continuer l'exécution d'autres methods
     */
    verificationToken(req, res, next){
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            try {
                jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, function (err, decode) {
                    if (err) {
                        req.utilisateur = undefined;
                        return res.status(401).json({ message: 'Invalid token' });
                    }
                    req.utilisateur = decode;
                    next();
                });
            } catch (e) {
                console.log("catch");
            }
        } else {
            req.utilisateur = undefined;
            next();
        }
    },
    /**
     * Vérifie si la route existe
     */
    verificationRoute (req, res) {
        res.status(404).send({ url: req.originalUrl + ' not found' })
    },
    //Appliqué sur les routes
    /**
     * Permet de vérifier le token et de savoir si l'utilisteur est authorizé ou non
     * à accéder à unue requête
     * 
     * @param  {} req paramètre de requête
     * @param  {} res paramètre de response
     * @param  {} next fonction permmettant de continuer l'exécution d'autres methods
     */
    loginRequired(req, res, next) {
        if (req.utilisateur) {
            console.log(req.body.utilisateur);
            next();
        } else {
            console.log(req.utilisateur);
            console.log(req.body);
            return res.status(401).json({ message: 'Unauthorized user!!' });
        }
    }
    
}