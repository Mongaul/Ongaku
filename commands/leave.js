const { useQueue } = require("discord-player");
const {SlashCommandBuilder} = require ("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Clear the queue and disconnect the bot!"),

    async run (interaction) {
        const queue = useQueue(interaction.guildId);

        if(!queue)
            return interaction.reply({
                content: "You're not in a voice channel, buddy!",
                ephemeral: true,
            });
        
        queue.delete();
        return interaction.reply({
            content: `| I was disconnected; clearing queue!`
        })
    }

}
