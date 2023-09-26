const {useHistory, useQueue} = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("play previous track in the queue"),

    async run (interaction) {
        const history = useHistory(interaction.guildId);
        const queue = useQueue(interaction.guildId);

        if(!queue){
            return interaction.reply({
                content: "Ongaku is not in a voice channel",
                ephemeral: true,
            })
        }
        if(!history.previousTrack){
            return interaction.reply({
                content: "no previous track to play",
                ephemeral: true,
            })
        }

        await history.previous();
        return interaction.reply({
            content: `replaying ${history.previousTrack.title} - ${history.previousTrack.author}`
        })
    }
}