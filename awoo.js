const Discord = require('discord.js');
const client = new Discord.Client();
let rp = require(`request-promise`);

var auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Awooy\'s cutie bot");
});

function soloScrape(id, channel) {
    rp("https://royale.pet/player/" + id).then(a => {
        //Disgusting String manipulation. Basically, find the correct spot in the html code and take out the correct value.
        let kills = a.split("kills")[1].split(" ")[1].split(">")[1].split("<")[0];
        let deaths = a.split("deaths")[1].split(" ")[1].split(">")[1].split("<")[0];
        let kd = a.split("K:D")[1].split(" ")[1].split(">")[1].split("<")[0]
        let name = (a.split("\"name\"")[1].split(">")[1].split("<")[0]);
        let image = (a.split("background-image")[1].split("(")[1].split(")")[0])
        let games = a.split("Games Played")[1].split(" ")[1].split(">")[1].split("<")[0];
        let since = a.split("Player since ")[1].split("<")[0];
        //Create and organize embed
        let emb = new Discord.RichEmbed();
        emb.setTitle("Solo Stats");
        emb.setColor(0xff2727);
        emb.setThumbnail(image);
        emb.setDescription("Name: " + name + " \nKills: " + kills + "\nDeaths: " + deaths + "\nK/D: " + kd);
        emb.setFooter(games + " Solo games, player since " + since);
        emb.setURL("https://royale.pet/players/" + id);
        channel.send(emb); //Send embed

    });
}

function squadScrape(id, channel) {
    rp("https://royale.pet/player/" + id).then(a => {
        //Note that the only difference between the string scraping in all three functions is which instance of "kill/deaths/etc" is selected. Because they appear linearly, we just need to jump to the correct instance of it, and we can collect the correct value with relative ease.
        let kills = a.split("kills")[5].split(" ")[1].split(">")[1].split("<")[0];
        let deaths = a.split("deaths")[3].split(" ")[1].split(">")[1].split("<")[0];
        let kd = a.split("K:D")[3].split(" ")[1].split(">")[1].split("<")[0]
        let name = (a.split("\"name\"")[1].split(">")[1].split("<")[0]);
        let image = (a.split("background-image")[1].split("(")[1].split(")")[0])
        let games = a.split("Games Played")[3].split(" ")[1].split(">")[1].split("<")[0];
        let since = a.split("Player since ")[1].split("<")[0];
        let emb = new Discord.RichEmbed();
        emb.setTitle("Squads Stats");
        emb.setColor(0xff2727);
        emb.setThumbnail(image);
        emb.setDescription("Name: " + name + " \nKills: " + kills + "\nDeaths: " + deaths + "\nK/D: " + kd);
        emb.setFooter(games + " Squad games, player since " + since);
        emb.setURL("https://royale.pet/players/" + id);
        channel.send(emb);
    });
}

function duoScrape(id, channel) {
    rp("https://royale.pet/player/" + id).then(a => {
        let kills = a.split("kills")[3].split(" ")[1].split(">")[1].split("<")[0];
        let deaths = a.split("deaths")[2].split(" ")[1].split(">")[1].split("<")[0];
        let kd = a.split("K:D")[2].split(" ")[1].split(">")[1].split("<")[0]
        let name = (a.split("\"name\"")[1].split(">")[1].split("<")[0]);
        let image = (a.split("background-image")[1].split("(")[1].split(")")[0])
        let games = a.split("Games Played")[2].split(" ")[1].split(">")[1].split("<")[0];
        let since = a.split("Player since ")[1].split("<")[0];
        let emb = new Discord.RichEmbed();
        emb.setTitle("Duos Stats");
        emb.setColor(0xff2727);
        emb.setThumbnail(image);
        emb.setDescription("Name: " + name + " \nKills: " + kills + "\nDeaths: " + deaths + "\nK/D: " + kd);
        emb.setFooter(games + " Duo games, player since " + since);
        emb.setURL("https://royale.pet/players/" + id);
        channel.send(emb);
    });
}

/*
 *Start chat commands
 */
client.on("message", async message => {
    //Organize inputs
    if (message.content.indexOf(auth.prefix) !== 0) return;
    const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(command);

    if (command === 'solo') {
        if (!args[0]) return message.channel.send("You need to give a player!");
        let id = args[0];
        if (parseInt(args[0]) != args[0]) { //Occurs when there are letters in the id, therefore isnt steam id
            rp("https://steamcommunity.com/id/" + args[0]).then(a => {
                id = a.split("steamid\":\"")[1].split("\"")[0]; //Scrape id from steamcommunity.com
                soloScrape(id, message.channel);
            });
        } else {
            soloScrape(id, message.channel);
        }
    }

    if (command === 'duos') {
        if (!args[0]) return message.channel.send("You need to give a player!");
        let id = args[0];
        if (parseInt(args[0]) != args[0]) {
            rp("https://steamcommunity.com/id/" + args[0]).then(a => {
                id = a.split("steamid\":\"")[1].split("\"")[0];
                duoScrape(id, message.channel);
            });
        } else {
            duoScrape(id, message.channel);
        }
    }

    if (command === 'squads') {
        if (!args[0]) return message.channel.send("You need to give a player!");
        let id = args[0];
        if (parseInt(args[0]) != args[0]) {
            rp("https://steamcommunity.com/id/" + args[0]).then(a => {
                id = a.split("steamid\":\"")[1].split("\"")[0];
                squadScrape(id, message.channel);
            });
        } else {
            squadScrape(id, message.channel);
        }
    }

});
/*
 *End chat commands
 */

client.login(auth.token);
