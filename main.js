console.log('preparing...')

const { Client, Events, GatewayIntentBits, WebhookClient, EmbedBuilder, PresenceUpdateStatus, GuildMember, REST, Routes, Collection, AttachmentBuilder, Partials } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { tukyn } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path')
const { REPL_MODE_SLOPPY } = require('repl');
const yaml = require('js-yaml');
const os = require('os-utils');
const request = require("request");
const nodeHtmlToImage = require("node-html-to-image");
const wait = require('node:timers/promises').setTimeout;
require('dotenv').config();
const http = require('http')
const express = require('express');
const wapp = express(), shapp = express();
const cors = require('cors');
const exec = require('child_process').exec;
const iconv = require('iconv-lite')
const ffmpeg = require('fluent-ffmpeg')
const twemoji = require('twemoji')
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, dws, lci, toHiragana, mir, hash, isTL, TLs, noWeb, getBadges, migrateRepostFeaturePostDataFileFromFxxkingCSVToGodJSONWithJustASingleLineOfNodejsCodeSoUseThis } = require('./fn')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
	],
	partials: [
		Partials.Message, Partials.Channel, Partials.Reaction
	]
});

wapp.use(express.static(path.join(__dirname, 'htdocs')));
wapp.use(express.urlencoded({ extended: true }))
wapp.use(cors({ origin: true, credentials: true }));

wapp.get('/', (req, res) => {
  	res.status(200).send('i\'m okay for now.')
});

wapp.post('/', (req, res) => {
	console.log(req)
	res.send('Done');
})

wapp.listen(3728, () => {
  	console.log('Server running: ftweb (https://first.treron.jp/)');
});

shapp.use(cors({ origin: true, credentials: true }));
shapp.listen(19377, () => {
	console.log('Server running: share (https://share.treron.jp)')
})

// repost emoji id
const repostEmojiId = "1274321686338076775";
// like emoji id (e.g. heart)
const likeEmojiId = "1274996409048764490";
// bookmark emoji id
const bookmarkEmojiId = "1274996408012767341";
const tms = new Date().getTime();
// your bot's id
const clientId = "1062340451966914580";
// server id
const guildId = "1227213276576874558";

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const commands = [], gcmd = [];

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			file === "heart.js" ? gcmd.push(command.data.toJSON()) : commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const cc = [
	{
		name: "connect",
		description: "connect and set tts where voice channel you're currently in"
	},
	{
		name: "disconnect",
		description: "disconnect and stop tts"
	}
]
cc.forEach(i=>commands.push(i))

const rest = new REST().setToken(tukyn);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

