require('dotenv').config();
const token = process.env.TOKEN;
const telegramBot = require("./localModules/telegramBot/telegramBot");
const Firestore = require("@google-cloud/firestore");
const { FieldValue } = require('@google-cloud/firestore');

const db = new Firestore()

//initialisation from firestore settings db
let countDoot = 1;
let dootActive;

(async () => {
    try {
        dootActive = (await db.collection('dootbot').doc('settings').get()).data()
        console.log("init succeeded")
    } catch (e) {
        console.log("init failed", e)
    }
})()

//create the doot message and update the o count in the database
async function doot(){
    const settingsRef = db.collection('dootbot').doc('settings')
    try {
        await db.runTransaction(async (t) => {
          const settings = await t.get(settingsRef);
          countDoot = settings.data().countDoot + 1;
          if (countDoot === 200){countDoot = 2;}
          t.update(settingsRef, {countDoot: countDoot});
        });
        console.log('Doot transaction succeeded');
      } catch (e) {
        console.log('Doot transaction failed:', e);
      }
    let doot = "";
    doot += "d";
    doot = "d"+"o".repeat(countDoot)+"t";
    return doot;
};

//creation of bot
const dootBot = telegramBot.createBot(token,"/");

//fetch the countDoot param, send message and update stats
dootBot.addCommand("/doot",function(message){
    if (dootActive){
        doot().then(text => dootBot.sendMessage(message.chat.id, text));
        const statsRef = db.collection('dootbot').doc('stats')
        const userRef = statsRef.collection('users').doc(String(message.from.id))
        userRef.get().then((userSnapshot) => {
            if (userSnapshot.exists) {
                userRef.update({dooted: FieldValue.increment(1)})
            } else {
                userRef.set({
                    first_name: message.from.first_name,
                    last_name: message.from.last_name,
                    username: message.from.username,
                    dooted: 1,
                    mastodooted: 0
                })
            }
        })
    }
})

//stop the bot from dooting by updating the dootActive parameter
dootBot.addCommand("/dootOff",function(message){
    if (message.from.username == "Oz_Obal" || message.from.username == "Dixneuf19"){
        dootActive = false
        db.collection('dootbot').doc('settings').update({dootActive: false}).then(success => console.log("doot Off"))
    }
    else {
        dootBot.defaultCommand(message);
    }
});

//resume the dooting behavior by updating the dootActive parameter
dootBot.addCommand("/dootOn",function(message){
    if (message.from.username == "Oz_Obal" || message.from.username == "Dixneuf19"){
        dootActive = true;
        db.collection('dootbot').doc('settings').update({dootActive: true}).then(success => console.log("doot On"))
    }else {
        dootBot.defaultCommand(message);
    }
});

//send mastodoot messages and update the stats
dootBot.addCommand("/mastoDoot",function(message){
    if (dootActive) {
        for (let i=0;i<5;i+=1) {
            dootBot.sendMessage(message.chat.id,"DOOOOOOOOOOOT !!!!!");
        }
        const statsRef = db.collection('dootbot').doc('stats')
        const userRef = statsRef.collection('users').doc(String(message.from.id))
        userRef.get().then((userSnapshot) => {
            if (userSnapshot.exists) {
                userRef.update({mastodooted: FieldValue.increment(1)})
            } else {
                userRef.set({
                    first_name: message.from.first_name,
                    last_name: message.from.last_name,
                    username: message.from.username,
                    dooted: 0,
                    mastodooted: 1
                })
            }
        })
    }
})

//TODO retrieve stats from db and display them
/*
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
*/

exports.processMessage = dootBot.processMessage
