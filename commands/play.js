const { useMainPlayer } = require("discord-player");
const {SlashCommandBuilder} = require ("discord.js");



module.exports = {
    //command registration
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play or enqueue song of choice!")
            .addStringOption( option =>
                option.setName("input")
                    .setDescription("the name of the song")
                    .setAutocomplete(true)
                    .setRequired(true)),
    
    /*
    //no idea what this does
    async autocomplete(interaction) {
        const query = interaction.options.getString("query");
        const result = await player.search(query);

        const tracks = result.tracks.slice(0,10).map((t) => ({
            name: t.author + " - " + t.title,
            value: t.url,
        }));
    }*/
    async run (interaction) {
        //console.log(interaction)
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply({ephemeral: true})

        const query = interaction.options.getString("query", true)
        const player = useMainPlayer();
        try{
            if (!interaction.member.voice.channel) {
                return interaction.followUp({
                    content: "You're not in a voice channel, buddy!",
                    ephemeral: true,
                });
            }
        await player;
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
        });
        console.log(interaction.user)

        if(!searchResult.hasTracks()) {
            return interaction.followUp(`We couldn't find tracks for ${query}!`)
        }

        const resume = await player.play(
            interaction.member.voice.channel.id,
            searchResult,
            {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        requestedBy: interaction.user,
                    },
                    bufferingTimeout: 15000,
                    leaveOnStop: true,
                    leaveOnStopCooldown: 5000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 15000,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    skipOnNoStream: true,
                },
            }
        );

        const message = resume.track.playlist
            ? `👍🏼| All **track(s)** from **${resume.track.playlist.title}** enqueued!`
            : `👍🏼| **${resume.track.author} - ${resume.track.title}** enqueued!`
        return interaction.editReply({ content: message });
        
        } catch (error) {
            console.error(error);
            return interaction.followUp({
                content: "An error occurred while trying to play the track",
                ephemeral: true,
            });
        }
    },
}