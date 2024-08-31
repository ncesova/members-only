import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
