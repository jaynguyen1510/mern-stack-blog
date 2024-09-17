// const express = require('express')
import express from 'express'
import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config()

mongoose.connect(process.env.MONGO_DB)

    .then(() => {
        console.log("Connect MongoDB successfully");

    })
    .catch((error) => {
        console.log("Error connecting to DB", error);
    });

const app = express();
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log("server running on", port);

})