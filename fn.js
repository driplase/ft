const { Client, EmbedBuilder, GuildMember, Collection, GatewayIntentBits, } = require('discord.js');
const fs = require('fs'), crypto = require('crypto')
const yaml = require('js-yaml')
const { tukyn } = require('./config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});
client.login(tukyn)
// ../<SECOND_TRERON_PATH>
const stp = "bluecord-2-py";
function lc(member) {
    try {
        if (member.roles.cache.has('1274696519538180096') ?? getStat(member.id).roles.includes('1274696519538180096')) {
            return "en_us";
        } else if (member.roles.cache.has('1275649994384343153') ?? getStat(member.id).roles.includes('1275649994384343153')) {
            return member.displayName.toLowerCase().includes("é") ? "xi_lz" : "ja_as";
        } else if (member.roles.cache.has('1325798881006719098') ?? getStat(member.id).roles.includes('1325798881006719098')) {
            return "ja_ny"
        } else {
            return "ja_jp";
        } 
    } catch (e) {
        console.error(e);
        lang = "ja_jp";
    }
}
function lci(interaction) {
    let la = lc(interaction.member)
    if (!interaction.member.roles.cache.has('1275043743149326428') && la === "ja_jp") {
        la = l[interaction.locale] ?? "en_us";
    }
    return la
}
function x(key, lang) {
	let t;
	try {
		t = yaml.load(fs.readFileSync(`./locales/${lang.toLowerCase()}.yaml`));
	} catch (e) {
		console.error(e);
		t = yaml.load(fs.readFileSync(`./locales/ja_jp.yaml`));
	}
	return t[key] ?? key
}
function createStatFileIfItDoesntExists(userId) {
    if (!fs.existsSync(`./stats/${userId}.json`)) {
        const djsn = {
            "posts": 0,
            "reposted": 0, 
            "grepost": 0, 
            "liked": 0, 
            "glike": 0,
            "achievements": [],
            "xp": 0,
            "level": 1,
            "lvxp": 0,
            "badges": [],
            "cghistory": [],
            "roles": [],
            "lastLogin": null,
            "loginStreak": 0,
            "spaced": 0,
            "invites": 0,
            "bm": 0,
            "gbm": 0,
            "previousStreak": null,
            "longestStreak": 0,
            "items": [],
            "coinsEarned": 0,
            "coinsSpent": 0,
            "lynsts": 0,
            "logged": 1,
            "bumped": 0,
            "up": 0,
            "vc": 0,
            "coinRequests": [],
            "crts": null,
            "crq": [],
            "reapplied": 0,
            "tts": null
        };
        /* items: [
            {
                "id": itemId,
                "count": int
            }
        ]*/
        fs.writeFileSync(`./stats/${userId}.json`, JSON.stringify(djsn, null, "\t"));
    }
}
function getStat(userId) {
    return JSON.parse(fs.readFileSync(`./stats/${userId}.json`));
}
function setStat(userId, key, value) {
    const st = getStat(userId);
    if (value !== undefined) {
        st[key] = value;
    } else {
        delete st[key];
    }
    fs.writeFileSync(`./stats/${userId}.json`, JSON.stringify(st, null, "\t"));
}
function setStatIfDoesntExists(userId, key, value) {
    if (getStat(userId)[key] === undefined) {
        setStat(userId, key, value)
    }
}
function unlockAchievement(userId, achievementId, lang, isA2S, coins, d) {
    try {
        const ft = client.guilds.cache.get('1227213276576874558');
        const ach = JSON.parse(fs.readFileSync('./data/achievements.json'));
        let c = coins;
        if (ach[achievementId].coin && ach[achievementId].coin !== -1) { c = ach[achievementId].coin }
        const mem = ft.members.cache.get(userId);
        createStatFileIfItDoesntExists(userId);
        setStatIfDoesntExists(userId, "achievements", []);
        const adt = getStat(userId);
        if (!adt.achievements.includes(achievementId)) {
            let f;
            if (d !== null) {
                f = d;
            } else {
                f = ach[achievementId].rank;
            }
            adt.achievements.push(achievementId);
            fs.writeFileSync(`./stats/${userId}.json`, JSON.stringify(adt, null, "\t"));
            if (isA2S) {
                mem.createDM();
                let ae = new EmbedBuilder();
                if (achievementId === "3d6" || achievementId === "1d100") {
                    ae = new EmbedBuilder()
                    .setAuthor({
                        name: x("achievement.unlock", lang)
                    })
                    .setTitle(x(`achievement.${achievementId}.title`, lang) ?? `achievement.${achievementId}.title`)
                    .setDescription(`${c}!`)
                    .setColor(Math.round(Math.random() * 16777215))
                    .setFooter({ text: `[${x(`achievement.${f}`, lang) ?? `achievement.${f}`}]` });
                } else {
                    ae = new EmbedBuilder()
                    .setAuthor({
                        name: x("achievement.unlock", lang)
                    })
                    .setTitle(x(`achievement.${achievementId}.title`, lang) ?? `achievement.${achievementId}.title`)
                    .setDescription(x(`achievement.${achievementId}.description`, lang) ?? `achievement.${achievementId}.description`)
                    .setColor(Math.round(Math.random() * 16777215))
                    .setFooter({ text: `[${x(`achievement.${f}`, lang) ?? `achievement.${f}`}]` });
                }
                mem.send({
                    embeds: [ ae ]
                });
            }
            const E = new EmbedBuilder()
                .setAuthor({
                    name: `${mem.user.username} unlocked an achievement!`
                })
                .setTitle(x(`achievement.${achievementId}.title`, "en_us") ?? `achievement.${achievementId}.title`)
                .setDescription(x(`achievement.${achievementId}.description`, "en_us") ?? `achievement.${achievementId}.description`)
                .setColor(Math.round(Math.random() * 16777215))
                .setFooter({ text: `[${x(`achievement.${f}`, "en_us") ?? `achievement.${f}`}]` });
            ft.channels.cache.get('1274655940343500901').send({
                embeds: [ E ]
            });
        }
        if (coins >= 1) {
            addCoin(userId, c)
            addXP(userId, c * (1 + Math.random() * 4))
        }
    } catch (e) {
        console.error(e)
    }
}
function addXP(userId, amount) {
    const s = getStat(userId);
    let cxp = s.xp, cl = s.level, lvxp = s.lvxp;
    cxp += amount;
    while (getRequiredXP(cl) <= cxp - lvxp) {
        lvxp += getRequiredXP(cl);
        cl++;
    }
    if (cl > 0) {
        while (cxp - lvxp < 0) {
            cl--;
            lvxp -= getRequiredXP(cl);
        }
    }
    setStat(userId, "xp", cxp);
    setStat(userId, "level", cl);
    setStat(userId, "lvxp", lvxp);

    try {
        let q = JSON.parse(fs.readFileSync('./data/lb/xp.json'));
        if (!s.lbBanned) {
            const l = q[q.findIndex(i => i.id === userId)];
            if (l) {
                l.xp = cxp
                l.level = cl
            } else {
                q.push({
                    id: userId,
                    xp: cxp,
                    level: cl
                });
            }
            q.sort((a,b) => b.xp - a.xp);
            fs.writeFileSync('./data/lb/xp.json', JSON.stringify(q, null, "\t"))
        }
        let lb = JSON.parse(fs.readFileSync('./badges/_leaderboard.json'))
        if (lb.first !== q[0].id) {
            try {
                let U = getStat(lb.first).badges;
                U.splice(U.indexOf('first'), 1);
                setStat(lb.first, "badges", U);
            } catch (e) {
                console.error(e)
            }
            let P = getStat(q[0].id).badges;
            if (!P.includes('first')) {
                P.push('first');
                setStat(q[0].id, 'badges', P);
            }
            lb.first = q[0].id;
        }
        if (lb.second !== q[1].id) {
            try {
                let U = getStat(lb.second).badges;
                U.splice(U.indexOf('second'), 1);
                setStat(lb.second, "badges", U);
            } catch (e) {
                console.error(e)
            }
            let P = getStat(q[1].id).badges;
            if (!P.includes('second')) {
                P.push('second');
                setStat(q[1].id, 'badges', P);
            }
            lb.second = q[1].id;
        }
        if (lb.third !== q[2].id) {
            try {
                let U = getStat(lb.third).badges;
                U.splice(U.indexOf('third'), 1);
                setStat(lb.third, "badges", U);
            } catch (e) {
                console.error(e)
            }
            let P = getStat(q[2].id).badges;
            if (!P.includes('third')) {
                P.push('third');
                setStat(q[2].id, 'badges', P);
            }
            lb.third = q[2].id;
        }
        fs.writeFileSync('./badges/_leaderboard.json', JSON.stringify(lb, null, "\t"))
    } catch (e) {
        console.error(e)
    }
}
function getCoin(userId) {
    return parseInt(fs.readFileSync(`../${stp}/data.csv`).toString().match(`${userId},(-?)\\d+`, "g")?.at(0)?.split(',')?.at(1)) ?? 0;
}
function addCoin(userId, amount) {
    const ft = client.guilds.cache.get('1227213276576874558');
    if (amount !== 0) {
        if (amount > 0) {
            const emb = new EmbedBuilder()
                .setTitle(userId)
                .setDescription(amount.toString());
            ft.channels.cache.get('1277136937869770752').send({
                content: "give_coin",
                embeds: [ emb ]
            })
            return true;
        } else {
            if (getCoin(userId) >= -amount) {
                const emb = new EmbedBuilder()
                    .setTitle(userId)
                    .setDescription(Number(-amount).toString());
                ft.channels.cache.get('1277136937869770752').send({
                    content: "use_coin",
                    embeds: [ emb ]
                })
                return true;
            } else {
                return false;
            }
        }
    }
}
function ix(iconId) {
	const i = JSON.parse(fs.readFileSync('./data/icons.json'));
	if (iconId) {
		return i[iconId] ?? null
	} else {
		return i
	}
}
function ep(posts, likes, reposts, bookmarks, spaces) {
	return 4 * posts + 6 * likes + 2 * reposts + 16 * bookmarks + 24 * spaces
}
function Lynst(s, p, C, U, c, d) {
	return Math.max((256 * s + 1.6 * p + 3 * Math.sqrt(54 * C - 16 * U + c)) / (32 * (d + 24)), 0)
}
function getRank(userId, isLyns) {
    isLyns ? null : lyns(userId)
    const lyr = JSON.parse(fs.readFileSync('./data/lb/lynst.json')), pos = lyr.findIndex(i => i.id === userId) + 1;
    const u = Math.round(pos / lyr.length * 100);
    return getStat(userId).lbBanned ? '?' : Object.entries(JSON.parse(fs.readFileSync('./data/ranks.json'))).filter(i=>i[1]>=u).sort((a,b)=>a[1]-b[1])[0]?.at(0)?.toUpperCase() ?? '?'
}
function lyns(userId) {
    setStatIfDoesntExists(userId, 'logged', 1)
    setStatIfDoesntExists(userId, 'level', 1)
    setStatIfDoesntExists(userId, 'xp', 0)
    setStatIfDoesntExists(userId, 'lvxp', 0)
    setStatIfDoesntExists(userId, 'posts', 0)
    setStatIfDoesntExists(userId, 'glike', 0)
    setStatIfDoesntExists(userId, 'grepost', 0)
    setStatIfDoesntExists(userId, 'gbm', 0)
    setStatIfDoesntExists(userId, 'coinsEarned', 0)
    setStatIfDoesntExists(userId, 'coinsSpent', 0)
    const s = getStat(userId), coins = getCoin(userId);
    const l = Lynst(ep(s.posts, s.glike, s.grepost, s.gbm, s.spaced), s.xp, s.coinsEarned, s.coinsSpent, coins, s.logged)
    console.log(`userId: ${userId}, Lynsts: ${l}`)
    let q = JSON.parse(fs.readFileSync('./data/lb/lynst.json'));
    if (!s.lbBanned) {
        const f = q[q.findIndex(i => i.id === userId)];
        if (f) {
            f.lynsts = l, f.rank = getRank(userId,1)
        } else {
            q.push({
                id: userId,
                lynsts: l,
                rank: getRank(userId,1)
            });
        }
        q.sort((a,b) => b.lynsts - a.lynsts);
        fs.writeFileSync('./data/lb/lynst.json', JSON.stringify(q, null, 4))
    }
    setStat(userId, 'lynsts', l)
    return l
}
function rankTopPercentile(userId) {
    lyns(userId)
    const lyr = JSON.parse(fs.readFileSync('./data/lb/lynst.json')), pos = lyr.findIndex(i => i.id === userId) + 1;
    return Math.round(pos / lyr.length * 10000) / 100;
}
function getLoginSteak(userId) {
    let D = new Date(); D.setHours(0); D.setMinutes(0); D.setSeconds(0); D.setMilliseconds(0);

    setStatIfDoesntExists(userId, "lastLogin", null);
    setStatIfDoesntExists(userId, "loginStreak", 0);
    const S = getStat(userId);
    if (S.lastLogin >= D.getTime() - 86400000) {
        return S.loginStreak;
    } else {
        setStat(userId, "loginStreak", 0);
        return 0;
    }
}
function getRequiredXP(le) {
	let rq;
	if (31 <= le) {
		return Math.floor((9 / 2) * le ** 2 - (325 / 2) * le + 2220)
	} else if (16 <= le) {
		return Math.floor((5 / 2) * le ** 2 - (81 / 2) * le + 360)
	} else if (0 <= le) {
		return le ** 2 + 6 * le
	} else {
		return 0;
	}
}
function uz(n, la) {
    if (["en_us","xi_lz"].includes(la)) {
        if (n[n.length - 1] === 's') {
            return n + "'";
        } else {
            return n + "'s";
        }
    } else {
        return n;
    }
}
function randASCIIstring(length) {
    const c = "0123456789qwertyuiopasdfghjklzxcvbnm_"
    let r = "";
    for (let i = 0; i < 16; i++) {
        r = `${r}${c.at(Math.round(Math.random() * (c.length - 1)))}`;
    }
    return r;
}
function getRate(rateId) {
	if (rateId === "100") {
		return parseFloat(fs.readFileSync('./data/rate/100.txt').toString())
	} else return null;
}
const l = {
    "ja": "ja_jp",
    "en-US": "en_us"
};
function isJSON(string) {
    try {
        JSON.parse(string)
        return true;
    } catch {
        return false;
    }
}
function ln(str, len) {
    if (str.length > len) {
        return `${str.slice(0, len - 3)}...`;
    } else {
        return str;
    }
}
function dws() {
    let e = new Date(); e.setSeconds(0); e.setMilliseconds(0);
    return e.getTime();
}
function xtc(amount) { return amount / (getRate("100") / 5) }
function ctx(amount) { return amount * (getRate("100") / 5) }
function isStreakSafe(streak, longest, l2) {
    /*
        -1 .. not even trying to save it.
        0 .. NOT SAFE
        1 .. safe.
        2 .. safe with best streak.
    */
   let d = new Date(); d.setTime(dws()),d.setHours(0),d.setMinutes(0)
   return l2 === d.getTime() ? longest <= streak ? 2 : 1 : streak <= 0 ? -1 : 0
}
function toHiragana(x){const j=x.split('');return j.map(i=>/^[ァ-ヶヽヾ]$/.test(i)?String.fromCodePoint(i.codePointAt(0)-96):i).join('')}
function toKatakana(x){const j=x.split('');return j.map(i=>/^[ぁ-ゖゝゞ]$/.test(i)?String.fromCodePoint(i.codePointAt(0)+96):i).join('')}
function genCode(){const _=["QWERTYUPASDFGHJKLZXCVBNM123456789","",[0,1,2,3,4],()=>_[0][_[6][_[7]]],[0,1,2,3],()=>{for(let i of _[2]){_[1]+=_[3](),_[7]++}},crypto.randomBytes(25).map(k=>k%33),0];for(let j of _[4]){_[5](),_[1]+="-"}_[5]();return _[1]}
async function mir(s) {
    const ft = await client.guilds.fetch('1227213276576874558');
    const m = {
        users: s.match(/<@!?\d+>/g),
        roles: s.match(/<@&\d+>/g)
    }
    const U = await m.users?.map(async r=>await ft.members.fetch(r.match(/\d+/)[0]).then(i => i.displayName).catch(async () => await client.users.fetch(r.match(/\d+/)[0]).then(i=>i.displayName).catch(()=>"unknown-user")))
    const R = await m.roles?.map(async r => await ft.roles.fetch(r.match(/\d+/)[0]).then(i=>i.name).catch(i=>"unknown-role"))
    let j = [,,].fill(-1);
    return s
        .replace(/((?!\\)\|){2}[^\|]+\1{2}/g, r => "ネタバレ")
        .replace(/((?!\\)`){3}(?:[^`]|`(?!``))*\1{3}/g, r => "コードブロック省略")
        .replace(/<@!?\d+>/g, async r => {
            j[0]++
            return U[j[0]]
        }).replace(/<@&\d+>/g, async r => {
            j[1]++
            return R[j[1]]
        })
}
function hash(method,str) { crypto.createHash(method).update(str).digest('hex') }
/*
    0 = not timeline
    1 = normal timeline (not mature or dev)
    2 = mature
    -1 = dev (for development)
*/
function isTL(channelId) {
    const TLs = JSON.parse(fs.readFileSync('./data/TLs.json'));
    return TLs.normal.includes(channelId) ? 1 : TLs.mature.includes(channelId) ? 2 : TLs.dev.includes(channelId) ? -1 : 0;
}
const TLs = {
	default: "1227216489199960157",
	r18: "1227231817346842635"
}
const noWeb = '1286857846423556206';
async function getBadges(userId, type) {
    const ft = client.guilds.cache.get('1227213276576874558'), ty = type ?? 0;
    const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json'));
    let badgestring = "";
    const s = getStat(userId), badgeslist = [], mem = await ft.members.fetch(userId).then(mem=>{
        if (mem?.roles?.cache?.has('1276543473083875410')) {
            if (!s.badges.includes('ltsl')) {
                s.badges.push("ltsl")
            }
        }
        if (mem?.roles?.cache?.has('1276542660315844728')) {
            if (!s.badges.includes('ltsy')) {
                s.badges.push("ltsy")
            }
        }
    }).catch(e=>console.error(e));
    for (let c = 0; c < s.badges.length; c++) {
        badgeslist.push(bl[s.badges[c]] ?? "❓")
    }
    if (badgeslist.length > 0) {
        for (let j = 0; j < badgeslist.length; j++) {
            badgestring = `${badgestring} ${badgeslist[j]}`
        }
    }
    switch (ty) {
        case 0: return badgestring
        case 1: return s.badges
        case 2: return s.badges.map(i=>{return {id:i,emoji:bl[i]}})
        case 3: return badgeslist
        case 4: return badgeslist.length
    }
}
function migrateRepostFeaturePostDataFileFromFxxkingCSVToGodJSONWithJustASingleLineOfNodejsCodeSoUseThis(aStringDataFromFormerRepostFeaturePostDataFileThatIsUsingFuckingCSV) { return aStringDataFromFormerRepostFeaturePostDataFileThatIsUsingFuckingCSV.replace(/^\/\/.+$/gm,'').match(/(\d+),\d+\r?\n\d+\r?\n\1/g).map(i=>{const b=i.split(/\r?\n/g);return{target:b[2],reposter:b[0].split(',')[1],created:b[1]}}) }
module.exports = { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, dws, isStreakSafe, lci, toHiragana, toKatakana, genCode, mir, hash, isTL, TLs, noWeb, getBadges, migrateRepostFeaturePostDataFileFromFxxkingCSVToGodJSONWithJustASingleLineOfNodejsCodeSoUseThis }