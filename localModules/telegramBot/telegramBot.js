const request = require("request");

function Message(chat_id,text){
    this.chat_id = chat_id;
    this.text = text;
};

function Command(cmd,callback){
    this.cmd = cmd;
    this.callback = callback;
}

// return commands in message object
const parseCommand = function(message){
    let cmd = null;
    if (message.hasOwnProperty("entities")){
        const len = message.entities.length;
        for (let i = 0;i<len;i+=1){
            let ent = message.entities[i];
            if (ent.type == "bot_command"){
                cmd = message.text.slice(ent.offset,ent.offset+ent.length);
                return cmd
            }
        }
    }
    return cmd;
}

// bot to process telegram message according to a list of predefined commands
function Bot(token,route){
    this.route = route;
    this.token = token;
    this.commands = [];
    const _this = this
    this.defaultCommand = function(message){}

    // find commands in the message and execute them
    this.processMessage = function(req,res){
        if (req.body.hasOwnProperty("message")){
            const message = req.body.message;
            if (message.hasOwnProperty("text")){
                const parsedCommand = parseCommand(message);
                let cmdExists = false;
                for(let i = 0; i < _this.commands.length; i += 1){
                    if (_this.commands[i].cmd == parsedCommand){
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
    }

    // append a command and its callback to the list of processed commands
    this.addCommand = function(cmd,callback){
        this.commands.push(new Command(cmd,callback));
    }

    // create a default command for bot api
    this.setDefault = function(callback){
        this.defaultCommand = callback;
    }

    // send a message to the given chat
    this.sendMessage = function(chat_id,text,reply=null){
        const message = new Message(chat_id,text);
        const options = {
            url: 'https://api.telegram.org/bot'+this.token+'/sendMessage',
            json: true,
            body: message
        };
        if (reply != null){
            options.body.reply_to_message_id = reply;
        }
        request.post(options,function(err,res,body){
        });
    }
}

exports.createBot = function(token,route){
    return new Bot(token,route);
}

