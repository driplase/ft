const f=require("node:fs"),x=require("shelljs");try{async function e(){x.cd("ABSOLUTE_PATH_TO_./ftlocales"),f.existsSync("ftlocales")?(x.cd("ftlocales"),x.exec("git stash"),x.exec("git checkout l10n_main"),x.exec("git pull")):(x.exec("git clone -b l10n_main https://github.com/LightTreron/ftlocales.git"),x.cd("ftlocales"),x.exec("git checkout l10n_main")),x.cd("../");let e=f.readdirSync("./ftlocales/locales");for(let c in e)f.copyFileSync(`./ftlocales/locales/${e[c]}`,`./locales/${e[c].toLowerCase()}`)}e(),setInterval(e,3e5)}catch(c){console.error(c)}

const express = require('express'), app = express()

app.get('/og', (req, res) => {
    const q = req.query
    res.status(200).send(`${q.title?`<meta property="og:title" content="${htmlspecialchars(q.title)}">`:''}${q.description?`<meta property="og:description" content="${htmlspecialchars(q.description)}">`:''}${q.url?`<meta property="og:url" content="${htmlspecialchars(q.url)}">`:''}`)
});

app.listen(16287, () => {
    console.log('Server running');
});

function htmlspecialchars(str) { if (typeof str !== 'string') { return str; } return str.replace(/&/g, '&amp;') .replace(/</g, '&lt;') .replace(/>/g, '&gt;') .replace(/"/g, '&quot;') .replace(/'/g, '&#039;'); }