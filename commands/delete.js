const { useQueue }  = require("discord-player");
const {SlashCommandBuilder} = require ("discord.js");

module.exports = {
    //command registration
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("delete song at queue index position")
            .addIntegerOption( option =>
                option.setName("index")
                    .setDescription("Song's index in the queue")
                    .setRequired(true)),
    
    async run (interaction) {
        if (!interaction.isChatInputCommand()) return;

        const query = interaction.options.getInteger("index", true)
        const index = query-1
        const queue = useQueue(interaction.guildId);
        if(!queue){
            return interaction.reply({
                content: "Ongaku is not in a voice channel",
                ephemeral: true,
            })
        }
        if(!queue.tracks.at(index)) {
            return interaction.reply({
               content:"There is no song at that queue index",
               ephemeral: true
            });
        }
        
        const msg = `removed track ${query}: **${queue.tracks.at(index).author} - ${queue.tracks.at(index).title}** `
        queue.node.remove(queue.tracks.at(index));
        return interaction.reply({
            content: msg,
            ephemeral: true
        })
    },
}