const { useQueue }  = require("discord-player");
const {SlashCommandBuilder} = require ("discord.js");

module.exports = {
    //command registration
    data: new SlashCommandBuilder()
        .setName("jump")
        .setDescription("Skip to chosen queue song index")
            .addIntegerOption( option =>
                option.setName("index")
                    .setDescription("Song's index in the queue")
                    .setRequired(true)),
    
    async run (interaction) {
        //console.log(interaction)
        if (!interaction.isChatInputCommand()) return;
        //await interaction.deferReply({ephemeral: true})
        await interaction.deferReply()

        const query = interaction.options.parseInt("index", true)
        const index = query-1
        const queue = useQueue(interaction.guildId);
        if(!queue){
            return interaction.reply({
                content: "Ongaku is not in a voice channel",
                ephemeral: true,
            })
        }
        if(!queue.queue.tracks.at(index)) {
            return interaction.reply({
               content:"There is no song at that queue index",
               ephemeral: true
            });
           }

        queue.node.skipTo(index);
        const newQueue = useQueue(interaction.guildId);
        //fix content:
        return interaction.reply({
            content: `skipped to ${index}\n; now playing:**${queue.tracks.at(index).author} - ${queue.tracks.at(index).title}** from ${queue.tracks.at(index).url} **`,
            ephemeral: true
        })
    },
}