const t = document.getElementById('top');
const m = document.getElementById('topi');
const I = document.getElementById('topImg');
const l = document.getElementById('tl');
const M = document.getElementById('main');
let j, u;

function htmlspecialchars(str){
    return (str + '').replace(/&/g,'&amp;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#x27;')
        .replace(/`/g,'&#x60;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/&/g,'&amp;');
}

async function sf() {
    const response = await fetch("https://ft.j0.si/trend/post.json", { signal: AbortSignal.timeout(1000), method: "GET" });
    const rs = await response.text();
    j = JSON.parse(rs);
    const responze = await fetch("https://ft.j0.si/trend/user.json", { signal: AbortSignal.timeout(1000), method: "GET" });
    const zs = await responze.text();
    u = JSON.parse(zs);

    const b = j.length;

    for (let k = 0; k < b; k++) {
        const y = document.createElement('div');
        M.appendChild(y)
        let a = "";
        if (j[k].attachment) {
            a = `<img class="attachment image" onclick="img('${j[k].attachment}')" src="${j[k].attachment}">`
        }
        const U = u.find(e => e.id === j[k].user);
        y.innerHTML = `<div class="post"><div class="postUser"><img class="avatar" src="${U.avatar}" width="48" height="48"><span class="u"><span class="showname">${U.name}</span>&nbsp; <span class="usn">@${U.username}</span></span></div><div class="content"><p>${j[k].content}</p></div></div>`
    }
}
sf()

function img(url) {
    t.style.display = "flex";
    I.src = url;
    l.href = url;
    const i = setInterval(() => {
        t.style.transition = ".15s cubic-bezier(0.5, 0, 0.75, 0)"
        m.style.transition = ".25s cubic-bezier(0.25, 1, 0.5, 1)";
        t.style.opacity = 1;
        m.style.transform = "scale(1)";
        clearInterval(i)
    }, 1)
}

t.addEventListener('click', (e) => {
    if (e.target === t || e.target === document.getElementById('tl')) {
        m.style.transition = ".15s cubic-bezier(0.5, 0, 0.75, 0)";
        t.style.transition = ".25s cubic-bezier(0.25, 1, 0.5, 1)";
        t.style.opacity = 0;
        m.style.transform = "scale(0)";
        const i = setInterval(() => {
            t.style.display = "none";
            clearInterval(i)
        }, 250)
    }
})

window.scrollTo(0, document.body.scrollHeight);