const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require("uuid");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordconfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0 ){
            return res.render('register', {
                message: 'the email is already in use'
            })
        } else if ( password !== passwordconfirm){
            return res.render('register', {
                message: 'Password do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { id: uuidv4(), name: name, email: email, password: hashedPassword }, (error,results) => {
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register', {
                    message: 'user registered !'
                })
            }
        })
    });
}