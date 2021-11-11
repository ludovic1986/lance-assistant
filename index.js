/* Auteur : Ludovic Pignat
  Date : 05.11.2021
  Description : Robot servant d'assistant à la lance
*/

// initation des variable de constantes
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const request = require('request');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config();
const token = process.env.TOKEN;


// affichage d'un message dans la console quand le robot est fonctionnel
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// TODO A ameliorer
//
client.on('messageCreate', message => {
  if (message.content === 'lance') {
    message.channel.send("D'entremont !!!!");
  }


// Outil de sondage
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


// Citation de kamelott aleatoire
// source https://gitmemory.cn/repo/Kadaaran/api-kaamelott
// TODO donner la possibilité de choisir le personnage ou le livre mais pas tous de suite il y a apero
if(message.content.startsWith(prefix+ "kamelott")){
    citation = getCitation('https://kaamelott.chaudie.re/api/random');
    auteur = message.author.username ;
    message.delete(); // Supprime l'ancien message

    setTimeout(() => { message.channel.send(auteur+":\n"+ citation)}, 500); // mise en pause car javascript asynchrone
}

});

// Authentification du robot
client.login(token);


// fonction faisant via la methode httpget appel aux données json contenant les citations
function getCitation(theUrl)
{

  citation = request(theUrl, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    citation = "" ;
    if (parseInt(body.status) === 1) {
      citation += body.citation.citation + "("+body.citation.infos.personnage+")" ;
    }else{
        citation = "Erreur avec la commande";
    }

    return citation
  });
  return citation ;
}
