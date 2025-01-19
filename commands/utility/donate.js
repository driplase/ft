const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, lci } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Find out how you can donate to us.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('driplase')
                .setDescription('Find out how you can donate to driplase, First Treron Developer.'))
        /*.addSubcommand(subcommand =>
            subcommand
                .setName('light-treron')
                .setDescription('Find out how you can donate to us.'))*/
        .addSubcommand(subcommand =>
            subcommand
                .setName('arlgon')
                .setDescription('Find out how you can donate to arlgon, Second Treron Developer.')),
	async execute(interaction) {
        const m = interaction.member;
        const r = m.roles.cache;
        let lang = lci(interaction);
        if (interaction.options.getSubcommand() === 'driplase') {
            const em = new EmbedBuilder()
                .setAuthor({ name: x("command.donate.sen", lang).replace("<target>", "driplase") })
                .setDescription(`${x("command.donate.method", lang)}\n${x("command.donate.kyash", lang)}: @driplase\n${x('command.donate.amazon.wishlist', lang)} [amazon.jp](https://www.amazon.jp/hz/wishlist/ls/14D6K016V9YZU?ref_=wl_share)\n${x("command.donate.pixivFANBOX", lang)}: [@driplase](https://driplase.fanbox.cc)\n\n-# _${x("command.donate.comment", lang)}_`)
                .setFooter({ text: x("command.donate.footer", lang) })
                await interaction.reply({
                    embeds: [
                        em
                    ]
                })
        } else if (interaction.options.getSubcommand() === 'arlgon') {
            const a = JSON.parse(fs.readFileSync('./data/texts.json'))
            const em = new EmbedBuilder()
                .setAuthor({ name: x("command.donate.sen", lang).replace("<target>", "ArLgon") })
                .setDescription(`${x("command.donate.method", lang)}\n${x("command.donate.booth", lang)}: [ArLgon](https://arlgon.booth.pm/)${a.arlgonDonateComment ? `\n-# __${a.arlgonDonateComment}__  *- <@1039458282554806295>*` : ''}\n\n-# _${x("command.donate.comment", lang)}_`)
                .setFooter({ text: x("command.donate.footer", lang) })
                await interaction.reply({
                    embeds: [
                        em
                    ]
                })
        } else {
            await interaction.reply({
                content: "it's not functional yet",
                ephemeral: true
            });
        }
	},
};