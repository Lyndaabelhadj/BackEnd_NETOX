
'use strict'
// imporation express validator
import { validationResult } from 'express-validator'

// importation models de la base de donnée rdv.js
import rdv from '../models/rdv.js';


//Affichage de tous les articles existants dans la DB (Admin)
export function getAllRdv(req, res) {
    rdv
        .find({})
       
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



//Ajout d'une question dans la DB 
export function AjoutRdv(req, res) {
    // Invoquer la m�thode create directement sur le mod�le
    console.log(req.body)
    rdv
            .create({
                date: req.body.date,
                heure: req.body.heure,
            })
        .then(newRdv => {
            res.status(200).json(newRdv);
            console.log("Ajout success!");
        })
        .catch(err => {
            res.status(400).json({ error: err });
            console.log("Error in adding rdv: ", err);
        });
    

}



  

//Affichage d'un seule rdv
export function getOnceRdv(req, res) {
    rdv
        .findOne({ "idRdv": req.params.idRdv })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}





/**
 * Mettre � jour un seul document/ un seul user 
 */
export function modifierRdv(req, res) {

    rdv
        .findOneAndUpdate({ "idRdv": req.params.idRdv },
        { date: req.body.date,
            heure: req.body.heure
        //"datedenaissance":req.body.datedenaissance
    }
        )
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}
    


/**
 * Supprimer un seul article
 */
export function deleteOnceRdv(req, res) {
    rdv
        .findOneAndRemove({ "idRdv": req.params.idRdv })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}




