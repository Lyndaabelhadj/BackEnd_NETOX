
'use strict'

// importation models de la base de donnée User.js
import User from '../models/user.js';

// imporation du bcrypt pour hasher le password
import bcrypt from 'bcrypt';

import nodemailer from 'nodemailer'; // To Send Emails
import crypto from 'crypto'; // To Generate Random Numbers

import { signAccessToken} from '../middlewares/auth.js';
import Question from '../models/question.js';


import pkg from 'nodemon';
import { query } from 'express-validator';
const { reset } = pkg;

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
};


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
};



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
};

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
};


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
};


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
};



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
};



///////////////////////////////////////////////////////////////////////////////
export const ChangePasswordForgot = async (req, res, next) => {
  // Change Password
  const { email,  password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Something is missing" });
  } else {
    //
    const user = await User.findOne({ email: req.body.email });
    if (req.body.email == user.email && user.email != "") {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        } else {
          user.password = hash;
          user.codeForget = "";
          user.save().then((user) => {
            return res
              .status(200)
              .json({ message: "Congratulations, Password changed!" });
          });
        }
      });
    } else {
      return res.status(402).json({ message: "Sorry! The email is incorrect!" });
    }
  }
};


///////////////////////////////////////////////////////////////////////////////
export const SendCodeForgot = async (req, res, next) => {
    const userMail = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!userMail) {
      res.status(202).json({
        message: "email not found",
      });
    } else {
      //
      // var RandomXCode = crypto.randomBytes(2).toString("hex");
      //console.log(RandomXCode);
      //
      var RandomXCode = Math.floor(1000 + Math.random() * 9000);
      console.log(RandomXCode);
      //
  
      var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: req.body.email,
        text: "Forget Password?",
        subject: "Password Reset",
        html: `<!DOCTYPE html>
        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
          <head>
            <title></title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <!--[if mso]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                <o:AllowPNG/>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if !mso]>
            <!-->
            <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Alegreya" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css" />
            <!--
            <![endif]-->
            <style>
              * {
                box-sizing: border-box;
              }
        
              body {
                margin: 0;
                padding: 0;
              }
        
              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
              }
        
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
              }
        
              p {
                line-height: inherit
              }
        
              .desktop_hide,
              .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
              }
        
              @media (max-width:520px) {
                .desktop_hide table.icons-inner {
                  display: inline-block !important;
                }
        
                .icons-inner {
                  text-align: center;
                }
        
                .icons-inner td {
                  margin: 0 auto;
                }
        
                .image_block img.big,
                .row-content {
                  width: 100% !important;
                }
        
                .mobile_hide {
                  display: none;
                }
        
                .stack .column {
                  width: 100%;
                  display: block;
                }
        
                .mobile_hide {
                  min-height: 0;
                  max-height: 0;
                  max-width: 0;
                  overflow: hidden;
                  font-size: 0px;
                }
        
                .desktop_hide,
                .desktop_hide table {
                  display: table !important;
                  max-height: none !important;
                }
              }
            </style>
          </head>
          <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
              <tbody>
                <tr>
                  <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;">
                                          <br>
                                          <br>
                                          <br>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
                                          <div align="center" class="alignment" style="line-height:10px">
                                            <img alt="reset-password" class="big" src="https://i.ibb.co/9g5fBQW/gif-resetpass.gif" style="display: block; height: auto; border: 0; width: 350px; max-width: 100%;" title="reset-password" width="350" />
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="text-align:center;width:100%;">
                                          <h1 style="margin: 0; color: #393d47; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 25px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                            <strong>Forgot your password?</strong>
                                          </h1>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="10" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                      <tr>
                                        <td class="pad">
                                          <div style="font-family: Tahoma, Verdana, sans-serif">
                                            <div class="" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
                                              <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">
                                                <span style="font-size:14px;">
                                                  <span style="">Not to worry, we got you! </span>
                                                  <span style="">Let’s get you a new password.</span>
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="15" cellspacing="0" class="button_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad">
                                          <div align="center" class="alignment">
                                            <!--[if mso]>
                                                  <v:roundrect
                                                    xmlns:v="urn:schemas-microsoft-com:vml"
                                                    xmlns:w="urn:schemas-microsoft-com:office:word" href="www.yourwebsite.com" style="height:58px;width:272px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#FFC727" fillcolor="#ffc727">
                                                    <w:anchorlock/>
                                                    <v:textbox inset="0px,0px,0px,0px">
                                                      <center style="color:#393d47; font-family:Tahoma, Verdana, sans-serif; font-size:18px">
                                                        <![endif]-->
                                            <a style="text-decoration:none;display:inline-block;color:#393d47;background-color:#ffc727;border-radius:20px;width:auto;border-top:1px solid #FFC727;font-weight:undefined;border-right:1px solid #FFC727;border-bottom:1px solid #FFC727;border-left:1px solid #FFC727;padding-top:10px;padding-bottom:10px;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank">
                                              <span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;">
                                                <span style="word-break: break-word;">
                                                  <span data-mce-style="" style="line-height: 36px;">
                                                    <strong>${RandomXCode}</strong>
                                                  </span>
                                                </span>
                                              </span>
                                            </a>
                                            <!--[if mso]>
                                                      </center>
                                                    </v:textbox>
                                                  </v:roundrect>
                                                  <![endif]-->
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                          <div style="font-family: Tahoma, Verdana, sans-serif">
                                            <div class="" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
                                              <p style="margin: 0; mso-line-height-alt: 19.5px;">
                                                <span style="font-size:13px;">If you didn’t request to change your password, simply ignore this email.</span>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="15" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                      <tr>
                                        <td class="pad">
                                          <div style="font-family: Tahoma, Verdana, sans-serif">
                                            <div class="" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;">
                                              <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
                                                <span style="font-size:10px;">If you continue to have problems</span>
                                                <br />
                                                <span style="font-size:10px;">please feel free to contact us at discoverytn@zohomail.com. </span>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                          <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                            <tr>
                                              <td class="alignment" style="vertical-align: middle; text-align: center;">
                                                <!--[if vml]>
                                                      <table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                                                        <![endif]-->
                                                <!--[if !vml]>
                                                        <!-->
                                                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                  <!--
                                                          <![endif]-->
                                                  <tr></tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End -->
          </body>
        </html>`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ message: "error sending" });
          console.log(error);
        } else {
          res.status(205).json({
            codeForget: RandomXCode,
          });
          User.findOneAndUpdate(
            { email: req.body.email },
            { codeForget: RandomXCode },
            { new: true }
          )
            .then((user) => {
              //console.log(user);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };




///////////////////////////////////////////////////////////////////////////////

export const EditProfil = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (email && !username && !password ) {
      //
      User.findOneAndUpdate(
        { _id: req.body.id },
        { email: req.body.email },
        { new: true }
      )
        .then((user) => {
          return res.status(200).json({ message: "Email Has Changed!" });
        })
        .catch((err) => {
          console.log(err);
        });
      //
      console.log("Email Has Selected!");
    } else if (username) {
      //
      User.findOneAndUpdate(
        { _id: req.body.id },
        { username: req.body.username },
        { new: true }
      )
        .then((user) => {
          return res.status(200).json({ message: "Username Has Changed!" });
        })
        .catch((err) => {
          console.log(err);
        });
      //
      console.log("username Has Selected!");
    } else if (password) {
      //
      const user = await User.findOne({ _id: req.body.id });
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        } else {
          user.password = hash;
          user.save();
          return res.status(200).json({ message: "password Has Changed!" });
        }
      });
      //
      console.log("password Has Selected!");
    } else {
      return res.status(200).json({ error: "Else!" });
    }
};
////////////////////////////update score/////////////////////


