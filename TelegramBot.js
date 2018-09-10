const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');
const PORT = process.env.PORT;

function Bot(token,route){
    this.url = url;
    this.token = token;
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.listen(PORT);
    //adding events methods
    this.getMessage() = function(callback){
        this.app.post(route,function(req,res){
            const message = req.body.message;
            res.status(200);
            callback(message);
        });
    }
}

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
};

const sendMessage = function(token,id,text){
    const message = new Message(id,text); 
    const options = {
        url: 'https://api.telegram.org/bot'+token+'/sendMessage',
        json: true,
        body: text
    };
    request.post(options,function(err,res,body){
        console.log("message send");
    });
};