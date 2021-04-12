const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
require('dotenv').config()
app = express()

const MongoClient = require('mongodb').MongoClient;
uri = "mongodb+srv://dbUser:FAKEBD@cluster0-sxxwv.mongodb.net/FAKECONNECT?retryWrites=true&w=majority";


MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('dbalunos')

    app.listen(3000, () => {
        console.log('porta 3000 ouvindo')
    })
})

var smtpTransport = nodemailer.createTransport({
    pool: true,
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.emailUser,
        pass: process.env.passUser,
    }
});

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/')
        db.collection('data').find().toArray((err, results) => {})
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    let cursor = db.collection('data').find()
    console.log("nota", cursor)
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/show')
    })
})

app.get('/send', function(req, res) {
    var mailOptions = {
        from: "FORTEC <FAKEEMAIL@gmail.com>",
        // to: req.query.to,
        bcc: req.query.bcc,
        subject: req.query.subject,
        text: req.query.text,
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Enviada: " + response.message);
            res.end("sent");
        }
    });
});