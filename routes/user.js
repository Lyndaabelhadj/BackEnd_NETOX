import express from 'express';
import { body } from 'express-validator';
import { getAll, signup, getOnce, modifier, deleteOnce, putOnce, putAll, login, forgotPassword , activateAccount, resetPassword} from '../controllers/user.js';
import multer from '../middlewares/multer-config.js'; 
/**
 * Router est un objet de base sur le module express.
 * Cet objet a des méthodes similaires (.get, .post, .patch, .delete)
 * à l'objet app de type "express()" que nous avons utilisé précédemment.
 */
const router = express.Router();

// Déclarer d'abord la route, puis toutes les méthodes dessus (préfixe spécifié dans server.js)
router
  .route('/')
  .get(getAll)
    .post(

        //utiliser multer
        //multer,
        signup);

router
  .route('/:_id')
    .get(getOnce)
    .put(putOnce)
    .put(putAll)
    .patch(
      multer,
      modifier)
    .delete(deleteOnce);


router
  .route('/login')
  .post(login)

router
.post('/email-activate', activateAccount)

router
.put('/forgot-password', forgotPassword)

router
.put('/reset-password', resetPassword)

//router
//  .post('/signup', signup)

/**
 * Maintenant que nous avons créé toutes ces routes,
 * exportons ce module pour l'utiliser dans server.js
 * puisque c'est lui notre entrée principale "main".
 */
export default router;