import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";

const quizSchema = new Schema(
    {
      
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: "questions"
        },
        
        reponse: {
            type: Schema.Types.ObjectId,
            ref: "reponses"
        },

        score: {
            type:Number,
            required:true,
        }
        


    
    }
)

export default model("Quiz", quizSchema);