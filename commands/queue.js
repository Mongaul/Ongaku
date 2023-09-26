const { useQueue }  = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Pull up a list of songs the that have been queued, but not played yet."),

    async run (interaction) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue)
        return interaction.reply({
          content: "Ongaku isn't in a voice channel, buddy!",
          ephemeral: true,
        });
        
        const formatTracks = queue.tracks.toArray();

        if(formatTracks.length === 0) {
            return interaction.reply({
                content: `There is nothing in the queue`,
                ephemeral: true,
            });
        }
        
        const tracks = formatTracks.map(
            (track, index) => `**${index+1}** [${track.title}](${track.url})`
        );

        const chunkSize = 10;
        const pages = Math.ceil(tracks.length/chunkSize);
        const embeds = []

        for(let i = 0; i < pages; i++){
            const start = i * chunkSize;
            const end = start + chunkSize;

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle ("Tracks in the Queue")
                .setDescription(
                    tracks.slice(start, end).join("\n") || "no queued songs"
                )
                .setFooter({
                    text: `Page ${i + 1} | Total ${queue.tracks.size} tracks`,
                });
            embeds.push(embed);
        }

        //this is what gets displayed first
        if (embeds.length ===1) {
            return interaction.reply({
                embeds:[embeds[0]],
            })
        }

        const prevButton = new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⬅️");

        const nextButton = new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("➡️");

        const row = new ActionRowBuilder()
            .addComponents(prevButton, nextButton);

        const message = await interaction.reply({
            embeds: [embeds[0]],
            components: [row],
            fetchReply: true,
            });
        
        let currentIndex = 0;
        const collector = message.createMessageComponentCollector({
            idle: 60000,
        });

        collector.on("collect", (i) => {
            i.deferUpdate();

            switch(i.customId){
                case "prev":
                    currentIndex = currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
                    break;
                case "next":
                    currentIndex = currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
                    break;
                    default: break;
            }

            message.edit({
                embeds: [embeds[currentIndex]],
                components: [row],
            });
        });

        collector.on("end", () => {
            message.edit({
                components: [],
            });
        });
    },
};
