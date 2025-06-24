require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const line = require('@line/bot-sdk');

// 設定 LINE 設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

// LINE 客戶端
const client = new line.Client(config);

// 中介處理器：接收 LINE webhook 的資料
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 處理事件（這裡你可以自訂訊息內容）
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `你說了：「${event.message.text}」`
  });
}

app.get('/', (req, res) => {
  res.send('Line Notify Server Running');
});

app.listen(port, () => {
  console.log(`伺服器運行中，port: ${port}`);
});
