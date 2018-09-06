//const token = "514706312:AAGU4Gf5Gl1rmPCwK-LWE7CFPrhW7eP2xNM";

const express = require("express");
const PORT = process.env.PORT;
const app = express();
let count = 0;

app.get("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.status(200);
    res.send('ce bot a reçu '+count+' messages depuis son build');
});

app.post("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    count += 1;
    res.status(200);
    res.send('ok');
});

app.listen(PORT);