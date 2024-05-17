var express = require("express");
var router = express.Router();
var connection = require('../config_db/db');
var string_qr = require('../config_db/requete');

let query = new string_qr();

router.get('/liste', function (req, res) {

    let qr = query.Afficher_tous("livres");

    connection.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'errs');
        }

        if (result.length > 0) {
            res.send({
                message: 'livre data',
                data: result
            });
        }
    });
});

router.get('/categorie', function (req, res) {

    let qr = `select categorie from livres group by categorie;`;

    connection.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'errs');
        }

        if (result.length > 0) {
            res.send({
                message: 'categorie data',
                data: result
            });
        }
    });
});


router.put('/Pochette',(req,res)=>{

    let file = req.body
    const base64data = file.content.replace(/^data.*,/,'');

    fs.writeFile('./pochette/'+file.name,base64data,'base64',(err)=>{
        if(err){
            console.log(err);
            res.status(500);
        }
        else{
            res.set('Location','./pochette/'+file.name);
            res.send(file);
            res.status(200);
        }
    });


});

router.get('/Generer_Numero_livre',(req,res)=>{

    const length = 3;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Caractères autorisés dans le mot de passe
    let NumeroLivres ='';
    
    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * charset.length);
        NumeroLivres += charset[randomIndex];
    
    }
    res.send({
        id_livre:NumeroLivres
    });
    
});

router.get('/:id_livre', function (req, res) {

    let qr = query.Afficher_avec_condition("livres",`id_livre ='${req.params.id_livre}'`);

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

    console.log(req.body);

    var NomColonne = ["id_livre", "titre", "auteur","categorie","exemplaire","pochette"];

    var contenu = [`'${req.body.id_livre}'`,'"'+req.body.titre+'"','"'+req.body.auteur+'"','"'+req.body.categorie+'"',req.body.exemplaire,'"'+req.body.pochette+'"'];

    let etat_select = query.Afficher_avec_condition('livres',`id_livre = '${req.body.id_livre}'`);

    connection.query(etat_select,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            res.send({
                message:'ID livre existe déja',
                data:result
            })
        }
        else{
            let qr_insert = query.Inserer_donner_colonne("livres",NomColonne,contenu)
            connection.query(qr_insert,(err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result)
                {
                    res.send({
                        message:"Livre ajouter avec succes",
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

router.put('/update_livres',(req,res)=>{

    let qr_update = `UPDATE livres SET titre="${req.body.titre}",auteur="${req.body.auteur}",exemplaire="${req.body.exemplaire}",exemplaire=${req.body.exemplaire},pochette="${req.body.pochette}" WHERE id_livre = '${req.body.id_livre}'`;

    if(!req.body.id_livre){
        return res.status(400).send({ error: true, message: "Identifiant livre Obligatoire" });
    }

    connection.query(qr_update,function(error,results,fields){
        console.log(qr_update)
        if(error) throw error;

        return res.send({
            message:'Livre modifier avec succès'
        });
    });

});

router.put('/update_exemplaire',(req,res)=>{

    let qr_update = `UPDATE livres SET exemplaire=exemplaire${req.body.signe}1 WHERE id_livre = '${req.body.id_livre}'`;

    if(!req.body.id_livre){
        return res.status(400).send({ error: true, message: "Identifiant livre Obligatoire" });
    }

    connection.query(qr_update,function(error,results,fields){
        console.log(qr_update);

        if(error) throw error;        
         console.log(qr_update);
        ;
        return res.send({
            message:'Exemplaire modifier avec succèes'
        });
    });

});

router.put('/Ajout_stock_livre',(req,res)=>{

    let qr_update = `UPDATE livres SET exemplaire=exemplaire${req.body.signe}${req.body.nombres} WHERE id_livre = '${req.body.id_livre}'`;

    if(!req.body.id_livre){
        return res.status(400).send({ error: true, message: "Identifiant livre Obligatoire" });
    
    }

    connection.query(qr_update,function(error,results,fields){
        if(error) throw error;

        return res.send({
            message:'Exemplaire modifier avec succèes'
        });
    });

});


router.delete('/Delete_livre',(req,res)=>{
    let im = req.body.id_livre;

    let qr_delete = `DELETE from livres where id_livre = '${im}'`;

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
                message:"Livre supprimer avec succés"
            });

        }
    });

});


module.exports = router;