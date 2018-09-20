const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
};

const limiter = rateLimit({
    windowMs: 1000,
    max: 10
});

function Command(cmd,callback){
    this.cmd = cmd;
    this.callback = callback;
}

const parseCommand = function(text){
    let char = text[0];
    let cmd = "";
    let i = 1;
    if (char == "/"){
        char = text[i];
        while (char != " "){
            cmd += char;
            i+=1;
            char = text[i];
        }
    }
    return cmd;
}

exports.parseArgs = function(text){
    let args = [];
    let arg = "";
    let i = 0;
    while (i<text.length){
        if (text[i]!=" "){
            arg += text[i];
        }
        else if(arg!=""){
            args.push(arg);
            arg = "";
        }
        i+=1;
    }
    if (arg!=""){
        args.push(arg);
    }
    return args;
}

function Bot(token,route){
    this.route = route;
    this.token = token;
    this.app = express();
    this.app.enable('trust proxy');
    this.app.use(bodyParser.json());
    this.app.use(limiter);
    this.commands = [];
    //adding events methods
    this.listen = function(port){
        this.app.listen(port);
    }
    const _this = this;


    this.app.post(route,function(req,res){
        if (req.body.hasOwnProperty("message")){
            const message = req.body.message;
            if (message.hasOwnProperty("text")){
                const cmd = parseCommand(message.text);
                let cmdExists = false;
                for(let i=0;i<_this.commands.length;i+=1){
                    if (_this.commands[i].cmd == cmd){
                        cmdExists = true;
                        _this.commands[i].callback(message);
                    }
                }
                if (!cmdExists){
                    _this.defaultCommand(message);
                }
            }
        }
        res.status(200);
        res.send('ok');
    });

    this.addCommand = function(cmd,callback){
        this.commands.push(new Command(cmd,callback));
    }

    this.setDefault = function(callback){
        this.defaultCommand = callback;
    }

    this.sendMessage = function(id,text){
        const message = new Message(id,text); 
        const options = {
            url: 'https://api.telegram.org/bot'+this.token+'/sendMessage',
            json: true,
            body: message
        };
        request.post(options,function(err,res,body){
            console.log("message send");
        });
    }
}

exports.createBot = function(token,route){
    return new Bot(token,route);
}

