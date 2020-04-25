const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client({ disableEveryone: true });
const fs = require("fs");
client.commands = new Discord.Collection();

function ChangeStatus(status, presence) {
  client.user.setActivity(status, { type: presence });
}
function readComs(folder) {
  fs.readdir(`./commands/${folder}/`, (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter((f) => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
      console.log("Was not able to find command");
      return;
    }

    jsfile.forEach((f, i) => {
      let props = require(`./commands/${folder}/${f}`);

      for (var i = f.length; i <= 20; i++) f = f + " ";
      console.log(`| ${f}  | ✅     |`);
      client.commands.set(props.help.name, props);
    });
  });
}

readComs("score");
readComs("bot");
readComs("other");

console.log("----------------------------------\n| Command name           | Status |\n----------------------------------");

client.on("ready", async (message) => {
  console.log("----------------------------------");
  console.log(`Bot name: ${client.user.username}\nBot id: ${client.user.id}`);
  ChangeStatus("👀", "WATCHING");
});

client.on("message", async (message) => {
  if (message.author.bot) return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let fcmd = message.content;

  let commandFile = client.commands.get(cmd.toLowerCase().slice(config.prefix.length));
  if (commandFile) commandFile.run(client, message, args);
});

client.login(config.token);
