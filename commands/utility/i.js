const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('node:fs')
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, dws, genCode } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('i')
		.setDescription('who hates a single character with the shortest visual?')
		.addSubcommand(s => s.setName('cmremove')
							.setDescription('i.js')
							.addStringOption(o => o.setName('id')
												.setDescription('message id.')
												.setRequired(true)))
		.addSubcommand(s => s.setName('ux')
							.setDescription('verify unverified member.')
							.addUserOption(o => o.setName('target')
												.setDescription('target.')))
		.addSubcommand(s => s.setName('2ndembdm')
							.setDescription('send a embed message from second trijon')
							.addUserOption(o => o.setName('target')
												.setDescription('target.')
												.setRequired(true))
							.addStringOption(o => o.setName('title')
												.setDescription('embed title.')
												.setRequired(false))
							.addStringOption(o => o.setName('description')
												.setDescription('embed description.')
												.setRequired(false))
							.addIntegerOption(o => o.setName('color')
												.setDescription('0 ~ 16,777.215 (default: random)')
												.setRequired(false)))
		.addSubcommand(s => s.setName('setstreak')
							.setDescription('for streak extender who lost their streak \'cause of bot\'s bug')
							.addUserOption(o => o.setName('user')
												.setDescription('target.')
												.setRequired(true))
							.addIntegerOption(o => o.setName('amount')
													.setDescription('do not cheat, yeah?')
													.setRequired(true)))
		.addSubcommand(s => s.setName("gen")
							.setDescription('tjamk to your fans lase (only lase can run this)')
							.addStringOption(o => o.setName('type')
													.setDescription('Subscription type.')
													.addChoices(JSON.parse(fs.readFileSync('./data/subscriptions.json')))
													.setRequired(true)))
		.addSubcommand(s => s.setName('expire')
							.setDescription('ayy any mod can run this but did u ask lase to expire codes')
							.addStringOption(o => o.setName('code')
													.setDescription('a code, you know what i mean')
													.setRequired(true)))
		.addSubcommand(s => s.setName('setstat')
							.setDescription('hmmmmmm')
							.addUserOption(o => o.setName('user')
												.setDescription('i get userId from here')
												.setRequired(!0))
							.addStringOption(o => o.setName('key')
													.setDescription('a')
													.setRequired(!0))
							.addStringOption(o => o.setName('value')
													.setDescription('dont forget, i JSON.parse() this')
													.setRequired(!0)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const o5 = interaction.options, sb = o5.getSubcommand();
		switch (sb) {
			case "cmremove": {
				try {
					if (/\d+/.test(interaction.options.getString('id'))) {
						let cmCSV = fs.readFileSync(`../${stp}/cm.csv`).toString()
						cmCSV.replace(new RegExp(`${interaction.options.getString('id')},\\d+\n`), '')
						fs.writeFileSync(`../${stp}/cm.csv`, cmCSV)
						await interaction.reply({
							content: `deleted a cm! (\`${interaction.options.getString('id')}\`)`,
							ephemeral: true
						})
					}
				} catch (e) {
					console.error(e)
					await interaction.reply({
						content: ix('repostSad'),
						ephemeral: true
					})
				}
				return
			}
			case "ux": {
				try {
					await interaction.deferReply({
						ephemeral: true
					})
					const coinCSV = fs.readFileSync(`../${stp}/data.csv`).toString()
					if (new RegExp(`^${o5.getUser('target').id},-?\\d+$`, 'gm').test(coinCSV)) {
						await interaction.editReply({
							content: "user coin data found",
							ephemeral: true
						})
					} else {
						fs.appendFileSync(`../${stp}/data.csv`, `${o5.getUser('target').id},100`)
						const mem = await interaction.guild.members.cache.get(o5.getUser('target').id)
						mem.roles.add('1227622383100104705').then(async () => {
							await interaction.editReply({
								content: ix('rankZ'),
								ephemeral: true
							})
							const a = new EmbedBuilder().setTitle('/i ux')
										.setDescription(`<@${o5.getUser('target').id}>`)
										.setFooter({ text: `by ${interaction.user.username}` })
										.setColor(Math.round(Math.random()*16777215))
							await interaction.guild.channels.cache.get('1274655940343500901').send({
								embeds: [ a ]
							})
						})
					}
				} catch (e) {
					console.error(e)
					await interaction.editReply(ix('rankD'))
				}
				return
			}
			case "2ndembdm": {
				try {
					await interaction.deferReply({
						ephemeral: true
					})
					let col = o5.getInteger('color') ?? Math.round(Math.random()*16777215)
					col >= 0 && col <= 16777215 ? null : col = Math.round(Math.random()*16777215)
					const es = [new EmbedBuilder().setColor(col), new EmbedBuilder().setTitle(o5.getUser('target').id)]
					o5.getString('title') ? es[0].setTitle(o5.getString('title')) : null
					o5.getString('description') ? es[0].setDescription(o5.getString('description')) : null
					interaction.guild.channels.cache.get('1277136937869770752').send({
						embeds: es,
						content: "sendEmbedDM"
					}).then(async a => await interaction.editReply(ix('rankXP')))
				} catch (e) {
					console.error(e)
					await interaction.editReply({
						content: ix('repostSad'),
						ephemeral: true
					})
				}
				return
			}
			case "setstreak": {
				const target = o5.getUser('user'), streak = o5.getInteger('amount'), S = getStat(target.id);
				let D = new Date(); D.setHours(0); D.setMinutes(0); D.setSeconds(0); D.setMilliseconds(0);
				setStat(target.id, 'loginStreak', streak)
				setStat(target.id, 'lastLogin', D.getTime())
				if (S.longestStreak < streak) {
					setStat(target.id, 'longestStreak', streak)
				}
				await interaction.reply({
					ephemeral: true,
					content: `\`\`\`loginStreak: ${streak}\nlastLogin: ${D.getTime()}${S.longestStreak < streak ? `\nlongestStreak: ${streak}` : ""}\`\`\``
				})
				return
			}
			case "gen": {
				try {
					interaction.user.id === "959034815766728714" ? (async () => {
						const type = interaction.options.getString('type'), codes = JSON.parse(fs.readFileSync("./data/codes.json"))
						let q = 0, code;
						await interaction.deferReply({ ephemeral: true })
						while (!codes.find(i=>i.code===code) && q < 100) { code = genCode(), q++ }
						if (q <= 100) {
							codes.push({
								code: code, type: type
							})
							fs.writeFileSync('./data/codes.json', JSON.stringify(codes, null, 4))
							await interaction.editReply({
								ephemeral: true,
								embeds: [ new EmbedBuilder().setColor(Math.round(Math.random() * 16777215)).setDescription(`||\`\`\`${code}\`\`\`||`) ]
							})
						}
					})() : null
				} catch (e) {
					console.error(e)
				}
				return
			}
			case "expire": {
				try {
					const codes = JSON.parse(fs.readFileSync('./data/codes.json')), target = interaction.options.getString('code').toUpperCase(), pos = codes.findIndex(i=>i.code===target)
					if (pos > -1) {
						codes.splice(pos, 1)
						fs.writeFileSync('./data/codes.json', JSON.stringify(codes, null, 4))
						await interaction.reply({ content: "the code expired gg", ephemeral: true })
					} else {
						await interaction.reply({ content: "the code not found", ephemeral: true })
					}
				} catch (e) { console.error(e) }
				return
			}
			case "setstat": {
				if (interaction.user.id === 959034815766728714) {
					const options = interaction.options
					setStat(options.getUser('user').id, options.getString('key'), JSON.parse(options.getString('value')))
					await interaction.reply({
						content: "ok",
						ephemeral: !0
					})
					return
				}
			}
		}
	},
};