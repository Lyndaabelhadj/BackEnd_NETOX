import express from 'express';
import { getAll, signup, getOnce, modifier, deleteOnce, putOnce, putAll, login, 
  ChangePasswordForgot , EditProfil, UploadAvatarUser, SendCodeForgot, SendConfirmEmail, VerifCodeEmail, updateScore //VerifCodeForgot
} from '../controllers/user.js';
//import multer from '../middlewares/multer-config.js'; android 
import CheckFolderUpload from '../middlewares/CheckFolderUpload.js';
import multer from 'multer'; //ios
import crypto from 'crypto';

var storage, path;

/** 
 * Router est un objet de base sur le module express.
 * Cet objet a des méthodes similaires (.get, .post, .patch, .delete)
 * à l'objet app de type "express()" que nous avons utilisé précédemment.
 */
const router = express.Router();


//configure multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 9000000, // Max 9 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});


// Déclarer d'abord la route, puis toutes les méthodes dessus (préfixe spécifié dans server.js)
router
  .route('/')
  .get(getAll)   // Show All Users
    .post(

        //utiliser multer
        //multer,
        signup);    // SignUp

router
  .route('/:_id')
    .get(getOnce)
    //.put(putOnce)
    //.put(putAll)
   
    .patch(
      multer,
      modifier)   // update User
    .delete(deleteOnce);


router
  .route('/login')
  .post(login);   // Login

router.post("/EditProfil", EditProfil);
router.post("/updateScore", updateScore); //  Edit Profil

router.post(
  "/UploadAvatarUser",
  CheckFolderUpload,
  upload.single("image"),
  UploadAvatarUser
); // Upload Avatar
//
router.post("/SendConfirmEmail", SendConfirmEmail); // Confirm Email
router.get("/VerifCodeEmail/:email/:codeVerif", VerifCodeEmail); // Verif CodeEmail
//
router.post("/SendCodeForgot", SendCodeForgot); //  Send FogetCode
//router.post("/VerifCodeForgot", VerifCodeForgot); //  Verif FogetCode
router.post("/ChangePasswordForgot", ChangePasswordForgot); //  Change Password Forget



/**
 * Maintenant que nous avons créé toutes ces routes,
 * exportons ce module pour l'utiliser dans server.js
 * puisque c'est lui notre entrée principale "main".
 */
export default router;