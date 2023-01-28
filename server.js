import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler, notFoundError } from './middlewares/error-handler.js'
import userRoutes from './routes/user.js';
import articleRoutes from './routes/article.js';
import rdvRoutes from './routes/rdv.js';


const app = express();
const port = process.env.PORT || 9091;
const database = 'Netox'

mongoose.connect(`mongodb+srv://linda:K1HQf7lEJCRYAmGQ@cluster0.cvgs4cq.mongodb.net/netox`)
    .then(() => console.log("DB connection established"))
    .catch((error) => console.log(error));

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.use(cors());
app.use(morgan("dev")); //Utiliser morgan
app.use(express.json()); // Pour analyser (parsing) les requetes application/json
app.use(express.urlencoded({ extended: true })); // Pour analyser application/x-www-form-urlencoded
app.use('/img', express.static('public/images')); // Servir les fichiers sous le dossier public/images


//// A chaque requête, exécutez ce qui suit
app.use((req, ers, next) => {
    console.log("middleware just ran");
    next();
});


//Sur toute demande à /gse, exécutez ce qui suit
app.use("/gse", (req, ers, next) => {
    console.log("middleware just ran on a gse route");
    next();
});

// pr�fixe chaque route ici avec /game
app.use('/user', userRoutes); // Utiliser les routes cr��s
app.use('/article', articleRoutes);
app.use('/rdv', rdvRoutes);


// Utiliser le middleware de routes introuvables
app.use(notFoundError);
// Utiliser le middleware gestionnaire d'erreurs
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});