const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const telegramBot = require("./telegramBot");
const PORT = process.env.PORT;
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
const dootOn = function(){
    dootBot.setDefault(function(message){
        const text = doot();
        dootBot.sendMessage(message.chat.id,text);
    });
};

const dootOff = function(){
    dootBot.setDefault(function(){});
}


dootBot.addCommand("/dootOff",function(message){
    if (message.from.username == "Oz_Obal"){
        dootOff();
        console.log("doot Off");
    }
    else {
        dootBot.defaultCommand(message);
    }
});

dootBot.addCommand("/dootOn",function(message){
    if (message.from.username == "Oz_Obal"){
        dootOn();
        console.log("doot On");
    }else {
        dootBot.defaultCommand(message);
    }
});


dootOn();
dootBot.listen(PORT);
