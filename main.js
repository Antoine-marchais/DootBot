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

//creation of bot
const dootBot = telegramBot.createBot(token,"/");

//setting commands
dootBot.setDefault(function(message){
    if (dootActive){
        up+=1;
        if ((up%up_param == 0)&&(message.chat.id==-1001355626155)){
            dootBot.sendMessage(message.chat.id,"Up",62776);
        }
        else {
            const text = doot();
            dootBot.sendMessage(message.chat.id,text);
        }
    }
});

dootBot.addCommand("/dootOff",function(message){
    if (message.from.username == "Oz_Obal"){
        dootActive = false;
        console.log("doot Off");
    }
    else {
        dootBot.defaultCommand(message);
    }
});

dootBot.addCommand("/dootOn",function(message){
    if (message.from.username == "Oz_Obal"){
        dootActive = true;
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

dootBot.listen(PORT);

process.on('SIGTERM',function(){
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    
    const queryString = "UPDATE bot_settings SET o_count = $1, doot_isactive = $2 WHERE id = 1";
    const values = [countDoot,dootActive];

    pool.query(queryString,values, (err, res) => {
        console.log("saved params");
        pool.end();
        process.exit(0);
    });
})