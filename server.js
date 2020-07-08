
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "laparik2020client@gmail.com",
        pass: "Client2020"
    }
  })
const uri = "mongodb+srv://PatrickOndreovici:Patrick242004@restaurant.btnkm.mongodb.net/restaurant?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
const produsSchema = new mongoose.Schema({
    nume_produs: String,
    pret: Number,
    descriere: String
  }, { collection : 'meniu' })

var produs = mongoose.model("meniu", produsSchema)

const rezervareSchema = new mongoose.Schema({
    nume: String,
    tel: String,
    data: Date,
    mesaj: String
  }, { collection : 'rezervari' })
  
var rezervare = mongoose.model("rezervari", rezervareSchema)

const comandaSchema = new mongoose.Schema({
    nume: String,
    tel: String,
    str: String,
    nr: Array,
    nr2: Array,
    pret: Number
}, { collection : 'comenzi' })

var comanda = mongoose.model("comenzi", comandaSchema)

app.get('/', (req, res) => {
    produs.find((err, pr) => {
        res.render("index", {meniu: pr})
    })
})

app.post("/success", (req, res) =>{
    res.redirect("/")
})

app.post("/comanda", (req, res) => {
  produs.find((err, pr) => {
    var nume = req.body.nume
    var tel = req.body.tel
    var str = req.body.str
    var nr = req.body.nr
    var v = []
    var pret = 0;
    for (var i = 0; i < nr.length; ++i){
        pret += Number(nr[i]) * Number(pr[i].pret)
        v.push(pr[i].nume_produs)
    }
    const com = new comanda({nume: nume, tel: tel, str: str, nr: nr, pret: pret})
    com.save().then(() => {
      ejs.renderFile(__dirname + "/views/comanda.ejs",{nume: nume, tel: tel, str: str, nr: nr, nr2: v, pret: pret}, (err, data) => {
        var id = com._id.toString()
        const mailOptions = {
          from: "laparik2020client@gmail.com",
          to: "laparik2020@gmail.com",
          subject: "Comanda noua (" + id + ")",
          html: data
        }
        transporter.sendMail(mailOptions,() =>{
          res.render("success", {tip: "Comanda"})
         })
  })
    })
  })
})

app.post("/rezervare", (req, res) => {
    var nume = req.body.nume
    var tel = req.body.tel
    var mesaj = req.body.mesaj
    var data = req.body.data
    const rez = new rezervare({ nume: nume, tel: tel, data: data, mesaj: mesaj})
    rez.save().then(() => {
        ejs.renderFile(__dirname + "/views/rezervare.ejs", {nume: nume, tel: tel, data: data, mesaj: mesaj}, (err, data) => {
              var id = rez._id.toString()
              const mailOptions = {
                from: "laparik2020client@gmail.com",
                to: "laparik2020@gmail.com",
                subject: "Rezervare noua (" + id + ")",
                html: data
              }
              transporter.sendMail(mailOptions,() =>{
                res.render("success", {tip: "Rezervarea"})
               })
        })
    })
})

app.listen(process.env.PORT, () => {
    console.log("server has started...")
})