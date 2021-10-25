const fs = require('fs');
const googleTTS = require('google-tts-api');
const path = require('path');
const {
    generateRandomString,
} = require("../helpers/generate");

/**
 * 
 * @param {String} lang 
 * @param {String} text 
 * @param {String} mp3_path 
 */
function getTTS(lang, text, mp3_path) {
    // 2. get base64 text
    googleTTS
        .getAudioBase64(text, { lang, slow: false })
        .then((base64) => {
            // save the audio file
            const buffer = Buffer.from(base64, 'base64');
            const mp3_name = generateRandomString() + ".mp3";
            const locationSave = path.join(__dirname, mp3_name)
            fs.writeFile(locationSave, buffer, { encoding: 'base64' }, () => {
                mp3_path(locationSave)
            });
        })
        .catch(console.error);
}

function deleteMP3(location) {
    fs.unlinkSync(location);
}

module.exports = {
    getTTS,
    deleteMP3,
}