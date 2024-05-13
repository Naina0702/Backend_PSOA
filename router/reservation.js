var express = require("express");
var router = express.Router();
var connection = require('../config_db/db');
var string_qr = require('../config_db/requete');

let query = new string_qr();

router.get('/', function (req, res) {

    let qr = query.Afficher_tous("reservation");

    connection.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'errs');
        }

        if (result.length > 0) {
            res.send({
                message: 'reservation data',
                data: result
            });
        }
    });
});

router.get('/max_id_reservation', function (req, res) {

    let qr = `SELECT max(id_resa)+1 as id from reservation`;

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


router.get('/:id_resa', function (req, res) {

    let qr = query.Afficher_avec_condition("reservation",`id_resa =${req.params.id_resa}`);

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

    var NomColonne = [
        "id_resa",	
        "id_membres",	
        "id_livre",	
        "date_reservation"	
        ];

    var contenu = [req.body.id_resa,"'"+req.body.id_membres+"'","'"+req.body.id_livre+"'","'"+req.body.date_reservation+"'"];

    let etat_select = query.Afficher_avec_condition('reservation',`id_resa = '${req.body.id_resa}'`);

    connection.query(etat_select,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            res.send({
                message:'Id resa existe déja',
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

router.put('/update_emprunts',(req,res)=>{

    let qr_update = `UPDATE reservation SET id_resa=${req.body.id_resa},id_membres='${req.body.id_membres}',id_livre='${req.body.id_livre}',date_reservation='${req.body.date_reservation}' WHERE id_resa = '${req.body.id_resa}'`;

    if(req.body.id_membres){
        return res.status(400).send({ error: true, message: "Identifiant resa Obligatoire" });
    }

    connection.query(qr_update,function(error,results,fields){
        if(error) throw error;

        return res.send({
            message:'resa modifier avec succès'
        });
    });

});


router.delete('/Delete_resa/:id_resa',(req,res)=>{
    let im = req.params.id_livre;

    let qr_delete = `DELETE from reservation where id_resa = ${im}`;

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
                message:"Reservation annulée avec succés"
            });

        }
    });

});


module.exports = router;