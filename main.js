require('dotenv').config();
const token = process.env.TOKEN;
const telegramBot = require("./localModules/telegramBot");
const PORT = process.env.PORT;
const pg = require('pg');

//initialisation
let up = 0;
let countDoot = 1;
let dootActive = true;
let up_param = 0;

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
  
pool.query('SELECT * FROM bot_settings WHERE id = 1', (err, res) => {
    if (err){console.log(err)}
    else {
        const data = res.rows[0];
        countDoot = data.o_count;
        up = data.up_parametter;
        dootActive = data.doot_isactive
    }
    pool.end();
})

//helper functions
const doot = function(){
    countDoot += 1;
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
    dootBot.setDefault(function(message){
        up+=1;
        if ((up%up_param == 0)&&(message.chat.id==-1001355626155)){
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
            dootBot.sendMessage(message.chat.id,"DOOOOOOOOOOOT !!!!!");
        }
    }
})

dootBot.addCommand("/reDoot",function(){
    countDoot = 1;
});

if (dootActive){
    dootOn();
}else {
    dootOff();
}

dootBot.listen(PORT);

process.on('SIGTERM',function(){
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    
    const queryString = " UPDATE bot_settings SET o_count = "+countDoot
        +", doot_isactive = "+dootActive+" WHERE id = 1";

    pool.query(queryString, (err, res) => {
        console.log("saved params");
        pool.end();
        process.exit(0);
    });
})