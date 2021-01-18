var express = require("express");
var hostname = "localhost";
var port = 3000;
var mongoose = require("mongoose");
var options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
};
var urlmongo =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
mongoose.connect(urlmongo, options);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur lors de la connexion"));
db.once("open", function () {
  console.log("Connexion à la base OK");
});
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var userSchema = mongoose.Schema({
  nom: String,
  age: Number,
  favoriteFoods: [String],
});
var user = mongoose.model("user", userSchema);
var myRouter = express.Router();
myRouter.route("/").all(function (req, res) {
  res.json({ message: "Bienvenue sur notre Frugal API ", methode: req.method });
});

myRouter
  .route("/users")
  .get(function (req, res) {
    user.find(function (err, users) {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
  })
  .post(function (req, res) {
    var user = new user();
    user.nom = req.body.nom;
    user.age = req.body.age;
    user.favoriteFoods = req.body.favoriteFoods;
    user.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({
        message: "Bravo, la user est maintenant stockée en base de données",
      });
    });
  });

myRouter
  .route("/users/:user_id")
  .get(function (req, res) {
    user.findById(req.params.user_id, function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
  })
  .put(function (req, res) {
    user.findById(req.params.user_id, function (err, user) {
      if (err) {
        res.send(err);
      }
      user.nom = req.body.nom;
      user.adresse = req.body.adresse;
      user.tel = req.body.tel;
      user.description = req.body.description;
      user.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Bravo, mise à jour des données OK" });
      });
    });
  })
  .delete(function (req, res) {
    user.remove({ _id: req.params.user_id }, function (err, user) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Bravo, user supprimée" });
    });
  });
app.use(myRouter);
app.listen(port, hostname, function () {
  console.log("Mon serveur fonctionne sur http://" + hostname + ":" + port);
});
