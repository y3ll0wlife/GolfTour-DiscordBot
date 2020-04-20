const Discord = require("discord.js");
const { Client, Attachment } = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith(config.prefix)) return;
  let data = await fetch("http://tbagolftourapi.azurewebsites.net/api/Results/5")
    .then((res) => res.json())
    .then((json) => json);

  let msg = "```#  | Namn                  | Rundor | OOM Poäng  | Sämst Poäng (Topp 14)  | Poäng (Medel)   | Slag (Medel)\n";

  for (let i = 0; i < data.length; i++) {
    let num = i + 1;

    let name = data[i].Name;
    let points = data[i].Points;
    let avgScore = data[i].AverageScore;
    let avgStroke = data[i].AverageStrokes;
    let rounds = data[i].ParticipatedRounds;
    let lowestScore14 = data[i].LowestScoreInMaxForteen;

    // Place
    if (num == 10) msg += num + " |";
    else msg += num + "  |";

    // Name
    for (let i = name.length; i < 21; i++) name += " ";
    msg += " " + name + " |";

    // Rounds
    for (let i = rounds.toString().length; i < 6; i++) rounds += " ";
    msg += " " + rounds + " |";

    // OOM Points
    for (let i = points.toString().length; i < 10; i++) points += " ";
    msg += " " + points + " |";

    // Worst score (Top 14)
    for (let i = lowestScore14.toString().length; i < 22; i++) lowestScore14 += " ";
    msg += " " + lowestScore14 + " |";

    // Avg points
    for (let i = avgScore.toString().length; i < 15; i++) avgScore += " ";
    msg += " " + avgScore + " |";

    // Strokes
    msg += " " + avgStroke;

    // Adding new row end
    msg += "\n";
  }

  msg += "```";

  return message.channel.send(msg);
};

module.exports.help = {
  name: "leaderboard",
};

/*
Namn                | Rundor    | OOM Poäng  | Sämst Poäng (Topp 14)  | Poäng (Medel)   | Slag (Medel)
Sören Helenelund  	| 1 	      | 16 	       | 16 	                    | 17.0 	          | 46.0
Johan Öhman 	      | 1 	      | 15 	      | 15 	                    | 16.0 	          | 45.0
Christian Forsberg 	| 1         | 14 	      | 14 	                    | 15.0 	          | 39.0

*/
