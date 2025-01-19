const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { tukyn } = require('../../config.json');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
const client = new Client({
	intents: [
        GatewayIntentBits.Guilds
    ]
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('badge')
		.setDescription('edit badges')
        .addSubcommand(subcommand =>
            subcommand
                .setName('display')
                .setDescription('choose a badge that you want to display.')
                .addStringOption(option => 
                    option.setName('badge')
                        .setDescription('select a badge.')
                        .setRequired(true)
                        .setAutocomplete(true))),
        async autocomplete(interaction) {
            const bs = JSON.parse(fs.readFileSync('./badges/_emojidata.json')),
                H = Object.entries(bs).map(i=>{return{name:i[0],value:i[0]}}),
                S = getStat(interaction.user.id).badges.map(i=>{return{name:i,value:i}}),
                M = interaction.member;
                M.roles.cache.has('1276542660315844728')?S.push({name:'ltsy',value:'ltsy'}):(M.roles.cache.has('1276543473083875410')?S.push({name:'ltsl',value:'ltsl'}):S.push({name:"nobadge",value:"0"}))
            const focusedOption = interaction.options.getFocused(true);
            if (focusedOption.name === 'badge') {
                let filtered = S.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()));
                await interaction.respond(
                    filtered.slice(0, 25),
                );
            }
        },
	async execute(interaction) {
        try {
            const target = interaction.member
            const bid = interaction.options.getString('badge')
            const g = interaction.guild;
            const nvc = g.channels.cache.get('1274655940343500901')
            setStatIfDoesntExists(target.id, "badges", [])
            const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json'))
            const br = JSON.parse(fs.readFileSync('./badges/roles.json'))
            const iy = Object.entries(br).map(i=>{return i[1]})
            let b = getStat(target.id).badges;
            if (interaction.options.getSubcommand() === "display") {
                if (b.includes(bid) || bid === "ltsl" || bid === "ltsy" || bid === "0") {
                    for (let j in iy) {
                        if (iy[j]) target.roles.cache.has(iy[j])?target.roles.remove(iy[j]):null
                    }
                    br[bid]?target.roles.add(br[bid]):null
                    await interaction.reply({
                        content: "success!",
                        ephemeral: true
                    })
                } else {
                    await interaction.reply({
                        content: "you don't have that badge...",
                        ephemeral: true
                    })
                }
            }
        } catch (e1) {
            try {
                console.error(e1)
                await interaction.reply({
                    content: "error gg idk",
                    ephemeral: true
                })
            } catch (e2) {
                console.error(e2)
            }
        }
	},
};