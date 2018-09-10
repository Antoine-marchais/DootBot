const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');
const PORT = process.env.PORT;

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
};

function Bot(token,route){
    this.url = url;
    this.token = token;
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.listen(PORT);
    //adding events methods
    this.getMessage = function(callback){
        this.app.post(route,function(req,res){
            const message = req.body.message;
            res.status(200);
            callback(message);
        });
    };

    this.sendMessage = function(id,text){
        const message = new Message(id,text); 
        const options = {
            url: 'https://api.telegram.org/bot'+this.token+'/sendMessage',
            json: true,
            body: text
        };
        request.post(options,function(err,res,body){
            console.log("message send");
        });
    }
}

exports.createBot = function(token,route){
    return Bot(token,route);
}
