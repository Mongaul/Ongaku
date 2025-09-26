const { useQueue } = require("discord-player");
const {SlashCommandBuilder} = require ("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear the current queue while continuing current song"),

    async run (interaction) {
        const queue = useQueue(interaction.guildId);


        if(!queue)
        return interaction.reply({
            content: "Ongaku isn't in a voice channel, buddy!",
            ephemeral: true,
        });

        if(queue.tracks.size === 0) {
            return interaction.reply({
                content: `There is nothing in the queue to clear`,
                ephemeral: true,
            })
        }
        queue.tracks.clear();
        return interaction.reply({
            content: `The queue has been **cleared**`
        })
    }


}
