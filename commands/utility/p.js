const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('node:fs')
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('p')
		.setDescription('private thread thing, improved version')
		.addSubcommand(s => s.setName('quicksell')
							.setDescription('use this if you tired of making private threads by yourself')
							.addStringOption(o => o.setName('name')
												.setDescription('name.')
												.setRequired(true))
							.addIntegerOption(o => o.setName('price')
													.setDescription('if you don\'t specify a price, it\'ll be default to 200.')
													.setDescriptionLocalizations({
														ja: '値段を指定しなかった場合、デフォルトで200になります。'
													}))
							.addIntegerOption(o => o.setName('limit')
													.setDescription('limit how many users can buy your thread.')
													.setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.CreatePrivateThreads),
	async execute(interaction) {
		const sb = interaction.options.getSubcommand();
		if (sb === "quicksell") {
			try {
				await interaction.deferReply({
					ephemeral: true
				})
				const tn = interaction.options.getString('name'), price = interaction.options.getInteger('price') ?? 200, _ = []
				_[0] = interaction.options.getInteger('limit') ?? -1
				const l = _[0] > 0 ? _[0] : -1
				if (price >= 0) {
					interaction.channel.threads.create({
						name: tn,
						type: 12,
						AutoArchiveDuration: 60 * 24 * 100,
						reason: `quicksell requested by ${interaction.user.username}`
					}).then(async a => {
						const b = fs.readFileSync(`../${stp}/private.csv`).toString()
						if (/[^\n,"]+/g.test(tn)) {
							if (new RegExp(`^${tn},\\d+,\\d+,-?\\d+$`, 'gm').test(b)) {
								await interaction.editReply({
									content: 'Thread name already taken. Try using different name.',
									ephemeral: true
								})
							} else {
								fs.appendFileSync(`../${stp}/private.csv`, `${tn},${a.id},${price},${l}\n`)
								a.send({
									content: `<@${interaction.user.id}>`,
									allowedMentions: {
										users: [ interaction.user.id ]
									}
								}).then(async b => {
									await b.delete()
									await interaction.editReply({
										content: `Success! Created a private thread: <#${a.id}>`,
										ephemeral: true
									})
								})
							}
						} else {
							await interaction.editReply({
								content: "Invalid thread name for this command.\nTry using different name or use </pthread_sale:1277931827826528341> command instead.",
								ephemeral: true
							})
						}
					})
				} else {
					await interaction.editReply({
						content: 'Thread price mustn\'t be cheaper than 0.',
						ephemeral: true
					})
				}
			} catch (e) {
				console.error(e)
				await interaction.editReply({
					content: ix('repostSad'),
					ephemeral: true
				})
			}
		}
	},
};