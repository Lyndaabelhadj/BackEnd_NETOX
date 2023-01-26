import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";
const rdvSchema = new Schema(
{
        date: {
            type: String,
            required: true,
        },
        heure: {
            type: String,
            required: true,
        },
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
} 
)

export default model("Rdv", rdvSchema);