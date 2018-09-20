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

const parseCommand = function(message){
    const cmd = [];
    if (message.hasOwnProperty("entities")){
        const len = message.entities.length;
        for (let i = 0;i<len;i+=1){
            let ent = message.entities[i];
            if (ent.type == "bot_command"){
                cmd.push(message.text.slice(ent.offset,ent.offset+ent.length));
            }
        }
    }
    return cmd;
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
                const cmd = parseCommand(message);
                let cmdExists = false;
                for (let j=0;j<cmd.length;j+=1){
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
        });
    }
}

exports.createBot = function(token,route){
    return new Bot(token,route);
}

