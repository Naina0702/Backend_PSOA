var express = require("express");
var router = express.Router();
var connection = require('../config_db/db');
var string_qr = require('../config_db/requete');

let query = new string_qr();

router.get('/liste', function (req, res) {

    let qr = query.Afficher_tous("membres");

    connection.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'errs');
        }

        if (result.length > 0) {
            res.send({
                message: 'membres data',
                data: result
            });
        }
    });
});

router.get('/Generer_Numero_membres',(req,res)=>{

    const length = 6;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Caractères autorisés dans le mot de passe
    let NumeroLivres ='';
    
    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * charset.length);
        NumeroLivres += charset[randomIndex];
    
    }
    res.send({
        id_membres:NumeroLivres
    });
    
});

router.get('/:id_membres', function (req, res) {

    let qr = query.Afficher_avec_condition("membres",`id_membres ='${req.params.id_membres}'`);

    connection.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'errs');
        }

        if (result.length > 0) {
            res.send({
                message: 'ok',
                data: result
            });
        }
        if(result.length == 0){
            res.send({
                message:"rien"
            });
        }
    });
});

router.post('/Ajout', function (req, res) {

    var NomColonne = ["id_membres","nom","prenoms","email","adresse","telephone"];

    var contenu = ["'"+req.body.id_membres+"'","'"+req.body.nom+"'","'"+req.body.prenoms+"'","'"+req.body.email+"'","'"+req.body.adresse+"'","'"+req.body.telephone+"'"];

    let etat_select = query.Afficher_avec_condition('membres',`id_membres = '${req.body.id_membres}'`);

    connection.query(etat_select,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            res.send({
                message:'ID membres existe déja',
                data:result
            })
        }
        else{
            let qr_insert = query.Inserer_donner_colonne("membres",NomColonne,contenu)
            connection.query(qr_insert,(err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result)
                {
                    res.send({
                        message:"Membre ajouter avec succes",
                        data:result
                    });
                    console.log(qr_insert);

                }
                else{
                    
                    res.send({
                        message:"Erreur"
                    })

                }
            });
        
        }
    });
});

router.put('/update_membres',(req,res)=>{


    let qr_update = `UPDATE membres SET nom='${req.body.nom}',prenoms='${req.body.prenoms}',email='${req.body.email}',adresse='${req.body.adresse}',telephone='${req.body.telephone}' WHERE id_membres = '${req.body.id_membres}'`;

    if(!req.body.id_membres){
        return res.status(400).send({ error: true, message: "Identifiant membres Obligatoire" });
    }

    connection.query(qr_update,function(error,results,fields){
        if(error) throw error;

        return res.send({
            message:'Membres modifier avec succès'
        });
    });

});


router.delete('/Delete_livre',(req,res)=>{
    let im = req.body.id_membres;

    let qr_delete = `DELETE from membres where id_membres = '${im}'`;

    if(!im){
        return res.status(400).send({ error: true, message: '' });
    }
    connection.query(qr_delete,(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result){
            
            return res.send({
                error:false,
                message:"Membres supprimer avec succés"
            });

        }
    });

});


module.exports = router;