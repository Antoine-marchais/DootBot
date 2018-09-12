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
let count_req = 0;
const dootBot = telegramBot.createBot(token,"/");
dootBot.listen(PORT);
dootBot.setDefault(function(message){
    count_req+=1;
    if (count_req%100==0){console.log(count_req);};
})
