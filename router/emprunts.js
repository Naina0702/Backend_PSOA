var express = require("express");
var router = express.Router();
var connection = require('../config_db/db');
var string_qr = require('../config_db/requete');

let query = new string_qr();

router.get('/', function (req, res) {

    let qr = query.Afficher_tous("emprunts");

    connection.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'errs');
        }

        if (result.length > 0) {
            res.send({
                message: 'emprunts data',
                data: result
            });
        }
    });
});

router.get('/max_id_emprunts', function (req, res) {

    let qr = `SELECT max(id_emprunts)+1 as id from emprunts`;

    connection.query(qr, (err, result) => {

        if(err){
            console.log(err, 'errs');
        }
        if(result[0].id == null) {
           res.send({
                id_emprunts:1
            });

        }
        else{
           res.send({
                id_emprunts:result[0].id
            });
        }
    });
});


router.get('/:id_emprunts', function (req, res) {

    let qr = query.Afficher_avec_condition("emprunts",`id_emprunts =${req.params.id_emprunts}`);

    connection.query(qr, (err, result) => {
        if(err){
            console.log(err, 'errs');
            console.log(qr);

        }
        if(result.length > 0) {
            console.log(result.length);

            res.send({
                message: 'ok',
                data: result
            });
        }
        else if(result.length == 0){
            console.log(result.length);

            res.send({
                message:"rien"
            });
        }
    });
});

router.post('/Ajout', function (req, res) {

    var NomColonne = [
        "id_emprunts",
        "id_membres",
        "id_livre",
        "date_emprunt",
        "date_retour"
        ];

    var contenu = [req.body.id_emprunts,"'"+req.body.id_membres+"'","'"+req.body.id_livre+"'","'"+req.body.date_emprunt+"'","'"+req.body.date_retour+"'"];

    let etat_select = query.Afficher_avec_condition('emprunts',`id_emprunts = ${req.body.id_emprunts}`);

    connection.query(etat_select,(err,result)=>{
        if(err){
            console.log(err)
            console.log(etat_select)

        }
        if(result.length>0){
            
            res.send({
                message:'Id emprunts existe déja',
                data:result
            })
        }
        else{
            let qr_insert = query.Inserer_donner_colonne("emprunts",NomColonne,contenu)
            console.log(qr_insert)

            connection.query(qr_insert,(err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result)
                {
                    res.send({
                        message:"Emprunt enregister avec succes",
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

router.put('/update_emprunts',(req,res)=>{


    let qr_update = `UPDATE membres SET id_emprunts=${req.body.id_emprunts},id_membres='${req.body.id_membres}',id_livre='${req.body.id_livre}',date_emprunt='${req.body.date_emprunt}',date_retour='${req.body.date_retour}' WHERE id_emprunts = ${req.body.id_emprunts}`;

    if(req.body.id_membres){
        return res.status(400).send({ error: true, message: "Identifiant emprunts Obligatoire" });
    }

    connection.query(qr_update,function(error,results,fields){
        if(error) throw error;

        return res.send({
            message:'emprunts modifier avec succès'
        });
    });

});


router.delete('/Delete_emprunts/:id_emprunts',(req,res)=>{
    let im = req.params.id_livre;

    let qr_delete = `DELETE from emprunts where id_emprunts = ${im}`;

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
                message:"Emprunts supprimer avec succés"
            });

        }
    });

});


module.exports = router;