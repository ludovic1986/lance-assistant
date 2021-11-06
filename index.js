const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config();
const token = process.env.TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// TODO A ameliorer
client.on('messageCreate', message => {
  if (message.content === 'lance') {
    message.channel.send("D'entremont !!!!");
  }
prefix = "?";
footer = "" ;


if(message.content.startsWith(prefix+ "sondage")){
	let msg = message.content.split(" ").slice(1);
  message.delete(); // Supprime l'ancien message
	let args = msg.join(" ");
	let sondage = new Discord.MessageEmbed()
	.setTitle('Sondage')
	.setAuthor(message.author.username)
	.setDescription(msg.toString().replaceAll(","," ")+"\n\nVeuillez répondre à ce sondage par le biais de ces réacations :white_check_mark:  ou :negative_squared_cross_mark: ")
	.setTimestamp()
	.setFooter(footer);

	message.channel.send({embeds: [sondage]}).then(msg=> {
		msg.react('✅')
		msg.react('❎')
	})

}

});

client.login(token);