(async () => {
	try {
		console.log(`Started refreshing ${gcmd.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: gcmd },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const safetySettings = [
	{
	  category: HarmCategory.HARM_CATEGORY_HARASSMENT,
	  threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
	},
	{
	  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
	  threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
	},
	{
	  category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
	  threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
	},
	{
	  category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
	  threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
];
  
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
  
const model = genAI.getGenerativeModel({
    // your google ai studio model id here
	model: "tunedModels/firstreron-v17-tfzuidmn1e36",
});
  
const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};
  
async function genAi(prq) {
	const chatSession = model.startChat({
	  	generationConfig,
		safetySettings: safetySettings,
		// safetySettings: Adjust safety settings
		// See https://ai.google.dev/gemini-api/docs/safety-settings
	  	history: [
	  	],
	});
  
	const result = await chatSession.sendMessage(prq);
	let o = await result.response.text();
	if (await o.length < 1) { o = "..." }
	return await o;
}

client.once(Events.ClientReady, async readyClient => {
	const ft = client.guilds.cache.get(guildId);
	ft.channels.cache.get('1227216489199960157').messages.fetch({ limit: 100 })
	let ltInvites = {};
	ltInvites = await ft.invites.fetch({ cache: false });
	const vcu = [], spn = [];
	let TTS = {}, connection, player;
	try {
		try {
			const f0 = JSON.parse(fs.readFileSync('./data/texts.json'));
			if (new Date().getTime() - f0.upped <= 36e5) {
				const t0 = setInterval(() => {
					const B = new EmbedBuilder().setColor(7506394)
						.setTitle('UP TIME')
						.setDescription('</dissoku up:828002256690610256> '.repeat(Math.round(Math.random() * 5 + 5)))
					ft.channels.cache.get('1275790994826334281').send({
						embeds: [B]
					}).then(() => {
						const F = JSON.parse(fs.readFileSync('./data/texts.json'))
						F.upped = null
						fs.writeFileSync('./data/texts.json', JSON.stringify(F, null, 4))
						clearInterval(t0)
					})
				}, 36e5 - new Date().getTime() + f0.upped)
			}
			if (new Date().getTime() - f0.bumped <= 72e5) {
				const t0 = setInterval(() => {
					const B = new EmbedBuilder().setColor(2406327)
						.setTitle('BUMP TIME')
						.setDescription('</bump:947088344167366698> '.repeat(Math.round(Math.random() * 5 + 5)))
					ft.channels.cache.get('1275790994826334281').send({
						embeds: [B]
					}).then(() => {
						const F = JSON.parse(fs.readFileSync('./data/texts.json'))
						F.bumped = null
						fs.writeFileSync('./data/texts.json', JSON.stringify(F, null, 4))
						clearInterval(t0)
					})
				}, 72e5 - new Date().getTime() + f0.bumped)
			}
			if (f0.TTS?.channelId) {
				connectTTS(f0.TTS.channelId)
			}
		} catch (e) {
			console.error(e)
		}
		function TTSUpdate(TTSJSON) {
			const _f = JSON.parse(fs.readFileSync('./data/texts.json'));
			TTS = TTSJSON, _f.TTS = TTSJSON
			fs.writeFileSync('./data/texts.json', JSON.stringify(_f, null, 4))
		}
		async function connectTTS(channelId) {
			connection = joinVoiceChannel({
				channelId: channelId,
				guildId: ft.id,
				adapterCreator: ft.voiceAdapterCreator,
			});
			player = createAudioPlayer();
			console.log('connected')
			TTS?.channelId !== channelId ? player.stop() : null
			connection.subscribe(player);
			TTSUpdate({
				channelId: channelId,
				tracks: [],
				np: -1
			})
			player.play(createAudioResource('./data/240msNone.wav'))
			player.on(AudioPlayerStatus.Idle, () => {
				try {
					console.log('idle')
					//if (TTS.tracks.length > TTS.np) {
						/*TTS.tracks[TTS.np]?fs.unlinkSync(TTS.tracks[TTS.np]).then(() => {
							TTS.tracks[TTS.np] = null
						}):null*/
						TTS.np++;
						TTSUpdate(TTS)
						TTS.tracks[TTS.np] ? player.play(createAudioResource(TTS.tracks[TTS.np])) : null
					//}
				} catch (e) {
					console.error(e)
				}
			})
			return true
		}
		client.on("interactionCreate", async interaction => {
			if (interaction.isChatInputCommand()) {
				const command = interaction.client.commands.get(interaction.commandName);
		
				if (!command) {
					switch (interaction.commandName) {
						case "connect": {
							await connectTTS(interaction.channel.id)
							return
						}
						case "disconnect": {
							try {
								player.stop()
								connection.destroy()
								connection = undefined, player = undefined
								TTSUpdate({})
							} catch (e) { console.error(e) }
							return
						}
						default: {
							console.error(`No command matching ${interaction.commandName} was found.`);
							return;
						}
					}
				}
			
				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					} else {
						await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			} else if (interaction.isAutocomplete()) {
				const command = interaction.client.commands.get(interaction.commandName);
		
				if (!command) {
					console.error(`No command matching ${interaction.commandName} was found.`);
					return;
				}
		
				try {
					await command.autocomplete(interaction);
				} catch (error) {
					console.error(error);
				}
			} else if (interaction.isButton()) {
				const langRoles = ['1275043743149326428', '1274696519538180096']
				if (interaction.customId === "ja") {
					const tr = interaction.member.roles.cache.map(i => i.id).filter(y => langRoles.includes(y));
					for (let E = 0; E < tr.length; E++) {
						interaction.member.roles.remove(tr[E]);
					}
					interaction.member.roles.add('1275043743149326428')
					const lang = lc(interaction.member)
					const re = new EmbedBuilder()
						.setTitle(x('panel.addRole', 'ja_JP'))
						.setDescription('<@&1275043743149326428>')
						.setColor(Math.round(Math.random() * 16777215))
					interaction.reply({
						embeds: [ re ],
						ephemeral: true
					})
				} else if (interaction.customId === "en") {
					const tr = interaction.member.roles.cache.map(i => i.id).filter(y => langRoles.includes(y));
					for (let E = 0; E < tr.length; E++) {
						interaction.member.roles.remove(tr[E]);
					}
					interaction.member.roles.add('1274696519538180096')
					const lang = lc(interaction.member)
					const re = new EmbedBuilder()
						.setTitle(x('panel.addRole', 'en_US'))
						.setDescription('<@&1274696519538180096>')
						.setColor(Math.round(Math.random() * 16777215))
					interaction.reply({
						embeds: [ re ],
						ephemeral: true
					})
				} else if (interaction.customId === "yn") {
					interaction.member.roles.remove('1274646925609795687');
					interaction.member.roles.add('1274646873889570887')
					const lang = lc(interaction.member)
					const re = new EmbedBuilder()
						.setTitle(x('panel.addRole', lang))
						.setDescription('<@&1274646873889570887>')
						.setColor(Math.round(Math.random() * 16777215))
					interaction.reply({
						embeds: [ re ],
						ephemeral: true
					})
				} else if (interaction.customId === "fn") {
					interaction.member.roles.remove('1274646873889570887');
					interaction.member.roles.add('1274646925609795687')
					const lang = lc(interaction.member)
					const re = new EmbedBuilder()
						.setTitle(x('panel.addRole', lang))
						.setDescription('<@&1274646925609795687>')
						.setColor(Math.round(Math.random() * 16777215))
					interaction.reply({
						embeds: [ re ],
						ephemeral: true
					})
				} else if (interaction.customId === "wb") {
					if (interaction.member.roles.cache.has('1286857846423556206')) {
						interaction.member.roles.remove('1286857846423556206');
						const lang = lc(interaction.member);
						const re = new EmbedBuilder()
							.setTitle(x('panel.removeRole', lang))
							.setDescription('<@&1286857846423556206>')
							.setColor(Math.round(Math.random() * 16777215))
						interaction.reply({
							embeds: [ re ],
							ephemeral: true
						})
					} else {
						interaction.member.roles.add('1286857846423556206');
						const lang = lc(interaction.member);
						const re = new EmbedBuilder()
							.setTitle(x('panel.addRole', lang))
							.setDescription('<@&1286857846423556206>')
							.setColor(Math.round(Math.random() * 16777215))
						interaction.reply({
							embeds: [ re ],
							ephemeral: true
						})
					}
				} else if (interaction.customId.startsWith('creq')) {
					if (interaction.message.interactionMetadata.user.id === interaction.user.id) {
						const S = getStat(interaction.user.id), lang = lci(interaction)
						if (new Date().getTime() - S.crts >= 30 * 1e3) {
							const requestId = parseInt(interaction.customId.replace(/^creq/, ''))
							const crqd = S.crq.find(i=>i.id===requestId), target = await interaction.guild.members.fetch(crqd.target);
							setStatIfDoesntExists(target.id, "coinRequests", [])
							const trgStat = getStat(target.id);
							const requestId2 = (trgStat.coinRequests?.sort((a,b)=>b.id-a.id)?.at(0)?.id ?? 0) + 1
							const requestData = {
								id: requestId2,
								user: target.id,
								amount: crqd.amount,
								rid: requestId,
								from: interaction.user.id,
								timestamp: new Date().getTime()
							}
							trgStat.coinRequests.push(requestData)
							setStat(target.id, 'coinRequests', trgStat.coinRequests)
							target.createDM()
							const trgLang = lc(target)
							const emb = new EmbedBuilder()
								.setAuthor({ name: interaction.user.username, iconURL: interaction.member.displayAvatarURL() })
								.setTitle(x("command.request.dm.coinRequest", trgLang))
								.setDescription(`${x('command.request.dm.requested', trgLang).replace('<user>', `<@${interaction.user.id}>`).replace('<coins>', crqd.amount.toLocaleString())}${crqd.message ? crqd.message.split('\n').map(i=>`\n-# *${i}*`).join('\n') : ''}`)
								.setColor(Math.round(Math.random()*16777215))
							await target.send({
								embeds: [emb],
								components: [
									{ type: 1, components: [
										{ type: 2, label: x("accept", trgLang), style: 3, custom_id: `cra${requestId2}` },
										{ type: 2, label: x("decline", trgLang), style: 4, custom_id: `crd${requestId2}` }
									] }
								]
							})
							crqd.status = "waiting"
							setStat(interaction.user.id, "crq", S.crq)
							await interaction.message.edit({
								embeds: [ new EmbedBuilder().setColor(8714888).setTitle(x("command.request.requestCompleted", lang)).setDescription(`-# ***${crqd.amount.toLocaleString()} <:coin:1284070241005080606>***`) ],
								components: [],
								content: ""
							})
							setStat(interaction.user.id, "crts", new Date().getTime())
						} else {
							await interaction.reply({
								content: `${x('coolingDown', lang)} (<t:${Math.round(S.crts/1e3+30)}:R>)`,
								ephemeral: true
							})
						}
					}
				} else if (interaction.customId.startsWith('crqx')) {
					if (interaction.message.interactionMetadata.user.id === interaction.user.id) {
						const requestId = parseInt(interaction.customId.replace(/^crqx/, ''))
						const S = getStat(interaction.user.id)
						S.crq.find(i=>i.id===requestId).status = "canceled"
						setStat(interaction.user.id, "crq", S.crq)
						await interaction.message.delete()
					}
				} else if (interaction.customId.startsWith('cra')) {
					const requestId = parseInt(interaction.customId.replace(/^cra/, ''))
					const S = getStat(interaction.user.id), requestData = S.coinRequests.find(i=>i.id===requestId), lang = lc(ft.members.cache.get(interaction.user.id)), requestor = await ft.members.fetch(requestData.from)
					const rqLang = lc(requestor);
					const rqStat = getStat(requestData.from), rqd = rqStat.crq.find(i=>i.id===requestData.rid)
					if (rqd.status === "waiting") {
						const ac = addCoin(interaction.user.id, -requestData.amount)
						if (ac) {
							await interaction.message.edit({
								embeds: [ new EmbedBuilder().setColor(0x63ffac).setTitle(x("command.request.dm.transferSuccess", lang)).setDescription(x("command.requested.dm.gave", lang).replace('<user>', `<@${requestor.id}>`).replace('<coins>', requestData.amount.toLocaleString())) ]
							})
							addCoin(requestor.id, requestData.amount)
							await requestor.createDM()
							await requestor.send({
								embeds: [ new EmbedBuilder().setColor(0x6d9dfc).setDescription(`${x("command.request.dm.accepted", rqLang).replace('<user>', `<@${interaction.user.id}>`)}\n-# ***${requestData.amount.toLocaleString()} <:coin:1284070241005080606>***\n-# *requestId: \`${requestor.id}:${requestData.rid},${interaction.user.id}:${requestData.id}\`*`).setTitle(x('command.request.accepted.title', rqLang)) ]
							})
							rqd.status = "accepted"
							setStat(requestor.id, 'crq', rqStat.crq)
							await interaction.update({
								components: []
							})
						} else {
							await interaction.reply({
								content: x("command.request.dm.notEnoughCoins", lang),
								ephemeral: true
							})
						}
					}
				} else if (interaction.customId.startsWith('crd')) {
					const requestId = parseInt(interaction.customId.replace(/^crd/, '')), S = getStat(interaction.user.id)
					await interaction.message.delete()
					const requestData = S.coinRequests.find(i=>i.id===requestId), requestor = await ft.members.fetch(requestData.from)
					const rqLang = lc(requestor);
					const rqStat = getStat(requestor.id), rqd = rqStat.crq.find(i=>i.id===requestData.rid)
					if (rqd.status === "waiting") {
						await requestor.createDM()
						await requestor.send({
							embeds: [ new EmbedBuilder().setColor(0xfc4e4e).setDescription(`${x("command.request.dm.declined", rqLang).replace('<user>', `<@${interaction.user.id}>`)}\n-# ***${requestData.amount.toLocaleString()} <:coin:1284070241005080606>***\n-# *requestId: \`${requestor.id}:${requestData.rid},${interaction.user.id}:${requestData.id}\`*`).setTitle(x('command.request.declined.title', rqLang)) ]
						})
						rqd.status = "declined"
						setStat(requestor.id, 'crq', rqStat.crq)
					}
				}
			} else if (interaction.isMessageContextMenuCommand()) {
				const command = interaction.client.commands.get(interaction.commandName);

				if (!command) {
					console.error(`No command matching ${interaction.commandName} was found.`);
					return;
				}
			
				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					} else {
						await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			}
		});

		sts();
		setInterval(sts, 60000);
		console.log(`${readyClient.user.tag}`);
		io('okay i woke up')
		try {
			wapp.get('/stats', async (req, res) => {
				//if (req.headers.authorization === `Digest ${process.env.STATS_HASHED_PW}`) {
					console.log(req.query.id)
					if (req.query.id) {
						const pth = path.join(__dirname, 'stats', `${req.query.id}.json`);
						if (fs.existsSync(pth)) {
							lyns(req.query.id)
							let st = JSON.parse(fs.readFileSync(pth));
							st.coins = getCoin(req.query.id), st.rank = getRank(req.query.id);
							const target = await ft.members.fetch(req.query.id);
							console.log(target)
							if (target.roles.cache.has('1276543473083875410')) {
								if (!st.badges.includes('ltsl')) {
									st.badges.push('ltsl')
								}
							}
							if (target.roles.cache.has('1276542660315844728')) {
								if (!st.badges.includes('ltsy')) {
									st.badges.push('ltsy')
								}
							}
							delete st.cghistory, delete st.roles, delete st.lastLogin, delete st.items, delete st.pendingInvite, delete st.lbBanned, delete st.crq, delete st.coinsRequests, delete st.crts;
							st = { "id": req.query.id, "name": target.displayName, "username": target.user.username, ... st}
							st.loginStreak = getLoginSteak(req.query.id)
							res.status(200).send(st);
						} else {
							res.status(404).send('Stats not found.')
						}
					} else {
						res.status(400).send('Invalid params.');
					}
				/*} else {
					res.status(401)
				}*/
			});

			shapp.get('/*', async (req, res) => {
				function htmlspecialchars(str){
					return (str + '').replace(/&/g,'&amp;')
						.replace(/"/g,'&quot;')
						.replace(/'/g,'&#x27;')
						.replace(/</g,'&lt;')
						.replace(/>/g,'&gt;');
						// .replace(/`/g,'&#x60;')
				}
		
				function markdown(str) {
					return str.replace(/^(?!\\)-# .+/gm, r => { return `<small>${r.slice(3, r.length)}</small>`; })
						.replace(/^(?!\\)### .+/gm, r => { return `<h3>${r.slice(4, r.length)}</h3>`; })
						.replace(/^(?!\\)## .+/gm, r => { return `<h2>${r.slice(3, r.length)}</h2>`; })
						.replace(/^(?!\\)# .+/gm, r => { return `<h1>${r.slice(2, r.length)}</h1>`; })
						.replace(/^\s*(?!\\)- .+/gm, r => { const lp = Math.floor((r.match(/^\s*-/)[0].length - 1) / 2); let c; if (lp > 0) { c = "list-style-type: circle;"; }; return `<li style="left: ${lp * 24}px;${c}">${r.replace((/^\s*- /), '')}</li>` })
						.replace(/^\s*(?!\\)\* .+/gm, r => { return `<li style="left: ${Math.floor((r.match(/^\s*\*/)[0].length - 1) / 2) * 24}px;">${r.replace((/^\s*\* /), '')}</li>` })
						.replace(/((?!\\)\*){2}[^\*]+\1{2}/g, r => { return `<strong>${r.slice(2, r.length - 2)}</strong>`; })
						.replace(/((?!\\)\*)[^\*]+\1/g, r => { return `<i>${r.slice(1, r.length - 1)}</i>`; })
						.replace(/((?!\\)_){2}[^_]+\1{2}/g, r => { return `<u>${r.slice(2, r.length - 2)}</u>`; })
						.replace(/((?!\\)_)[^_]+\1/g, r => { return `<i>${r.slice(1, r.length - 1)}</i>`; })
						.replace(/((?!\\)~){2}[^~]+\1{2}/g, r => { return `<del>${r.slice(2, r.length - 2)}</del>`; })
						.replace(/((?!\\)`){3}(?:[^`]|`(?!``))*\1{3}/g, r => {
								const wl = r.replace(/`/g, '');
								if (wl.split('\n').length < 2) {
									return `<code class="cb">${wl}</code>`;
								} else {
									if (wl.split('\n')[0] === "") {
										return `<code class="cb">${wl}</code>`;
									} else {
										console.log(wl.replace(/^.+\n/, ''))
										return `<pre><code class="language-${wl.split('\n')[0]} theme-dark cb">${wl.replace(/^.+\n/, '')}</code></pre>`;
									}
								}
							})
						.replace(/((?!\\)`){1,2}[^`]+\1{1,2}/g, r => { return `<code>${r.replace(/`/g, '')}</code>`; })
						.replace(/\n|\r/g, '<br>')
						.replace(/(<\/h[1-3]>|<\/li>)<br>/g, r => { return r.slice(0, 5); })
						.replace(/\|\|[^\|]+\|\|/g, r => { return `<span class="spoiler">${r.slice(2, r.length - 2)}</span>` })
						.replace(/https?:\/\/[\w.?=&#%~\/-]+/g, r => { return `<a href="${r}" target="_blank">${r}</a>` })
						.replace(/\\\W/g, r => r[1])
				}
		
				function customEmoji(str) {
					return str.replace(/&lt;a?:\S+:\d+&gt;/g, a => {
						return `<img src="https://cdn.discordapp.com/emojis/${a.match(/\d+/)[0]}" class="emoji">`;
					})
				}
				
				function mention(str) {
					return userMention(str)
				}
		
				function userMention(str) {
					return str.replace(/&lt;@!?\d+&gt;/g, r => {
						let m = u.find(d => d.id === r.replace('!', '').match(/\d+/)[0]).name;
						if (m === undefined) {
							m = r;
						}
						return `<span class="mention">@${m}</span>`;
					})
				}

				const u = req.url;
				if (/^\/([0-9a-z_.]{2,}|[^\/]+%23\d{4})\/\d+\/?$/i.test(u)) {
					try {
						const j = u.replace(/^\//, '').replace(/\/$/,'').split('/'), msgId = j[1], msg = await ft.channels.cache.get(TLs.default).messages.fetch(msgId).catch(async e => {
							return await ft.channels.cache.get(TLs.r18).messages.fetch(msgId)
						})
						const mem = await ft.members.fetch(msg.author.id).catch(async e => {
							if (e.code === 10007) {
								return msg.author;
							} else {
								console.error(e)
							}
						})
						if (j[0] !== encodeURIComponent(msg.author.tag)) {
							res.redirect(307, u.replace(new RegExp(`^/${j[0]}/`), `/${encodeURIComponent(msg.author.tag)}/`))
						} else {
							if ((mem.user && mem?.roles?.cache?.has(noWeb)) || getStat(msg.author.id)?.roles?.includes(noWeb)) {
								res.status(403).send('the author doesn\'t want to make their messages public.')
							} else {
								const rea = msg.reactions.cache
								let doc = fs.readFileSync('./data/templates/share.html').toString()
									.replace(/%content%/g, mention(customEmoji(markdown(htmlspecialchars(msg.content)))).replace(/\n/g, "<br>"))
									.replace(/%contentTitle%/g, msg.content)
									.replace(/%avatar%/g, mem.displayAvatarURL())
									.replace(/%username%/g, msg.author.tag)
									.replace(/%displayName%/g, `${mem.displayName}${await getBadges(mem.user.id, 4) ? customEmoji(htmlspecialchars(await getBadges(mem.user.id, 0))) : ""}`)
									.replace(/%displayNameTitle%/g, mem.displayName)
									.replace(/%avatarDecorationAsset%/, msg.author.avatarDecorationData?.asset ?? "")
									.replace(/%reactionHTML%/g, a => {
										let c = "";
										rea.each(i=>c+=`<div class="m3qko p7oMc"><img class="reactionEmoji" src="${i.emoji.id?`https://cdn.discordapp.com/emojis/${i.emoji.id}.webp?size=32&quality=lossless`:`https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${twemoji.convert.toCodePoint(i.emoji.name)}.png`}"><div class="reactionCount">${i.count}</div></div>`)
										return c
									});
								res.status(200).send(doc)
							}
						}
					} catch (e) {
						console.error(e)
						res.status(400).send('something went wrong...')
					}
				} else {
					res.status(200).send(fs.readFileSync('./data/web/share/default.html').toString())
				}
			})

			ft.channels.cache.get('1276129256547680309').messages.fetch('1276129798921523200');
			client.on('messageReactionAdd', async (reaction, user) => {
				try {
					console.log(`${reaction.message.id}, ${reaction.message.partial}`)
					if (!reaction.message.partial) {console.log(`${reaction.message.id}, ${reaction.message.content}, ${reaction.message.author.id}, ${reaction.message.member.id}`)}
					reaction.message.author.bot ? null : lyns(reaction.message.author.id)
					user.bot ? null : lyns(user.id)
				} catch (e) {
					er(e)
				}
				reaction.message.fetch()
				if (reaction.emoji.id === repostEmojiId || reaction.emoji.id === "1274325288498499689") {
					try {
						reaction.message.fetch().then(async msg => {
							console.log(msg)
						})
						if (!user.bot) {
							if (!fs.readFileSync('./data/bl.txt').toString().split('\r\n').includes(reaction.message.channelId)) {
								let reactionMessage = reaction.message
								const t = JSON.parse(fs.readFileSync('./data/ri.json')).find(i=>reaction.message.id===i.created)
								if (t) { reactionMessage = await reaction.message.channel.messages.fetch(t.target) }
								let lang = lc(reactionMessage.member);
								try {
									let repostCount;
									reactionMessage.fetch().then(async (message) => {
										repostCount = await message.reactions.cache.get(repostEmojiId).count ?? 1;
									})
									if (!reactionMessage.author.bot) {
										createStatFileIfItDoesntExists(reactionMessage.author.id)
										setStatIfDoesntExists(reactionMessage.author.id, "grepost", 0)
										let grepost = getStat(reactionMessage.author.id).grepost;
										grepost++;
										setStat(reactionMessage.author.id, "grepost", grepost)
										if (grepost === 1) {
											const doNotify = reactionMessage.member.roles.cache.has('1274646873889570887');
											unlockAchievement(reactionMessage.author.id, "1reposted", lang, doNotify, 50, "common");
										}
										if (grepost === 100) {
											const doNotify = reactionMessage.member.roles.cache.has('1274646873889570887');
											unlockAchievement(reactionMessage.author.id, "100reposted", lang, doNotify, 640, "uncommon");
										}
										addXP(reactionMessage.author.id, Math.floor(5 + (repostCount ?? 1) / 2))
									}
									let lang2 = lc(reactionMessage.guild.members.cache.get(user.id));
									if (!user.bot) {
										createStatFileIfItDoesntExists(user.id)
										setStatIfDoesntExists(user.id, "reposted", 0)
										let reposted = getStat(user.id).reposted;
										reposted++;
										setStat(user.id, "reposted", reposted)
										if (reposted === 1) {
											const doNotify = reactionMessage.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
											unlockAchievement(user.id, "1repost", lang2, doNotify, 20, "common");
										}
										if (reposted === 100) {
											const doNotify = reactionMessage.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
											unlockAchievement(user.id, "100repost", lang2, doNotify, 240, "uncommon");
										}
										addXP(user.id, Math.floor(3 + ((repostCount ?? 1) - 1) / 3))
									}
								} catch (e) {
									er(e);
								}
								console.log('Repost detected!');
								try {
									const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json')), s = getStat(user.id);
									let badgeslist = [], badgestring = "";
									for (let c = 0; c < s.badges.length; c++) {
										badgeslist.push(bl[s.badges[c]] ?? "❓")
									}
									if (ft.members.cache.get(user.id).roles.cache.has('1276543473083875410')) {
										if (!s.badges.includes('ltsl')) {
											badgeslist.push(bl.ltsl)
										}
									}
									if (ft.members.cache.get(user.id).roles.cache.has('1276542660315844728')) {
										if (!s.badges.includes('ltsy')) {
											badgeslist.push(bl.ltsy)
										}
									}
									if (badgeslist.length > 0) {
										badgestring = "";
										for (let j = 0; j < badgeslist.length; j++) {
											badgestring = `${badgestring} ${badgeslist[j]}`
											console.log(badgeslist[j])
										}
										badgestring = `${badgestring} `
									}
									for (let i = 0; i < 2; i++) {
										try {
											let whurl = cwe(reactionMessage.channelId);
											if (!whurl) {
												whurl = await cw(reactionMessage.channel);
											}
											let webhookClient;
											webhookClient = new WebhookClient({ url: whurl })
											const rci = reactionMessage.channelId;
											if (!reactionMessage.member) { reactionMessage.fetch() }
											let ma = reactionMessage?.member?.avatarURL(), ua = reactionMessage.author.displayAvatarURL(), C, R = `https://discord.com/channels/${reactionMessage.channel.guildId}/${rci}/${reactionMessage.id}`;
											const header = `-# ___ <:repost:${repostEmojiId}> ${x('post.reposted', lang).replace('<user>', `<@!${user.id}>${badgestring}`)}(${R}) / <t:${Math.round(reactionMessage.createdTimestamp / 1000)}:R> ___\n`;
											if ((header + reactionMessage.content).length <= 2000) {
												C = reactionMessage.content;
											} else {
												C = `${reactionMessage.content.slice(0, 199)}... [${x('post.showMore', lang)}](${R})`;
											}
											const rpc = reactionMessage.toJSON()
											rpc.content = `${header}${C}`
											rpc.avatarURL = ma ?? ua, rpc.username = suin(reactionMessage), rpc.allowedMentions = { parse: [] }, rpc.nonce = 8, rpc.attachments = reactionMessage.attachments
											console.log(rpc, rpc.attachments)
											webhookClient.send(rpc).then(msg => {
												reactionMessage.editedTimestamp ? webhookClient.editMessage(msg, msg) : null
												//fs.appendFileSync('./data/ri.txt', `${reactionMessage.id},${user.id}\n${msg.id}\n${reactionMessage.id}\n`);
												let ri = JSON.parse(fs.readFileSync('./data/ri.json'));
												if (fs.readFileSync('./data/ri.txt').toString()) { ri = ri.concat(migrateRepostFeaturePostDataFileFromFuckingCSVToGodJSONWithJustASingleLineOfNodejsCodeSoUseThis(fs.readFileSync('./data/ri.txt').toString())), fs.writeFileSync('./data/ri.txt', '') }
												ri.push({target:reactionMessage.id,reposter:user.id,created:msg.id})
												fs.writeFileSync('./data/ri.json', JSON.stringify(ri, null, 4))
											})
											if (reactionMessage.member.roles.cache.has('1274646873889570887') && reactionMessage.author.id !== user.id) {
												io(`notify accepted!\n${reactionMessage.author.username}`)
												reactionMessage.author.createDM();
												const nt = new EmbedBuilder()
													.setColor(0x00ffa9)
													.setTitle(x("notify.notifications", lang))
													.setDescription(`${x("notify.repost", lang).replace('<user>', `<@!${user.id}>`).replace('<link>', reactionMessage.url)}\n${reactionMessage.content.split('\n')[0]}`);
												reactionMessage.member.send({
													embeds: [
														nt
													]
												}).catch((e) => {er(e)})
											}
											break;
										} catch (e) {
											er(e);
											let wl = fs.readFileSync('./data/wht.txt').toString();
											wl.replace(`${reactionMessage.channelId}\n${whurl}\n`, '');
											await cw(reactionMessage.channel);
											continue;
										};
									}
								} catch (e) {
									er(e);
								}
							} else {
								io(`Repost requested in blacklisted channel! <#${reaction.message.channelId}>`)
							}
						}
					} catch (e) { er(e) }
				}
				if (reaction.emoji.id === likeEmojiId || reaction.emoji.id === "1274995055106723880") {
					try {
						if (!user.bot && !reaction.message.author.bot) {
							let lang = lc(reaction.message.member);
							try {
								let likeCount;
								if (!reaction.message.author.bot) {
									createStatFileIfItDoesntExists(reaction.message.author.id)
									setStatIfDoesntExists(reaction.message.author.id, "glike", 0)
									let glike = getStat(reaction.message.author.id).glike;
									glike++;
									setStat(reaction.message.author.id, "glike", glike)
									if (glike >= 1 && !getStat(reaction.message.author.id).achievements.includes('1liked')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "1liked", lang, doNotify, 50, "common");
									}
									if (glike >= 100 && !getStat(reaction.message.author.id).achievements.includes('100liked')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "100liked", lang, doNotify, 810, "uncommon");
									}
									if (glike >= 1000 && !getStat(reaction.message.author.id).achievements.includes('1kliked')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "1kliked", lang, doNotify, 1260, "uncommon");
									}
									reaction.message.fetch().then(async (message) => {
										likeCount = message.reactions.cache.get(likeEmojiId).count;
										if (likeCount === 12 && reaction.message.content.length === 1) {
											if (!reaction.message.author.bot) {
												let lang = lc(reaction.message.member);
												createStatFileIfItDoesntExists(reaction.message.author.id);
												if (!getStat(reaction.message.author.id).achievements.includes('1c12l')) {
													const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
													unlockAchievement(reaction.message.author.id, "1c12l", lang, doNotify, 1111, "godlike");
												}
											}
										}
									})
									addXP(reaction.message.author.id, 10 + (likeCount ?? 0))
								}
								let lang2 = lc(reaction.message.guild.members.cache.get(user.id));
								if (!user.bot) {
									createStatFileIfItDoesntExists(user.id)
									setStatIfDoesntExists(user.id, "liked", 0)
									let liked = getStat(user.id).liked;
									liked++;
									setStat(user.id, "liked", liked)
									if (liked >= 1 && !getStat(reaction.message.author.id).achievements.includes('1like')) {
										const doNotify = reaction.message.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
										unlockAchievement(user.id, "1like", lang2, doNotify, 30, "common");
									}
									if (liked >= 100 && !getStat(reaction.message.author.id).achievements.includes('100like')) {
										const doNotify = reaction.message.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
										unlockAchievement(user.id, "100like", lang2, doNotify, 320, "uncommon");
									}
									if (liked >= 1000 && !getStat(user.id).achievements.includes("1klike")) {
										const doNotify = reaction.message.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
										unlockAchievement(user.id, "1klike", lang2, doNotify, 640, "uncommon");
									}
									addXP(user.id, Math.floor(5 + (likeCount ?? 0) / 2))
								}
								if (!reaction.message.author.bot && !user.bot) {
									if (reaction.message.author.id === user.id) {
										createStatFileIfItDoesntExists(reaction.message.author.id);
										if (!getStat(reaction.message.author.id).achievements.includes('selflike')) {
											const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
											unlockAchievement(reaction.message.author.id, "selflike", lang, doNotify, 16, "uncommon");
										}
									}
								}
							} catch (e) {
								er(e);
							}
							
							try {
								const N = reaction.message.member.roles.cache.has('1274646873889570887') ?? getStat(reaction.message.author.id).roles.includes('1274646873889570887');
								if (N && reaction.message.author.id !== user.id) {
									io(`notify accepted!\n${reaction.message.author.username}`)
									reaction.message.author.createDM();
									const nt = new EmbedBuilder()
										.setColor(0xf91880)
										.setTitle(x("notify.notifications", lang))
										.setDescription(`${x("notify.like", lang).replace('<user>', `<@!${user.id}>`).replace('<link>',`https://discord.com/channels/${reaction.message.channel.guildId}/${reaction.message.channelId}/${reaction.message.id}`)}\n${reaction.message.content.split('\n')[0]}`);
									reaction.message.member.send({
										embeds: [
											nt
										]
									}).catch((e) => {
										er(e)
										er(reaction.message.author.username)
									})
								}
							} catch (e) {
								er(e)
							}
						}
					} catch (e) {
						er(e)
					}
				}
				if (reaction.emoji.id === bookmarkEmojiId) {
					try {
						if (!user.bot && !reaction.message.author.bot) {
							let lang = lc(reaction.message.member);
							try {
								if (!reaction.message.author.bot) {
									createStatFileIfItDoesntExists(reaction.message.author.id)
									setStatIfDoesntExists(reaction.message.author.id, "gbm", 0)
									let gbm = getStat(reaction.message.author.id).gbm;
									gbm++;
									setStat(reaction.message.author.id, "gbm", gbm)
									if (gbm >= 1 && !getStat(reaction.message.author.id).achievements.includes('1bmd')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "1bmd", lang, doNotify, 60, "common");
									}
								}
								let lang2 = lc(reaction.message.guild.members.cache.get(user.id));
								if (!user.bot) {
									createStatFileIfItDoesntExists(user.id)
									setStatIfDoesntExists(user.id, "bm", 0)
									let bm = getStat(user.id).bm;
									bm++;
									setStat(user.id, "bm", bm)
									if (bm >= 1 && !getStat(reaction.message.author.id).achievements.includes('1bm')) {
										const doNotify = reaction.message.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
										unlockAchievement(user.id, "1bm", lang2, doNotify, 30, "common");
									}
								}
							} catch (e) {
								er(e);
							}
							
							try {
								const N = reaction.message.member.roles.cache.has('1274646873889570887') ?? getStat(reaction.message.author.id).roles.includes('1274646873889570887');
								if (N && reaction.message.author.id !== user.id) {
									io(`notify accepted!\n${reaction.message.author.username}`)
									reaction.message.author.createDM();
									const nt = new EmbedBuilder()
										.setColor(0xf91880)
										.setTitle(x("notify.notifications", lang))
										.setDescription(`${x("notify.like", lang).replace('<user>', `<@!${user.id}>`).replace('<link>',`https://discord.com/channels/${reaction.message.channel.guildId}/${reaction.message.channelId}/${reaction.message.id}`)}\n${reaction.message.content.split('\n')[0]}`);
									reaction.message.member.send({
										embeds: [
											nt
										]
									}).catch((e) => {
										er(e)
										er(reaction.message.author.username)
									})
								}
							} catch (e) {
								er(e)
							}
						}
					} catch (e) {
						er(e)
					}
				}
				if (reaction.message.channelId === "1276129256547680309") {
					try {
						if (!user.bot) {
							let lang = lc(reaction.message.guild.members.cache.get(user.id));
							createStatFileIfItDoesntExists(user.id);
							if (!getStat(user.id).achievements.includes('work')) {
								const doNotify = reaction.message.guild.members.cache.get(user.id).roles.cache.has('1274646873889570887');
								unlockAchievement(user.id, "work", lang, doNotify, 1, "common");
							}
							addXP(user.id, 1 + getCoin(user.id) / 100);
						}
					} catch (e) {
						er(e);
					}
				}
				try {
					if (!reaction.message.author.bot) {
						createStatFileIfItDoesntExists(reaction.message.author.id)
						let likeCount, repostCount;
						reaction.message.fetch().then(async (message) => {
							wait(36);
							likeCount = await message.reactions.cache.get(likeEmojiId).count ?? 0;
							repostCount = await message.reactions.cache.get(repostEmojiId).count ?? 0;
							console.log(`${likeCount}, ${repostCount}`)
							if (likeCount === 1 && repostCount >= 5) {
								if (!reaction.message.author.bot) {
									let lang = lc(reaction.message.member);
									createStatFileIfItDoesntExists(reaction.message.author.id);
									if (!getStat(reaction.message.author.id).achievements.includes('0l5r')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "0l5r", lang, doNotify, 700, "epic");
									}
								}
							}
							if (likeCount === 1 && repostCount >= 16) {
								if (!reaction.message.author.bot) {
									let lang = lc(reaction.message.member);
									createStatFileIfItDoesntExists(reaction.message.author.id);
									if (!getStat(reaction.message.author.id).achievements.includes('0l16r')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "0l16r", lang, doNotify, 5000, "godlike");
									}
								}
							}
							if ((reaction.message.content === "にゃーん" || reaction.message.content.toLowerCase === "nyan") && repostCount >= 8) {
								if (!reaction.message.author.bot) {
									let lang = lc(reaction.message.member);
									createStatFileIfItDoesntExists(reaction.message.author.id);
									if (!getStat(reaction.message.author.id).achievements.includes('nyan8r')) {
										const doNotify = reaction.message.member.roles.cache.has('1274646873889570887');
										unlockAchievement(reaction.message.author.id, "nyan8r", lang, doNotify, 222, "godlike");
									}
								}
							}
						})
						const L = await reaction.message.fetch().then(async (T) => { return await T.member; });
						updateUserJSON(L ?? reaction.message.guild.members.cache.get(reaction.message.author.id));
						updateUserJSON(reaction.message.guild.members.cache.get(user.id));
					}
				} catch (e) {
					er(e)
				}
				try {
					if (!user.bot) {
						lgs(ft.members.cache.get(user.id))
					}
				} catch (e) {
					er(e);
				}
			})
	
			client.on('rateLimit', (rateLimitData) => {
				console.log(rateLimitData);
			});
	
			client.on('messageReactionRemove', async (reaction, user) => {
				if (reaction.emoji.id === repostEmojiId || reaction.emoji.id === "1274325288498499689") {
					try {
						io('removing a repost...')
						createStatFileIfItDoesntExists(reaction.message.author.id)
						setStatIfDoesntExists(reaction.message.author.id, "grepost", 0)
						let grepost = getStat(reaction.message.author.id).grepost;
						grepost--;
						setStat(reaction.message.author.id, "grepost", grepost)
						createStatFileIfItDoesntExists(user.id)
						setStatIfDoesntExists(user.id, "reposted", 0)
						let reposted = getStat(user.id).reposted;
						reposted--;
						setStat(user.id, "reposted", reposted)
						try {/*
							let k = fs.readFileSync('./data/ri.txt').toString().split('\n');
							if (k.includes(`${reaction.message.id},${user.id}`)) {
								const fm = await reaction.message.channel.messages.fetch(k[k.indexOf(`${reaction.message.id},${user.id}`) + 1]);
								fm.delete();
								let l = fs.readFileSync('./data/ri.txt').toString().replace(new RegExp(`${k[k.indexOf(`${reaction.message.id},${user.id}`)]}\n${k[k.indexOf(`${reaction.message.id},${user.id}`) + 1]}\n${k[k.indexOf(`${reaction.message.id},${user.id}`) + 2]}\n`, 'g'), "")
								fs.writeFileSync('./data/ri.txt', l);
								io(`a message (${k[k.indexOf(reaction.message.id) + 1]}) deleted.`)
							}*/
							const ri = JSON.parse(fs.readFileSync('./data/ri.json')), F = ri.findIndex(i=>i.target===reaction.message.id&&i.reposter===user.id)
							if (F >= 0) {
								(await reaction.message.channel.messages.fetch(ri[F].created)).delete().then(i=>io(`${i?.id} deleted.`))
								ri.splice(F,1),fs.writeFileSync('./data/ri.json', JSON.stringify(ri, null, 4))
							}
						} catch (e) {
							er(e);
						}	
					} catch (e) {
						er(e);
					}
				}
				reaction.message.author.bot ? null : lyns(reaction.message.author.id)
				user.bot ? null : lyns(user.id)
			});
	
			client.on('messageUpdate', async (om, nm) => {
				// io('a message updated. will add some features soon, maybe')
				if (nm.author.bot) {
					if (nm.author.id === "761562078095867916") {
						if (nm.interaction.commandName === "dissoku up") {
							const a = nm.embeds[0];
							if (a.color === 15158332) {
								io('huh upFail')
							} else if (a.color === 7506394) {
								io(`upSuccess!`)
								if (!nm.interaction.user.bot) {
									setStatIfDoesntExists(nm.interaction.user.id, 'up', 0)
									const S = getStat(nm.interaction.user.id)
									S.up++
									setStat(nm.interaction.user.id, 'up', S.up)
									addCoin(nm.interaction.user.id, Math.round(51 * Math.sqrt(S.up)) * 114)
								}
								const upper = await ft.members.fetch(nm.interaction.user.id), lang = lc(upper);
								const G = new EmbedBuilder().setColor(7506394)
									.setDescription(x('bump.notify', lang).replace('<time>', `<t:${Math.round(new Date().getTime()/1e3+3600)}:R>`))
								nm.channel.send({ embeds: [G] })
								const F = JSON.parse(fs.readFileSync('./data/texts.json'))
								F.upped = new Date().getTime()
								fs.writeFileSync('./texts.json', JSON.stringify(F, null, 4))
								const t0 = setInterval(() => {
									const B = new EmbedBuilder().setColor(7506394)
										.setTitle('UP TIME')
										.setDescription('</dissoku up:828002256690610256> '.repeat(Math.round(Math.random() * 5 + 5)))
									ft.channels.cache.get('1275790994826334281').send({
										embeds: [B]
									}).then(() => {
										const F = JSON.parse(fs.readFileSync('./data/texts.json'))
										F.upped = null
										fs.writeFileSync('./texts.json', JSON.stringify(F, null, 4))
										clearInterval(t0)
									})
								}, 36e5)
							}
						}
					} /*else if (nm.author.id === "302050872383242240") {
						if (nm.interaction.commandName === "bump") {
							const a = nm.embeds[0];
							if (a.color === 2406327) {
								io('bumpSuccess!')
								if (!nm.interaction.user.bot) {
									setStatIfDoesntExists(nm.interaction.user.id, 'bumped', 0)
									const S = getStat(nm.interaction.user.id)
									S.bumped++
									setStat(nm.interaction.user.id, 'bumped', S.bumped)
									addCoin(nm.interaction.user.id, Math.round(77 * Math.sqrt(S.bumped)))
								}
								const bumper = await ft.members.fetch(nm.interaction.user.id), lang = lc(bumper);
								const G = new EmbedBuilder().setColor(2406327)
									.setDescription(x('bump.notify', lang).replace('<time>', `<t:${Math.round(new Date().getTime()/1e3+7200)}:R>`))
								nm.channel.send({ embeds: [G] })
								const F = JSON.parse(fs.readFileSync('./data/texts.json'))
								F.bumped = new Date().getTime()
								fs.writeFileSync('./texts.json', JSON.stringify(F, null, 4))
								const t0 = setInterval(() => {
									const B = new EmbedBuilder().setColor(2406327)
										.setTitle('BUMP TIME')
										.setDescription('</bump:947088344167366698> '.repeat(Math.round(Math.random() * 5 + 5)))
									ft.channels.cache.get('1275790994826334281').send({
										embeds: [B]
									}).then(() => {
										const F = JSON.parse(fs.readFileSync('./data/texts.json'))
										F.bumped = null
										fs.writeFileSync('./texts.json', JSON.stringify(F, null, 4))
										clearInterval(t0)
									})
								}, 72e5)
							}
						}
					}*/
				}
			})
	
			client.on('messageCreate', async (message) => {
				if (!message.author.bot) {
					createStatFileIfItDoesntExists(message.author.id)
					setStatIfDoesntExists(message.author.id, "posts", 0)
					let posts = getStat(message.author.id).posts;
					message.type !== 7 ? posts++ : null;
					setStat(message.author.id, "posts", posts)
					if (posts >= 1 && !getStat(message.author.id).achievements.includes('1post')) {
						let lang = lc(message.member)
						const doNotify = message.member.roles.cache.has('1274646873889570887');
						unlockAchievement(message.author.id, "1post", lang, doNotify, 50, "common");
					}
					if (posts >= 100 && !getStat(message.author.id).achievements.includes('100post')) {
						let lang = lc(message.member)
						const doNotify = message.member.roles.cache.has('1274646873889570887');
						unlockAchievement(message.author.id, "100post", lang, doNotify, 90, "uncommon");
					}
					if (posts >= 500 && !getStat(message.author.id).achievements.includes('500post')) {
						let lang = lc(message.member)
						const doNotify = message.member.roles.cache.has('1274646873889570887');
						unlockAchievement(message.author.id, "500post", lang, doNotify, 180, "uncommon");
					}
					if (posts >= 1000 && !getStat(message.author.id).achievements.includes('1kpost')) {
						let lang = lc(message.member)
						const doNotify = message.member.roles.cache.has('1274646873889570887');
						unlockAchievement(message.author.id, "1kpost", lang, doNotify, 900, "uncommon");
					}
					let ct = new Date();
					ct.setTime(message.createdTimestamp);
					console.log(ct.getHours())
					if (ct.getHours() <= 3 || ct.getHours() >= 22) {
						try {
							let lang = lc(message.member);
							if (!message.author.bot && message.type !== 7) {
								createStatFileIfItDoesntExists(message.author.id);
								if (!getStat(message.author.id).achievements.includes('nocturnal')) {
									const doNotify = message.member.roles.cache.has('1274646873889570887');
									unlockAchievement(message.author.id, "nocturnal", lang, doNotify, 16, "uncommon");
								}
							}
						} catch (e) {
							er(e);
						}
					}
					addXP(message.author.id, Math.floor(5 + posts / 100))
					updateUserJSON(message.member);
					lgs(message.member);
					lyns(message.author.id)

					if (TTS?.channelId === message.channel.id) {
						async function aspouUTAUtalk(str, output) {
							return await new Promise(async rsv => {
								const utauDir = "./data/AsakazeTakuma_Tandokuv1"
								const otoData = parseOtoIni(path.join(utauDir, 'oto.ini'));
								const text = str;
								const voicevoxData = await fetch(`http://localhost:50021/audio_query?text=${encodeURIComponent(text)}&speaker=11`, { method: "POST" })
								const voicevoxJSON = await voicevoxData.json(), _if = [];
								for (let i in voicevoxJSON.accent_phrases) {
									const outputFilePath = `./data/utautts/ATTD/output/${output}_${i}.wav`;
									await synthesizeAudio(voicevoxJSON.accent_phrases[i].moras, otoData, outputFilePath, utauDir);
									_if.push(outputFilePath)
									console.log(`#${parseInt(i) + 1} audio saved at:`, outputFilePath);
								}
								const FFc = ffmpeg()
								_if.forEach(f=>FFc.input(f),FFc.input(`./data/750msNone.wav`))
								FFc.on('end', () => {
									console.log('Audio merge complete!')
									rsv(`./data/utautts/output/${output}.wav`)
								}).on('error', e => console.error(e))
									.mergeToFile(`./data/utautts/output/${output}.wav`)
								
								function parseOtoIni(filePath) {
								const otoIni = iconv.decode(fs.readFileSync(filePath), 'Shift_JIS').toString().split('\r\n').map(i => {
									const j = i.split(',');
									const k = {};
									k.name = j[0].split('=')[0];
									k.offset = parseFloat(j[1]);
									k.consonant = parseFloat(j[2]);
									k.cutOff = parseFloat(j[3]);
									k.preutter = parseFloat(j[4]);
									k.overlap = parseFloat(j[5]);
									return k;
								});
								return otoIni;
								}
								
								// 音素ごとの音声ファイルを取得する関数
								function textToAudioFiles(text, otoData) {
									const audioFiles = [];
									
									for (let char in text) {
										const c = "ぁぃぅぇぉゃゅょ".includes(text[parseInt(char)+1])?text.slice(char,parseInt(char)+2):text[char]
										const audioFile = otoData.find(data => data.name.startsWith(c));
										if (audioFile) {
											audioFiles.push(audioFile.name);
										}
									}
									
									return audioFiles;
								}
								
								// 音声ファイルを順番にカット＆結合する関数
								async function synthesizeAudio(text, otoData, outputFilePath, utauDir) {
									const tempDir = path.join(__dirname, "data", "utautts", "ATTD", 'temp');
									if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
									const actualText = toHiragana(text.map(i=>i.text).join(''));
									//console.log(actualText)
									const audioFiles = textToAudioFiles(actualText, otoData); // テキストから音声ファイルを取得
									const tempFiles = [];
									let q = 0;
									for (const [index, audioFileName] of audioFiles.entries()) {
										actualText[index+q]==="っ"?tempFiles.push(path.join(__dirname, "data", "240msNone.wav")):null
										const inputPath = path.join(utauDir, audioFileName); // UTAU音源のディレクトリにある音声ファイル
										const outputPath = path.join(tempDir, `${output}_${index}.wav`);
									
										// 音声ファイルの長さをミリ秒単位で取得
										const audioLength = await getAudioLength(inputPath);
										const playDuration = Math.max(Math.min((text[index].consonant_length + text[index].vowel_length) * 1500, Math.abs(audioLength + otoData.find(data => data.name === audioFileName).cutOff * 1.2)), 180) + -(Math.random() * 45 + 18) + (audioFiles.length-1===index) * 120; // カットオフを加算
									
										// 音声ファイルをカット＆保存
										await new Promise((resolve, reject) => {
										ffmpeg(inputPath)
											.setStartTime((otoData.find(data => data.name === audioFileName).offset) / 1000) // 開始位置（ミリ秒から秒に変換）
											.setDuration(playDuration / 1000) // 再生時間（ミリ秒から秒に変換）
											.audioFilters([
											`asetrate=${44100*Math.max(1, 1+(text[index].pitch-5)/3)}`,
											])
											.on('end', () => {
											//console.log(`Processed: ${audioFileName}`);
											tempFiles.push(outputPath);
											resolve();
											})
											.on('error', (err) => reject(err))
											.save(outputPath);
										});
										audioFileName.replace('.wav','').length >= 2 ? q++ : null
									}
									
									// 各音声ファイルを結合
									await new Promise((resolve, reject) => {
										const ffmpegCommand = ffmpeg();
									
										tempFiles.forEach(file => ffmpegCommand.input(file));
									
										ffmpegCommand
										.on('end', () => {
											console.log('Audio synthesis complete!');
											resolve();
										})
										.on('error', (err) => reject(err))
										.mergeToFile(outputFilePath, tempDir);
									});
									
									// 一時ファイルを削除
									tempFiles.forEach(file => file.includes(path.join(__dirname, "data", "utautts", "ATTD", 'temp'))?fs.unlinkSync(file):null);
									}
									
									// 音声ファイルの長さをミリ秒単位で取得する関数
									function getAudioLength(filePath) {
									return new Promise((resolve, reject) => {
										ffmpeg.ffprobe(filePath, (err, metadata) => {
										if (err) {
											reject(err);
										} else {
											const durationInSeconds = metadata.format.duration; // 秒単位で返される
											const durationInMilliseconds = durationInSeconds * 1000; // ミリ秒単位に変換
											resolve(durationInMilliseconds);
										}
										});
									});
								}
							})
						};
						const mrd = await mir(message.content), cont = mrd.length > 150 ? mrd.slice(0, 150) + "...以下省略" : mrd
						createStatFileIfItDoesntExists(message.author.id)
						setStatIfDoesntExists(message.author.id, "tts", null)
						if (getStat(message.author.id).tts === "AsakazeTakuma") {
							aspouUTAUtalk(cont, message.id).then(u => {
								console.log(cont)
								TTS.tracks.push(u)
								TTSUpdate(TTS)
								if (player.state.status === "idle") {
									console.log("idling now, trying to play a track")
									console.log(fs.existsSync(TTS.tracks[TTS.np]))
									TTS.tracks[TTS.np]?player.play(createAudioResource(TTS.tracks[TTS.np])):null
								}
							})
						}
						console.log(TTS.np)
						console.log(TTS.tracks, TTS.tracks[TTS.np])
					}
				} else {
					if (message.author.id === "302050872383242240") {
						if (message.interaction.commandName === "bump") {
							const a = message.embeds[0];
							if (a.color === 2406327) {
								io('bumpSuccess!')
								if (!message.interaction.user.bot) {
									setStatIfDoesntExists(message.interaction.user.id, 'bumped', 0)
									const S = getStat(message.interaction.user.id)
									S.bumped++
									setStat(message.interaction.user.id, 'bumped', S.bumped)
									addCoin(message.interaction.user.id, Math.round(38147 * Math.sqrt(S.bumped)))
								}
								const bumper = await ft.members.fetch(message.interaction.user.id), lang = lc(bumper);
								const G = new EmbedBuilder().setColor(2406327)
									.setDescription(x('bump.notify', lang).replace('<time>', `<t:${Math.round(new Date().getTime()/1e3+7200)}:R>`))
								message.channel.send({ embeds: [G] })
								const F = JSON.parse(fs.readFileSync('./data/texts.json'))
								F.bumped = new Date().getTime()
								fs.writeFileSync('./texts.json', JSON.stringify(F, null, 4))
								const t0 = setInterval(() => {
									const B = new EmbedBuilder().setColor(2406327)
										.setTitle('BUMP TIME')
										.setDescription('</bump:947088344167366698> '.repeat(Math.round(Math.random() * 5 + 5)))
									ft.channels.cache.get('1275790994826334281').send({
										embeds: [B]
									}).then(() => {
										const F = JSON.parse(fs.readFileSync('./data/texts.json'))
										F.bumped = null
										fs.writeFileSync('./texts.json', JSON.stringify(F, null, 4))
										clearInterval(t0)
									})
								}, 72e5)
							}
						}
					} else if (message.author.id === "761562078095867916") {
						if (message.interaction.commandName === "dissoku up") {
							console.log(await message)
						}
					}
				}
				if (message.content === "ft!info" && !message.author.bot) {
					message.channel.send({
						content: `Ping\\: ${client.ws.ping}ms`
					})
				}
				/*
				if (message.content.toLowerCase() === "3d6" && !message.author.bot) {
					try {
					let lang = lc(message.member);
						createStatFileIfItDoesntExists(message.author.id);
						if (!getStat(message.author.id).achievements.includes('3d6')) {
							const doNotify = message.member.roles.cache.has('1274646873889570887');
							unlockAchievement(message.author.id, "3d6", lang, true, i3d6(), "hidden");
						}
					} catch (e) {
						er(e);
					}
				}
				if (message.content.toLowerCase() === "1d100" || message.content.toLowerCase() === "d100") {
					try {
						if (!message.author.bot) {
							let lang = lc(message.member);
							createStatFileIfItDoesntExists(message.author.id);
							if (!getStat(message.author.id).achievements.includes('1d100')) {
								const doNotify = message.member.roles.cache.has('1274646873889570887');
								unlockAchievement(message.author.id, "1d100", lang, true, d100(), "hidden");
							}
						}
					} catch (e) {
						er(e);
					}
				}*/
				if (!message.author.bot) {
					if (message.member.roles.cache.has('1276543473083875410')) {
						let lang = lc(message.member);
						if (!message.author.bot) {
							createStatFileIfItDoesntExists(message.author.id);
							if (!getStat(message.author.id).achievements.includes('ltsl')) {
								const doNotify = message.member.roles.cache.has('1274646873889570887');
								unlockAchievement(message.author.id, "ltsl", lang, doNotify, 0, "common");
							}
						}
					}
					if (message.member.roles.cache.has('1276542660315844728')) {
						let lang = lc(message.member);
						if (!message.author.bot) {
							createStatFileIfItDoesntExists(message.author.id);
							if (!getStat(message.author.id).achievements.includes('ltsy')) {
								const doNotify = message.member.roles.cache.has('1274646873889570887');
								unlockAchievement(message.author.id, "ltsy", lang, doNotify, 800, "uncommon");
							}
						}
					}
					if (message.member.roles.cache.has('1275043743149326428')) {
						if (message.content.includes('アスピッピミシミシガメ') || message.content.includes('しゅくな')) {
							message.member.roles.remove('1275043743149326428');
							message.member.roles.add('1275649994384343153');
							message.react('<:jasp:1275651728074739762>');
						}
					}
					if (message.member.roles.cache.has('1275649994384343153')) {
						if (message.content.includes('アスピッピミシミシガメ') || message.content.includes('しゅくな')) {
							message.react('<:jasp:1275651728074739762>');
						}
					}
					if (message.content.includes('アスピッピミシミシガメ') || message.content.includes('しゅくな')) {
						try {
							let lang = lc(message.member);
							if (!message.author.bot) {
								createStatFileIfItDoesntExists(message.author.id);
								if (!getStat(message.author.id).achievements.includes('jasp')) {
									const doNotify = message.member.roles.cache.has('1274646873889570887');
									unlockAchievement(message.author.id, "jasp", lang, doNotify, 0, "hidden");
								}
							}
						} catch (e) {
							er(e);
						}
					}
					if (message.content.includes('j0.si')) {
						try {
							let lang = lc(message.member);
							if (!message.author.bot) {
								createStatFileIfItDoesntExists(message.author.id);
								if (!getStat(message.author.id).achievements.includes('j0si')) {
									const doNotify = message.member.roles.cache.has('1274646873889570887');
									j0siA(message.author.id, lang, doNotify)
								}
								addXP(message.author.id, 80);
							}
						} catch (e) {
							er(e);
						}
					}
					if (message.content && (message.author.id === "1062340451966914580" || !message.author.bot) && !message.member.roles.cache.has('1286857846423556206') && message.channel.id === "1227216489199960157") {
						let d = JSON.parse(fs.readFileSync('./htdocs/timeline/post.json'));
						let m = {
							"user": message.author.id,
							"content": message.content,
							"url": message.url,
							"timestamp": message.createdTimestamp
						}
						try {
							if (message.attachments) {
								if (message.attachments.first()?.contentType?.startsWith("image")) {
									m.attachment = message.attachments.first().proxyURL;
								}
							}
						} catch (e) {
							er(e)
						}
						d.push(m)
						if (d.length > 3) {
							d.splice(0, 1);
						}
						console.log(d)
						fs.writeFileSync('./htdocs/timeline/post.json', JSON.stringify(d, null, "\t"));
					}
				}
				if (message.channelId === "1277136937869770752") {
					if (message.author.bot && message.author.id === "1264422349537546241") {
						try {
							if (message.content.split('/')[0] === "send_notify") {
								let target = await message.guild.members.fetch(message.content.split('/')[1])
								target.createDM()
								await target.send({
									embeds: message.embeds
								});
							}
							if (message.content.split('/')[0] === "trend") {
								let target = await message.guild.members.fetch(message.content.split('/')[1]);
								try {
									let lang = lc(target);
									if (!target.user.bot) {
										createStatFileIfItDoesntExists(target.user.id);
										if (!getStat(target.user.id).achievements.includes('trend')) {
											const doNotify = target.roles.cache.has('1274646873889570887');
											unlockAchievement(target.user.id, "trend", lang, doNotify, 160, "common");
										}
										addXP(target.id, 50 * (1 + getStat(target.user.id).glike / 100))
									}
								} catch (e) {
									er(e);
								}
								const trendMsg = await ft.channels.cache.get('1227216489199960157').messages.fetch(message.content.split('/')[2]);
								console.log(trendMsg.content)
								if (trendMsg.content === undefined) {
									let lang = lc(target);
									if (!target.user.bot) {
										createStatFileIfItDoesntExists(target.user.id);
										if (!getStat(target.user.id).achievements.includes('nocontenttrend')) {
											const doNotify = target.roles.cache.has('1274646873889570887');
											unlockAchievement(target.user.id, "nocontenttrend", lang, doNotify, 240, "uncommon");
										}
									}
								}
								if (!target.user.bot && !target.roles.cache.has('1286857846423556206')) {
									let d = JSON.parse(fs.readFileSync('./htdocs/trend/post.json'));
									let m = {
										"user": target.user.id,
										"content": trendMsg.content,
										"url": trendMsg.url,
										"timestamp": trendMsg.createdTimestamp
									}
									try {
										if (trendMsg.attachments) {
											if (trendMsg.attachments.first().contentType?.startsWith("image")) {
												m.attachment = trendMsg.attachments.first().proxyURL;
											}
										}
									} catch (e) {
										er(e)
									}
									d.push(m)
									console.log(d)
									fs.writeFileSync('./htdocs/trend/post.json', JSON.stringify(d, null, "\t"));
								}
							}
							if (message.content.split('/')[0] === "gave") {
								try {
									let target1 = await ft.members.fetch(message.content.split('/')[1]), target2 = await ft.members.fetch(message.content.split('/')[2]);
									const amount = parseInt(message.content.split('/')[3]), remain = parseInt(message.content.split('/')[4]);
									try {
										let lang1 = lc(target1), lang2 = lc(target2);
										if (!target1.user.bot && !target2.user.bot) {
											createStatFileIfItDoesntExists(target1.user.id);
											if (!getStat(target1.user.id).achievements.includes('coinsend') && amount >= 1) {
												const doNotify = target1.roles.cache.has('1274646873889570887');
												unlockAchievement(target1.user.id, "coinsend", lang1, doNotify, 30, "common");
											}
											if (!getStat(target1.user.id).achievements.includes('500coinsend') && amount >= 500) {
												const doNotify = target1.roles.cache.has('1274646873889570887');
												unlockAchievement(target1.user.id, "500coinsend", lang1, doNotify, 240, "uncommon");
											}
											if (!getStat(target1.user.id).achievements.includes('5kcoinsend') && amount >= 5000) {
												const doNotify = target1.roles.cache.has('1274646873889570887');
												unlockAchievement(target1.user.id, "5kcoinsend", lang1, doNotify, 2000, "uncommon");
											}
											if (!getStat(target1.user.id).achievements.includes('allsend') && amount >= 1 && remain === 0) {
												const doNotify = target1.roles.cache.has('1274646873889570887');
												unlockAchievement(target1.user.id, "allsend", lang1, doNotify, 6400, "uncommon");
											}
											if (!getStat(target1.user.id).achievements.includes('10kcoinsend') && amount >= 10000) {
												const doNotify = target1.roles.cache.has('1274646873889570887');
												unlockAchievement(target1.user.id, "10kcoinsend", lang1, doNotify, 6000, "expert");
											}
											if (!getStat(target1.user.id).achievements.includes('sendaspoucoin') && amount >= 2413) {
												if (target2.user.id === "726636661441560636" || target2.user.id === "1160169683304058961" || target2.user.id === "743372806661865472" || target2.user.id === "1163793435396935721") {
													const doNotify = target1.roles.cache.has('1274646873889570887');
													unlockAchievement(target1.user.id, "sendaspoucoin", lang1, doNotify, 2413, "hidden");
												}
											}
											const X = fee(target1) * 100 + 100;
											if (!getStat(target1.user.id).achievements.includes('sendnicewithfee') && parseInt(amount * X / 100) === 69) {
												const doNotify = target1.roles.cache.has('1274646873889570887');
												unlockAchievement(target1.user.id, "sendnicewithfee", lang1, doNotify, 420, "hidden");
											}
										}
									} catch (e) {
										er(e)
									}
								} catch (e) {
									er(e);
								}
							}
							const h = message.content.split('/');
							if (h[0] === "cg") {
								const member = await ft.members.fetch(h[1]), role = ft.roles.cache.get(h[2]), rarity = h[3];
								const rl = ["normal", "rare", "superrare"], lang = lc(member);
								setStatIfDoesntExists(h[1], "cghistory", [])
								let S = getStat(h[1]);
								S.cghistory.push(h[2])
								if (!getStat(h[1]).achievements.includes('cgacha')) {
									const doNotify = member.roles.cache.has('1274646873889570887');
									unlockAchievement(h[1], "cgacha", lang, doNotify, 20, "common");
								}
								if (rarity === 1 && !getStat(h[1]).achievements.includes('rcr')) {
									const doNotify = member.roles.cache.has('1274646873889570887');
									unlockAchievement(h[1], "rcr", lang, doNotify, 827, "expert");
								}
								if (rarity === 2 && !getStat(h[1]).achievements.includes('scr')) {
									const doNotify = member.roles.cache.has('1274646873889570887');
									unlockAchievement(h[1], "scr", lang, doNotify, 5700, "legendary");
								}
								if (S.cghistory.length >= 3) {
									if (S.cghistory.slice(-3).every(l => l === S.cghistory[S.cghistory.length - 1])) {
										if (!getStat(h[1]).achievements.includes('cgacha3same')) {
											const doNotify = member.roles.cache.has('1274646873889570887');
											unlockAchievement(h[1], "cgacha3same", lang, doNotify, 3200, "epic");
										}
										if (S.cghistory.length >= 5 && S.cghistory.slice(-5).every(l => l === S.cghistory[S.cghistory.length - 1])) {
											if (!getStat(h[1]).achievements.includes('cgacha5same')) {
												const doNotify = member.roles.cache.has('1274646873889570887');
												unlockAchievement(h[1], "cgacha5same", lang, doNotify, 12000, "godlike");
											}
										}
									}
								}
								setStat(h[1], "cghistory", S.cghistory)
							}
							if (h[0] === "space") {
								const userId = h[1], member = await ft.members.fetch(userId), lang = lc(member), gc = ft.channels.cache.get(h[2]);
								setStatIfDoesntExists(userId, "spaced", 0)
								let spaced = getStat(userId).spaced;
								spaced++;
								setStat(userId, "spaced", spaced);
								if (spaced >= 1 && !getStat(h[1]).achievements.includes('1space')) {
									const doNotify = member.roles.cache.has('1274646873889570887');
									unlockAchievement(h[1], "1space", lang, doNotify, 72, "common");
								}
								if (spaced >= 10 && !getStat(h[1]).achievements.includes('10space')) {
									const doNotify = member.roles.cache.has('1274646873889570887');
									unlockAchievement(h[1], "10space", lang, doNotify, 720, "uncommon");
								}
								addXP(userId, Math.random() * (3 + spaced));
								if (lang !== 'ja_jp') {
									gc.setName(x('space.voice.title', lang).replace('<user>', uz(member.user.username, lang)))
								}
								spn.push({
									userId: userId,
									channelId: h[2],
									nmsg: h[3]
								})
							}
							if (h[0] === "c+") {
								const userId = h[1], member = await ft.members.fetch(userId), lang = lc(member)
								member.user.bot ? null : createStatFileIfItDoesntExists(userId)
								setStatIfDoesntExists(userId, 'coinsEarned', 0)
								setStatIfDoesntExists(userId, 'coinsSpent', 0)
								const stat = getStat(userId);
								h[2] >= 0 ? stat.coinsEarned += parseInt(h[2]) : stat.coinsSpent += parseInt(h[2])
								setStat(userId, 'coinsEarned', stat.coinsEarned)
								setStat(userId, 'coinsSpent', stat.coinsSpent)
								if (h[3] >= 10000 && !getStat(h[1]).achievements.includes('10kcoin')) {
									const doNotify = member.roles.cache.has('1274646873889570887');
									unlockAchievement(h[1], "10kcoin", lang, doNotify, 80, "uncommon");
								}
							}
							if (h[0] === "c-") {
								const userId = h[1], member = await ft.members.fetch(userId), lang = lc(member)
								member.user.bot ? null : createStatFileIfItDoesntExists(userId)
								setStatIfDoesntExists(userId, 'coinsEarned', 0)
								setStatIfDoesntExists(userId, 'coinsSpent', 0)
								const stat = getStat(userId);
								h[2] >= 0 ? stat.coinsSpent += parseInt(h[2]) : stat.coinsEarned += parseInt(h[2])
								setStat(userId, 'coinsEarned', stat.coinsEarned)
								setStat(userId, 'coinsSpent', stat.coinsSpent)
							}
						} catch (e) {
							er(e);
						}
					}
				}
				if (message.content.includes('<@&1282255512913707039>')) {
					try {
						console.log(message.reference)
						addXP(message.author.id, 18)
						if (message.reference) {
							const ch = client.channels.cache.get(message.reference.channelId);
							const rmg = ch.messages.cache.get(message.reference.messageId);
							const gn = randASCIIstring(12)
							let col = "filter:grayscale(1);";
							if (message.content.includes('color')) {
								col = col.replace('filter:grayscale(1);', "")
							}
							let f = "'Noto Sans JP', sans-serif";
							if (message.content.match(/font=\S+/i)) {
								f = qf(message.content.match(/font=\S+/i)[0].replace('font=', ''))
								console.log(f)
							}
							if (rmg.channelId === "1227216489199960157" || rmg.channelId === "1227231817346842635" || rmg.channelId === "1275051364975775744") {
								quote(rmg, gn, col, undefined, f)
							} else {
								message.reply({
									content: x('miaq.generating',lc(message.member)),
									allowedMentions: { parse: [] }
								}).then(async msg => {
									quote(rmg, gn, col, msg, f)
								})
							}
						} else {
							const rmg = await message.channel.messages.fetch(message.channelId);
							console.log(message.channel.messages.fetch(message.channelId))
							if (rmg) {
								const gn = randASCIIstring(12)
								let col = "filter:grayscale(1);";
								if (message.content.includes('color')) {
									col = col.replace('filter:grayscale(1);', "")
								}
								let f = "'Noto Sans JP', sans-serif";
								if (message.content.match(/font=\S+/i)) {
									f = qf(message.content.match(/font=\S+/i)[0].replace('font=', ''))
									console.log(f)
								}
								message.reply({
									content: "Generating..."
								}).then(async msg => {
									quote(rmg, gn, col, msg, f)
								})
							}
						}

						function quote(rmg, gn, col, msg, font) {
							const f = font ?? "'Noto Sans JP', sans-serif"
							function htmlspecialchars(str){
								return (str + '').replace(/&/g,'&amp;')
									.replace(/"/g,'&quot;')
									.replace(/'/g,'&#x27;')
									.replace(/</g,'&lt;')
									.replace(/>/g,'&gt;');
									// .replace(/`/g,'&#x60;')
							}
				
							function markdown(str) {
								return str.replace(/^-# .+/gm, r => { return `<span class="small">${r.slice(3, r.length)}</span>`; })
									.replace(/^### .+/gm, r => { return `<h3>${r.slice(4, r.length)}</h3>`; })
									.replace(/^## .+/gm, r => { return `<h2>${r.slice(3, r.length)}</h2>`; })
									.replace(/^# .+/gm, r => { return `<h1>${r.slice(2, r.length)}</h1>`; })
									.replace(/^\s*- .+/gm, r => { const lp = Math.floor((r.match(/^\s*-/)[0].length - 1) / 2); let c; if (lp > 0) { c = "list-style-type: circle;"; }; return `<li style="left: ${lp * 24}px;${c}">${r.replace((/^\s*- /), '')}</li>` })
									.replace(/^\s*\* .+/gm, r => { return `<li style="left: ${Math.floor((r.match(/^\s*\*/)[0].length - 1) / 2) * 24}px;">${r.replace((/^\s*\* /), '')}</li>` })
									.replace(/\*\*[^\*]+\*\*/g, r => { return `<strong>${r.slice(2, r.length - 2)}</strong>`; })
									.replace(/\*[^\*]+\*/g, r => { return `<i>${r.slice(1, r.length - 1)}</i>`; })
									.replace(/__[^_]+__/g, r => { return `<u>${r.slice(2, r.length - 2)}</u>`; })
									.replace(/_[^_]+_/g, r => { return `<i>${r.slice(1, r.length - 1)}</i>`; })
									.replace(/~~[^~]+~~/g, r => { return `<del>${r.slice(2, r.length - 2)}</del>`; })
									.replace(/```(?:[^`]|`(?!``))*```/g, r => {
											const wl = r.replace(/`/g, '');
											if (wl.split('\n').length < 2) {
												return `<code class="cb">${wl}</code>`;
											} else {
												if (wl.split('\n')[0] === "") {
													return `<code class="cb">${wl}</code>`;
												} else {
													console.log(wl.replace(/^.+\n/, ''))
													return `<pre><code class="language-${wl.split('\n')[0]} theme-dark cb">${wl.replace(/^.+\n/, '')}</code></pre>`;
												}
											}
										})
									.replace(/(`{1,2})[^`]+\1/g, r => { return `<code>${r.replace(/`/g, '')}</code>`; })
									.replace(/\n|\r/g, '<br>')
									.replace(/(<\/h[1-3]>|<\/li>)<br>/g, r => { return r.slice(0, 5); })
									.replace(/\|\|[^\|]+\|\|/g, r => { return `<span style="background-color:#1e1f22;border-radius:5px;box-shadow:0 0 1px;color:transparent;">${r.slice(2, r.length - 2)}</span>` })
							}
				
							function customEmoji(str) {
								return str.replace(/&lt;a?:\S+:\d+&gt;/g, a => {
									return `<img src="https://cdn.discordapp.com/emojis/${a.match(/\d+/)[0]}" class="emoji">`;
								})
							}

							function mention(str) {
								return str.replace(/&lt;@!?[^&]\d+&gt;/g, r => {
									const m = ft.members.cache.get(r.match(/\d+/)[0])
									const t = m ? `@${m.displayName}` : `&lt;@${r.match(/\d+/)[0]}&gt;`;
									return `<span class="mention">${t}</span>`
								})
							}

							nodeHtmlToImage({
								output: `./data/miaq/${gn}.png`,
								html: `<html style="width:1200px;height:630px;overflow:hidden;"><head><link rel="stylesheet" href="./htdocs/trend/dhljt.css"><style>.small {font-size: 12px;color: gray;}h1, h2, h3 {line-height: 36px;margin-top: 0px;margin-bottom: 8px;}li {position: relative;}code {padding: 0 .2em;background-color: #2b2d30;border: solid #1e1f22 1px;border-radius: 4px;font-family: 'Consolas', 'Ubuntu Mono', monospace;}code.cb {padding: 5px;display: block;width: 100%;margin: 10px 0;margin-bottom: 3px;}pre {background-color: #2b2d30;width: 100%;margin: 0;}img.emoji {height: 1em;width: 1em;margin: 0 .05em 0 .1em;vertical-align: -0.1em;}.mention{background-color:#3c4270;color:#c9cdfb;padding:0 3px;border-radius:8px;transition:.15s ease-out;z-index:2}</style><script src="https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js" crossorigin="anonymous"></script></head><body style="margin:0;width:1200px;height:630px"><div style="background-color:#000;width:1200px;height:630px"><img src="${rmg.member.avatarURL({ size: 1024 }) ?? rmg.author.displayAvatarURL({ size: 1024 })}" style="width:630px;height:630px;transform:translateX(-64px);${col}"><div style="background: linear-gradient(90deg, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%);width:480px;height:630px;transform:translate(90px,-100%)"></div><div style="color:#fff;transform:translate(640px,-970px);width:512px;height:630px;position:absolute;margin:0;font-family:${f};text-align:center;display:inline-block;"><div style="display:inline-block;top:50%;transform:translate(0,-50%);"></div><div style="transform:translateY(-50%)"><p style="font-size:40px;overflow-wrap:break-word;font-family:${font}", id="content">${mention(customEmoji(markdown(htmlspecialchars(rmg.content))))}</p><p style="transform:translateY(-42px);font-size:20px;font-style:italic;font-weight:300;font-family:'Noto Sans JP', sans-serif" id="nm">- ${rmg.member.displayName}<br><span style="font-size:12px;color:#9f9f9f;font-weight:500;">@${rmg.author.username}</span></p></div></div></div><p style="font-size:14px;color:#8e8e8e;transform:translate(-10px,-40px);text-align:right;font-family:'Segoe UI',sans-serif">First Treron#4506, driplase</p></div><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script><script>twemoji.parse(document.getElementById('content'));twemoji.parse(document.getElementById('nm'));hljs.highlightAll();</script></body></html>`,
								transparent: true,
                				waitUntil: "load"
							}).then(async () => {
								if (msg) {
									console.log("IMG_GEN_SUCCESS")
									const i = await new AttachmentBuilder()
										.setName("miaq.png")
										.setFile(`./data/miaq/${gn}.png`)
									await msg.edit({
										files: [i],
										content: ""
									}).then(() => fs.unlinkSync(`./data/miaq/${gn}.png`));
								} else {
									console.log("IMG_GEN_SUCCESS")
									const i = await new AttachmentBuilder()
										.setName("miaq.png")
										.setFile(`./data/miaq/${gn}.png`)
									if (isTL(rmg.channelId)) {
										if (rmg.hasThread) {
											await rmg.thread.send({
												files: [i],
												content: ""
											}).then(() => fs.unlinkSync(`./data/miaq/${gn}.png`));
										} else {

										}
									} else {
										await rmg.reply({
											files: [i],
											content: ""
										}).then(() => fs.unlinkSync(`./data/miaq/${gn}.png`));	
									}
									
								}
								
							});
						}

						function qf(p) {
							const s = p.toLowerCase();
							if (s.match(/^notosans(jp|japanese)$/)) {
								return "'Noto Sans JP', sans-serif";
							} else if (s.match(/^notoserif(jp|japanese)$/)) {
								return "'Noto Serif JP', serif";
							} else if (s === "hachimarupop" || s === "hmp") {
								return "'Hachi Maru pop'";
							} else if (s === "consolas" || s === "monospace") {
								return "Consolas, monospace";
							} else if (s === "inconsolata") {
								return "Inconsolata";
							} else if (s === "eclyera") {
								return "Eclyera";
							} else if (s === "opensans") {
								return "'Open Sans', sans-serif";
							} else if (s === "ubuntu") {
								return "Ubuntu";
							} else if (s === "mplus1p" || s === "mp1") {
								return "'M PLUS 1p'";
							} else if (s === "mplusrounded1c" || s === "mpr1") {
								return "Rounded Mplus 1c'";
							} else {
								return "'Noto Sans JP', sans-serif";
							}
						}
						
					} catch (e) {
						er(e)
					}
				}
				if (message.mentions.users.has('1062340451966914580') || message.channelId === "1287434176945197099") {
					if (!message.content.match(/block(_|\\_)ai/gi) && message.author.id !== "1062340451966914580" ) {
						genAiReply(message.content.replace('<@1062340451966914580>', ''), message)
					}
				}
				if (!message.author.bot) {
					createStatFileIfItDoesntExists(message.author.id)
					setStatIfDoesntExists(message.author.id, "achievements", [])
					if (message.member.roles.cache.has('1227622383100104705') && !getStat(message.author.id).achievements.includes('beginning')) {
						let lang = lc(message.member)
						const doNotify = message.member.roles.cache.has('1274646873889570887');
						unlockAchievement(message.author.id, "beginning", lang, doNotify, 0, "common");
					}
				}
				if (!message.author.bot) {
					if (message.member.roles.cache.has('1276106622673879050')) {
						let lang = lc(message.member);
						createStatFileIfItDoesntExists(message.author.id);
						if (!getStat(message.member.user.id).achievements.includes('rainbow')) {
							const doNotify = message.member.roles.cache.has('1274646873889570887');
							unlockAchievement(message.author.id, "rainbow", lang, doNotify, 320, "legendary");
						}
					}
					if (message.member.roles.cache.has('1276096908242190407')) {
						let lang = lc(message.member);
						createStatFileIfItDoesntExists(message.author.id);
						if (!getStat(message.author.id).achievements.includes('unsightreadable')) {
							const doNotify = message.member.roles.cache.has('1274646873889570887');
							unlockAchievement(message.author.id, "unsightreadable", lang, doNotify, 320, "legendary");
						}
					}
				}
			})
	
			client.on('messageDelete', async (message) => {
				try {
					try {
						if (!message.author.bot) {
							createStatFileIfItDoesntExists(message.author.id)
							setStatIfDoesntExists(message.author.id, "posts", 0)
							let posts = getStat(message.author.id).posts;
							posts--;
							setStat(message.author.id, "posts", posts)
							lyns(message.author.id)
						}
					} catch (e) {
						er(e)
					}
					let k = fs.readFileSync('./data/ri.txt').toString().split('\n');
					while (k.includes(message.id)) {
						if (k[k.indexOf(message.id) - 2].includes(',') && !message.author.bot) {
							const fm = await message.channel.messages.fetch(k[k.indexOf(message.id) - 1]);
							fm.delete();
							k = fs.readFileSync('./data/ri.txt').toString().replace(new RegExp(`${k[k.indexOf(message.id) - 2]}\n${k[k.indexOf(message.id) - 1]}\n${k[k.indexOf(message.id)]}\n`, 'g'), "")
							fs.writeFileSync('./data/ri.txt', k);
						}
					}
				} catch (e) {
					er(e)
				}
			});
	
			client.on('guildMemberUpdate', (om, nm) => {
				if (!nm.user.bot) {
					setStat(nm.user.id, "roles", nm.roles.cache.map(r => r.id));
					lyns(nm.user.id)
				}
				if (om.roles.cache.has('1275649994384343153')) {
					const nr = nm.roles.cache;
					console.log(nr.has('1275043743149326428') || nr.has('1274696519538180096'))
					if (nr.has('1275043743149326428') || nr.has('1274696519538180096')) {
						nm.roles.remove('1275649994384343153');
					}
				}
				if (!om.roles.cache.has('1227622383100104705')) {
					const nr = nm.roles.cache;
					if (nr.has('1227622383100104705')) {
						try {
							if (!nm.user.bot) {
							}
						} catch (e) {
							er(e)
						}
						setStatIfDoesntExists(nm.user.id, "achievements", [])
						let lang = lc(nm)
						if (!getStat(nm.user.id).achievements.includes('beginning')) {
							const doNotify = nm.roles.cache.has('1274646873889570887');
							unlockAchievement(nm.user.id, "beginning", lang, doNotify, 0, "common");
						}
					}
				}
				if (nm.roles.cache.has('1276543473083875410')) {
					let lang = lc(nm);
					if (!nm.user.bot) {
						createStatFileIfItDoesntExists(nm.user.id);
						if (!getStat(nm.user.id).achievements.includes('ltsl')) {
							const doNotify = nm.roles.cache.has('1274646873889570887');
							unlockAchievement(nm.user.id, "ltsl", lang, doNotify, 0, "common");
						}
					}
				}
				if (nm.roles.cache.has('1276542660315844728')) {
					let lang = lc(nm);
					if (!nm.user.bot) {
						createStatFileIfItDoesntExists(nm.user.id);
						if (!getStat(nm.user.id).achievements.includes('ltsy')) {
							const doNotify = nm.roles.cache.has('1274646873889570887');
							unlockAchievement(nm.user.id, "ltsy", lang, doNotify, 800, "uncommon");
						}
					}
				}
				if (nm.roles.cache.has('1276106622673879050')) {
					let lang = lc(nm);
					if (!nm.user.bot) {
						createStatFileIfItDoesntExists(nm.user.id);
						if (!getStat(nm.user.id).achievements.includes('rainbow')) {
							const doNotify = nm.roles.cache.has('1274646873889570887');
							unlockAchievement(nm.user.id, "rainbow", lang, doNotify, 320, "legendary");
						}
					}
				}
				if (nm.roles.cache.has('1276096908242190407')) {
					let lang = lc(nm);
					if (!nm.user.bot) {
						createStatFileIfItDoesntExists(nm.user.id);
						if (!getStat(nm.user.id).achievements.includes('unsightreadable')) {
							const doNotify = nm.roles.cache.has('1274646873889570887');
							unlockAchievement(nm.user.id, "unsightreadable", lang, doNotify, 320, "legendary");
						}
					}
				}
			});
	
			client.on('guildMemberAdd', async (member) => {
				member.user.bot ? null : createStatFileIfItDoesntExists(member.id)
				const s = getStat(member.id);
				if (s) {
					for (let i = 0; i < s?.roles?.length; i++) {
						await member.roles.add(s.roles[i]);
					}
				}
				if (!member.user.bot && member.guild.id === ft.id) {
					const oi = ltInvites;
					ltInvites = await ft.invites.fetch({ cache: false });
					const f = ltInvites.find(t => oi.get(t.code).uses < t?.uses)
					const inviter = f.inviter;
					if (!inviter.bot) {
						createStatFileIfItDoesntExists(inviter.id)
						setStatIfDoesntExists(inviter.id, 'invites', 0)
						let invited = getStat(inviter.id).invites;
						invited++;
						setStat(inviter.id, 'invites', invited);
						setStat(member.user.id, 'pendingInvite', inviter.id)
						createStatFileIfItDoesntExists(member.user.id)
						const pdiv = getStat(member.user.id).pendingInvite;
						const inv = getStat(pdiv).invites;
						// inviter coin bonus formula by kickydayo <3
						addCoin(Math.round(pdiv, 100 + 10 * Math.sqrt(5 * inv) + 1.06 ** (inv / 1.5)));
						addXP(pdiv, 320 * inv);
						addCoin(member.user.id, 14);
					}
				}
				try {
					const coinCSV = fs.readFileSync(`../${stp}/data.csv`).toString(), lang = lc(member)
					if (!new RegExp(`^${member.id},-?\\d+$`, 'gm').test(coinCSV)) {
						await fs.appendFileSync(`../${stp}/data.csv`, `${member.id},100\n`)
						await member.roles.add('1227622383100104705')
						const es = [new EmbedBuilder().setTitle(x('second.welcome', lang)).setDescription(x('second.firstdm', lang)).setColor(1874928), new EmbedBuilder().setTitle(member.id)]
						await client.channels.cache.get('1277136937869770752').send({
							embeds: es,
							content: "sendEmbedDMX"
						})
					}
				} catch (e) {
					console.error(e)
				}
			})

			client.on('guildCreate', async (guild) => {
				io(`Joined a server: ${guild.name} (${guild.id})`);
				if (guild.id !== guildId) {
					io('THE SERVER WASN\'T LIGHT TRERON\nleaving it...')
					guild.leave().then(() => {
						io(`Leaved a server: ${guild.name} (${guild.id})`)
					})
				}
			})

			client.on('voiceStateUpdate', async (os, ns) => {
				console.log('vsu')
				try {
					const a = [null, undefined, '1275333156366581820']
					if (!ns.member.user.bot) {
						setStatIfDoesntExists(ns.member.id, 'vc', 0)
						const s = getStat(ns.member.id)
						if (a.includes(os.channel?.id) && !a.includes(ns.channel?.id)) {
							console.log('vcConnect')
							if (vcu.findIndex(i => i.member.id === ns.member.id) === -1) {
								vcu.push({
									member: ns.member,
									joined: new Date().getTime()
								})
							}
						} else if (!a.includes(os.channel?.id) && a.includes(ns.channel?.id)) {
							console.log('vcDisconnect')
							const b = vcu.findIndex(i => i.member.id === ns.member.id)
							b >= 0 ? (() => {
								const d = new Date().getTime(), c = (d - vcu[b].joined) / 6e4;
								s.vc += d - vcu[b].joined
								addXP(ns.member.id, 35 * (c - Math.sqrt(3 * c + 2.25)) + 52.5)
								setStat(ns.member.id, 'vc', s.vc)
								vcu.splice(b, 1)
							})() : null
						}
					}
					console.log(vcu)
				} catch (e) {
					er(e)
				}
			})

			client.on('channelDelete', channel => {
				if (channel.type === 2) {
					const a = spn.findIndex(i => i.channelId === channel.id)
					if (a) {
						ft.channels.cache.get('1227216489199960157').messages.cache.get(spn[a].nmsg).delete().then(() => {
							spn.splice(a, 1)
						})
					}
				}
			})

			setInterval(() => {
				if (Math.random() > .73) {
					TLSpeak(ft.channels.cache.get('1227216489199960157'));
				}
			}, 89716423)
			
			if (Math.random() < .008) {
				TLSpeak(ft.channels.cache.get('1227216489199960157'));
			}
	
			async function TLSpeak(channel) {
				console.log("yoo new tl lets gooo")
				const chatSession = model.startChat({
					generationConfig,
					safetySettings: safetySettings,
					history: [],
				});
		
				try {
					const r2p = fs.readFileSync('./data/aipr.txt').toString();
					const rd = Math.round(Math.random() * (r2p.split('\r\n').length - 1));
					const result = await chatSession.sendMessage(r2p.split('\r\n')[rd]);
					let o = await result.response.text(), pr = "";
					if (rd !== 0) {
						pr = `-# ___Q. ${r2p.split('\r\n')[rd]}___\n`
					}
					if (await o.length < 1) { o = "..." }
					channel.send({
						content: `${pr}${await o}`
					}).then(msg => {
						msg.react(likeEmojiId);
						msg.react(repostEmojiId);
						msg.react(bookmarkEmojiId);
						msg.startThread({ name: ln(msg.content, 100) })
					})
				} catch (e) {
					er(e);
				}
			}

		} catch (e) {
			er(e);
		}
	
		function cwe(chi) {
			let i = fs.readFileSync('./data/wht.txt').toString().split('\n')
			if (i.includes(chi)) {
				io('there\'s a webhook exists!')
				return i[i.indexOf(chi) + 1]
			} else {
				io('no webhooks found from my webhook list...')
				return undefined;
			}
		}
	
		async function cw(ch) {
			await ch.createWebhook({
				name: 'repyx'
			}).then(webhook => {
				fs.appendFileSync('./data/wht.txt', `${ch.id}\n${webhook.url}\n`);
				io(`created a webhook at ${ch.id}`);
				return webhook.url;
			})
			.catch(console.error);
		}
	
		rcr();
		setInterval(rcr, 90000);
		setInterval(() => {
			changeRate("100")
		}, 100)

		function updateUserJSON(mem) {
			try {
				let d = JSON.parse(fs.readFileSync('./htdocs/trend/user.json'));
				const h = d[d.findIndex(i => i.id === mem.user.id)];
				if (h) {
					h.username = mem.user.username
					h.avatar = mem.avatarURL({ size: 64 }) ?? mem.user.displayAvatarURL({ size: 64 });
					h.name = mem.displayName
				} else {
					const j = {
						"id": mem.user.id,
						"username": mem.user.username,
						"avatar": mem.avatarURL({ size: 64 }) ?? mem.user.displayAvatarURL({ size: 64 }),
						"name": mem.displayName
					}
					d.push(j);
				}
				fs.writeFileSync('./htdocs/trend/user.json', JSON.stringify(d, null, "\t"));
			} catch (e) {
				er(e);
			}
		}

		function lgs(member) {
			setStatIfDoesntExists(member.id, "lastLogin", null);
			setStatIfDoesntExists(member.id, "loginStreak", 0);
			setStatIfDoesntExists(member.id, "previousStreak", null);
			setStatIfDoesntExists(member.id, "longestStreak", 0);
			setStatIfDoesntExists(member.id, "logged", 1);
			let S = getStat(member.id);
			let D = new Date(); D.setHours(0); D.setMinutes(0); D.setSeconds(0); D.setMilliseconds(0);
			if (S.lastLogin !== D.getTime()) {
				if (S.lastLogin >= D.getTime() - 86400000 * (1 + (hasItem(member.id, "streakFreeze").count ?? 0)) && S.lastLogin <= D.getTime() - 86400000) {
					S.loginStreak++;
					S.logged++;
					if (S.loginStreak >= S.longestStreak) {
						S.longestStreak = S.loginStreak
					}
					if (S.lastLogin < D.getTime() - 86400000) {
						useItem(member.id, 'streakFreeze', (D.getTime() - S.lastLogin) / 86400000 - 1)
					}
					addXP(member.id, S.loginStreak * 12.8);
					S.loginStreak >= 30 ? addCoin(member.id, Math.round(64 + (320 * S.loginStreak) / (Math.sqrt(3 * S.loginStreak)))) : null
				} else {
					S.previousStreak = S.loginStreak, S.loginStreak = 1;
				}
				if (S.loginStreak >= 7 && !getStat(member.id).achievements.includes('7day')) {
					let lang = lc(member)
					const doNotify = member.roles.cache.has('1274646873889570887');
					unlockAchievement(member.id, "7day", lang, doNotify, 420, "uncommon");
				}
				if (S.loginStreak >= 14 && !getStat(member.id).achievements.includes('14day')) {
					let lang = lc(member)
					const doNotify = member.roles.cache.has('1274646873889570887');
					unlockAchievement(member.id, "14day", lang, doNotify, 3360, "expert");
				}
				if (S.loginStreak >= 30 && !getStat(member.id).achievements.includes('30day')) {
					let lang = lc(member)
					const doNotify = member.roles.cache.has('1274646873889570887');
					unlockAchievement(member.id, "30day", lang, doNotify, 8390, "legendary");
				}
				S.lastLogin = D.getTime();
			}
			setStat(member.id, "loginStreak", S.loginStreak);
			setStat(member.id, "lastLogin", S.lastLogin);
			setStat(member.id, "previousStreak", S.previousStreak);
			setStat(member.id, "longestStreak", S.longestStreak);
			setStat(member.id, "logged", S.logged);
			const userId = member.id;
			try {
				let q = JSON.parse(fs.readFileSync('./data/lb/streak.json'));
				const l = q[q.findIndex(i => i.id === userId)];
				if (!S.lbBanned) {
					if (l) {
						l.streak = S.loginStreak
						l.l2 = S.lastLogin
						l.saves = hasItem(userId, "streakFreeze").count ?? 0
					} else {
						q.push({
							id: userId,
							streak: S.loginStreak,
							l2: S.lastLogin,
							saves: hasItem(userId, "streakFreeze").count ?? 0
						});
					}
				}
				for (let i = 0; i < q.length; i++) {
					const targ = q[i];
					if (targ.lastlogin < D.getTime() - 86400000) {
						if (targ.l2 < D.getTime() - 86400000) {
							const cu = hasItem(targ.id, 'streakFreeze').count ?? 0, ua = (D.getTime() - S.lastLogin) / 86400000 - 1;
							if (ua > cu) {
								useItem(targ.id, 'streakFreeze', cu);
								targ.streak = 0, targ.saves = 0;
							} else {
								useItem(targ.id, 'streakFreeze', ua);
								targ.saves = cu - ua
							}
							targ.l2 = D.getTime();
						}
					}
				}
				q.sort((a,b) => b.streak - a.streak);
				console.log(q)
				fs.writeFileSync('./data/lb/streak.json', JSON.stringify(q, null, 2))
			} catch (e) {
				console.error(e)
			}
		}

		function getItems(userId) {
			setStatIfDoesntExists(userId, 'items', [])
			return getStat(userId).items;
		}

		function hasItem(userId, itemId) {
			const h = getItems(userId).find(i => i.id === itemId);
			const c = h ? h.count : 0;
			return c > 0 ? h : false;
		}

		function addItem(userId, itemId, count) {
			const items = getItems(userId);
			if (hasItem(userId, itemId)) {
				const h = items.find(i => i.id === itemId);
				h.count += count ?? 1;
			} else {
				items.push({
					"id": itemId,
					"count": count ?? 1
				})
			}
			setStat(userId, "items", items)
		}

		function useItem(userId, itemId, count) {
			const items = getItems(userId), hs = hasItem(userId, itemId);
			if (hs) {
				if (hs.count >= count) {
					const h = items.find(i => i.id === itemId);
					h.count -= count ?? 1;
					setStat(userId, "items", items);
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		async function genAiReply(prq, msg) {
			let hs = [];
			let mc = [];
			let v = msg;
			while (v.reference) {
				v = await v.fetchReference();
				try {
					mc.push(await v.content.replace(`\n-# _${x('ftai.footer',lc(msg.member))}_`, ''));
				} catch (e) {
					er(e)
				}
			}
			mc.reverse();
		
			console.log(mc)
		
			if (mc.length > 0) {
				for (let g = 0; g < mc.length; g++) {
					let u;
					if (g % 2) {
						u = "model"
					} else {
						u = "user"
					}
					hs.push({
						role: u,
						parts: [
							{ text: mc[g] }
						]
					})
				}
			}
		
			msg.reply(`-# _${x('ftai.generating', lc(msg.member))}_`).then(async mh => {
				console.log(hs)
				const chatSession = model.startChat({
					generationConfig,
					safetySettings: safetySettings,
					history: hs,
				});
		
			
				try {
					const result = await chatSession.sendMessage(prq);
					let o = await result.response.text();
					if (await o.length < 1) { o = "..." }
					mh.edit({
						content: `${await o}\n-# _${x('ftai.footer',lc(msg.member))}_`
					});
					addXP(msg.author.id, o.length / 2)
				} catch (e) {
					er(e);
					mh.edit({
						content: `-# _${x('ftai.fail',lc(msg.member))}_\n-# \`\`\`${e}\`\`\``
					})
				}
			})
		}

	} catch (e) {
		er(e)
	}

	function sts() {
		if (client.ws.status === 5) {
			try {
				client.login(tukyn);
			} catch (e) {
				console.log(e);
			}
		}
		try {
			client.user.setPresence({
				activities: [
					{
						name: `[${Math.round((new Date().getTime() - tms) / 360000) / 10}h] Ping: ${client.ws.ping}ms`,
						type: 4
					}
				],
				status: PresenceUpdateStatus.DoNotDisturb
			});
		} catch (e) {
			console.log(e);
		}
	}

	function rcr() {
		try {
			let rh = parseFloat(fs.readFileSync("./data/r2.txt"));
			ft.roles.cache.get('1276106622673879050').setColor(hsvToHex(rh / 100, 0.46, 1));
			rh += 4;
			if (rh > 100) {
				rh = 0;
			}
			fs.writeFileSync("./data/r2.txt", rh.toString());
		} catch (e) {
			er(e);
		}
	}
	
	async function j0siA(userId, lang, isA2S) {
		const url = "https://www.gaitameonline.com/rateaj/getrate";
		const response = await getRequest({ url, json: true });
		const usdToJpyRate = response.quotes.find(t=>t.currencyPairCode==="USDJPY").ask;
		// j0.si ... $15.89 per year
		const j0siP = Math.round(parseFloat(usdToJpyRate) * 1589 / 100);
		unlockAchievement(userId, "j0si", lang, isA2S, j0siP, "hidden");
	}

	function fee(member) {
		const ltsl = "1276543473083875410", ltsy = "1276542660315844728";
		if (member.roles.cache.has(ltsy)) {
			return 0;
		} else if (member.roles.cache.has(ltsl)) {
			return 0.05;
		} else {
			return 0.1;
		}
	}
});

function suin(ma) {
	try {	
		if (ma.member.displayName === ma.member.user.username) {
			return ma.member.displayName;
		} else {
			return `${ma.member.displayName} (@${ma.member.user.username})`;
		}
	} catch (e) {
		er(e);
		try {
			return ma.author.username;
		} catch (e) {
			er(e);
			return undefined;
		}
	}
}

function er(e) {
	console.error(`${new Date()}:`);
	console.error(e);
	const ee = new EmbedBuilder()
		.setColor(0xFF0000)
		.setTitle('Error detected!')
		.setDescription(`\`\`\`\n${e}\n\`\`\``);

	client.channels.cache.get('1274414683675295796').send({
		content: `<:repost:1274321686338076775>`,
		embeds: [
			ee
		]
	})
}

function io(e) {
	console.log(`${new Date()} // ${e}`);
	const ee = new EmbedBuilder()
		.setColor(0x111222)
		.setTitle('Some info')
		.setDescription(`\`\`\`\n${e}\n\`\`\``);

	client.channels.cache.get('1274414683675295796').send({
		content: `<:repost:1274321686338076775>`,
		embeds: [
			ee
		]
	})
}

// hsv to hex, code by copilot lol
function hsvToHex(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    let toHex = x => {
        let hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function i3d6() {
	const d1 = Math.round(Math.random() * 5 ) + 1;
	const d2 = Math.round(Math.random() * 5 ) + 1;
	const d3 = Math.round(Math.random() * 5 ) + 1;
	return d1 + d2 + d3;
}

function d100() {
	const d4 = Math.round(Math.random() * 99) + 1;
	return d4;
}

async function usdjpy() {
	const url = "https://www.gaitameonline.com/rateaj/getrate";
	const response = await getRequest({ url, json: true });
	const usdToJpyRate = response.quotes.find(t=>t.currencyPairCode==="USDJPY").ask;
	console.log(`1 USD = ${usdToJpyRate}`);
}

function getRequest(options) {
return new Promise((resolve, reject) => {
	request(options, (error, response, body) => {
	if (error) {
		reject(error);
	} else {
		resolve(body);
	}
	});
});
}

function changeRate(id) {
	if (id === "100") {
		const v = 25;
		let n = parseFloat(fs.readFileSync('./data/rate/100.txt'));
		if (n * 1 !== n) {
			n = 100;
		}
		n += Math.random() * v - v / 2;
		if (n <= 25) {
			n += v / 10;
		}
		if (n >= 175) {
			n -= v / 10;
		}
		fs.writeFileSync('./data/rate/100.txt', n.toString())
		
		fs.writeFileSync('./htdocs/rate/100/index.html', `<html><head><style>body{text-align:center}</style></head><body><h4>rate:</h4><h1 id=r>${Math.round(n * 100 ) / 100}</h1><script src="script.js"></script></body></html>`)

		let j;
		try {
			j = JSON.parse(fs.readFileSync('./htdocs/rate/rate.json'));
		} catch (e) {
			er(e);
			fs.writeFileSync('./htdocs/rate/rate.json', "{}");
			j = {};
		}
		j["100"] = n;
		fs.writeFileSync('./htdocs/rate/rate.json', JSON.stringify(j, null, "\t"))
	}
}

client.login(tukyn);