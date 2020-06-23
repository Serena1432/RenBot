const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
const nekoAPI = require("nekos.life");
const neko = new nekoAPI();
const fs = require("fs");
const express = require("express");
const app = express();
const ms = require("ms");
const ytdl = require("ytdl-core");
const queue = new Map();
var commands = [
  {
    category: "Fun",
    commands: [
      {
        command: "baka @someone",
        description: "Say someone baka"
      },
      {
        command: "bbcon",
        description: "Prove that you are a BBcon"
      },
      {
        command: "dance",
        description: "Dance"
      },
      {
        command: "fact",
        description: "Get a fact"
      },
      {
        command: "foxgirl",
        description: "Get a random fox girl"
      },
      {
        command: "hug @someone",
        description: "Hug someone"
      },
      {
        command: "kemonomimi",
        description: "Get a random kemonomimi"
      },
      {
        command: "kill @someone",
        description: "Kill someone"
      },
      {
        command: "kiss @someone",
        description: "Kiss someone"
      },
      {
        command: "lewd/fuck @someone",
        description: "Do something lewd to someone"
      },
      {
        command: "lick @someone",
        description: "Lick someone"
      },
      {
        command: "lolicon",
        description: "Prove that you are a Lolicon"
      },
      {
        command: "love @someone",
        description: "Love someone"
      },
      {
        command: "meme",
        description: "Send a random meme"
      },
      {
        command: "memorize (messageid)",
        description:
          "Memorize a message into the guild's Message Memories channel."
      },
      {
        command: "neko",
        description: "Get a random neko"
      },
      {
        command: "nekogif",
        description: "Get a random neko GIF"
      },
      {
        command: "owoify",
        description: "OwOify something"
      },
      {
        command: "pat @someone",
        description: "Pat someone"
      },
      {
        command: "poke @someone",
        description: "Poke someone"
      },
      {
        command: "punch @someone",
        description: "Punch someone"
      },
      {
        command: "quote @something",
        description: "Put your message into a quote box"
      },
      {
        command: "say @something",
        description: "Make this BOT say something"
      },
      {
        command: "sleep",
        description: "Go to sleep"
      },
      {
        command: "slap @someone",
        description: "Slap someone"
      },
      {
        command: "smug",
        description: "Feel so good"
      },
      {
        command: "tickle @someone",
        description: "Tickle someone"
      },
      {
        command: "waifu",
        description: "Get a random waifu image"
      },
      {
        command: "wait @someone",
        description: "Wait for someone"
      },
      {
        command: "why",
        description: "Get a question"
      },
      {
        command: "wallpaper",
        description: "Get a random wallpaper"
      }
    ]
  },
  {
    category: "Server management",
    commands: [
      {
        command: "set nfcmd enabled/disabled",
        description: "Enable or disable non-fun commands in a channel"
      },
      {
        command: "set spoiler enabled/disabled",
        description: "Enable or disable auto-spoiling when punishing a member"
      },
      {
        command: "set punishment #tag-a-channel-here",
        description: "Set the punishment reporting channel"
      },
      {
        command: "set memories #tag-a-channel-here",
        description: "Set the message memories channel"
      }
    ]
  },
  {
    category: "Moderation (not completed yet)",
    commands: [
      {
        command: "warn @someone (reason)",
        description: "Warn someone"
      },
      {
        command: "mute @someone duration (reason)",
        description: "Mute someone"
      },
      {
        command: "kick @someone (reason)",
        description: "Kick someone"
      },
      {
        command: "ban @someone (reason)",
        description: "ban someone"
      }
    ]
  },
  {
    category: "Role manager",
    commands: [
      {
        command: "giverole @someone (role)",
        description: "Give someone a role"
      },
      {
        command: "takerole @someone (role)",
        description: "Take a role from someone"
      },
      {
        command: "setcolor @role (color)",
        description: "Set a color for a role"
      }
    ]
  },
  {
    category: "Users info",
    commands: [
      {
        command: "account",
        description: "Get your/someone's Discord account info"
      },
      {
        command: "avatar",
        description: "Get your/someone's Discord avatar"
      },
      {
        command: "owner",
        description: "Get the guild owner's info"
      },
      {
        command: "developer",
        description: "Get this BOT developer's info"
      }
    ]
  },
  {
    category: "Music things (not completed yet)",
    commands: [
      {
        command: "play <YouTube link>",
        description: "Play a YouTube video.\nNotice that it supports YouTube video link only."
      },
      {
        command: "queue",
        description: "List all songs in current server's queue"
      },
      {
        command: "skip",
        description: "Skip the current playing song"
      },
      {
        command: "stop",
        description: "Delete all songs in current queue and leave the current voice channel"
      },
    ]
  }
];
var RenBot;
request('http://kirarin2005.000webhostapp.com/RenBot.json', function(error, response, body) {
		console.error('error:', error); // Print the error if one occurred
		console.log(response.statusCode);
		if (response && response.statusCode == 200) {
			RenBot = JSON.parse(body);
		}
	});

async function SaveData() {
    request.post('http://kirarin2005.000webhostapp.com/RenBotUpdate.php', { form: {
            token: 'dk6gq7HWNKpL2Ra7AaacyNs2pDaGxGQ7r3ZnGWmDz2J6s93LRM2Z8GZ3yYuAQ4EA',
            content: JSON.stringify(RenBot)
        }}, (error, res, body) => {
        if (error) {
            console.error(error)
            return
        }
        console.log(body)
    })
}

var ready = false;

function Unmute() {
  fs.readFile("./RenBot.json", async function(err, data) {
    RenBot = JSON.parse(data);
    console.log("function activated");
    for (var i = 0; i < RenBot.mutes.length; i++) {
      if (RenBot.mutes[i]) {
        if (RenBot.mutes[i].active == true) {
          var arrayId = i;
          var caseid = RenBot.mutes[i].id;
          var guild = client.guilds.cache.get(RenBot.mutes[i].guildId);
          var mention = guild.members.cache.get(RenBot.mutes[i].user);
          if (mention) {
            var mentionUser = client.users.cache.get(RenBot.mutes[i].user);
            var author = client.users.cache.get(RenBot.mutes[i].muter);
            var reason = RenBot.mutes[i].reason;
            var unmuteTime = RenBot.mutes[i].unmute_time;
            var channelId;
            for (var i = 0; i < RenBot.punishChannels.length; i++) {
              if (RenBot.punishChannels[i].guildId == guild.id) {
                channelId = RenBot.punishChannels[i].value;
              }
            }
            if (mention.roles.cache.find(role => role.name == "Muted")) {
              console.log(RenBot.mutes[arrayId].active);
              if (RenBot.mutes[arrayId].active == true) {
                var date = new Date();
                var unmute2 = setInterval(async function() {
                  console.log(
                    "timeleft:" +
                      (parseInt(unmuteTime) - parseInt(date.getTime()))
                  );
                  if (parseInt(unmuteTime) - parseInt(date.getTime()) <= 0) {
                    for (var x = 0; x < RenBot.mutes.length; x++) {
                      if (!RenBot.mutes[x] && RenBot.mutes[x].id == caseid) {
                        RenBot.mutes[x] = {
                          id: caseid,
                          guildId: guild.id,
                          user: mention.id,
                          muter: author.id,
                          reason: reason,
                          unmute_time: "none",
                          active: false
                        };
                      }
                    }
                    await SaveData();
                    var muteRole = mention.roles.cache.find(
                      role => role.name == "Muted"
                    );
                    mention.roles.remove(muteRole.id, "Automatic Unmute");
                    clearInterval(unmute2);
                    sendPunishment(
                      caseid,
                      guild.id,
                      "",
                      channelId,
                      author,
                      mentionUser,
                      "unmuted",
                      "Unmute",
                      "Automatic Unmute",
                      ""
                    );
                  }
                }, 5000);
              }
            } else {
              for (var x = 0; x < RenBot.mutes.length; x++) {
                if (!RenBot.mutes[x] && RenBot.mutes[x].id == caseid) {
                  RenBot.mutes[x] = {
                    id: caseid,
                    guildId: guild.id,
                    user: mention.id,
                    muter: author.id,
                    reason: reason,
                    unmute_time: "none",
                    active: false
                  };
                }
              }
                await SaveData();
              var muteRole = mention.roles.cache.find(
                role => role.name == "Muted"
              );
            }
          }
        }
      }
    }
  });
}

var unmuteInterval = setInterval(function() {
  if (ready) {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });
    app.get("/", (req, res) => {
      res.send(
        "<title>RenBot</title>This website is still under development.<br><br><span style=color:gray>RenBot is now in " +
          client.guilds.cache.size +
          " servers with " +
          client.users.cache.size +
          " users."
      );
    });
    clearInterval(unmuteInterval);
  }
}, 1000);

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function sendPunishment(
  caseid,
  guild,
  msgChannel,
  punishChannel,
  author,
  mention,
  actioned,
  action,
  reason,
  duration
) {
  var durationText = "";
  if (duration != "") {
    durationText = "\n**Duration:** " + duration;
  }
  if (msgChannel != "") {
    const mess = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: author.tag + " has just " + actioned + " " + mention.tag,
        icon_url: author.displayAvatarURL()
      },
      description: "**Reason:** " + reason + durationText,
      footer: {
        text:
          "Case #" +
          caseid +
          " | Member ID: " +
          mention.id +
          " | Author ID: " +
          author.id
      }
    };
    msgChannel.send({
      embed: mess
    });
  }
  client.channels.fetch(punishChannel).then(channel => {
    const mess = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: author.tag,
        icon_url: author.displayAvatarURL()
      },
      description:
        "**Member:** " +
        mention.tag +
        "\n**Action:** " +
        action +
        "\n**Reason:** " +
        reason +
        durationText,
      footer: {
        text:
          "Case #" +
          caseid +
          " | Member ID: " +
          mention.id +
          " | Author ID: " +
          author.id
      }
    };
    channel.send({
      embed: mess
    });
  });
  const messa = {
    color: Math.floor(Math.random() * 16777214) + 1,
    author: {
      name: "You just have been " + actioned + " in " + guild.name,
      icon_url: guild.iconURL()
    },
    description:
      "**From:** " +
      author.tag +
      "\n**Action:** " +
      action +
      "\n**Reason:** " +
      reason +
      durationText,
    footer: {
      text:
        "Case #" +
        caseid +
        " | Member ID: " +
        mention.id +
        " | Author ID: " +
        author.id
    }
  };
  mention.send({
    embed: messa
  });
}
var duration, days;

