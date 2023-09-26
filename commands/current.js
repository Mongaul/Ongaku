const { useQueue, useTimeline } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("current")
        .setDescription("Display current song + assoicated data in embed"),

    async run (interaction) {
    const queue = useQueue(interaction.guildId);
    const timeline = useTimeline(interaction.guildId);

    if (!queue)
      return interaction.reply({
        content: "Ongaku is not in a voice channel",
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: `Ongaku isn't playing anything`,
        ephemeral: true,
      });

    const track = queue.currentTrack;

    const requestedByString = track.requestedBy.username
      ? `${track.requestedBy.username}`: "Someone IDK";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("#ff9d00")
      .setThumbnail(track.thumbnail)
      .addFields([
        { name: "Now playing", value: track.title },
        { name: "Author", value: track.author },
        {
          name: "Progress",
          value: `${queue.node.createProgressBar()} (${
            timeline.timestamp.progress
          }%)`,
        },
      ])
      .setFooter({ text: `Song requested by ${requestedByString}` });

    return interaction.reply({ embeds: [embed] });
  },
};