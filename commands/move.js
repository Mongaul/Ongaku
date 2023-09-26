const { useQueue }  = require("discord-player");
const {SlashCommandBuilder} = require ("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move track to index position in queu")
        .addIntegerOption( option =>
            option.setName("song")
                .setDescription("index of song you want to move")
                .setMinValue(1)
                .setRequired(true))
        .addIntegerOption( option =>
            option.setName("index")
            .setDescription("index in the queue you want to move the song to")
            .setMinValue(1)
            .setRequired(true)),

    async run (interaction) {
        if (!interaction.isChatInputCommand()) return;
        const queue = useQueue(interaction.guildId);
        const querySong = interaction.options.getInteger("song", true);
        const queryIndex = interaction.options.getInteger("index", true);
        const song = querySong-1;
        const index = queryIndex -1;
        
        if(!queue){
            return interaction.reply({
                content: "Ongaku is not in a voice channel",
                ephemeral: true,
            })
        }
        if(!queue.tracks.at(song)||queryIndex>queue.getSize()) {
            return interaction.reply({
               content:"Invalid move: queue isn't big enough or you're moving a nonexistant song. **Fuck you.**",
               ephemeral: true
            });
        }
        if(querySong === queryIndex){
            return interaction.reply({
                content:"Invalid move: can't move song onto itself. **Fuck you.**",
                ephemeral: true
             });
        }
        const message = `moved **${queue.tracks.at(song).author} - ${queue.tracks.at(song).title}** to queue position: **${queryIndex}**`
        queue.node.move(queue.tracks.at(song), index)
        return interaction.reply({
            content: message,
            ephemeral: true
        })
    }
}