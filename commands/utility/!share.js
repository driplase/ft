const { ContextMenuCommandBuilder } = require('discord.js');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, isTL, TLs, noWeb } = require('../../fn')
module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName(x('command.ltshare.name', 'en_us'))
		.setNameLocalizations({
			ja: x('command.ltshare.name', 'ja_jp')
		})
		.setType(3),
	async execute(interaction) {
		if (isTL(interaction.targetMessage.channel.id) > 0) {
			const mem = interaction.targetMessage.member, msg = interaction.targetMessage
			await interaction.reply({
				content: `${interaction.targetMessage.url}${(mem.user && mem?.roles?.cache?.has(noWeb)) || getStat(msg.author.id)?.roles?.includes(noWeb) ? '' : `\nhttps://share.treron.jp/${encodeURIComponent(interaction.targetMessage.author.tag)}/${interaction.targetMessage.id}`}`,
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: 'no :)',
				ephemeral: true
			})
		}
	},
};