const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("shuffles the queue"),

    async run (interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue)
        return interaction.reply({
            content: "Ongaku is not in a voice channel",
            ephemeral: true,
        });

        if (queue.tracks.size < 2)
        return interaction.reply({
            content: `Not enough tracks in the queue to shuffle`,
            ephemeral: true,
        });

        queue.tracks.shuffle();
        return interaction.reply({
        content: `Ongaku has shuffled the queue`,
        });
    },
    };