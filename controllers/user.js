
'use strict'
// imporation express validator
import { body, validationResult } from 'express-validator'

// importation models de la base de donnée User.js
import User from '../models/user.js';

// imporation du bcrypt pour hasher le password
import bcrypt from 'bcrypt';

// email 
import mailgun from 'mailgun-js';

import { signAccessToken} from '../middlewares/auth.js';



const DOMAIN = 'sandbox197decac5e3745b58909236153f23c8a.mailgun.org';
const MAILGUN_APIKEY= 'cbd049d3e2d276f146a6e482cfff5312-2de3d545-6f611874';
const mg = mailgun({apiKey: MAILGUN_APIKEY, domain: DOMAIN});

import pkg from 'nodemon';
const { reset } = pkg;

const JWT_ACC_ACTIVATE='accountactivatekey123';



//Affichage de tous les utilisateurs existants dans la DB 
export function getAll(req, res) {
    User
        .find({})
       
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



//m2p n'est pas hashé
//Sign up pour enregistrer le nouvel utilisateur dans la DB 
export function signUp(req, res) {
    // Invoquer la m�thode create directement sur le mod�le
    console.log(req.body)
        User
            .create({
                username: req.body.username,
                role: req.body.role,
                email: req.body.email,
                datedenaissance: req.body.datedenaissance,
                password: req.body.password,
            })
        .then(newUser => {
            res.status(200).json(newUser);
            console.log("Signup success!");
        })
        .catch(err => {
            res.status(400).json({ error: err });
            console.log("Error in signup: ", err);
        });
    

}



export async function signup(req, res) {
    
    // Trouver les erreurs de validation dans cette requête et les envelopper dans un objet
    //if(!validationResult(req).isEmpty()) {
      //  res.status(400).json({ errors: validationResult(req).array() });
    //}
    //else {

        //bcrypt.hash(req.body.password,10,function(err,hashPass){
          //  if(err) {
            //    res.json({
              //      error:err
               // })
           // }
    
        // Invoquer la méthode create directement sur le modèle
        User
        .create({
    
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
           // datedenaissance: req.body.datedenaissance,
            password:   await bcrypt.hash(req.body.password,10),
            // Récupérer l'URL de l'image pour l'insérer dans la BD
            //image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
            
        })
        .then(newUser=> {
            res.status(200).json(newUser);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

    }


//hasher le mot de passe avant de l'envoyer à la DB
//salt = 10 combien de fois sera exécuté l'algorithme de hashage
export function SIGNUP (req, res) {

    /*const data = {
        from: 'noreply@hello.com',
        to: 'lynda.belhadj@esprit.tn',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });*/

    bcrypt.hash(req.body.password, 10) 
    .then((hash)=> {
    //ce qui va etre enregistré dans mongoDB
    const user = new User({
    username: req.body.username,
    role: req.body.role,
    email: req.body.email,
    datedenaissance: req.body.datedenaissance,
    password: hash,
    });


    //envoyer le user dans la DB 
    user
    .save()
    .then(()=>
    res.status(201).json({ message : "Signup success!"}))
    .catch((error)=> res.status(400).json({error}.send()));
   

})
.catch((error)=>res.status(400).json({error}).send(console.log("Error in signup: ",error)));
}





//activateAccount
export function activateAccount (req, res) {
    const {token} = req.body;
    if(token){
    jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err,decodedToken){
    if(err) {
    return res.status(400).json({error: 'Incorrect or Expired link.'})
    }
    const {username, role, email, datedenaissance,password} = decodedToken;
    User.findOne({email})
    .exec((err,user) => {
        if(user){
            return res.status(400).json({error: "User with this email already exists."});
        }
        let newUser = new User({});
        newUser.save((err, success) => {
            if (err){
                console.log("Error in signup while account activation: ", err);
                return res.status(400), json({error: 'Error activating account'})
            }
            res.json({
                message: "Signup success!"
            })
        } )
});
    })
    
    }
else{
return res.json({error: "Something went wrong !!!"})
}
}



//forgotPassword
export function forgotPassword (req, res) {
    const {email} = req.body;

    User.findOne({email}, (err,user) => {
if(err || !user) {
    return res.status(400).json({error: "User with this email does not exists"});
}
const token =jwt.sign({_id: user._id},process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});
        const data = {
        from: 'noreply@hello.com',
        to: 'lynda.belhadj@esprit.tn',
        subject: 'Account Activation Link',
        html: `
        <h2> Please click on given link to eset your password </h2>
        <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
        `
    };

    return user.updateOne({resetLink: token}, function(err, success) {
        if(err ) {
            return res.status(400).json({error: "reset password link error"}); 
                 } else {
        mg.messages().send(data, function (error, body) {
            if(error){
                return req.json({ 
                    error: err.message})
            }
            return res.json({message: 'Email has been sent, kindly folow the instructions'});
            });
                         }
    }) 
})
}
   
