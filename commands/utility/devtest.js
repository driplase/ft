const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('devtest')
		.setDescription('only admins run this command.')
		.addSubcommand(s => s.setName('lang')
							.setDescription('lang select panel.'))
		.addSubcommand(s => s.setName('notify')
							.setDescription('dn select panel.'))
		.addSubcommand(s => s.setName('privacy')
							.setDescription('privacy setting panel. importatn yeah why not'))
		.addSubcommand(s => s.setName('arlgon_donatecomment')
							.setDescription('nah you guys cant use this except for arlgon')
							.addStringOption(o => o.setName('content')
												.setDescription('something.')
												.setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const sb = interaction.options.getSubcommand();
		if (sb === "lang") {
			const jab = new ButtonBuilder()
				.setCustomId("ja")
				.setLabel('日本語')
				.setStyle(ButtonStyle.Primary)
				.setEmoji('🇯🇵')
			const enb = new ButtonBuilder()
				.setCustomId("en")
				.setLabel('English')
				.setStyle(ButtonStyle.Primary)
				.setEmoji('🇺🇸')
			const r1 = new ActionRowBuilder()
				.addComponents(jab, enb)
			const cnt = new EmbedBuilder()
				.setTitle('言語 / Language')
				.setDescription('言語を選択 / Select a language.')
				.setColor(Math.round(Math.random() * 16777215))
			await interaction.channel.send({
				embeds: [ cnt ],
				components: [ r1 ]
			}).then(async () => {
				await interaction.reply({
					content: 'OK',
					ephemeral: true
				})
			})
		} else if (sb === "notify") {
			const yb = new ButtonBuilder()
				.setCustomId("yn")
				.setStyle(ButtonStyle.Success)
				.setEmoji('🔔')
			const fb = new ButtonBuilder()
				.setCustomId("fn")
				.setStyle(ButtonStyle.Danger)
				.setEmoji('🔕')
			const r1 = new ActionRowBuilder()
				.addComponents(yb, fb)
			const cnt = new EmbedBuilder()
				.setTitle('通知 / Notifications')
				.setDescription('-# 🇯🇵 日本語\n**🔔 - 通知オン\n🔕 - 通知オフ**\n\n-# 🇺🇸 English\n**🔔 - Enable notifications\n🔕 - Disable notifications**')
				.setColor(Math.round(Math.random() * 16777215))
			await interaction.channel.send({
				embeds: [ cnt ],
				components: [ r1 ]
			}).then(async () => {
				await interaction.reply({
					content: 'OK',
					ephemeral: true
				})
			})
		} else if (sb === "privacy") {
			const wb = new ButtonBuilder()
				.setCustomId("wb")
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🌐')
			const r1 = new ActionRowBuilder()
				.addComponents(wb)
			const cnt = new EmbedBuilder()
				.setTitle('プライバシー / Privacy')
				.setDescription('-# 🇯🇵 日本語\n**🌐 - ウェブに表示しない**\n\n-# 🇺🇸 English\n**🌐 - DO NOT SHOW MY POSTS ON WEBSITE**')
				.setColor(Math.round(Math.random() * 16777215))
			await interaction.channel.send({
				embeds: [ cnt ],
				components: [ r1 ]
			}).then(async () => {
				await interaction.reply({
					content: 'OK',
					ephemeral: true
				})
			})
		} else if (sb === "arlgon_donatecomment") {
			if (interaction.user.id === "1039458282554806295") {
				const a = JSON.parse(fs.readFileSync('./data/texts.json'))
				a.arlgonDonateComment = interaction.options.getString('content')
				fs.writeFileSync('./data/texts.json', JSON.stringify(a, null, 4))
			} else {
				await interaction.reply({
					content: '👎'
				})
			}
		}
	},
};