const { useQueue }  = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("next")
        .setDescription("skip current track; play the next song in the queue"),

    async run (interaction) {
        const queue = useQueue(interaction.guildId);

        if(!queue){
            return interaction.reply({
                content: "Ongaku is not in a voice channel",
                ephemeral: true,
            })
        }
        if(!queue.currentTrack) {
         return interaction.reply({
            content:"There is nothing currently playing",
            ephemeral: true
         });
        }
        queue.node.skip();
        const newQueue = useQueue(interaction.guildId);
        //fix content:
        return interaction.reply({
            content: `skipped ${queue.currentTrack.title};\n now playing **${queue.tracks.at(0).author} - ${queue.tracks.at(0).title}** from ${queue.tracks.at(0).url} **`,
            ephemeral: true
        })
    }
}