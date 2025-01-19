const { SlashCommandBuilder } = require('discord.js');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, lci } = require('../../fn')
const fs = require("fs")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('redeem')
		.setDescription('Redeem gift codes!! :D')
		.addStringOption(option => option.setName('code')
										.setDescription('Enter gift code here')
										.setRequired(true)),
	async execute(interaction) {
		try {
			let lang = lci(interaction)
			createStatFileIfItDoesntExists(interaction.user.id)
			const codes = JSON.parse(fs.readFileSync('./data/codes.json')), code = interaction.options.getString('code').toUpperCase(), pos = codes.findIndex(i=>i.code===code), target = interaction.member, sci = JSON.parse(fs.readFileSync('./data/subscriptions.json'))
			setStatIfDoesntExists(target.id, "subscription", {})
			const S = getStat(target.id), T = -1
			await interaction.deferReply({ ephemeral: true })
			if (/^([A-HJ-NP-Z1-9]{5}-){4}[A-HJ-NP-Z1-9]{5}$/.test(code)) {
				if (S.subscription?.n >= 1) {
					if (S.subscription.n > sci.find(i=>i.value===codes[pos].type).n) {
						T = 1
					}
				}
				if (T <= 0) {
					if (pos > -1) {
						const C = sci.find(i=>i.value===codes[pos].type)
						setStat(target.id, "subscription", C)
						codes.splice(pos, 1)
						fs.writeFileSync('./data/codes.json', JSON.stringify(codes, null, 4))
						await interaction.editReply({ content: x("command.redeem.success", lang).replace('<type>', C.name), ephemeral: true })
					} else {
						await interaction.editReply({ content: x("command.redeem.unusable", lang), ephemeral: true })
					}
				}
			} else {
				await interaction.editReply({
					content: x("command.redeem.invalid", lang),
					ephemeral: true
				})
			}
		} catch (e) { console.error(e) }
	},
};