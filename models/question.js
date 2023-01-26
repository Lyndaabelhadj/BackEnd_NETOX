import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";
const questionSchema = new Schema(
    {
        
        contenu: {
            type: String,
            required: true,
         }
    
    }
)

export default model("Question", questionSchema);