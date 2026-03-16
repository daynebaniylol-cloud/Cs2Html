const http = require("http");

const TOKEN = "8799455642:AAE2U-tBn2xsI46n9YkOZIBtf3l7J3iR8R4";
const WEBAPP_URL = "https://brawl-mro6.onrender.com";

async function tg(method, data = {}) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await r.json();
}

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg) return;

  const text = (msg.text || "").trim();
  const chatId = msg.chat.id;

  if (text === "/start") {
    try {
      await tg("deleteMessage", {
        chat_id: chatId,
        message_id: msg.message_id
      });
    } catch {}

    await tg("sendMessage", {
      chat_id: chatId,
      text: "Ты в игре",
      reply_markup: {
        inline_keyboard: [[
          {
            text: "Зайти",
            web_app: { url: WEBAPP_URL }
          }
        ]]
      }
    });
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("bot ok");
    return;
  }

  if (req.method === "GET" && req.url === "/setwebhook") {
    const webhookUrl = `https://${req.headers.host}/webhook`;
    tg("setWebhook", { url: webhookUrl })
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(String(err));
      });
    return;
  }

  if (req.method === "POST" && req.url === "/webhook") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const update = JSON.parse(body);
        await handleUpdate(update);
      } catch (e) {
        console.error(e);
      }
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("ok");
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("not found");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Bot started on port " + PORT);
});
