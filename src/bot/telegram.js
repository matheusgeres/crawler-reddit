let bb = require('bot-brother');
let credentials = require('../../credentials/telegram');
const chrome = require('../robot/chrome');

let bot = bb({
  key: credentials.key,
  sessionManager: bb.sessionManager.memory(),
  polling: { interval: 0, timeout: 1 }
});


bot.command('NadaPraFazer')
.invoke(async function (ctx) {
  var args = ctx.command.args;

  let subreddits = [];
  if(args.length>0){
    if(args[0].indexOf(";")==-1){
      subreddits = [args[0]];  
    }else{
      subreddits = args[0].split(";");
    }
  }

  let data = await chrome.scrapperSubreddit(subreddits);
  let response = "";

  if(data.readableMessage.length>4096){
    response = data.readableMessage.substring(0,4096);
  }else if(data.readableMessage==""){
    response = "Sem resultados dessa vez! :(\nQue pena!"
  }else{
    response = data.readableMessage;
  }

  return ctx.sendMessage(response);
});