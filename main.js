const token = "514706312:AAEDQqSaQ-s8YDB7VvepQGjQDMCJNoUFf1Q";

const telegramBot = require("./localModules/telegramBot");
const jsonPreferences = require('./localModules/json-preferences');
const PORT = process.env.PORT;

const preferences = jsonPreferences.preferences("preferences.json");


//initialisation
if (preferences.get('up') != null){
    let up = preferences.get('up');
    let countDoot = preferences.get('countDoot');
    let dootActive = preferences.get('dootActive');
}else {
    let up = 0;
    let countDoot = 1;
    let dootActive = true;
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

if (dootActive){
    dootOn();
}

dootBot.listen(8080);
