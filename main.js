//const token = "514706312:AAGU4Gf5Gl1rmPCwK-LWE7CFPrhW7eP2xNM";

var express = require("express");

var app = express();

app.get("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.send('ceci est la réponse')
});

app.listen(8080);