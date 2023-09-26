const {QueueRepeatMode, useQueue} = require ("discord-player");
const {SlashCommandBuilder} = require("discord.js");

const loopModes = [
    { name: "Off", value: QueueRepeatMode.OFF },
    { name: "Track", value: QueueRepeatMode.TRACK },
    { name: "Queue", value: QueueRepeatMode.QUEUE },
    //{ name: "Autoplay", value: QueueRepeatMode.AUTOPLAY },
  ];

module.exports = {
    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Enable/Disable loop of current song/queue")
        .addIntegerOption( option =>
            option.setName("mode")
                .setDescription("Loop option")
                .setRequired(true)
                .addChoices(
                    { name: "Off", value: QueueRepeatMode.OFF },
                    { name: "Track", value: QueueRepeatMode.TRACK },
                    { name: "Queue", value: QueueRepeatMode.QUEUE },
                    //{ name: "Autoplay", value: QueueRepeatMode.AUTOPLAY },
                )
        ),

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

        const modeName = interaction.options.getInteger("mode", true);

        if(modeName != 0 && modeName != 1 && modeName != 2 ){
            return interaction.reply({
                content: `Invalid loop mode: ${modeName}`,
                ephemeral: true,
            });
        }

        queue.setRepeatMode(modeName);

        return interaction.reply({
            content: `**${modeName === queue.repeatMode ? "Enabled" : "Disabled" } Loopmode: ${loopModes[modeName].name}**`
        })

    }
}