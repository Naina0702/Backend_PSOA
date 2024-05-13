class String_qr{

    constructor(nomTable,NomCol,ContenuTable,Etat){
        this.nom_table = nomTable;
        this.nom_colonne = NomCol;
        this.contenuTableau = ContenuTable;
        this.etat = Etat;
    }


   Afficher_tous(nom_table){

        let qr = `SELECT *from ${nom_table}`;
        
        return qr;
    }
    Afficher_avec_condition(nom_table, etat){
    
        let qr ="SELECT *from "+nom_table+" where "+etat;
    
        return qr;
    }
    
    
    Afficher_qlq_colonne(nom_colonne,nom_table){
    
        let qr ="SELECT "+nom_colonne+" from "+nom_table;
    
        return qr;
    
    }
    
    Afficher_qlq_colonne_etat(nom_colonne,nom_table,etat){
        
        let qr ="SELECT "+nom_colonne+" from "+nom_table+" where "+etat;
    
        return qr;
    
    }
    
    Inserer_donner(nom_table,contenuTableau){
    
        let qr ="INSERT INTO "+nom_table+" values ("+contenuTableau+")";
    
        return qr;
    }
    
    Inserer_donner_colonne(nom_table,nom_colonne,contenuTableau){
    
        let qr = "INSERT INTO "+nom_table+" ("+nom_colonne+") VALUES ("+contenuTableau+")";
    
        return qr;
    }
    
    delete_data(nom_table,etat){
    
        let qr = "DELETE FROM "+nom_table+" WHERE "+etat;
    
        return qr;
    }

    selectionner_triggers(trigger_names){
        
        let checkTriggerQuery = `SELECT trigger_name FROM information_schema.triggers  WHERE trigger_schema = 'virement' AND trigger_name='${trigger_names}'`;

        return checkTriggerQuery;
    }
    
}

module.exports = String_qr;