//resetPassword
export function resetPassword (req, res) {
    const {email} = req.body;
} 

/*
creat user without mail account verification
exports.signup = (req,res) => {
    console.log(req.body);
    const {username, role, email, datedenaissance,password} = req.body
    User.findOne({email}).exec((err,user)) => {
        if(user){
            return res.status(400).json({error: "User with this email already exists."});
        }


const data = {
	from: 'noreply@hello.com',
	to: email,
	subject: 'Hello',
	text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});


        let newUser = new User({username, role, email, datedenaissance,password})
        newUser.save((err, success)) => {
            if (err){
                console.log("Error in signup: ", err);
                return res.status(400), json({error: err})
            }
            res.json({
                message: "Signup success!"
            })
        }
    }
}*/




//Affichage d'un seul utilisateur 
export function getOnce(req, res) {
    User
        .findOne({ "_id": req.params._id })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



/**
 * Mettre � jour plusieurs documents
 * Remarque : renommez putOnce par putAll
 */

export function putAll(req, res) {
    User
        .updateMany({}, { "name": "test" })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

/**
 * Updates all fields
 */
export function putOnce(req, res) {
    User
        .findOneAndUpdate({ "_id": req.params._id },
            {"username": req.body.username,
            "email": req.body.email,
            "age": req.body.age,
            "Datedenaissance": req.body.datedenaissance,
            "password": req.body.password })
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
export function modifier(req, res) {

    /*if(!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
    }
    else {

        bcrypt.hash(req.body.password,10,function(err,hashPass){
            if(err) {
                res.json({
                    error:err
                })
            }*/
    User
        .findOneAndUpdate({ "_id": req.params._id }, 
        {"username":req.body.username,
        "email":req.body.email,
       // "password":hashPass,
        //"image":`${req.protocol}://${req.get('host')}/img/${req.file.filename}`
    
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
 * Supprimer un seul document/user
 */
export function deleteOnce(req, res) {
    User
        .findOneAndRemove({ "_id": req.params._id })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}






export function  login  (req,res,next){
    var password = req.body.password

User.findOne({"username":req.body.username})
.then(user => {
    if(user){
    
        bcrypt.compare(password,user.password,async function(err,result){
            if(err){
                res.json({
                    error : err
                })
            }
            if(result){
                const accessToken = await signAccessToken(user.id)
              // const refreshToken = await signRefreshToken(user.id)
                res.status(200).json({
                    message: 'Login successful',
                    accessToken ,
                   // refreshToken,
                    user
                
                })
            }else {
                res.status(401).json({
                    message: 'Password does not matched'
                })
            }
        })
        
    }else{
        res.status(401).json({
            message : "This user doesn't exist, signup first"
        })
    }
})
}


//Sign In
export async function LOGIN(req, res) {
    const { username, password } = req.body

    const user = await User.findOne({ username: username, password: password })

    if (user) res.status(200).json(user)
    else res.status(404).json({ message: "This user doesn't exist, signup first" })

   // if(user.password !== password){
       // return res.status(400).json({
        //    error: "Username or password incorrect"
       // })
   // }


}


// /**
//  * Supprimer plusieurs documents
//  */
// export function deleteOnce(req, res) {
//     User
//     .remove({ "onSale": false })
//     .then(doc => {
//         res.status(200).json(doc);
//     })
//     .catch(err => {
//         res.status(500).json({ error: err });
//     });
// }