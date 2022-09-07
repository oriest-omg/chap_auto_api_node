const ejs = require("ejs");
const nodemailer = require("nodemailer");
const Utilisateur = require("../models/Utilisateur");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.PASSWORD,
  },
});

function contenuMail(fichierMailEjs, data, envoyerA, sujet) {
  const emplacement = __dirname.replace("controllers", "");
  ejs.renderFile(
    emplacement + "/mails/" + fichierMailEjs + ".mail.ejs",
    data,
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var mainOptions = {
          from: '"Tester" oriestmsp@gmail.com',
          to: envoyerA,
          subject: sujet,
          html: data,
        };
        console.log("html data ======================>", mainOptions.html);
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent: " + info.response);
          }
        });
      }
    }
  );
}

async function inscriptionMail() {
  try {
    let utilisateur;
    await Utilisateur.findOne()
      .sort({ _id: -1 })
      .then((user) => {
        utilisateur = user;
      });
    console.log(utilisateur);
    contenuMail(
      "inscription",
      { utilisateur: utilisateur },
      utilisateur.email,
      "inscription validée"
    );
  } catch {}
}

async function commandeMail(commande) {
  try {
    console.log(commande);
    contenuMail(
      "commande",
      { commande: commande },
      commande.utilisateur.email,
      "Commande effectuée avec succès"
    );
  } catch {}
}
module.exports = { inscription: inscriptionMail,commandeMail : commandeMail};
