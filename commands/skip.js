const { useQueue }  = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skip current track; play the next song in the queue")
        .addSubcommand(subcommand =>
            subcommand
                .setName('n')
                .setDescription('skip to next song')
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('to')
                .setDescription('skip to queue index position; will move songs it skips to the bottom of the queue')
                .addIntegerOption( option =>
                    option.setName("index")
                        .setDescription("Song's index in the queue")
                        .setMinValue(1)
                        .setRequired(true)
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
        if(queue.isEmpty()) {
            return interaction.reply({
                content:"There's nothing left in the queue",
                ephemeral: true
             });
        }
        if(queue.repeatMode === 1){
            queue.node.skip()
            return interaction.reply({
                content: `**Track Loop is enabled**;\n Replaying ${queue.currentTrack.author} - ${queue.currentTrack.title}\n `,
                ephemeral: true
            })
        }

        //subcommand
        if(interaction.options.getSubcommand() === 'to'){
            const query = interaction.options.getInteger("index", true)
            const index = query-1
            const message = `skipped ${index} songs;\n now playing **${queue.tracks.at(index).author} - ${queue.tracks.at(index).title}**`
            
            const end = queue.size-1
            if(queue.size>1){
                for(let i = 0; i <index; i++){
                    queue.node.move(queue.tracks.at(0), end)
                }
            }
            queue.node.skip()
            return interaction.reply({
                content: message,
                ephemeral: true
            })
        }
        else if (interaction.options.getSubcommand() === 'n'){
            queue.node.skip();
            return interaction.reply({
                content: `skipped:  **${queue.currentTrack.title}**;\n now playing:  **${queue.tracks.at(0).author} - ${queue.tracks.at(0).title}**`,
                ephemeral: true
            })
        }
    }
}