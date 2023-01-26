
'use strict'
// imporation express validator
import { validationResult } from 'express-validator'

// importation models de la base de donnée User.js
import Response from '../models/reponse.js';


//Affichage de tous les articles existants dans la DB (Admin)
export function getAllReponse(req, res) {
    Response
        .find({})
       
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



//Ajout d'une Reponse dans la DB 
export function AjoutReponse(req, res) {
    // Invoquer la m�thode create directement sur le mod�le
    console.log(req.body)
    Response
            .create({
                rep1: req.body.rep1,
                rep2: req.body.rep2,
                rep3: req.body.rep3,
            })
        .then(newReponse => {
            res.status(200).json(newReponse);
            console.log("Ajout success!");
        })
        .catch(err => {
            res.status(400).json({ error: err });
            console.log("Error in adding response: ", err);
        });
    

}



  

//Affichage d'un seule article
export function getOnceReponse(req, res) {
    Response
        .findOne({ "idReponse": req.params.idReponse })
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
export function modifierReponse(req, res) {

    Response
        .findOneAndUpdate({ "idReponse": req.params.idReponse },
        {"rep1":req.body.rep1,
        "rep2":req.body.rep2,
        "rep3":req.body.rep3
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
export function deleteOnceReponse(req, res) {
    Response
        .findOneAndRemove({ "idReponse": req.params.idReponse })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}




