const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const express = require("express");
const request = require("request");
const PORT = process.env.PORT;
const app = express();
let count = 0;

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
}

app.get("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.status(200);
    res.send('ce bot a reçu '+count+' messages depuis son build');
});

app.post("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    count += 1;
    request('https://api.telegram.org/bot'+token+'/sendMessage',)
    res.status(200);
    res.send('ok');
});

app.listen(PORT);