
'use strict'
// imporation express validator
import { validationResult } from 'express-validator'

// importation models de la base de donnée User.js
import Question from '../models/question.js';


//Affichage de toutes les questions existantes dans la DB (Admin)
export function getAllQuestion(req, res) {
    Question
        .find({})
       
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



//Ajout d'une question dans la DB 
export function AjoutQuestion(req, res) {
     console.log(req.body)
    Question
            .create({
                contenu: req.body.contenu,
                choix1: req.body.choix1,
                choix2: req.body.choix2,
                choix3: req.body.choix3,

            })
        .then(newQuestion => {
            res.status(200).json(newQuestion);
            console.log("Ajout success!");
        })
        .catch(err => {
            res.status(400).json({ error: err });
         console.log("Error in adding question: ", err);
        });
    

}



  
/*
//Affichage d'une seule question
export function getOnceQuestion(req, res) {
    Question
        .findOne({ "idQuestion": req.params.idQuestion })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

*/



/**
 * Mettre � jour un seul document/ une seule quest 
 */
export function modifierQuestion(req, res) {

    Question
        .findOneAndUpdate({ "idQuestion": req.params.idQuestion },
        {"title":req.body.title,
        "author":req.body.author,
        "summary":req.body.summary
       
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
 * Supprimer un seule question
 */
export function deleteOnceQuestion(req, res) {
    Question
        .findOneAndRemove({ "idQuestion": req.params.idQuestion })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}






