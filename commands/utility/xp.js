const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const nodeHtmlToImage = require("node-html-to-image");
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
		.setDescription('View your or someone\'s xp card.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to get xp of.')
                .setRequired(false)),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user') ?? interaction.user;
            target.fetch({ force: true });
            console.log(target.avatarDecorationURL())
            setStatIfDoesntExists(target.id, "xp", 0)
            setStatIfDoesntExists(target.id, "level", 1)
            setStatIfDoesntExists(target.id, "lvxp", 0)
            addXP(target.id, 0)
            const s = getStat(target.id);
            const m = getRequiredXP(s.level);
            const v = s.xp - s.lvxp;
            await interaction.deferReply();
            const gn = randASCIIstring(16);
            nodeHtmlToImage({
                output: `./data/xp/${gn}.png`,
                html: `<html style="width:570px;height:120px"><head><style>body{margin:0;font-family:Consolas,monospace;}img{margin: 20px;border-radius:50%;box-shadow:#fff 0 0 10px;width:80px;height:80px}#b{background: linear-gradient(146deg, rgba(54,97,94,1) 0%, rgba(24,112,133,1) 12%, rgba(34,62,136,1) 65%, rgba(72,64,108,1) 100%);border-radius:16px;}.r{transform:translate(124px,-128px);color:#fff;text-shadow:0 0 5px #ffffffae;}progress::-webkit-progress-bar{background-color:#000c33;border-radius:6px;box-shadow:0 0 6px #000c33}progress::-webkit-progress-value{background-color:#2189ff;border-radius:6px;box-shadow:0 0 12px #2189ff;}</style></head><body><div style="width:570px;height:120px;" id=b><img src="${interaction.guild.members.cache.get(target.id)?.avatarURL({ size: 64 }) ?? target?.displayAvatarURL({ size: 64 }) ?? 'https://cdn.discordapp.com/embed/avatars/0.png'}"><div class=r><h2 style="font-weight:normal;transform:translate(-150px,7px);font-style:italic;text-align:right">Level ${s.level.toLocaleString()}</h2><h1 style="transform:translateY(-42px)" id=t><span style="font-size:32px;" id=y>&shy;</span>${target.username}</h1><p style="text-align:right;transform:translate(-150px,-72px);color:gray;font-weight:600;text-shadow:rgb(59, 59, 59) 0 0 2px"><span style="font-size:12px">Total: ${Math.round(s.xp).toLocaleString()} XP</span><br>${v.toLocaleString()} / ${m.toLocaleString()}</p><progress style="transform:translateY(-87px);width:420px;height:12px;appearance:none;" max=${m} value=${v}></progress></div></div><script>const j=t.textContent.length-12;j>1?(t.style.fontSize=\`\${(240/(20*(j+12)))*32}px\`,y.style.fontSize="38px"):null</script></body></html>`,
                transparent: true,
                waitUntil: "load"
            }).then(async () => {
                console.log("IMG_GEN_SUCCESS")
                const i = new AttachmentBuilder()
                    .setName("xp.png")
                    .setFile(`./data/xp/${gn}.png`)
                await interaction.editReply({
                    files: [i]
                }).then(() => fs.unlinkSync(`./data/xp/${gn}.png`));
            });
        } catch (e) {
            console.error(e);
            await interaction.reply({
                content: "When the user did something, you'll able to see their xp card!"
            })
        }
	},
};