const Discord = require("discord.js");
const { Client, Attachment } = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith(config.prefix)) return;
  if (!args[0]) return message.channel.send("Usage: !reportresult <gamebookId> | **OBS** endast ``Admin`` kan använda detta");
  const member = message.guild.member(message.member);
  if (member.roles.some((role) => role.id === "697397290419093594") || message.member.id == "190160914765316096") {
    let data = await fetch("http://tbagolftourapi.azurewebsites.net/api/reportresult/" + args[0])
      .then((res) => res.json())
      .then((json) => json);

    return message.channel.send(data);
  } else {
    return message.channel.send(":lock: Saknar rollen ``Admin``");
  }
};

module.exports.help = {
  name: "reportresult",
};
