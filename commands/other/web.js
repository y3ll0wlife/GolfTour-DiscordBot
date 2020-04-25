const Discord = require("discord.js");
const { Client, Attachment } = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {
    if (!message.content.startsWith(config.prefix)) return;

    let embed = new Discord.RichEmbed()
        .setColor("ORANGE")
        .setTitle("Trevliga länkar")
        .setDescription("[**TBAGolftour**](https://tbagolftour.azurewebsites.net/)")

    return message.channel.send(embed);
};

module.exports.help = {
    name: "web",
};
