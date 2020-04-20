/*

*/
const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith(config.prefix)) return;
  return message.channel.send(":ping_pong:  ``" + bot.ping + " ms``");
};

module.exports.help = {
  name: "ping",
};
