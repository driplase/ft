// RUN GL.JS INSTEAD
const f=require('node:fs'), x=require('shelljs');
try{
    async function y() {
        x.cd("ABSOLUTE_PATH_TO_./ftlocales")
        if (f.existsSync('ftlocales')) {
            x.cd('ftlocales')
            x.exec('git stash');
            x.exec('git checkout l10n_main');
            x.exec('git pull');
            x.exec('git stash pop');
        } else {
            x.exec('git clone -b l10n_main https://github.com/LightTreron/ftlocales.git')
            x.cd('ftlocales')
            x.exec('git checkout l10n_main')
        }
        x.cd('../')
        const g = f.readdirSync('./ftlocales/locales')
        for (let r in g) {
            f.copyFileSync(`./ftlocales/locales/${g[r]}`, `./locales/${g[r].toLowerCase()}`)
        }
    }
    y();
    setInterval(y, 3e5)
} catch (r) {
    console.error(r)
}