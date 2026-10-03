import { Bot } from "node-telegram-bot-api";
import { run } from "node-telegram-bot-api/node";
import { main } from "./utils/main.js"
import { postData } from "./controller/controller.js"
import { getData } from "./controller/controller.js"

const token = ""
const bot = new Bot(token);
const chatId = '';

async function reminder(msg) {
  const fetching = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: chatId,
        text: msg
    })
  })
  return fetching
}

let lastTriggeredMinute = -1;
const timerId = setInterval(async () => {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = date.getDay();
  const second = date.getSeconds();

  if (second !== 0 || minute === lastTriggeredMinute) return;

  lastTriggeredMinute = minute;

  try {
    let triggered = false;

    if (hour === 0 && minute === 1) {
      const res = await main(true, "[SYSTEM TRIGGER: Kirim chat santai tanyain dia lagi ngapain jam segini, kok belum tidur.]");
      await reminder(res);
      await postData("", "assistant", res);
      triggered = true;
    } 
    else if (day === 6 && hour === 23 && minute === 55) {
      const res = await main(true, "[SYSTEM TRIGGER: Sapa santai ngomongin malam minggu.]");
      await reminder(res);
      await postData("", "assistant", res);
      triggered = true;
    } 
    else if (hour === 9 && minute === 2) {
      const res = await main(true, "[SYSTEM TRIGGER: Ucapin selamat pagi secara kasual dan tanyain lagi sibuk apa atau ada rencana apa hari ini.]");
      await reminder(res);
      await postData("", "assistant", res);
      triggered = true;
    } 
    else if (day === 5 && hour === 12 && minute === 1) {
      const res = await main(true, "[SYSTEM TRIGGER: Ingetin dia santai buat persiapan sholat Jumat dan jangan lupa makan siang.]");
      await reminder(res);
      await postData("", "assistant", res);
      triggered = true;
    } 
    else if (day !== 5 && hour === 12 && minute === 1) {
      const res = await main(true, '[SYSTEM TRIGGER: Ingetin dia santai udah masuk waktu Dzuhur sekalian ingetin makan siang.]');
      await reminder(res);
      await postData("", "assistant", res);
      triggered = true;
    } 
    else if (hour === 17 && minute === 58) {
      const res = await main(true, "[SYSTEM TRIGGER: Ingetin dia udah masuk waktu Maghrib sekalian ingetin makan malam.]");
      await reminder(res);
      await postData("", "assistant", res);
      triggered = true;
    }

    if (triggered) {
      console.log("Jadwal telah dieksekusi. Menghentikan interval...");
      clearInterval(timerId);
    }

  } catch (err) {
    console.error("Error pada penjadwalan:", err);
  }
}, 500);


bot.on("message", async(ctx) => {
  const id = ctx.update.message.from.id
  const chat = ctx.update.message.text
  const jiwon = await main("",chat)
  const data = await getData()
  ctx.reply(jiwon)
  
  await postData(data.idData+1,"user",chat)
  await postData(data.idData+2,"assistant",jiwon)
});

run(bot)
