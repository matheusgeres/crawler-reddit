const chrome   = require('./robot/chrome');

(async () => {
  const params = [];
  process.argv.forEach(function (val, index, array) {
    if(index>=2){
      params.push(val);
    }
  });

  let subreddits = [];
  if(params.length>0){
    if(params[0].indexOf(";")==-1){
      subreddits = [params[0]];  
    }else{
      subreddits = params[0].split(";");
    }
  }

  let data = await chrome.scrapperSubreddit(subreddits);

  console.log(data);
})();
