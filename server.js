const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8799455642:AAE2U-tBn2xsI46n9YkOZIBtf3l7J3iR8R4";
const WEBAPP_URL = "https://brawl-mro6.onrender.com";
const APP_URL = "https://serverbrawl.onrender.com";

const app = express();
app.use(express.json());

const bot = new TelegramBot(TOKEN);

bot.setWebHook(APP_URL + "/bot" + TOKEN)
  .then(() => console.log("webhook set"))
  .catch(err => console.error("webhook error:", err.message));

app.post("/bot" + TOKEN, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Открывай мини-приложение", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "Зайти",
          web_app: { url: WEBAPP_URL }
        }
      ]]
    }
  });
});

app.get("/", (req, res) => {
  res.send("bot ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("bot started on " + PORT);
});
