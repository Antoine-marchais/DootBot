const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const telegramBot = require("./TelegramBot.js");
let count = 1;

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

const dootBot = telegramBot.createBot(token,"/");
dootBot.getMessage(function(message){
    const chat_id = message.chat.id;
    const text = doot();
    dootBot.sendMessage(chat_id,text);
});
