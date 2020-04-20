const Discord = require("discord.js");
const { Client, Attachment } = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith(config.prefix)) return;
  let data = await fetch("http://tbagolftourapi.azurewebsites.net/api/Results/5")
    .then((res) => res.json())
    .then((json) => json);

  let msg = "";

  for (let i = 0; i < data.length; i++) {
    let num = i + 1;
    let place = "";
    if (num == 1) place = "🥇  ";
    else if (num == 2) place = "🥈  ";
    else if (num == 3) place = "🥉  ";
    else place = "**#" + num + "**  ";
    msg += place + data[i].Name + " (**" + data[i].Points + "** poäng)\n";
  }

  return message.channel.send(msg);
};

module.exports.help = {
  name: "result",
};
