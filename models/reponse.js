import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";
// Using Schema constructor, create a reponseSchema
const reponseSchema = new Schema(
    {
    
        rep1: {
            type: String,
            required: true,
        },
        rep2: {
            type: String,
            required: true,
        },
        rep3: {
            type: String,
            required: true,
        },
        score: {
            type: String,
            required: true,
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: "questions"
        }
    
    }
)
// Create model from the schema
// Export model
export default model("Reponse", reponseSchema);