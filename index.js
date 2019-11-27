const discord = require("discord.js");
const {token} = require("./config.json");

const bot = new discord.Client({disableEveryone: true});

bot.on("ready", () => {
    console.log(`${bot.user.username} is ready to go!`);
    bot.user.setActivity("for $suggest", {type: "WATCHING"});
});

bot.on("message", async message => {
    if (message.author.bot || message.channel.type !== "text") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.splice(1);

    if (cmd === `$suggest`) {
        if (message.channel.id !== "645349504819789827") {
	        if (!message.member.hasPermission("KICK_MEMBERS")) return;    
	    }
        message.delete();

        let titleMsg = await message.channel.send(text(`What is the title of your suggestion?`));

        const filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages(filter, {max: 1})
        .then(async collected => {
            let title = collected.first();
            title.delete();
            titleMsg.delete();

            let bodyMsg = await message.channel.send(text(`What will the description of your suggestion be?`));

            message.channel.awaitMessages(filter, {max: 1})
            .then(collected => {
                let body = collected.first();
                body.delete();
                bodyMsg.delete();

                let time = new Date();
                let embed = new discord.RichEmbed()
                .setColor("#3498db")
                .setTitle(title.content)
                .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                .setDescription(body.content)
                .setTimestamp(time)
                .setFooter(`Bot Created by weird gamer22#5366`);

                message.channel.send(embed);
            });
        });
    }
});

bot.login(token);

// Functions
const text = (text, color = "#3498db") => {
    let embed = new discord.RichEmbed()
    .setDescription(text)
    .setColor(color);

    return embed;
}
