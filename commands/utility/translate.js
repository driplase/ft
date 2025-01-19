/*
const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');

const l = {
    "ja": "ja_jp",
    "en-US": "en_us"
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('See how you can translate First Treron.'),
	async execute(interaction) {
        const m = interaction.member;
        const r = m.roles.cache;
        let lang;
        try {
            if (r.has('1274696519538180096')) {
                lang = "en_us";
            } else if (r.has('1275649994384343153')) {
                lang = "ja_as";
            } else if (r.has('1275043743149326428')) {
                lang = "ja_jp";
            } else {
                lang = l[interaction.locale] ?? "en_us";
            }
        } catch (e) {
            console.error(e);
            lang = "ja_jp";
        }
        if (interaction.options.getSubcommand() === 'driplase') {
            const em = new EmbedBuilder()
                .setAuthor({ name: x("command.donate.sen", lang).replace("<target>", "driplase") })
                .setDescription(`${x("command.donate.method", lang)}\n${x("command.donate.kyash", lang)}: [driplase](https://j0.si/dplkyash)\n\n-# _${x("command.donate.comment", lang)}_`)
                .setFooter({ text: x("command.donate.footer", lang) })
                await interaction.reply({
                    embeds: [
                        em
                    ]
                })
        } else if (interaction.options.getSubcommand() === 'arlgon') {
            const em = new EmbedBuilder()
                .setAuthor({ name: x("command.donate.sen", lang).replace("<target>", "ArLgon") })
                .setDescription(`${x("command.donate.method", lang)}\n${x("command.donate.booth", lang)}: [ArLgon](https://arlgon.booth.pm/)\n-# __M3終わったらCD買って支援してね！__  *- <@1039458282554806295>*\n\n-# _${x("command.donate.comment", lang)}_`)
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

function x(key, lang) {
	let t;
	try {
		t = yaml.load(fs.readFileSync(`./locales/${lang.toLowerCase()}.yaml`));
	} catch (e) {
		console.error(e);
		t = yaml.load(fs.readFileSync(`./locales/ja_jp.yaml`));
	}
	return t[key]
}
*/