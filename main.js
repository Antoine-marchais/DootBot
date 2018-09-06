const token = "514706312:AAGU4Gf5Gl1rmPCwK-LWE7CFPrhW7eP2xNM";
const http = require('http');
const request = require("request");

const target = "https://api.telegram.org/bot"+token;
request(target+"/setWebhook?url=http://192.168.20.38:8080",function(err,body,res){
    if (!err) {
        console.log("okidoki");
    }
});

const bot = http.createServer(function(req,res){
    console.log("plop");
    res.writeHead(200);
    res.end("almost no content");
});

bot.listen(8080);

