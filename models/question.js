import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";
const questionSchema = new Schema(
    {
        
        contenu: {
            type: String,
            required: true,
         },
         choix1: {
            type: Number,
            required: true,
         },
         choix2: {
            type: Number,
            required: true,
         },
         choix3: {
            type: Number,
            required: true,
         }
    
    }
)

export default model("Question", questionSchema);