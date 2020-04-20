/*

*/
const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith(config.prefix)) return;
  let embed = new Discord.RichEmbed().setColor("RANDOM").setDescription(`
**===> Help <===**

**===Score commands===**
**!result**
**!leaderboard**

**===Bot commands===**
**!ping**
**!help**


[Github](https://github.com/y3ll0wlife/Golftour-Discordbot)
  `);

  return message.channel.send(embed);
};

module.exports.help = {
  name: "help",
};
