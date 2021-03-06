'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  //const echo = { type: 'text', text: event.message.text };

  // For debug
  console.log(event.message);
  console.log(event.source);
  console.log('process.env.LINE_USERID_ADMIN : ' + process.env.LINE_USERID_ADMIN);
  console.log('Type of LINE_USERID_ADMIN is ' + typeof process.env.LINE_USERID_ADMIN)
  
  let testmsg = { type: 'text', text: 'KONICHIWA' }
  if (event.message.text == 'admin') {
    console.log('文字列adminは確認できた');
    console.log(testmsg + ' server.js:50')

    if (event.source.userId == process.env.LINE_USERID_ADMIN) {
      console.log('USER_ID確認でけた！');
      testmsg.text = 'Login as admin!';
      console.log(testmsg + ' server.js:54')
    } else {
      console.log('admin受け取ったけど、USER_ID確認できひんかった');
      testmsg,text = 'Hello admin user!';
      console.log(testmsg + ' server.js:58')
    }
  }
  
  console.log(testmsg + ' server.js:63')
  // use reply API
  //return client.replyMessage(event.replyToken, echo);
  return client.replyMessage(event.replyToken, testmsg);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});