client.on("ready", () => {
  if (!ready) {
    ready = true;
  }
  setInterval(function() {
    duration = parseInt((new Date()).getTime()) - 1590238427000;
		days = parseInt(duration / 1000 / 60 / 60 / 24);
		client.guilds.cache.get('642990594809135117').member('713736436544831491').setNickname('RenBot ' + days + ' Ngày Tủi', 'Tự động đổi nickname cho RenBot bởi Nico Levianth#5503');
  }, 60000);
  console.log(`Logged in as ${client.user.tag}!`);
  var gamePlaying = [
    "r!help | ren help",
    "with Nico Levianth",
    "on " + client.guilds.cache.size + " server(s)!",
    "based on Discord.js"
  ];
  var gameType = ["PLAYING", "PLAYING", "PLAYING", "PLAYING"];
  var rand = random(0, 4);
  client.user.setStatus("online");
  client.user.setActivity(gamePlaying[rand], gameType[rand]);
  setInterval(function() {
    var rand = random(0, 4);
    client.user.setStatus("online");
    client.user.setActivity(gamePlaying[rand], gameType[rand]);
  }, 10000);
});

client.on("message", async message => {
  var prefix = false;
  const prefixes = ["r", "ren "];
  for (var i = 0; i < prefixes.length; i++) {
    if (message.content.toLowerCase().startsWith("r!")) {
      prefix = "r!";
    } else if (message.content.toLowerCase().startsWith(prefixes[i])) {
      prefix = prefixes[i];
    }
  }
  if (message.mentions.users.size && message.mentions.users.first().id == client.user.id) {
    message.channel.send('My prefixes are `r`, `r!` or `ren`.\nPlease remember these prefixes to use the commands correctly!').then(message => message.delete({timeout: 5000}))
  }
  if (!prefix || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    var dated = new Date();
    message.reply(
      "Pong!\nResponse time: " +
        (dated.getTime() - message.createdTimestamp) +
        " ms"
    );
  } else if (command == "eval") {
    if (message.author.id == "536899471720841228") {
      try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
      } catch (err) {
        message.channel.send("An error has occurred:\n" + err.toString());
      }
    } else {
      message.channel.send(
        "bruh, I already know you aren't Nico Levianth, so no."
      );
    }
  } else if (command == "help") {
    var cmdDisabled = false;
    for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
      if (
        RenBot.cmdDisabled[i].channelId == message.channel.id &&
        RenBot.cmdDisabled[i].value == true
      ) {
        cmdDisabled = true;
      }
    }
    if (!cmdDisabled) {
      for (var i = 0; i < commands.length; i++) {
        var cmdList = "";
        for (var x = 0; x < commands[i].commands.length; x++) {
          cmdList +=
            "`" +
            commands[i].commands[x].command +
            "` - " +
            commands[i].commands[x].description +
            "\n";
        }
        const mess = {
          color: Math.floor(Math.random() * 16777214) + 1,
          title:
            "List of RenBot commands (page " +
            (i + 1) +
            " of " +
            commands.length +
            ")",
          description:
            "**" + (i + 1) + ". " + commands[i].category + ":**\n" + cmdList
        };
        message.channel.send({
          embed: mess
        });
      }
    } else {
      message.channel.send("This command is disabled on this channel!");
    }
  } else if (command == "slap") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("Why did you slap yourself...?");
      } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("Do you think that you can slap me?");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime slap&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              const image = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.username +
                    " is slapping " +
                    message.mentions.users.first().username +
                    "! Ouch!",
                  icon_url: message.author.displayAvatarURL()
                },
                image: {
                  url: gif.url
                },
                footer: {
                  text: "Powered by Nico Levianth#5503 | API by Tenor",
                  icon_url: client.user.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: image
              });
            }
          }
        );
      }
    } else {
      message.reply("You can't just slap air!");
    }
  } else if (command == "kiss") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("Do you really need a kiss...?");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime kiss&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
              const image = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.username +
                    " is kissing " +
                    message.mentions.users.first().username +
                    "! So beautiful!",
                  icon_url: message.author.displayAvatarURL()
                },
                image: {
                  url: gif.url
                },
                footer: {
                  text: "Powered by Nico Levianth#5503 | API by Tenor",
                  icon_url: client.user.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: image
              });
            }
          }
        );
      }
    } else {
      message.reply("Who are you going to kiss?");
    }
  } else if (command == "hug") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("I will hug you...");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime hug&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
              const image = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.username +
                    " is hugging " +
                    message.mentions.users.first().username,
                  icon_url: message.author.displayAvatarURL()
                },
                image: {
                  url: gif.url
                },
                footer: {
                  text: "Powered by Nico Levianth#5503 | API by Tenor",
                  icon_url: client.user.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: image
              });
            }
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "pat") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("I will pat you...");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime pat&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
              const image = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.username +
                    " pets " +
                    message.mentions.users.first().username,
                  icon_url: message.author.displayAvatarURL()
                },
                image: {
                  url: gif.url
                },
                footer: {
                  text: "Powered by Nico Levianth#5503 | API by Tenor",
                  icon_url: client.user.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: image
              });
            }
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "poke") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("Why do you want to poke yourself?");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime poke&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
              const image = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.username +
                    " pokes " +
                    message.mentions.users.first().username,
                  icon_url: message.author.displayAvatarURL()
                },
                image: {
                  url: gif.url
                },
                footer: {
                  text: "Powered by Nico Levianth#5503 | API by Tenor",
                  icon_url: client.user.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: image
              });
            }
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "baka") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.channel.send(
          "nah, you can't do that, " + message.author.username
        );
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime baka&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
              const image = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name: message.mentions.users.first().username + ", baka!",
                  icon_url: message.author.displayAvatarURL()
                },
                image: {
                  url: gif.url
                },
                footer: {
                  text: "Powered by Nico Levianth#5503 | API by Tenor",
                  icon_url: client.user.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: image
              });
            }
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "tickle") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("Did you laugh while tickling yourself?");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime tickle&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " tickles " +
                  message.mentions.users.first().username,
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "punch") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("You can't punch yourself!");
      } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("you can't punch me, bruh.");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime punch&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " is punching " +
                  message.mentions.users.first().username,
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "smug") {
    var gif = {
      url: ""
    };
    request(
      "https://api.tenor.com/v1/search?q=anime smug&key=XF1I98YOKFEH&limit=40",
      function(error, response, body) {
        console.error("error:", error); // Print the error if one occurred
        console.log(response.statusCode);
        if (response && response.statusCode == 200) {
          var gifs = JSON.parse(body);
          var rand = parseInt(random(0, 39));
          gif.url = gifs.results[rand].media[0].gif.url;
          console.log(gif.url);
          const image = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name: message.author.username + " is feeling so good 😏",
              icon_url: message.author.displayAvatarURL()
            },
            image: {
              url: gif.url
            },
            footer: {
              text: "Powered by Nico Levianth#5503 | API by Tenor",
              icon_url: client.user.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: image
          });
        }
      }
    );
  } else if (command == "cry") {
    var gif = {
      url: ""
    };
    request(
      "https://api.tenor.com/v1/search?q=anime cry&key=XF1I98YOKFEH&limit=40",
      function(error, response, body) {
        console.error("error:", error); // Print the error if one occurred
        console.log(response.statusCode);
        if (response && response.statusCode == 200) {
          var gifs = JSON.parse(body);
          var rand = parseInt(random(0, 39));
          gif.url = gifs.results[rand].media[0].gif.url;
          console.log(gif.url);
          const image = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name: message.author.username + " is crying! So sad 😢",
              icon_url: message.author.displayAvatarURL()
            },
            image: {
              url: gif.url
            },
            footer: {
              text: "Powered by Nico Levianth#5503 | API by Tenor",
              icon_url: client.user.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: image
          });
        }
      }
    );
  } else if (command == "sleep") {
    var gif = {
      url: ""
    };
    request(
      "https://api.tenor.com/v1/search?q=anime sleep&key=XF1I98YOKFEH&limit=40",
      function(error, response, body) {
        console.error("error:", error); // Print the error if one occurred
        console.log(response.statusCode);
        if (response && response.statusCode == 200) {
          var gifs = JSON.parse(body);
          var rand = parseInt(random(0, 39));
          gif.url = gifs.results[rand].media[0].gif.url;
          console.log(gif.url);
          const image = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name: message.author.username + " is going to sleep...",
              icon_url: message.author.displayAvatarURL()
            },
            image: {
              url: gif.url
            },
            footer: {
              text: "Powered by Nico Levianth#5503 | API by Tenor",
              icon_url: client.user.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: image
          });
        }
      }
    );
  } else if (command == "dance") {
    var gif = {
      url: ""
    };
    request(
      "https://api.tenor.com/v1/search?q=anime dance&key=XF1I98YOKFEH&limit=40",
      function(error, response, body) {
        console.error("error:", error); // Print the error if one occurred
        console.log(response.statusCode);
        if (response && response.statusCode == 200) {
          var gifs = JSON.parse(body);
          var rand = parseInt(random(0, 39));
          gif.url = gifs.results[rand].media[0].gif.url;
          console.log(gif.url);
          const image = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name: message.author.username + " is dancing",
              icon_url: message.author.displayAvatarURL()
            },
            image: {
              url: gif.url
            },
            footer: {
              text: "Powered by Nico Levianth#5503 | API by Tenor",
              icon_url: client.user.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: image
          });
        }
      }
    );
  } else if (command == "wait") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("You can't wait for yourself!");
      } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("Don't wait for me, I'm still here.");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime wait&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " is waiting for " +
                  message.mentions.users.first().username +
                  "... Why are you making him/her wait so long?",
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else if (args[0] == "@noone") {
      message.channel.send(
        message.author.username +
          " don't wait for anyone, so no GIF image is sent."
      );
    } else {
      var gif = {
        url: ""
      };
      request(
        "https://api.tenor.com/v1/search?q=anime wait&key=XF1I98YOKFEH&limit=40",
        function(error, response, body) {
          console.error("error:", error); // Print the error if one occurred
          console.log(response.statusCode);
          if (response && response.statusCode == 200) {
            var gifs = JSON.parse(body);
            var rand = parseInt(random(0, 39));
            gif.url = gifs.results[rand].media[0].gif.url;
            console.log(gif.url);
          }
          const image = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name: message.author.username + " is waiting for someone...",
              icon_url: message.author.displayAvatarURL()
            },
            image: {
              url: gif.url
            },
            footer: {
              text: "Powered by Nico Levianth#5503 | API by Tenor",
              icon_url: client.user.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: image
          });
        }
      );
    }
  } else if (command == "kill") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply(
          "please don't kill yourself, the life is still very long... 😢"
        );
      } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("you can't kill me, because I'm still here.");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime kill&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " kills " +
                  message.mentions.users.first().username +
                  "! Oof!",
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "lewd" || command == "fuck") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("why do you lewd yourself?");
      } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("I'm still thinking about your command, lul.");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime lewd&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " is doing something lewd to " +
                  message.mentions.users.first().username +
                  "...",
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "love") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("why do you love yourself?");
      } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("you can't love me, I'm just a BOT.");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime love&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " loves " +
                  message.mentions.users.first().username +
                  "...",
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "lick") {
    if (message.mentions.users.size) {
      if (message.mentions.users.first().id == message.author.id) {
        message.reply("why do you lick yourself?");
      } else {
        var gif = {
          url: ""
        };
        request(
          "https://api.tenor.com/v1/search?q=anime lick&key=XF1I98YOKFEH&limit=40",
          function(error, response, body) {
            console.error("error:", error); // Print the error if one occurred
            console.log(response.statusCode);
            if (response && response.statusCode == 200) {
              var gifs = JSON.parse(body);
              var rand = parseInt(random(0, 39));
              gif.url = gifs.results[rand].media[0].gif.url;
              console.log(gif.url);
            }
            const image = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.username +
                  " licks " +
                  message.mentions.users.first().username +
                  "! Mlem mlem!",
                icon_url: message.author.displayAvatarURL()
              },
              image: {
                url: gif.url
              },
              footer: {
                text: "Powered by Nico Levianth#5503 | API by Tenor",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: image
            });
          }
        );
      }
    } else {
      message.reply("Please mention someone first!");
    }
  } else if (command == "lolicon") {
    var gif = {
      url: ""
    };
    request(
      "https://api.tenor.com/v1/search?q=anime loli&key=XF1I98YOKFEH&limit=40",
      function(error, response, body) {
        console.error("error:", error); // Print the error if one occurred
        console.log(response.statusCode);
        if (response && response.statusCode == 200) {
          var gifs = JSON.parse(body);
          var rand = parseInt(random(0, 39));
          gif.url = gifs.results[rand].media[0].gif.url;
          console.log(gif.url);
        }
        const image = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: message.author.username + " is a Lolicon! FBI OPEN UP!",
            icon_url: message.author.displayAvatarURL()
          },
          image: {
            url: gif.url
          },
          footer: {
            text: "Powered by Nico Levianth#5503 | API by Tenor",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({
          embed: image
        });
      }
    );
  } else if (command == "say") {
    if (message.author.id == "453129563342372866") {
      return message.reply("Your command is blocked by the BOT owner!");
    }
    if (args[0] && !message.attachments.size) {
      var text = "";
      for (var i = 0; i < args.length; i++) {
        text += args[i] + " ";
      }
      text = text.substr(0, text.length - 1);
      message.channel.send(text);
    } else if (message.attachments.size) {
      if (args[0]) {
        var text = "";
        for (var i = 0; i < args.length; i++) {
          text += args[i] + " ";
        }
        text = text.substr(0, text.length - 1);
        var files = [];
        message.attachments.each(img => {
          files[files.length] = {
            attachment: img.url,
            name: img.filename
          };
        });
        message.channel.send(text, { files: [files] });
      } else {
        var files = [];
        message.attachments.each(img => {
          files[files.length] = {
            attachment: img.url,
            name: img.filename
          };
        });
        message.channel.send({ files: [files] });
      }
    } else {
      message.reply("What are you going to make me say?");
    }
  } else if (command == "quote") {
    if (args[0]) {
      var text = "";
      for (var i = 0; i < args.length; i++) {
        text += args[i] + " ";
      }
      text = text.substr(0, text.length - 1);
      const mess = {
        color: Math.floor(Math.random() * 16777214) + 1,
        description: '"' + text + '"',
        footer: {
          text: "- " + message.author.username,
          icon_url: message.author.displayAvatarURL()
        }
      };
      message.channel.send({
        embed: mess
      });
    } else {
      message.reply("type something please!");
    }
  } else if (command == "bbcon") {
    var gif = {
      url: ""
    };
    request(
      "https://api.tenor.com/v1/search?q=anime big boobs&key=XF1I98YOKFEH&limit=40",
      function(error, response, body) {
        console.error("error:", error); // Print the error if one occurred
        console.log(response.statusCode);
        if (response && response.statusCode == 200) {
          var gifs = JSON.parse(body);
          var rand = parseInt(random(0, 39));
          gif.url = gifs.results[rand].media[0].gif.url;
          console.log(gif.url);
        }
        const image = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: message.author.username + " is a BBcon! Cool!",
            icon_url: message.author.displayAvatarURL()
          },
          image: {
            url: gif.url
          },
          footer: {
            text: "Powered by Nico Levianth#5503 | API by Tenor",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({
          embed: image
        });
      }
    );
  } else if (command == "meme") {
    request("https://www.reddit.com/r/meme/hot/.json?limit=100", function(
      error,
      response,
      body
    ) {
      console.error("error:", error); // Print the error if one occurred
      console.log(response.statusCode);
      if (response && response.statusCode == 200) {
        var response = JSON.parse(body);
        var index =
          response.data.children[Math.floor(Math.random() * 100)].data;

        var image = index.preview.images[0].source.url.replace("&amp;", "&");
        var title = index.title;
        var link = "https://reddit.com" + index.permalink;
        var subRedditName = index.subreddit_name_prefixed;

        if (index.post_hint !== "image") {
          var text = index.selftext;
          const mess = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name: title,
              url: "https://reddit.com/" + subRedditName
            },
            footer: {
              text: "Powered by Nico Levianth#5503 | API by Reddit",
              icon_url: client.user.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: mess
          });
        }
        console.log(image);
        const mess = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: title,
            url: "https://reddit.com/" + subRedditName
          },
          image: {
            url: image
          },
          footer: {
            text: "Powered by Nico Levianth#5503 | API by Reddit",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({
          embed: mess
        });
      }
    });
  } else if (command == "neko") {
    const gif = await neko.sfw.neko();
    const image = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: message.author.username + ", Here's your random neko",
        icon_url: message.author.displayAvatarURL()
      },
      image: {
        url: gif.url
      },
      footer: {
        text: "Powered by Nico Levianth#5503 | API by nekos.life",
        icon_url: client.user.displayAvatarURL()
      }
    };
    message.channel.send({
      embed: image
    });
  } else if (command == "nekogif") {
    const gif = await neko.sfw.nekoGif();
    const image = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: message.author.username + ", Here's your random neko GIF",
        icon_url: message.author.displayAvatarURL()
      },
      image: {
        url: gif.url
      },
      footer: {
        text: "Powered by Nico Levianth#5503 | API by nekos.life",
        icon_url: client.user.displayAvatarURL()
      }
    };
    message.channel.send({
      embed: image
    });
  } else if (command == "foxgirl") {
    const gif = await neko.sfw.foxGirl();
    const image = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: message.author.username + ", Here's your random fox girl",
        icon_url: message.author.displayAvatarURL()
      },
      image: {
        url: gif.url
      },
      footer: {
        text: "Powered by Nico Levianth#5503 | API by nekos.life",
        icon_url: client.user.displayAvatarURL()
      }
    };
    message.channel.send({
      embed: image
    });
  } else if (command == "kemonomimi") {
    const gif = await neko.sfw.kemonomimi();
    const image = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: message.author.username + ", Here's your random kemonomimi",
        icon_url: message.author.displayAvatarURL()
      },
      image: {
        url: gif.url
      },
      footer: {
        text: "Powered by Nico Levianth#5503 | API by nekos.life",
        icon_url: client.user.displayAvatarURL()
      }
    };
    message.channel.send({
      embed: image
    });
  } else if (command == "wallpaper") {
    const gif = await neko.sfw.wallpaper();
    const image = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: message.author.username + ", Here's your random wallpaper",
        icon_url: message.author.displayAvatarURL()
      },
      image: {
        url: gif.url
      },
      footer: {
        text: "Powered by Nico Levianth#5503 | API by nekos.life",
        icon_url: client.user.displayAvatarURL()
      }
    };
    message.channel.send({
      embed: image
    });
  } else if (command == "set") {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to do it, bruh."
      );
    } else {
      if (args[0] == "nfcmd") {
        if (args[1] == "disabled") {
          var exist = false;
          for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
            if (RenBot.cmdDisabled[i].channelId == message.channel.id) {
              RenBot.cmdDisabled[i] = {
                channelId: message.channel.id,
                value: true
              };
              exist = true;
            }
          }
          if (!exist) {
            RenBot.cmdDisabled[RenBot.cmdDisabled.length] = {
              channelId: message.channel.id,
              value: true
            };
          }
          fs.writeFile("./RenBot.json", JSON.stringify(RenBot), async function(err) {
            if (err) {
              return console.log(err);
            }
                    await SaveData();
            message.channel.send(
              "All non-fun commands are disabled on this channel!"
            );
          });
        } else if (args[1] == "enabled") {
          var exist = false;
          for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
            if (RenBot.cmdDisabled[i].channelId == message.channel.id) {
              RenBot.cmdDisabled[i] = {
                channelId: message.channel.id,
                value: false
              };
              exist = true;
            }
          }
          if (!exist) {
            RenBot.cmdDisabled[RenBot.cmdDisabled.length] = {
              channelId: message.channel.id,
              value: false
            };
          }
          fs.writeFile("./RenBot.json", JSON.stringify(RenBot), async function(err) {
            if (err) {
              return console.log(err);
            }
                    await SaveData();
            message.channel.send(
              "All non-fun commands are enabled on this channel!"
            );
          });
        }
      } else if (args[0] == "spoiler") {
        if (args[1] == "enabled") {
          var exist = false;
          for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
            if (RenBot.punishSpoilers[i].guildId == message.guild.id) {
              exist = true;
              RenBot.punishSpoilers[i] = {
                guildId: message.guild.id,
                value: true
              };
            }
          }
          if (!exist) {
            RenBot.punishSpoilers[RenBot.punishSpoilers.length] = {
              guildId: message.guild.id,
              value: true
            };
          }
          fs.writeFile("./RenBot.json", JSON.stringify(RenBot), async function(err) {
            if (err) {
              return console.log(err);
            }
                    await SaveData();
            message.channel.send(
              "Enabled auto-spoling the reason when punishing a member."
            );
          });
        } else if (args[1] == "disabled") {
          var exist = false;
          for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
            if (RenBot.punishSpoilers[i].guildId == message.guild.id) {
              exist = true;
              RenBot.punishSpoilers[i] = {
                guildId: message.guild.id,
                value: false
              };
            }
          }
          if (!exist) {
            RenBot.punishSpoilers[RenBot.punishSpoilers.length] = {
              guildId: message.guild.id,
              value: false
            };
          }
          fs.writeFile("./RenBot.json", JSON.stringify(RenBot), async function(err) {
            if (err) {
              return console.log(err);
            }
                    await SaveData();
            message.channel.send(
              "Disabled auto-spoling the reason when punishing a member."
            );
          });
        }
      } else if (args[0] == "punishment") {
        console.log(args[1]);
        if (/ *<#*>*/.test(args[1]) == true) {
          var channelId = args[1].replace("<#", "").replace(">", "");
          console.log(channelId);
          var exist = false;
          for (var i = 0; i < RenBot.punishChannels.length; i++) {
            if (RenBot.punishChannels[i].guildId == message.guild.id) {
              exist = true;
              RenBot.punishChannels[i] = {
                guildId: message.guild.id,
                value: channelId
              };
            }
          }
          if (!exist) {
            RenBot.punishChannels[RenBot.punishChannels.length] = {
              guildId: message.guild.id,
              value: channelId
            };
          }
          fs.writeFile("./RenBot.json", JSON.stringify(RenBot), async function(err) {
            if (err) {
              return console.log(err);
            }
                    await SaveData();
            client.channels.fetch(channelId).then(channel => {
              message.channel.send(
                "Successfully set the punishment reporting channel into the " +
                  channel.toString() +
                  " channel."
              );
            });
          });
        } else {
          message.reply("Please mention a channel!");
        }
      } else if (args[0] == "memories") {
        console.log(args[1]);
        if (/ *<#*>*/.test(args[1]) == true) {
          var channelId = args[1].replace("<#", "").replace(">", "");
          console.log(channelId);
          var exist = false;
          for (var i = 0; i < RenBot.memoriesChannel.length; i++) {
            if (RenBot.memoriesChannel[i].guildId == message.guild.id) {
              exist = true;
              RenBot.memoriesChannel[i] = {
                guildId: message.guild.id,
                value: channelId
              };
            }
          }
          if (!exist) {
            RenBot.memoriesChannel[RenBot.memoriesChannel.length] = {
              guildId: message.guild.id,
              value: channelId
            };
          }
          fs.writeFile("./RenBot.json", JSON.stringify(RenBot), async function(err) {
            if (err) {
              return console.log(err);
            }
                    await SaveData();
            client.channels.fetch(channelId).then(channel => {
              message.channel.send(
                "Successfully set the message memories channel into the " +
                  channel.toString() +
                  " channel."
              );
            });
          });
        } else {
          message.reply("Please mention a channel!");
        }
      }
    }
  } else if (command == "warn") {
    if (message.member.hasPermission("KICK_MEMBERS")) {
      var channelId = null;
      for (var i = 0; i < RenBot.punishChannels.length; i++) {
        if (RenBot.punishChannels[i].guildId == message.guild.id) {
          channelId = RenBot.punishChannels[i].value;
        }
      }
      if (channelId == null) {
        message.reply(
          "The server owner haven't set the punishment reporting channel yet!"
        );
      } else {
        if (message.mentions.users.size) {
          if (
            message.mentions.users.first().id != message.author.id &&
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) > 0
          ) {
            var caseid = 1;
            for (var i = 0; i < RenBot.warns.length; i++) {
              if (RenBot.warns[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.mutes.length; i++) {
              if (RenBot.mutes[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.kicks.length; i++) {
              if (RenBot.kicks[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            if (args[1]) {
              var text;
              for (var i = 0; i < args.length - 1; i++) {
                text += args[i + 1] + " ";
              }
              text = text.substr(0, text.length - 1).replace("undefined", "");
              for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                if (
                  RenBot.punishSpoilers[i].guildId == message.guild.id &&
                  RenBot.punishSpoilers[i].value == true
                ) {
                  text = "||" + text + "||";
                }
              }
              RenBot.warns[RenBot.warns.length] = {
                id: caseid,
                guildId: message.guild.id,
                user: message.mentions.users.first().id,
                warner: message.author.id,
                reason: text,
                time: message.createdTimestamp
              };
                    await SaveData();
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                message.mentions.users.first(),
                "warned",
                "Warn",
                text,
                ""
              );
            } else {
              RenBot.warns[RenBot.warns.length] = {
                id: caseid,
                guildId: message.guild.id,
                user: message.mentions.users.first().id,
                warner: message.author.id,
                reason: "Unspecified",
                time: message.createdTimestamp
              };
                    await SaveData();
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                message.mentions.users.first(),
                "warned",
                "Warn",
                "Unspecified",
                ""
              );
            }
          } else if (message.mentions.users.first().id == message.author.id) {
            message.reply("You cannot warn yourself!");
          } else if (
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) <= 0
          ) {
            message.reply(
              "You cannot warn a member that has higher role than you!"
            );
          }
        } else {
          message.reply("Please mention someone first!");
        }
      }
    } else {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to warn this member.\nYou need to have the `Kick members` permission to do that."
      );
    }
  } else if (command == "mute") {
    if (message.member.hasPermission("KICK_MEMBERS")) {
      var channelId = null;
      for (var i = 0; i < RenBot.punishChannels.length; i++) {
        if (RenBot.punishChannels[i].guildId == message.guild.id) {
          channelId = RenBot.punishChannels[i].value;
        }
      }
      if (channelId == null) {
        message.reply(
          "The server owner haven't set the punishment reporting channel yet!"
        );
      } else {
        if (message.mentions.users.size) {
          if (
            message.mentions.users.first().id != message.author.id &&
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) > 0 &&
            !message.mentions.members
              .first()
              .roles.cache.find(r => r.name === "Muted")
          ) {
            var duration;
            if (
              / *s/.test(args[1]) ||
              / *m/.test(args[1]) ||
              / *h/.test(args[1]) ||
              / *d/.test(args[1]) ||
              / *w/.test(args[1])
            ) {
              duration = args[1];
              console.log("time specified: " + ms(duration));
            } else {
              duration = null;
            }
            var caseid = 1;
            for (var i = 0; i < RenBot.warns.length; i++) {
              if (RenBot.warns[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.mutes.length; i++) {
              if (
                RenBot.mutes[i] &&
                RenBot.mutes[i].guildId == message.guild.id
              ) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.kicks.length; i++) {
              if (RenBot.kicks[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.bans.length; i++) {
              if (RenBot.bans[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            var muteRole = message.guild.roles.cache.find(
              role => role.name === "Muted"
            );
            if (!muteRole) {
              message.guild.roles
                .create({
                  data: {
                    name: "Muted",
                    color: "000000",
                    permissions: []
                  },
                  reason: "Create a Muted role"
                })
                .then(console.log)
                .catch(console.error);
              muteRole = message.guild.roles.cache.find(
                role => role.name === "Muted"
              );
              message.guild.channels.cache.each(async (channel, id) => {
                await channel.createOverwrite(muteRole, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false
                });
              });
            }
            var muteid = RenBot.mutes.length;
            message.mentions.members
              .first()
              .roles.add(
                muteRole.id,
                "Mute command performed by " + message.author.tag
              );
            if (duration) {
              setTimeout(async function() {
                for (var i = 0; i < RenBot.mutes.length; i++) {
                  if (
                    RenBot.mutes[i].id == caseid &&
                    RenBot.mutes[i].guildId == message.guild.id
                  ) {
                    RenBot.mutes[i] = {
                      id: caseid,
                      guildId: message.guild.id,
                      user: message.mentions.users.first().id,
                      muter: message.author.id,
                      reason: RenBot.mutes[i].reason,
                      unmute_time: "none",
                      active: false
                    };
                  }
                }
                    await SaveData();
                message.mentions.members
                  .first()
                  .roles.remove(muteRole.id, "Automatic Unmute");
                sendPunishment(
                  caseid,
                  message.guild,
                  "",
                  channelId,
                  message.author,
                  message.mentions.users.first(),
                  "unmuted",
                  "Unmute",
                  "Automatic Unmute",
                  ""
                );
              }, ms(duration));
            }
            if (duration) {
              if (args[2]) {
                var text;
                for (var i = 1; i < args.length - 1; i++) {
                  text += args[i + 1] + " ";
                }
                text = text.substr(0, text.length - 1).replace("undefined", "");
                for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                  if (
                    RenBot.punishSpoilers[i].guildId == message.guild.id &&
                    RenBot.punishSpoilers[i].value == true
                  ) {
                    text = "||" + text + "||";
                  }
                }
                if (duration) {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: text,
                    unmute_time: message.createdTimestamp + ms(duration),
                    active: true
                  };
                } else {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: text,
                    unmute_time: "none"
                  };
                }
                    await SaveData();
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text,
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text,
                    ""
                  );
                }
              } else {
                if (duration) {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: "Unspecified",
                    unmute_time: message.createdTimestamp + ms(duration)
                  };
                } else {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: "Unspecified",
                    unmute_time: "none"
                  };
                }
                    await SaveData();
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified",
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified",
                    ""
                  );
                }
              }
            } else {
              if (args[1]) {
                var text;
                for (var i = 0; i < args.length - 1; i++) {
                  text += args[i + 1] + " ";
                }
                text = text.substr(0, text.length - 1).replace("undefined", "");
                for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                  if (
                    RenBot.punishSpoilers[i].guildId == message.guild.id &&
                    RenBot.punishSpoilers[i].value == true
                  ) {
                    text = "||" + text + "||";
                  }
                }
                if (duration) {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: text,
                    unmute_time: message.createdTimestamp + ms(duration),
                    active: true
                  };
                } else {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: text,
                    unmute_time: "none"
                  };
                }
                    await SaveData();
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text,
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text,
                    ""
                  );
                }
              } else {
                if (duration) {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: "Unspecified",
                    unmute_time: message.createdTimestamp + ms(duration),
                    active: true
                  };
                } else {
                  RenBot.mutes[RenBot.mutes.length] = {
                    id: caseid,
                    guildId: message.guild.id,
                    user: message.mentions.users.first().id,
                    muter: message.author.id,
                    reason: "Unspecified",
                    unmute_time: "none"
                  };
                }
                    await SaveData();
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified",
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified",
                    ""
                  );
                }
              }
            }
          } else if (message.mentions.users.first().id == message.author.id) {
            message.reply("You cannot mute yourself!");
          } else if (
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) <= 0
          ) {
            message.reply(
              "You cannot mute a member that has higher role than you!"
            );
          } else if (
            message.mentions.members
              .first()
              .roles.cache.find(r => r.name === "Muted")
          ) {
            message.reply("This member is already being muted!");
          }
        } else {
          message.reply("Please mention someone first!");
        }
      }
    } else {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to mute this member.\nYou need to have the `Kick members` permission to do that."
      );
    }
  } else if (command == "unmute") {
    if (message.member.hasPermission("KICK_MEMBERS")) {
      var channelId = null;
      for (var i = 0; i < RenBot.punishChannels.length; i++) {
        if (RenBot.punishChannels[i].guildId == message.guild.id) {
          channelId = RenBot.punishChannels[i].value;
        }
      }
      if (channelId == null) {
        message.reply(
          "The server owner haven't set the punishment reporting channel yet!"
        );
      } else {
        if (message.mentions.users.size) {
          if (
            message.mentions.users.first().id != message.author.id &&
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) > 0 &&
            message.mentions.members
              .first()
              .roles.cache.find(role => role.name == "Muted")
          ) {
            var caseid;
            for (var i = 0; i < RenBot.mutes.length; i++) {
              if (
                RenBot.mutes[i].user == message.mentions.users.first().id &&
                RenBot.mutes[i].guildId == message.guild.id &&
                RenBot.mutes[i].active == true
              ) {
                caseid = RenBot.mutes[i].id;
                RenBot.mutes[i] = {
                  id: caseid,
                  guildId: message.guild.id,
                  user: message.mentions.users.first().id,
                  muter: message.author.id,
                  reason: RenBot.mutes[i].reason,
                  unmute_time: "none",
                  active: false
                };
              }
            }
                    await SaveData();
            var muteRole = message.mentions.members
              .first()
              .roles.cache.find(role => role.name == "Muted");
            message.mentions.members
              .first()
              .roles.remove(muteRole.id, "Automatic Unmute");
            sendPunishment(
              caseid,
              message.guild,
              message.channel,
              channelId,
              message.author,
              message.mentions.users.first(),
              "unmuted",
              "Unmute",
              "Manually Unmute",
              ""
            );
          } else if (message.mentions.users.first().id == message.author.id) {
            message.reply("You cannot unmute yourself!");
          } else if (
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) <= 0
          ) {
            message.reply(
              "You cannot unmute a member that has higher role than you!"
            );
          } else if (
            !message.mentions.members
              .first()
              .roles.cache.find(role => role.name == "Muted")
          ) {
            message.reply("This member isn't being muted!");
          }
        } else {
          message.reply("Please mention someone first!");
        }
      }
    } else {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to unmute this member.\nYou need to have the `Kick members` permission to do that."
      );
    }
  } else if (command == "kick") {
    if (message.member.hasPermission("KICK_MEMBERS")) {
      var channelId = null;
      for (var i = 0; i < RenBot.punishChannels.length; i++) {
        if (RenBot.punishChannels[i].guildId == message.guild.id) {
          channelId = RenBot.punishChannels[i].value;
        }
      }
      if (channelId == null) {
        message.reply(
          "The server owner haven't set the punishment reporting channel yet!"
        );
      } else {
        if (message.mentions.users.size) {
          if (
            message.mentions.users.first().id != message.author.id &&
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) > 0
          ) {
            var caseid = 1;
            for (var i = 0; i < RenBot.kicks.length; i++) {
              if (RenBot.kicks[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.mutes.length; i++) {
              if (RenBot.mutes[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.kicks.length; i++) {
              if (RenBot.kicks[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            if (args[1]) {
              var text;
              for (var i = 0; i < args.length - 1; i++) {
                text += args[i + 1] + " ";
              }
              text = text.substr(0, text.length - 1).replace("undefined", "");
              for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                if (
                  RenBot.punishSpoilers[i].guildId == message.guild.id &&
                  RenBot.punishSpoilers[i].value == true
                ) {
                  text = "||" + text + "||";
                }
              }
              RenBot.kicks[RenBot.kicks.length] = {
                id: caseid,
                guildId: message.guild.id,
                user: message.mentions.users.first().id,
                kicker: message.author.id,
                reason: text,
                time: message.createdTimestamp
              };
                    await SaveData();
              message.mentions.members
                .first()
                .kick(message.author.tag + " - " + text);
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                message.mentions.users.first(),
                "kicked",
                "Kick",
                text,
                ""
              );
            } else {
              RenBot.kicks[RenBot.kicks.length] = {
                id: caseid,
                guildId: message.guild.id,
                user: message.mentions.users.first().id,
                kicker: message.author.id,
                reason: "Unspecified",
                time: message.createdTimestamp
              };
                    await SaveData();
              message.mentions.members
                .first()
                .kick(message.author.tag + " - " + "Unspecified reason");
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                message.mentions.users.first(),
                "kicked",
                "Kick",
                "Unspecified",
                ""
              );
            }
          } else if (message.mentions.users.first().id == message.author.id) {
            message.reply("You cannot kick yourself!");
          } else if (
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) <= 0
          ) {
            message.reply(
              "You cannot kick a member that has higher role than you!"
            );
          }
        } else {
          message.reply("Please mention someone first!");
        }
      }
    } else {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to kick this member.\nYou need to have the `Kick members` permission to do that."
      );
    }
  } else if (command == "ban") {
    if (message.member.hasPermission("BAN_MEMBERS")) {
      var channelId = null;
      for (var i = 0; i < RenBot.punishChannels.length; i++) {
        if (RenBot.punishChannels[i].guildId == message.guild.id) {
          channelId = RenBot.punishChannels[i].value;
        }
      }
      if (channelId == null) {
        message.reply(
          "The server owner haven't set the punishment reporting channel yet!"
        );
      } else {
        if (message.mentions.users.size) {
          if (
            message.mentions.users.first().id != message.author.id &&
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) > 0
          ) {
            var caseid = 1;
            for (var i = 0; i < RenBot.bans.length; i++) {
              if (RenBot.bans[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.mutes.length; i++) {
              if (RenBot.mutes[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.bans.length; i++) {
              if (RenBot.bans[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            if (!message.mentions.members.first().bannable) {
              return message.reply("I can't ban this member!");
            }
            if (args[1]) {
              var text;
              for (var i = 0; i < args.length - 1; i++) {
                text += args[i + 1] + " ";
              }
              text = text.substr(0, text.length - 1).replace("undefined", "");
              for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                if (
                  RenBot.punishSpoilers[i].guildId == message.guild.id &&
                  RenBot.punishSpoilers[i].value == true
                ) {
                  text = "||" + text + "||";
                }
              }
              RenBot.bans[RenBot.bans.length] = {
                id: caseid,
                guildId: message.guild.id,
                user: message.mentions.users.first().id,
                baner: message.author.id,
                reason: text,
                time: message.createdTimestamp
              };
                    await SaveData();
              message.mentions.members
                .first()
                .ban(message.author.tag + " - " + text);
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                message.mentions.users.first(),
                "banned",
                "Ban",
                text,
                ""
              );
            } else {
              RenBot.bans[RenBot.bans.length] = {
                id: caseid,
                guildId: message.guild.id,
                user: message.mentions.users.first().id,
                baner: message.author.id,
                reason: "Unspecified",
                time: message.createdTimestamp
              };
                    await SaveData();
              message.mentions.members
                .first()
                .ban(message.author.tag + " - " + "Unspecified reason");
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                message.mentions.users.first(),
                "banned",
                "Ban",
                "Unspecified",
                ""
              );
            }
          } else if (message.mentions.users.first().id == message.author.id) {
            message.reply("You cannot ban yourself!");
          } else if (
            message.member.roles.highest.comparePositionTo(
              message.mentions.members.first().roles.highest
            ) <= 0
          ) {
            message.reply(
              "You cannot ban a member that has higher role than you!"
            );
          }
        } else {
          message.reply("Please mention someone first!");
        }
      }
    } else {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to ban this member.\nYou need to have the `Ban members` permission to do that."
      );
    }
  } else if (command == "unban") {
    if (message.member.hasPermission("BAN_MEMBERS")) {
      var channelId = null;
      for (var i = 0; i < RenBot.punishChannels.length; i++) {
        if (RenBot.punishChannels[i].guildId == message.guild.id) {
          channelId = RenBot.punishChannels[i].value;
        }
      }
      if (channelId == null) {
        message.reply(
          "The server owner haven't set the punishment reporting channel yet!"
        );
      } else {
        if (args[0]) {
          if (!message.guild.fetchBans().find(user => user.id === args[0])) {
            return message.reply("This member isn't being banned!");
          }
          for (var i = 0; i < RenBot.bans.length; i++) {
            if (
              RenBot.bans[i].user == args[0] &&
              RenBot.bans[i].guildId == message.guild.id
            ) {
              caseid = RenBot.mutes[i].id;
              message.mentions.members
                .first()
                .unban(message.author.tag + " - " + "Manually Unban");
              sendPunishment(
                caseid,
                message.guild,
                message.channel,
                channelId,
                message.author,
                client.users.cache.get(args[0]),
                "unbanned",
                "Unban",
                "Manually Unban",
                ""
              );
            }
          }
        } else {
          message.reply("Please type an ID first!");
        }
      }
    } else {
      message.channel.send(
        "> " +
          message.content +
          "\n" +
          message.author.toString() +
          " nah, you don't have the permission to unban this member.\nYou need to have the `Ban members` permission to do that."
      );
    }
  } else if (command == "memorize") {
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
    var channelId = null;
    for (var i = 0; i < RenBot.memoriesChannel.length; i++) {
      if (RenBot.memoriesChannel[i].guildId == message.guild.id) {
        channelId = RenBot.memoriesChannel[i].value;
      }
    }
    if (channelId == null) {
      message.reply(
        "The server owner haven't set the message memories channel yet!"
      );
    } else {
      if (args[0]) {
        var currentChannel = message.channel;
        message.channel.messages
          .fetch(args[0])
          .then(memMessage => {
            client.channels.fetch(channelId).then(channel => {
              if (!memMessage.attachments.size) {
              const mess = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name: memMessage.author.tag,
                  icon_url: memMessage.author.displayAvatarURL()
                },
                description: memMessage.content,
                footer: {
                  text: "Memorized by " + message.author.tag
                },
                timestamp: memMessage.createdTimestamp
              };
              channel
                .send('**Jump to this message:** https://discord.com/channels/' + memMessage.guild.id + '/' + memMessage.channel.id + '/' + memMessage.id, { embed: mess })
                .then(message => {
                  currentChannel.send(
                    "I have just sent this mentioned message into " +
                      channel.toString() +
                      " 👍"
                  );
                })
                .catch(err => {
                  throw err;
                  currentChannel.send(
                    "I can't send this message into the defined channel!"
                  );
                });
              } else {
                const mess = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name: memMessage.author.tag,
                  icon_url: memMessage.author.displayAvatarURL()
                },
                description: memMessage.content,
                image: {
                  url: memMessage.attachments.first().url
                },
                footer: {
                  text: "Memorized by " + message.author.tag
                },
                timestamp: memMessage.createdTimestamp
              };
              channel
                .send('**Jump to this message:** https://discord.com/channels/' + memMessage.guild.id + '/' + memMessage.channel.id + '/' + memMessage.id, { embed: mess })
                .then(message => {
                  currentChannel.send(
                    "I have just sent this mentioned message into " +
                      channel.toString() +
                      " 👍"
                  );
                })
                .catch(err => {
                  throw err;
                  currentChannel.send(
                    "I can't send this message into the defined channel!"
                  );
                });
              }
            });
          })
          .catch(err => {
            throw err;
            currentChannel.send("I can't find this message ID!");
          });
      } else {
        message.reply("Please specify a message ID!");
      }
    }
    }
    else {
      message.channel.send('> ' + message.content + '\n' + message.author.toString() + ' nah, you don\'t have the Manage Messages permissions, bruh.')
    }
  } else if (command == "giverole") {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      if (message.mentions.users.size) {
        if (message.mentions.roles.size) {
          if (
            !message.mentions.members
              .first()
              .roles.cache.find(
                role => role.id === message.mentions.roles.first().id
              )
          ) {
            message.mentions.members
              .first()
              .roles.add(
                message.mentions.roles.first().id,
                "Role given by " + message.author.tag
              );
            const mess = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.tag +
                  " has just given " +
                  message.mentions.users.first().tag +
                  " the " +
                  message.mentions.roles.first().name +
                  " role",
                icon_url: message.author.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: mess
            });
            const mess2 = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  "You just have been given " +
                  message.mentions.users.first().tag +
                  " a role in " +
                  message.guild.name,
                icon_url: message.author.displayAvatarURL()
              },
              description:
                "**Role:** " +
                message.mentions.roles.first().name +
                "\n**Given by:** " +
                message.author.tag
            };
            message.mentions.users.first().send({
              embed: mess2
            });
          } else {
            message.reply("This member has already had this role!");
          }
        } else if (message.mentions.roles.size == 0 && args[1]) {
          console.log(args[1]);
          var mentionRole = message.guild.roles.cache.filter(role =>
            role.name.startsWith(args[1])
          );
          console.log(mentionRole);
          if (mentionRole.size == 1) {
            if (
              !message.mentions.members
                .first()
                .roles.cache.find(role => role.id === mentionRole.first().id)
            ) {
              message.mentions.members
                .first()
                .roles.add(
                  mentionRole.first().id,
                  "Role given by " + message.author.tag
                );
              const mess = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.tag +
                    " has just given " +
                    message.mentions.users.first().tag +
                    " the " +
                    mentionRole.first().name +
                    " role",
                  icon_url: message.author.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: mess
              });
              const mess2 = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    "You just have been given " +
                    message.mentions.users.first().tag +
                    " a role in " +
                    message.guild.name,
                  icon_url: message.author.displayAvatarURL()
                },
                description:
                  "**Role:** " +
                  mentionRole.first().name +
                  "\n**Given by:** " +
                  message.author.tag
              };
              message.mentions.users.first().send({
                embed: mess2
              });
            } else {
              message.reply("This member has already had this role!");
            }
          } else if (mentionRole.size == 0 || !mentionRole) {
            message.reply("Please specify a valid role name!");
          } else if (mentionRole.size > 1) {
            message.reply(
              "The role name query result has more than 1 roles!\nPlease specify a more unique role name!"
            );
          }
        } else {
          message.reply("Please specify a role!");
        }
      } else {
        message.reply("Who do you want to give a role to?");
      }
    } else {
      message.reply("What do you think you're doing?");
    }
  } else if (command == "takerole") {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      if (message.mentions.users.size) {
        if (message.mentions.roles.size) {
          if (
            message.mentions.members
              .first()
              .roles.cache.find(
                role => role.id === message.mentions.roles.first().id
              )
          ) {
            message.mentions.members
              .first()
              .roles.remove(
                message.mentions.roles.first().id,
                "Role taken by " + message.author.tag
              );
            const mess = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  message.author.tag +
                  " has just taken " +
                  message.mentions.users.first().tag +
                  " the " +
                  message.mentions.roles.first().name +
                  " role",
                icon_url: message.author.displayAvatarURL()
              }
            };
            message.channel.send({
              embed: mess
            });
            const mess2 = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name:
                  "You just have been taken " +
                  message.mentions.users.first().tag +
                  " a role in " +
                  message.guild.name,
                icon_url: message.author.displayAvatarURL()
              },
              description:
                "**Role:** " +
                message.mentions.roles.first().name +
                "\n**taken by:** " +
                message.author.tag
            };
            message.mentions.users.first().send({
              embed: mess2
            });
          } else {
            message.reply("This member doesn't have this role!");
          }
        } else if (message.mentions.roles.size == 0 && args[1]) {
          var mentionRole = message.guild.roles.cache.filter(role =>
            role.name.startsWith(args[1])
          );
          if (mentionRole.size == 1) {
            if (
              message.mentions.members
                .first()
                .roles.cache.find(role => role.id === mentionRole.first().id)
            ) {
              message.mentions.members
                .first()
                .roles.remove(
                  mentionRole.first().id,
                  "Role taken by " + message.author.tag
                );
              const mess = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    message.author.tag +
                    " has just taken " +
                    message.mentions.users.first().tag +
                    " the " +
                    mentionRole.first().name +
                    " role",
                  icon_url: message.author.displayAvatarURL()
                }
              };
              message.channel.send({
                embed: mess
              });
              const mess2 = {
                color: Math.floor(Math.random() * 16777214) + 1,
                author: {
                  name:
                    "You just have been taken " +
                    message.mentions.users.first().tag +
                    " a role in " +
                    message.guild.name,
                  icon_url: message.author.displayAvatarURL()
                },
                description:
                  "**Role:** " +
                  mentionRole.first().name +
                  "\n**taken by:** " +
                  message.author.tag
              };
              message.mentions.users.first().send({
                embed: mess2
              });
            } else {
              message.reply("This member doesn't have this role!");
            }
          } else if (mentionRole.size == 0 || !mentionRole) {
            message.reply("Please specify a valid role name!");
          } else if (mentionRole.size > 1) {
            message.reply(
              "The role name query result has more than 1 roles!\nPlease specify a more unique role name!"
            );
          }
        } else {
          message.reply("Please specify a role!");
        }
      } else {
        message.reply("Who do you want to take a role to?");
      }
    } else {
      message.reply("What do you think you're doing?");
    }
  } else if (command == "setcolor") {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      if (message.mentions.roles.size) {
        if (args[1]) {
          message.mentions.roles
            .first()
            .edit(
              { color: args[1] },
              "Role color set by " + message.author.tag
            );
          const mess = {
            color: Math.floor(Math.random() * 16777214) + 1,
            author: {
              name:
                message.author.tag +
                " has just set the color of the " +
                message.mentions.roles.first().name +
                " role to " +
                args[1],
              icon_url: message.author.displayAvatarURL()
            }
          };
          message.channel.send({
            embed: mess
          });
        } else {
          message.reply("Please specify a color!");
        }
      } else {
        message.reply("Please specify a role!");
      }
    } else {
      message.reply("What do you think you're doing?");
    }
  } else if (command == "account") {
    var cmdDisabled = false;
    for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
      if (
        RenBot.cmdDisabled[i].channelId == message.channel.id &&
        RenBot.cmdDisabled[i].value == true
      ) {
        cmdDisabled = true;
      }
    }
    if (!cmdDisabled) {
      if (!message.mentions.users.size && args[0]) {
        var member = client.users.cache.get(args[0]);
        var guildMember = message.guild.member(args[0]);
        var nitroBoost;
        if (member) {
          if (guildMember) {
            if (guildMember.premiumSince) {
              nitroBoost = guildMember.premiumSince.toUTCString();
            } else {
              nitroBoost = "None";
            }
            const infoMessage = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name: member.tag + " (" + member.presence.status + ")"
              },
              thumbnail: {
                url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 128
                })
              },
              fields: [
                {
                  name: "Display Name:",
                  value: "<@" + member.id + ">",
                  inline: true
                },
                {
                  name: "User ID:",
                  value: member.id,
                  inline: true
                },
                {
                  name: "Avatar URL:",
                  value:
                    "[Download](" +
                    member.avatarURL({
                      format: "jpg",
                      dynamic: true,
                      size: 1024
                    }) +
                    ")",
                  inline: true
                },
                {
                  name: "Account created at:",
                  value: member.createdAt.toUTCString(),
                  inline: false
                },
                {
                  name: "Member joined at:",
                  value: guildMember.joinedAt.toUTCString(),
                  inline: false
                },
                {
                  name: "Number of roles:",
                  value: guildMember.roles.cache.filter(
                    role => role.name !== ""
                  ).size,
                  inline: true
                },
                {
                  name: "Highest role:",
                  value: guildMember.roles.highest.toString(),
                  inline: true
                },
                {
                  name: "\u200b",
                  value: "\u200b",
                  inline: false
                },
                {
                  name: "Nitro Boosted since:",
                  value: nitroBoost,
                  inline: true
                },
                {
                  name: "Member display color:",
                  value: guildMember.displayHexColor,
                  inline: true
                }
              ],
              footer: {
                text: "Powered by Nico Levianth#5503",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({ embed: infoMessage });
          } else {
            const infoMessage = {
              color: Math.floor(Math.random() * 16777214) + 1,
              author: {
                name: member.tag + " (" + member.presence.status + ")"
              },
              thumbnail: {
                url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 128
                })
              },
              fields: [
                {
                  name: "Display Name:",
                  value: "<@" + member.id + ">",
                  inline: true
                },
                {
                  name: "User ID:",
                  value: member.id,
                  inline: true
                },
                {
                  name: "Avatar URL:",
                  value:
                    "[Download](" +
                    member.avatarURL({
                      format: "jpg",
                      dynamic: true,
                      size: 1024
                    }) +
                    ")",
                  inline: true
                },
                {
                  name: "Account created at:",
                  value: member.createdAt.toUTCString(),
                  inline: false
                },
                {
                  name:
                    "Some informations cannot be get because this user doesn't join this guild.",
                  value: "\u200b",
                  inline: false
                }
              ],
              footer: {
                text: "Powered by Nico Levianth#5503",
                icon_url: client.user.displayAvatarURL()
              }
            };
            message.channel.send({ embed: infoMessage });
          }
        } else {
          message.reply("Please specify a valid ID!");
        }
      } else if (message.mentions.users.size) {
        var member = message.mentions.users.first();
        var guildMember = message.guild.member(
          message.mentions.members.first().id
        );
        var nitroBoost;
        if (guildMember.premiumSince) {
          nitroBoost = guildMember.premiumSince.toUTCString();
        } else {
          nitroBoost = "None";
        }
        const infoMessage = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: member.tag + " (" + member.presence.status + ")"
          },
          thumbnail: {
            url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 128
                })
          },
          fields: [
            {
              name: "Display Name:",
              value: "<@" + member.id + ">",
              inline: true
            },
            {
              name: "User ID:",
              value: member.id,
              inline: true
            },
            {
              name: "Avatar URL:",
              value:
                "[Download](" +
                member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 1024
                }) +
                ")",
              inline: true
            },
            {
              name: "Account created at:",
              value: member.createdAt.toUTCString(),
              inline: false
            },
            {
              name: "Member joined at:",
              value: guildMember.joinedAt.toUTCString(),
              inline: false
            },
            {
              name: "Number of roles:",
              value: guildMember.roles.cache.filter(role => role.name !== "")
                .size,
              inline: true
            },
            {
              name: "Highest role:",
              value: guildMember.roles.highest.toString(),
              inline: true
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: false
            },
            {
              name: "Nitro Boosted since:",
              value: nitroBoost,
              inline: true
            },
            {
              name: "Member display color:",
              value: guildMember.displayHexColor,
              inline: true
            }
          ],
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({ embed: infoMessage });
      } else {
        var member = message.author;
        var guildMember = message.guild.member(message.author);
        var nitroBoost;
        if (guildMember.premiumSince) {
          nitroBoost = guildMember.premiumSince.toUTCString();
        } else {
          nitroBoost = "None";
        }
        const infoMessage = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: member.tag + " (" + member.presence.status + ")"
          },
          thumbnail: {
            url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 128
                })
          },
          fields: [
            {
              name: "Display Name:",
              value: "<@" + member.id + ">",
              inline: true
            },
            {
              name: "User ID:",
              value: member.id,
              inline: true
            },
            {
              name: "Avatar URL:",
              value:
                "[Download](" +
                member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 1024
                }) +
                ")",
              inline: true
            },
            {
              name: "Account created at:",
              value: member.createdAt.toUTCString(),
              inline: false
            },
            {
              name: "Member joined at:",
              value: guildMember.joinedAt.toUTCString(),
              inline: false
            },
            {
              name: "Number of roles:",
              value: guildMember.roles.cache.filter(role => role.name !== "")
                .size,
              inline: true
            },
            {
              name: "Highest role:",
              value: guildMember.roles.highest.toString(),
              inline: true
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: false
            },
            {
              name: "Nitro Boosted since:",
              value: nitroBoost,
              inline: true
            },
            {
              name: "Member display color:",
              value: guildMember.displayHexColor,
              inline: true
            }
          ],
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({ embed: infoMessage });
      }
    } else {
      message.channel.send("This command is disabled on this channel!");
    }
  } else if (command == "owner") {
    var cmdDisabled = false;
    for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
      if (
        RenBot.cmdDisabled[i].channelId == message.channel.id &&
        RenBot.cmdDisabled[i].value == true
      ) {
        cmdDisabled = true;
      }
    }
    if (!cmdDisabled) {
      var member = message.guild.owner.user;
      var guildMember = message.guild.owner;
      var nitroBoost;
      if (guildMember.premiumSince) {
        nitroBoost = guildMember.premiumSince.toUTCString();
      } else {
        nitroBoost = "None";
      }
      const infoMessage = {
        color: Math.floor(Math.random() * 16777214) + 1,
        author: {
          name: member.tag + " (" + member.presence.status + ")"
        },
        thumbnail: {
          url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 128
                })
        },
        fields: [
          {
            name: "Display Name:",
            value: "<@" + member.id + ">",
            inline: true
          },
          {
            name: "User ID:",
            value: member.id,
            inline: true
          },
          {
            name: "Avatar URL:",
            value:
              "[Download](" +
              member.avatarURL({
                format: "jpg",
                dynamic: true,
                size: 1024
              }) +
              ")",
            inline: true
          },
          {
            name: "Account created at:",
            value: member.createdAt.toUTCString(),
            inline: false
          },
          {
            name: "Member joined at:",
            value: guildMember.joinedAt.toUTCString(),
            inline: false
          },
          {
            name: "Number of roles:",
            value: guildMember.roles.cache.filter(role => role.name !== "")
              .size,
            inline: true
          },
          {
            name: "Highest role:",
            value: guildMember.roles.highest.toString(),
            inline: true
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: false
          },
          {
            name: "Nitro Boosted since:",
            value: nitroBoost,
            inline: true
          },
          {
            name: "Member display color:",
            value: guildMember.displayHexColor,
            inline: true
          }
        ],
        footer: {
          text: "Powered by Nico Levianth#5503",
          icon_url: client.user.displayAvatarURL()
        }
      };
      message.channel.send({ embed: infoMessage });
    } else {
      message.channel.send("This command is disabled on this channel!");
    }
  } else if (command == "developer") {
    var cmdDisabled = false;
    for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
      if (
        RenBot.cmdDisabled[i].channelId == message.channel.id &&
        RenBot.cmdDisabled[i].value == true
      ) {
        cmdDisabled = true;
      }
    }
    if (!cmdDisabled) {
      var member = client.users.cache.get("536899471720841228");
      var guildMember = message.guild.member("536899471720841228");
      if (guildMember) {
        var nitroBoost;
        if (guildMember.premiumSince) {
          nitroBoost = guildMember.premiumSince.toUTCString();
        } else {
          nitroBoost = "None";
        }
        const infoMessage = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: member.tag + " (" + member.presence.status + ")"
          },
          thumbnail: {
            url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 128
                })
          },
          fields: [
            {
              name: "Display Name:",
              value: "<@" + member.id + ">",
              inline: true
            },
            {
              name: "User ID:",
              value: member.id,
              inline: true
            },
            {
              name: "Avatar URL:",
              value:
                "[Download](" +
                member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 1024
                }) +
                ")",
              inline: true
            },
            {
              name: "Account created at:",
              value: member.createdAt.toUTCString(),
              inline: false
            },
            {
              name: "Member joined at:",
              value: guildMember.joinedAt.toUTCString(),
              inline: false
            },
            {
              name: "Number of roles:",
              value: guildMember.roles.cache.filter(role => role.name !== "")
                .size,
              inline: true
            },
            {
              name: "Highest role:",
              value: guildMember.roles.highest.toString(),
              inline: true
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: false
            },
            {
              name: "Nitro Boosted since:",
              value: nitroBoost,
              inline: true
            },
            {
              name: "Member display color:",
              value: guildMember.displayHexColor,
              inline: true
            }
          ],
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send(
          member.tag + " is this BOT's developer! Shout out to him! :D",
          { embed: infoMessage }
        );
      } else {
        const infoMessage = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: member.tag + " (" + member.presence.status + ")"
          },
          thumbnail: {
            url: member.displayAvatarURL()
          },
          fields: [
            {
              name: "Display Name:",
              value: "<@" + member.id + ">",
              inline: true
            },
            {
              name: "User ID:",
              value: member.id,
              inline: true
            },
            {
              name: "Avatar URL:",
              value:
                "[Download](" +
                member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 1024
                }) +
                ")",
              inline: true
            },
            {
              name: "Account created at:",
              value: member.createdAt.toUTCString(),
              inline: false
            },
            {
              name:
                "Some informations cannot be get because this user doesn't join this guild.",
              value: "\u200b",
              inline: false
            }
          ],
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send(
          member.tag + " is this BOT's developer! Shout out to him! :D",
          { embed: infoMessage }
        );
      }
    } else {
      message.channel.send("This command is disabled on this channel!");
    }
  } else if (command == "avatar") {
    var cmdDisabled = false;
    for (var i = 0; i < RenBot.cmdDisabled.length; i++) {
      if (
        RenBot.cmdDisabled[i].channelId == message.channel.id &&
        RenBot.cmdDisabled[i].value == true
      ) {
        cmdDisabled = true;
      }
    }
    if (!cmdDisabled) {
      var member;
      if (!message.mentions.users.size && args[0]) {
        member = client.users.cache.get(args[0]);
        if (!member) {
          return message.reply("Please specify a valid ID!");
        }
      }
      else if (message.mentions.users.size) {
        member = message.mentions.users.first();
      }
      else {
        member = message.author;
      }
      const infoMessage = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: member.username + "'s Avatar",
            url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 1024
                })
          },
          image: {
            url: member.avatarURL({
                  format: "jpg",
                  dynamic: true,
                  size: 1024
                })
          },
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send(
          { embed: infoMessage }
        );
    } else {
      message.reply("This command is disabled on this channel!");
    }
  } else if(command == "fakemute") {
    if (message.mentions.users.size) {
          if (
            message.mentions.users.first().id != message.author.id
          ) {
            var duration;
            if (
              / *s/.test(args[1]) ||
              / *m/.test(args[1]) ||
              / *h/.test(args[1]) ||
              / *d/.test(args[1]) ||
              / *w/.test(args[1])
            ) {
              duration = args[1];
              console.log("time specified: " + ms(duration));
            } else {
              duration = null;
            }
            var caseid = 1;
            for (var i = 0; i < RenBot.warns.length; i++) {
              if (RenBot.warns[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.mutes.length; i++) {
              if (
                RenBot.mutes[i] &&
                RenBot.mutes[i].guildId == message.guild.id
              ) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.kicks.length; i++) {
              if (RenBot.kicks[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            for (var i = 0; i < RenBot.bans.length; i++) {
              if (RenBot.bans[i].guildId == message.guild.id) {
                caseid = parseInt(caseid) + 1;
              }
            }
            if (duration) {
              if (args[2]) {
                var text;
                for (var i = 1; i < args.length - 1; i++) {
                  text += args[i + 1] + " ";
                }
                text = text.substr(0, text.length - 1).replace("undefined", "");
                for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                  if (
                    RenBot.punishSpoilers[i].guildId == message.guild.id &&
                    RenBot.punishSpoilers[i].value == true
                  ) {
                    text = "||" + text + "||";
                  }
                }
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text + "\nDon't worry, this is just a fake mute command :)",
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text + "\nDon't worry, this is just a fake mute command :)",
                    ""
                  );
                }
              } else {
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified" + "\nDon't worry, this is just a fake mute command :)",
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified" + "\nDon't worry, this is just a fake mute command :)",
                    ""
                  );
                }
              }
            } else {
              if (args[1]) {
                var text;
                for (var i = 0; i < args.length - 1; i++) {
                  text += args[i + 1] + " ";
                }
                text = text.substr(0, text.length - 1).replace("undefined", "");
                for (var i = 0; i < RenBot.punishSpoilers.length; i++) {
                  if (
                    RenBot.punishSpoilers[i].guildId == message.guild.id &&
                    RenBot.punishSpoilers[i].value == true
                  ) {
                    text = "||" + text + "||";
                  }
                }
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text + "\nDon't worry, this is just a fake mute command :)",
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    text + "\nDon't worry, this is just a fake mute command :)",
                    ""
                  );
                }
              } else {
                if (duration) {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified" + "\nDon't worry, this is just a fake mute command :)",
                    ms(ms(duration))
                  );
                } else {
                  sendPunishment(
                    caseid,
                    message.guild,
                    message.channel,
                    channelId,
                    message.author,
                    message.mentions.users.first(),
                    "muted",
                    "Mute",
                    "Unspecified" + "\nDon't worry, this is just a fake mute command :)",
                    ""
                  );
                }
              }
            }
          } else if (message.mentions.users.first().id == message.author.id) {
            message.reply("You cannot mute yourself!");
          } else if (
            message.mentions.members
              .first()
              .roles.cache.find(r => r.name === "Muted")
          ) {
            message.reply("This member is already being muted!");
          }
        } else {
          message.reply("Please mention someone first!");
        }
  } else if (command == "punishments" || command == "puns") {
    if (!message.mentions.users.size) {
      var punishments = "⚠️ **Warnings:**\n", val = 0;
      for (var i = 0; i < RenBot.warns.length; i++) {
        if (RenBot.warns[i].user == message.author.id && RenBot.warns[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.warns[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.warns[i].warner).tag + "\n**Reason**: " + RenBot.warns[i].reason + "\n\n";
        }
      }
      punishments += "🤐 **Mutes:**\n";
      for (var i = 0; i < RenBot.mutes.length; i++) {
        if (RenBot.mutes[i].user == message.author.id && RenBot.mutes[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.mutes[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.mutes[i].muter).tag + "\n**Reason**: " + RenBot.mutes[i].reason + "\n\n";
        }
      }
      punishments += "❌ **Kicks:**\n";
      for (var i = 0; i < RenBot.kicks.length; i++) {
        if (RenBot.kicks[i].user == message.author.id && RenBot.kicks[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.kicks[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.kicks[i].kicker).tag + "\n**Reason**: " + RenBot.kicks[i].reason + "\n\n";
        }
      }
      punishments += "❌ **Bans:**\n";
      for (var i = 0; i < RenBot.bans.length; i++) {
        if (RenBot.bans[i].user == message.author.id && RenBot.bans[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.kicks[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.bans[i].banner).tag + "\n**Reason**: " + RenBot.bans[i].reason + "\n\n";
        }
      }
      if (val > 0) {
        const mess = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: "List of all your punishments on " + message.guild.name,
            icon_url: message.author.displayAvatarURL()
          },
          description: punishments,
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({
          embed: mess
        });
      }
      else {
        message.channel.send("You don't have any punishments!");
      }
    }
    else {
      var punishments = "⚠️ **Warnings:**\n", val = 0;
      for (var i = 0; i < RenBot.warns.length; i++) {
        if (RenBot.warns[i].user == message.mentions.users.first().id && RenBot.warns[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.warns[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.warns[i].warner).tag + "\n**Reason**: " + RenBot.warns[i].reason + "\n\n";
        }
      }
      punishments += "🤐 **Mutes:**\n";
      for (var i = 0; i < RenBot.mutes.length; i++) {
        if (RenBot.mutes[i].user == message.mentions.users.first().id && RenBot.mutes[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.mutes[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.mutes[i].muter).tag + "\n**Reason**: " + RenBot.mutes[i].reason + "\n\n";
        }
      }
      punishments += "❌ **Kicks:**\n";
      for (var i = 0; i < RenBot.kicks.length; i++) {
        if (RenBot.kicks[i].user == message.mentions.users.first().id && RenBot.kicks[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.kicks[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.kicks[i].kicker).tag + "\n**Reason**: " + RenBot.kicks[i].reason + "\n\n";
        }
      }
      punishments += "🚫 **Bans:**\n";
      for (var i = 0; i < RenBot.bans.length; i++) {
        if (RenBot.bans[i].user == message.mentions.users.first().id && RenBot.bans[i].guildId == message.guild.id) {
          val++;
          punishments += "**=== Case #" + RenBot.kicks[i].id + " ===**\n**From**: " + client.users.cache.get(RenBot.bans[i].baner).tag + "\n**Reason**: " + RenBot.bans[i].reason + "\n\n";
        }
      }
      if (val > 0) {
        const mess = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: "List of all " + message.mentions.users.first().username + "'s punishments on " + message.guild.name,
            icon_url: message.mentions.users.first().displayAvatarURL()
          },
          description: punishments,
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({
          embed: mess
        });
      }
      else {
        message.channel.send(message.mentions.users.first().username + " don't have any punishments!");
      }
    }
  } else if (command == "play") {
  const serverQueue = queue.get(message.guild.id);
    execute(message, serverQueue);
  } else if (command == "skip") {
  const serverQueue = queue.get(message.guild.id);
    skip(message, serverQueue);
  } else if (command == "stop") {
  const serverQueue = queue.get(message.guild.id);
    stop(message, serverQueue);
  } else if (command == "queue") {
  const serverQueue = queue.get(message.guild.id);
    if (!serverQueue || !serverQueue.songs) {
      return message.channel.send("There isn't any song in the queue! Please add a song and try again!");
    }
      var songs = "";
      for (var i = 0; i < serverQueue.songs.length; i++) {
        if (i == 0) {
          songs += "**Currently Playing: " + serverQueue.songs[i].title + "**\n[Watch this Video](" + serverQueue.songs[i].url + ")\n\n";
        }
        else {
          songs += "**" + i + ". " + serverQueue.songs[i].title + "**\n[Watch this Video](" + serverQueue.songs[i].url + ")\n\n";
        }
      }
      const mess = {
          color: Math.floor(Math.random() * 16777214) + 1,
          author: {
            name: "List of all songs playing on " + message.guild.name
          },
          description: songs,
          footer: {
            text: "Powered by Nico Levianth#5503",
            icon_url: client.user.displayAvatarURL()
          }
        };
        message.channel.send({
          embed: mess
        });
  } else if (command == "owoify") {
      if (args[0]) {
        var text = "";
        for (var i = 0; i < args.length; i++) {
          text += args[i] + " ";
        }
        text = text.substr(0, text.length - 1);
        var owoified = await neko.sfw.OwOify({text: text});
        message.channel.send(owoified.owo);
      } else {
        message.reply("Please type something first!");
      }
  } else if (command == "why") {
      var why = await neko.sfw.why();
      message.channel.send(why.why);
  } else if (command == "fact") {
      var fact = await neko.sfw.fact();
      message.channel.send(fact.fact);
  } else if (command == "waifu") {
    const gif = await neko.sfw.waifu();
    const image = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: message.author.username + ", Here's your random waifu",
        icon_url: message.author.displayAvatarURL()
      },
      image: {
        url: gif.url
      },
      footer: {
        text: "Powered by Nico Levianth#5503 | API by nekos.life",
        icon_url: client.user.displayAvatarURL()
      }
    };
    message.channel.send({
      embed: image
    });
  }
});

async function execute(message, serverQueue) {
  var prefix = false;
  const prefixes = ["r", "ren "];
  for (var i = 0; i < prefixes.length; i++) {
    if (message.content.toLowerCase().startsWith("r!")) {
      prefix = "r!";
    } else if (message.content.toLowerCase().startsWith(prefixes[i])) {
      prefix = prefixes[i];
    }
  }
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[0]);
  console.log(args[0]);
  var song;
  if (songInfo) {
    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    };
  }
  else {
    message.channel.send("I cannot find this video!")
  }

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There isn't any song in the queue!")
  message.channel.send("I have successfully leaved your voice channel 👍")
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return serverQueue.textChannel.send(`Finished playing the current queue! I'm going to leave the voice channel!`);;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(process.env.BotToken.toString());
