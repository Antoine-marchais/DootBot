require('dotenv').config();
const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";
const telegramBot = require("./localModules/telegramBot");
const jsonPreferences = require('./localModules/json-preferences');
const PORT = process.env.PORT;
const preferences = jsonPreferences.preferences("preferences.json");


//initialisation
let up = 0;
let countDoot = 1;
let dootActive = true;
if (preferences.get('up') != null){
    up = preferences.get('up');
    countDoot = preferences.get('countDoot');
    dootActive = preferences.get('dootActive');
}else {
    preferences.set('up',up);
    preferences.set('countDoot',countDoot);
    preferences.set('dootActive',dootActive);
}

//helper functions
const doot = function(){
    countDoot += 1;
    preferences.set('countDoot',countDoot);
    let doot = "";
    doot += "d";
    for(var i =0;i<countDoot;i+=1){
        doot += "o";
    };
    doot += "t";
    return doot;
};

const dootOn = function(){
    dootActive = true;
    preferences.set('dootActive',dootActive);
    dootBot.setDefault(function(message){
        up+=1;
        preferences.set('up',up);
        if ((up%20 == 0)&&(message.chat.id==-1001355626155)){
            dootBot.sendMessage(message.chat.id,"Up",62776);
        }
        else {
            const text = doot();
            dootBot.sendMessage(message.chat.id,text);
        }
    });
};

const dootOff = function(){
    dootBot.setDefault(function(){});
    dootActive = false;
    preferences.set('dootActive',dootActive)
}


//creation of bot
const dootBot = telegramBot.createBot(token,"/");

//setting commands
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

dootBot.addCommand("/mastoDoot",function(message){
    if (dootActive) {
        for (let i=0;i<20;i+=1) {
            dootBot.sendMessage(message.chat.id,"DOOOOOOOOOOOOOOOT");
        }
    }
})

if (dootActive){
    dootOn();
}else {
    dootOff();
}

dootBot.listen(PORT);
