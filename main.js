const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const express = require("express");
const request = require("request");
const PORT = process.env.PORT;
const app = express();
let count = 0;

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
};

app.get("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.status(200);
    res.send('ce bot a reçu '+count+' messages depuis son build');
});

app.post("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    count += 1;
    const id = JSON.parse(req).message.chat.id;
    const doot = 'd'+count*'o'+'t';
    const message = Message(id,doot); 
    request.post('https://api.telegram.org/bot'+token+'/sendMessage',{json : message});
    res.status(200);
    res.send('ok');
});

app.listen(PORT);