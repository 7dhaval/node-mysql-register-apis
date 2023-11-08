const express = require("express");
const app = express();

const path = require("path")
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env"})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

const publicDirectory = path.join(__dirname, './public' )
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false }));
app.use(express.json());

app.set('view engine', 'hbs');

db.connect( (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("mysql connected ...");
    }
})

//Define Routes 
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(1337, (req,res) => {
    console.log("server started on port: 1337");
})