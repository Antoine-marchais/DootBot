const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
let count = 1;

app.use(bodyParser.json());

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
};

const doot = function(){
    count += 1;
    let doot = "";
    doot += "d";
    for(var i =0;i<count;i+=1){
        doot += "o";
    };
    doot += "t";
    return doot;
};

app.get("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.status(200);
    res.send('ce bot a reçu '+count+' messages depuis son build');
});

app.post("/",function(req,res){
    res.status(200);
    const id = req.body.message.chat.id;
    const message = new Message(id,doot()); 
    const options = {
        url: 'https://api.telegram.org/bot'+token+'/sendMessage',
        json: true,
        body: message
    };
    console.log(options);
    console.log(message);
    request.post(options,function(err,res,body){
        if (request.statusCode >= 300) {
            console.log(err);
        }
    });
    res.status(200);
    res.send('ok');
});

app.listen(PORT);