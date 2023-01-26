import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";
const articleSchema = new Schema(
    {   
    
        title: {
            type: String,
            required: true,
            unique: true,
        },
        author: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    },
        {
        timestamps:true
        }
)

export default model("Article", articleSchema);