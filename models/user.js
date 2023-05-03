import mongoose from 'mongoose';
const { Schema, model } = mongoose;
//import {Schema, model} from "mongoose";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        role: {
            type: String,
            required: true
        },
       // datedenaissance: {
          //  type: String,
            //required: true
        //},
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        resetLink: {
            data: String,
            default: ''
        },
        codeForget: {
            type: String,
            required: false,
          },
        codeVerif: {
            type: String,
            required: false,
          },
        verified: {
            type: String,
            required: false,
          },
          score: {
            type: Number,
            required: false,
            default: 0
          },
    },
        {
        timestamps:true
        }

)

export default model("User", userSchema);