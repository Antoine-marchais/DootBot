const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
let count = 0;

app.use(bodyParser.json());
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
    const id = req.body.result[0].message.chat.id;
    const doot = 'd'+count*'o'+'t';
    const message = Message(id,doot); 
    const options = {
        url: 'https://api.telegram.org/bot'+token+'/sendMessage',
        json: true,
        body: message
    };
    request.post(options,function(){console.log("message send");});
    res.status(200);
    res.send('ok');
});

app.listen(PORT);