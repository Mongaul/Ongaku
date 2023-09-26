const {useTimeline, useQueue} = require ("discord-player");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause/Unpause Ongaku"),

    async run (interaction) {
        const queue = useQueue(interaction.guildId);
        const timeLine = useTimeline(interaction.guildId);

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
        timeLine.paused ? timeLine.resume() : timeLine.pause();
        const state = timeLine.paused;
        return interaction.reply({
            content: `Ongaku has been **${state ? "paused" : "resumed"}**`
        })

    }
}