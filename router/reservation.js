var express = require("express");
var router = express.Router();
var connection = require('../config_db/db');
var string_qr = require('../config_db/requete');

let query = new string_qr();

router.get('/liste', function (req, res) {

    let qr = `select *from reservation,membres,livres where (reservation.id_membres = membres.id_membres) and (reservation.id_livre = livres.id_livre);`;

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

        if(err){
            console.log(err, 'errs');
        }
        if(result[0].id == null) {
           res.send({
                id_resa:1
            });

        }
        else{
           res.send({
                id_resa:result[0].id
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
        "date_reservation",
        "dispo_livre"	
        ];

    var contenu = [req.body.id_resa,"'"+req.body.id_membres+"'","'"+req.body.id_livre+"'","'"+req.body.date_reservation+"'","'"+req.body.dispo_livre+"'"];

    let etat_select = query.Afficher_avec_condition('reservation',`id_resa = ${req.body.id_resa}`);

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
            let qr_insert = query.Inserer_donner_colonne("reservation",NomColonne,contenu)
            connection.query(qr_insert,(err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result)
                {
                    res.send({
                        message:"Réservation ajouté avec succes",
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


router.put('/update_reservation',(req,res)=>{

    let qr_update = `UPDATE reservation SET id_resa=${req.body.id_resa},id_membres='${req.body.id_membres}',id_livre='${req.body.id_livre}',date_reservation='${req.body.date_reservation}',dispo_livre=${req.body.dispo_livre} WHERE id_resa = '${req.body.id_resa}'`;

    if(!req.body.id_membres){
        return res.status(400).send({ error: true, message: "Identifiant resa Obligatoire" });
    }

    connection.query(qr_update,function(error,results,fields){
        if(error) throw error;

        return res.send({
            message:'resa modifier avec succès'
        });
    });

});

router.delete('/Delete_resa',(req,res)=>{
    let im = req.body.id_resa;

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