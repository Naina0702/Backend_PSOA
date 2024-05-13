var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var livre = require('./router/gerer_livre');
var emprunts = require('./router/emprunts');
var membres = require('./router/gestion_membres');
var reservation = require('./router/reservation');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuration des options CORS pour les requêtes DELETE


app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  

app.use('/livre', livre);
app.use('/emprunts', emprunts);
app.use('/membres', membres);
app.use('/reservation', reservation);

app.listen(3000, () => {
    console.log("Server running ........ ");
});
