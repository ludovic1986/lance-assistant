/* Auteur : Ludovic Pignat
  Date : 05.11.2021
  Description : Robot servant d'assistant à la lance
  Discord Version Compatibilité : V13
*/

// initation des variable de constantes
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const request = require('request');

//const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
 const client = new Client({ intents:  [Intents.FLAGS.GUILDS,
                                        Intents.FLAGS.GUILD_MESSAGES,
                                        Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
require('dotenv').config();
const token = process.env.TOKEN;
const applicationID = process.env.APPLICATION_ID ;


/* Lister les commandes discord */

const interactions = require("discord-slash-commands-client");
const interactionClient = new interactions.Client(token,applicationID);


/* TODO Ce sera pratique pour kamelott dans options pour le choix du personnage
choices: [
  {
    name: "name to display",
    value: "the actual value"
  },
  {
    name: "another option",
    value: "the other value"
  }
]
*/

interactionClient.createCommand({
    name: "kamelott",
    description: "Generation de citation kamelott aléatoire sans argument",
    options: {}
  })
  .catch(console.error)
  .then(console.log);


  interactionClient.createCommand({
      name: "sondage",
      description: "Création de sondage",
      options:[{ // très important de mettre les arguments dans le bon ordre !!!!!
            name: "sentence",
            description: "Question du sondage",
            type: 3,
            required: true

        }]

    })
    .catch(console.error)
    .then(console.log);
/**************/


/****************************/

// affichage d'un message dans la console quand le robot est démarré
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('interactionCreate', async interaction => {

  if(!interaction.isCommand()){
    console.log("bug with interaction")
    return ;
  }
  const { commandName, options} = interaction ;

  if (commandName === 'kamelott'){
    try {
      const axios = require('axios');
        citation =  await  axios('https://kaamelott.chaudie.re/api/random')
            .then(res => {
              const data = res.data.citation ;
              citation = data.citation +"("+data.infos.personnage+")";
              return citation ;
            })
            .catch(err => console.error(err));
     interaction.reply({
         content: citation + "("+interaction.user.username+")"
     })
} catch (error) {
    console.log('------------------------');
    console.log("Erreur avec kamelott");
    console.log(error);
    console.log('------------------------');
}

  }else if(commandName === 'sondage'){
    // https://discordjs.guide/additional-info/async-await.html#execution-with-discord-js-code
    // https://discordjs.guide/popular-topics/reactions.html#reacting-to-messages

    sentence = interaction.options.getString('sentence') ; // Argument de la question

    let pollEmbed = new Discord.MessageEmbed()
      .setTitle('Question')
      .setDescription(sentence +"\n\nVeuillez répondre à ce sondage par le biais de ces réacations :white_check_mark:  ou :negative_squared_cross_mark: ")
      .setAuthor(interaction.user.username)
      .setTimestamp()
      .setFooter("");

      try {

        const msg = await interaction.reply({ embeds: [pollEmbed] , fetchReply: true });
        await msg.react('✅');
        await msg.react('❎');

		} catch (error) {
      console.log('------------------------');
      console.log("Erreur avec le sondage");
      console.log(error);
      console.log('------------------------');
		}
  }else{
    console.log(commandName);
      interaction.reply({
          content: "Commande Invalide ",
          ephemeral:true
      })
  }

})
/*
client.on('messageCreate', message => {


  if (message.content === 'lance' || message.content === 'Lance') {
    message.channel.send("D'entremont !!!!");
  }

});*/


// Authentification du robot
client.login(token);
