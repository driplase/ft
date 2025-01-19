const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const consoleLog = console.log, consoleError = console.error;
const yaml = require('js-yaml');
const { tukyn } = require('../../config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});
client.login(tukyn)
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('exekvera-ett-skript')
		.setDescription('vad är det?')
        .addStringOption(option =>
            option.setName('skript')
                .setDescription('ange ett skript vad du vill köra.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('ephemeraled?')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        try {    
            if (interaction.user.id === "959034815766728714") {
                const $e = interaction.options.getBoolean('ephemeral') ?? true
                await interaction.deferReply({ ephemeral: $e })
                try {
                    let r = ""
                    console.log = (a) => { r += `${isJSON(a) ? JSON.parse(a) : a.toString()}\n`, consoleLog(a) }
                    console.error = (a) => { r += `${(isJSON(a) ? JSON.parse(a) : a.toString()).split('\n').map(i=>' \u001b[31m'+i).join('\n')}\n`, consoleError(a) }
                    const s=(t,p,l)=>t.split(new RegExp(`(${p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`)).reduce((a,c)=>(c===p?a.push(p):c.match(new RegExp(`.{1,${l}}`,'gs')).forEach((s,i)=>(i===0&&a[a.length-1]===p?a[a.length-1]+=s:a.push(s))),a),[]);
                    eval(interaction.options.getString('skript'));
                    const R = s(r,'\u001b[31m',4e3), E = []
                    for (let j in R) {
                        if (j < 10) { E.push(new EmbedBuilder().setDescription(`\`\`\`ansi\n${R[j].replace(tukyn, "[TOKEN]]")}\`\`\``).setColor(Math.round(Math.random()*16777215))) }
                    }
                    consoleLog(E)
                    await interaction.editReply({
                        ephemeral: $e,
                        embeds: E
                    });
                    console.log = consoleLog, console.error = consoleError;
                } catch (e) {
                    await interaction.editReply({
                        ephemeral: $e,
                        embeds: [ new EmbedBuilder().setColor(0xFF0000)
                            .setDescription(`\`\`\`${e.replace(tukyn, "[TOKEN]]")}\`\`\``) ]
                    });
                    console.log = consoleLog, console.error = consoleError;
                }
            } else {
                await interaction.reply({
                    ephemeral: true,
                    content: `-# ___Woahh..., that was tricky one....___`
                });
            }
        } catch (e) {
            consoleError(e)
        }
	}
}