import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import {postRoutes} from "./routes/posts.js"
import {userRoutes} from "./routes/users.js"

const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "100mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));
app.use(cors());

//use corresponding routes
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send("Hello to dailyframe API")
});

const PORT = process.env.PORT; // !! remove "|| 5000" at deploy

mongoose.connect(process.env.CONNECTION_URL,{dbName: "main"})
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));

//mongoose.set('useFindAndModify', false);
//