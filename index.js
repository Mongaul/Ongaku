const {Client, Collection,  Events, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Permissions, ActivityType, GuildMember,} = require('discord.js');
const {Player, QueryType} = require ("discord-player");
require('dotenv').config();
const fs = require("node:fs");
const path = require("node:path");


//Bot getting onto Discord
const client = new Client({
    intents: [       
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if('data' in command && 'run' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.login(process.env.TOKEN);
//Bot Boot-up
client.once(Events.ClientReady, c => {
    console.log(`${c.user.username} is ready; よろこべ！`);
    client.user.setPresence({
        activities: [{name: 'Burning in Hell', type: ActivityType.Custom}],
        status: "online",
    })
})
client.on(Events.Error, console.error);
client.on(Events.Warning, console.warn);

//player section
const player = new Player(client);

//Extractor = controls sources of music; change for default source of add bridge sources
(async () => {
    //await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
    await player.extractors.loadDefault((ext) => ext == 'YouTubeExtractor');
    console.log("Fuck you");
})();

client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try{
        await command.run(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});















/*
client.on("messageCreate", async (message) =>{
    if(message.author.bot || !message.guild) return;
    if(!client.application?.owner) await client.application?.fetch();
});

//sets up the commands on the server== type !deploy
client.on("messageCreate", async (message) =>{
    if(message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
            {
                name: "play",
                description: "plays a song from not youtube for now",
                options: [
                    {
                    name: "query",
                    type: 3,
                    description: "the song you want to play",
                    required: true
                    }
                ]
            },
            {
                name: "skip",
                description: "Skip to the current song"
            },
            {
                name: "queue",
                description: "see the queue"
            },
            {
                name: "stop",
                description: "stop the player"
            },
        ]);
        await message.reply("Ongaku has deployed; よろこべ!");
    }
});




//error handling
player.on("error", (queue, error)=>{
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
})
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

//player events
player.events.on('playerStart', (queue, track) =>{
    queue.metadata.channel.send(`👌🏼| Started playing **${track.title}**!`)
})
player.events.on('audioTrackAdd', (queue, track) =>{
    queue.metadata.channel.send(`👍🏼| Track **${track.title}** queued!`)
})
player.events.on('audioTrackRemove', (queue, track) =>{
    queue.metadata.channel.send(`👍🏼| Track **${track.title}** removed!`)
})
player.events.on('audioTracksAdd', (queue, track) =>{
    queue.metadata.channel.send(`👍🏼| All tracks **${track.title}** queued!`)
})
player.events.on('audioTracksRemove', (queue, track) =>{
    queue.metadata.channel.send(`👍🏼| All tracks **${track.title}** removed!`)
})
player.events.on('playerSkip', (queue, track) =>{
    queue.metadata.channel.send(`👍🏼| Skipped **${track.title}**!`)
})
player.events.on('disconnect', (queue, track) =>{
	queue.metadata.channel.send(`🖕🏼| I was disconnected, FUCK YOU; clearing queue!`)
});
player.events.on('emptyChannel', (queue, track) =>{
    queue.metadata.channel.send(`😪| Nobody here; Ongaku sad; disconnecting!`)
});
player.events.on('emptyQueue', (queue, track) =>{
    queue.metadata.channel.send(`🖕| Queue Finished!`)
});

const {useMainPlayer} = require ('discord-player')
client.on("interactionCreate", async (interaction) =>{
    const player = useMainPlayer();
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('You are not connected to a voice channel!');
    const query = interaction.options.getString('query', true);
    await interaction.deferReply();

    if (interaction.commandName === "play") {
        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });
            return interaction.followUp(`**${track.title}** from ${track.url} **enqueued!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
});
*/