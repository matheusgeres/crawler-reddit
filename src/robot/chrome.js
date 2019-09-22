const puppeteer   = require("puppeteer");
const env         = require("../../local.env.json")

exports.scrapperSubreddit = async function(subreddits){
    const browser      = await puppeteer.launch({
      headless         : env.puppeteer.headless,
      ignoreHTTPSErrors: env.puppeteer.ignoreHTTPSErrors,
      args             : env.puppeteer.args
    });

    const pages = await browser.pages();
    const page  = pages[0];
    await page.setViewport({width: env.puppeteer.viewPort.width, height: env.puppeteer.viewPort.height});

    let posts = [];
    for(let subreddit of subreddits){
      await page.goto(`https://old.reddit.com/r/${subreddit}/`, { waitUntil: env.goto.waitUntil });

      let postsReddit = [];
      postsReddit = await page.evaluate(() => {
        const $ = window.$; //otherwise the transpiler will rename it and won't work
        let subredditName = $('h1.redditname a').html();
        
        let postsReddit = [];
        $('.thing').each((index, value) => {
          if(!$(value).data("promoted") && $(value).data("score")>=5000){
            let allDataPost = $(value).data();
            let needDataPost = {};

            needDataPost.score = allDataPost.score;
            needDataPost.permalink = `https://old.reddit.com${allDataPost.permalink}`
            needDataPost.subredditName = subredditName;
            needDataPost.subredditPrefixed = `https://old.reddit.com/${allDataPost.subredditPrefixed}`;
            needDataPost.title = $(`.id-${allDataPost.fullname} .top-matter a.title`).html()

            postsReddit.push(needDataPost);
          }
        });

        postsReddit = postsReddit.sort(function(a, b){return b.score-a.score})
        return postsReddit;
      });

      posts.push(...postsReddit);
    }

    let readableMessage = ""
    posts.forEach(value => {
      readableMessage+=`-------\n`;
      readableMessage+=`Pontuação: ${value.score}\n`;
      readableMessage+=`Subreddit: ${value.subredditName}\n`;
      readableMessage+=`Subreddit link: ${value.subredditPrefixed}\n`;
      readableMessage+=`Título comentários: ${value.title}\n`;
      readableMessage+=`Link comentários: ${value.permalink}\n`;
    });

    let response = {
      json: posts,
      readableMessage: readableMessage
    }
    await browser.close();

    return response;
  }