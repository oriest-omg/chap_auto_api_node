var {google} = require('googleapis');
var MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
var SCOPES = [MESSAGING_SCOPE];
var request = require('request');

function getAccessToken(){
    return new Promise(function(resolve, reject){
        var key = require("../key.json");
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function(err, tokens){
            if(err){
                reject(err);
                return; 
            }
            resolve(tokens.access_token);
        });
    });
}
 
module.exports = {
    sendNotification(req,res){
        getAccessToken().then(function(access_token){
 
            var title = req.body.title; 
            var body = req.body.body; 
            var token = req.body.token; 
     
            request.post({
                headers:{
                    Authorization: 'Bearer '+access_token
                }, 
                url: "https://fcm.googleapis.com/v1/projects/chapauto-a4cee/messages:send", 
                body: JSON.stringify(
                    {
                        "message":{
                            "token" : token,
                            "notification" : {
                                "body" : body,
                                "title" : title,
                            }
                        }
                    }
                )
            }, function(error, response, body){
                res.end(body);
                console.log(body);
            });
        });
    }
}