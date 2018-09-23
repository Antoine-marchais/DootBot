const fs = require('fs')

function Preferences(path){
    this.path = path;
    try {
        this.obj = JSON.parse(fs.readFileSync(this.path));
    }catch (err) {
        this.obj = {};
        fs.writeFile(this.path,JSON.stringify(this.obj),'utf-8',function(err){
            if(err){console.log(err)}
        });
    }
    
    this.get = function(key){
        if (this.obj.hasOwnProperty(key)){
            return this.obj[key];
        }else{
            console.log("inexistant property required");
            return null;
        }
    }
    this.set = function(key,value){
        this.obj[key] = value;
        fs.writeFile(this.path,JSON.stringify(this.obj),function(err){if(err){console.log(err)}});
    };
};

exports.preferences = function(path){
    return new Preferences(path);
};