export const updateScorek = async (req, res) => {
  const { questionId, userId,reponse } = req.body;
  const question = await Question.findById( questionId);

  const user = await User.findById(userId).then((User) => {
    console.log("why");
  });
  console.log(user)
  let score =  user.score ?? 0;

  if (reponse == "yes") {
      score+=question.choix1;
  }
  else if (reponse == "no") {
      score+=question.choix2;
  }
  else if (reponse == "maybe") {
      score+=question.choix3;
  }
  User.findByIdAndUpdate(userId, { score: score }, { new: true }).then((user) => {

  res.status(200).json({ message: "Success" });})
  
}
//////////////////
function getscore(x) {
  return new Promise((resolve) => {
      
       const user = User.findOne({ _id: x }).then(
          user => {
            console.log(user)
            resolve(user.score);
          }
        );
      
  })
}
///////////////////////////////////////////////////////////////////////
export const updateScore = async (req, res) => {
  const {questionid, userid, reponse } = req.body;
  let scoreResponse=0
  let currentscore=0
  let loc = await getscore(userid);
  console.log(loc);
 // currentscore=User.findOne({ _id: userid }).score
  Question.findOne({ _id: questionid }).then(ques =>{
    console.log("1");
    if(reponse=="yes"){
      console.log("2");
      scoreResponse=ques.choix1;
      console.log(scoreResponse);
    }
    else if(reponse=="no"){
      console.log("3");
      scoreResponse=ques.choix2;
    }
    else{
      console.log("4");
      scoreResponse=ques.choix3;
    }

    User.findOneAndUpdate(
      { _id: userid },
      { score: loc+scoreResponse }
    )
      .then((User) => {
        return res.status(200).json({ message: "score Has been Changed!" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  console.log(scoreResponse);
    
    //
    }

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////Image
//
export const UploadAvatarUser = async (req, res, next) => {
    const userMail = await User.findOne({ email: req.body.email }); //req.body.email.toLowerCase()
    //console.log(req.body.email);
    //
    const file = req.file;
    if (userMail) {
      try {
        if (!file) {
          const error = new Error("Please upload a file");
          error.httpStatusCode = 400;
          console.log("error", "Please upload a file");
          res.send({ code: 500, msg: "Please upload a file" });
          return next({ code: 500, msg: error });
        }
        //res.send({ code: 200, msg: file.filename });
        console.log(file.filename);
        res.status(200).send(
          JSON.stringify({
            //200 OK
            msg: file.filename,
          })
        );
        ///////////////////////////////////////////////////////////////////////////////
        User.findOneAndUpdate(
          { email: req.body.email },
          {
            $set: {
              avatar: file.filename,
            },
          }
        ).exec(function (err, book) {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            res.send({ code: 200, msg: file.filename });
          }
        });
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    } else {
      console.log("Email not found");
      res.status(202).json({
        message: "Email not found",
      });
    }
  };




///////////////////////////////////////////////////////////////////////////////

var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
export  const SendConfirmEmail = async (req, res, next) => {
    const userMail = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!userMail) {
      res.status(202).json({
        message: "email not found",
      });
    } else {
      var codeVerif = crypto.randomBytes(6).toString("hex");
      console.log(codeVerif);
      // var mailContent = `Almost done : ` + code;
      var email = req.body.email;
  
      var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: req.body.email,
        text: "Confirm",
        subject: "Confirm Email Address",
        html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
          <title></title>
          
            <style type="text/css">
              @media only screen and (min-width: 670px) {
          .u-row {
            width: 650px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }
        
          .u-row .u-col-100 {
            width: 650px !important;
          }
        
        }
        
        @media (max-width: 670px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: calc(100% - 40px) !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col > div {
            margin: 0 auto;
          }
        }
        body {
          margin: 0;
          padding: 0;
        }
        
        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }
        
        p {
          margin: 0;
        }
        
        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }
        
        * {
          line-height: inherit;
        }
        
        a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
        }
        
        table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_6 .v-src-width { width: auto !important; } #u_content_image_6 .v-src-max-width { max-width: 30% !important; } }
            </style>
          
        <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
        
        </head>
        
  
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #182533;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #182533;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #182533;"><![endif]-->
           
            <br>	 
            <br>
            <br>
  
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #FFFFFF;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right: 0px;padding-left: 0px;" align="center">
              
              <img align="center" border="0" src="https://img.freepik.com/premium-vector/approved-account-email-message-icon-identity-user-check-mail-letter-with-valid-personal-profile_101884-1949.jpg?w=1060" alt="Hero Image" title="Hero Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 77%;max-width: 500.5px;" width="500.5" class="v-src-width v-src-max-width"/>
              
            </td>
          </tr>
        </table>
        
              </td>
            </tr>
          </tbody>
        </table>
        
          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>   
        
       <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #FFFFFF;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <h1 style="margin: 0px; color: #333333; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: 'Open Sans',sans-serif; font-size: 30px;">
            Confirm Email Address
          </h1>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div style="color: #5e5e5e; line-height: 170%; text-align: center; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 170%;">Welcome to Discovery! There's just one more step before you get to the fun part.</p>
        <p style="font-size: 14px; line-height: 170%;">Verify we have the right email address by clicking on the button below:</p>
          </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 60px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
        <div align="center">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:63px; v-text-anchor:middle; width:290px;" arcsize="6.5%"  stroke="f" fillcolor="#722b1d"><w:anchorlock/><center style="color:#ffffff;font-family:arial,helvetica,sans-serif;"><![endif]-->  
            <a href="https://serverdiscovery.onrender.com/api/user/VerifCodeEmail/${email}/${codeVerif}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #722b1d; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:46%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #000000; border-top-style: solid; border-top-width: 0px; border-left-color: #000000; border-left-style: solid; border-left-width: 0px; border-right-color: #000000; border-right-style: solid; border-right-width: 0px; border-bottom-color: #000000; border-bottom-style: solid; border-bottom-width: 0px;">
              <span style="display:block;padding:20px;line-height:120%;"><span style="font-size: 20px; line-height: 24px; font-family: 'Open Sans', sans-serif;">Click Here</span></span>
            </a>
          <!--[if mso]></center></v:roundrect><![endif]-->
        </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>
        
        
      <br>	 
      <br>
        <br>
  
  
          </td> 
          </tr>
          </tbody>
          </table>
          <!--[if mso]></div><![endif]-->
          <!--[if IE]></div><![endif]-->
        </body>
        </html>`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ message: "error sending" });
          console.log(error);
        } else {
          res.status(205).json({
            codeVerif: codeVerif,
          });
          User.findOneAndUpdate(
            { email: req.body.email },
            { codeVerif: codeVerif },
            { new: true }
          )
            .then((user) => {
              //console.log(user);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

///////////////////////////////////////////////////////////////////////////////
export const VerifCodeEmail = async (req, res, next) => {
    //console.log(__dirname); // "/Users/Sam/dirname-example/src/api"
    //console.log(process.cwd()); // "/Users/Sam/dirname-example"
    // res.sendFile(process.cwd() + "/ConfirmDone.html");
    // res.sendFile(process.cwd() + "/AlreadyConfirmed.html");
    const user = await User.findOne({ email: req.params.email });
    console.log(req.params.email);
    console.log(req.params.codeVerif);
    console.log(user.codeVerif);
    console.log(user.verified);
    ///
    if (user.verified == "YES") {
      console.log("Your account Already Verified!");
      res.sendFile(process.cwd() + "/AlreadyVerified.html");
    }
    /// codeVerif && User Not Verified Yet
    if (user.codeVerif == req.params.codeVerif && user.verified != "YES") {
      ////////////////////////////////////////////////////////// Change Values in DB
      User.findOneAndUpdate(
        { email: req.params.email },
        {
          $set: {
            verified: "YES",
            codeVerif: "",
          },
        }
      ).exec(function (err, book) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.sendFile(process.cwd() + "/VerifiedDone.html");
          console.log("Congratulations! Your account has been Verified!");
        }
      });
    }
    //////////////////////////////////////////////////////////
    if (user.codeVerif != req.params.codeVerif && user.verified != "YES") {
      res.sendFile(process.cwd() + "/WeSeeYou.html");
    }
  };



///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



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
    

};





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
};

