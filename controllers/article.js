
'use strict'
// imporation express validator
import { validationResult } from 'express-validator'

// importation models de la base de donnée User.js
import article from '../models/article.js';


//Affichage de tous les articles existants dans la DB (Admin)
export function getAllArticle(req, res) {
    article
        .find({})
       
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



//Ajout d'une question dans la DB 
export function AjoutArticle(req, res) {
    // Invoquer la m�thode create directement sur le mod�le
    console.log(req.body)
        article
            .create({
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,

            })
        .then(newArticle => {
            res.status(200).json(newArticle);
            console.log("Ajout success!");
        })
        .catch(err => {
            res.status(400).json({ error: err });
            console.log("Error in adding question: ", err);
        });
    

}



  

//Affichage d'un seule article
export function getOnceArticle(req, res) {
    article
        .findOne({ "idArticle": req.params.idArticle })
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
export function modifierArticle(req, res) {

    article
        .findOneAndUpdate({ "idArticle": req.params.idArticle },
        {"title":req.body.title,
        "author":req.body.author,
        "summary":req.body.summary
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
export function deleteOnceArticle(req, res) {
    article
        .findOneAndRemove({ "idArticle": req.params.idArticle })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}




