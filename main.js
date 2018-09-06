//const token = "514706312:AAGU4Gf5Gl1rmPCwK-LWE7CFPrhW7eP2xNM";

const express = require("express");
const PORT = process.env.PORT;
const app = express();

app.get("/",function(req,res){
    res.setHeader('Content-Type','text/plain');
    res.send('ceci est la réponse')
});

app.listen(PORT);