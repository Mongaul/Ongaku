const { useQueue, useTimeline } = require("discord-player");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("set the volume for Ongaku")
        .addIntegerOption( option =>
            option.setName("level")
                .setDescription("Set volume level (0-100)")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)),

  async run(interaction) {
    const timeline = useTimeline(interaction.guildId);
    const queue = useQueue(interaction.guildId);
    const volume = interaction.options.getInteger("level");

    if (!queue)
      return interaction.reply({
        content:  "Ongaku is not in a voice channel",
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: "Ongaku isn't playing anything",
        ephemeral: true,
      });

    timeline.setVolume(volume);
    return interaction.reply({
      content: `Ongaku volume changed to: **${timeline.volume}%**`,
    });
  },
};