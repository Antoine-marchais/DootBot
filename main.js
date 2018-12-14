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
        up_param = data.up_parametter;
        dootActive = data.doot_isactive
    }
})

//helper functions
const doot = function(){
    countDoot += 1;
    let doot = "";
    doot += "d";
    for(var i =0;i<countDoot;i+=1){
        doot += "o";
    };
    doot += "t ? That's a name I haven't heard in a really long time...";
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

dootBot.addCommand("/doot",function(message){
    if (dootActive){
        dootBot.defaultCommand(message);
        const queryString = "SELECT * FROM user_stats WHERE bot_id = $1 AND first_name = $2 AND last_name = $3";
        const values = [1,message.from.first_name,message.from.last_name];
        pool.query(queryString,values,(err,res) => {
            if (res.rows.length != 0){
                const dooted = res.rows[0].dooted;
                const id = res.rows[0].id;
                const queryString = "UPDATE user_stats SET dooted = $1 WHERE id = $2";
                const values = [dooted+1,id];
                pool.query(queryString,values,(err,res)=>{})
            }else {
                const queryString = "INSERT INTO user_stats(bot_id,first_name,last_name,dooted,mastodooted) VALUES($1,$2,$3,$4,$5)";
                const values = [1,message.from.first_name,message.from.last_name,1,0];
                pool.query(queryString,values,(err,res)=>{});
            }
        })
    }
})

dootBot.addCommand("/dootOff",function(message){
    if (message.from.username == "Oz_Obal" || message.from.username == "Dixneuf19"){
        dootActive = false;
        console.log("doot Off");
    }
    else {
        dootBot.defaultCommand(message);
    }
});

dootBot.addCommand("/dootOn",function(message){
    if (message.from.username == "Oz_Obal" || message.from.username == "Dixneuf19"){
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
        const queryString = "SELECT * FROM user_stats WHERE bot_id = $1 AND first_name = $2 AND last_name = $3";
        const values = [1,message.from.first_name,message.from.last_name];
        pool.query(queryString,values,(err,res) => {
            if (res.rows.length != 0){
                const mastodooted = res.rows[0].mastodooted;
                const id = res.rows[0].id;
                const queryString = "UPDATE user_stats SET mastodooted = $1 WHERE id = $2";
                const values = [mastodooted+1,id];
                pool.query(queryString,values,(err,res)=>{});
            }else {
                const queryString = "INSERT INTO user_stats(bot_id,first_name,last_name,dooted,mastodooted) VALUES($1,$2,$3,$4,$5)";
                const values = [1,message.from.first_name,message.from.last_name,1,0];
                pool.query(queryString,values,(err,res)=>{});
            }
        })
    }
})

dootBot.addCommand("/stats",function(message){
    const queryString = "SELECT * FROM user_stats ORDER BY dooted DESC LIMIT 3";
    pool.query(queryString,function(err,res){
        const results = res.rows;
        let text = "dooted the most :\n\n";
        results.forEach(function(row,i){
            text += `  ${i+1}. ${row.first_name} ${row.last_name} : ${row.dooted}\n`;
        })
        const queryString = "SELECT * FROM user_stats ORDER BY mastodooted DESC LIMIT 3";
        pool.query(queryString,(err,res)=>{
            const results = res.rows;
            text += "\nmastodooted the most :\n\n";
            results.forEach(function(row,i){
                text += `  ${i+1}. ${row.first_name} ${row.last_name} : ${row.mastodooted}\n`;
            })
            dootBot.sendMessage(message.chat.id,text);
        })
    });
})

dootBot.addCommand("/reDoot",function(){
    countDoot = 1;
});


//launchingBot

dootBot.listen(PORT);

//to do on termination

process.on('SIGTERM',function(){
    const queryString = "UPDATE bot_settings SET o_count = $1, doot_isactive = $2 WHERE id = 1";
    const values = [countDoot,dootActive];

    pool.query(queryString,values, (err, res) => {
        console.log("saved params");
        pool.end();
        process.exit(0);
    });
})
