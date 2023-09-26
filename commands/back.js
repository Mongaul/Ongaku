const {useHistory, useQueue} = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("play first track in history; use /history to check history"),

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

        const msg = `replaying **${history.previousTrack.title} - ${history.previousTrack.author}**`
        await history.previous();
        return interaction.reply({
            content: msg,
            ephemeral: true
        })
    }
}