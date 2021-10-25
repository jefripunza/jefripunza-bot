const config = require('../config');
const { getTime } = require('../helpers/date');

/**
 * uncomment this if use MongoDB (default)
 */

const {
    insertDocument,
    showCollection,
    showDocumentByID,
    updateDocumentByID,
    deleteDocumentByID,
    clearCollection,
    updateDocumentByObject,
} = require("./ModelMongoDB");

/**
 * 
 * @param {String} collection 
 * @returns 
 */
async function getLength(collection, number) {
    if (global[collection]) {
        const result = !global[collection] ? 0 : global[collection].filter(v => {
            return v.number === number;
        }).length;
        // console.log({ collection, number, select: global[collection], result });
        return result;
    } else {
        return false
    }
}




function checkGroupVerify(group_id) {
    if (global.system) {
        const check = global.system.group_verify.filter(v => {
            return v === group_id;
        }).length;
        return check > 0;
    }
    return false
}

async function addGrupVerifikasi(group_id) {
    if (!checkGroupVerify(group_id)) { // jika tidak ada
        const _id = global.system._id;
        // ambil data awal
        const group_verify = global.system.group_verify;
        // push
        group_verify.push(group_id)
        // write
        await updateDocumentByID("server", "system", _id, {
            group_verify,
        })
        return true
    } else {
        return false
    }
}


async function removeGrupVerifikasi(group_id) {
    if (checkGroupVerify(group_id)) { // jika tidak ada
        const _id = global.system._id;
        // ambil data awal & filter
        const group_verify = global.system.group_verify.filter(v => {
            return v !== group_id;
        })
        console.log({ group_verify });
        // write
        await updateDocumentByID("server", "system", _id, {
            group_verify,
        })
        return true
    } else {
        return false
    }
}

async function absenMember(chat, terakhir_message, terakhir_time) {
    const user_id = chat.participant;
    const now_user = global.join.filter(v => {
        return String(v.number).split("@")[0] === String(user_id).split("@")[0];
    });
    if (now_user.length > 0) {
        return await updateDocumentByID("bot_grup", "join", now_user[0]._id, {
            terakhir_message,
            terakhir_time,
            kick: false,
        })
    }
}

/**
 * 
 * @param {Number|String} number 
 * @returns 
 */
async function tambahStrike(number, reason) {
    return await insertDocument("bot_grup", "strike", {
        number,
        reason,
        time: getTime(),
    })
}

/**
 * 
 * @param {Number|String} number 
 * @returns 
 */
async function tambahXp(number, reason) {
    return await insertDocument("bot_grup", "xp", {
        number,
        reason,
        time: getTime(),
    })
}

async function tambahKataKasar(kata) {
    return await insertDocument("bot_grup", "kata_kasar", {
        kata,
    })
}


async function changeNowDay(_id, day) {
    return await updateDocumentByID("server", "system", _id, {
        day,
    })
}
async function changeKickTrue(_id) {
    return await updateDocumentByID("bot_grup", "join", _id, {
        kick: true,
    })
}

function checkMemberIsJoin(number) {
    if (global.join) {
        const check = global.join.filter(v => {
            return String(v.number).split("@")[0] === String(number).split("@")[0];
        }).length;
        return check > 0;
    }
    return false
}
async function joinMember(number, name, university, member_class, onSuccess, isJoined = false) {
    if (!checkMemberIsJoin(number)) {
        if (onSuccess)
            onSuccess()
        return await insertDocument("bot_grup", "join", {
            number,
            name,
            university,
            member_class,
            kick: false,
            terakhir_message: "*[system] saat pendaftaran*",
            terakhir_time: getTime(),
            time: getTime(),
        })
    } else {
        if (isJoined)
            isJoined()
    }
}
async function editMember(number, name, university, member_class) {
    const check = global.join.filter(v => {
        return String(v.number).split("@")[0] === String(number).split("@")[0];
    });
    if (check.length > 0) {
        const _id = check[0]._id;
        return await updateDocumentByID("bot_grup", "join", _id, {
            name,
            university,
            member_class,
        })
    }
}

async function clearStrike() {
    return await clearCollection("bot_grup", "strike")
}

async function clearXP() {
    return await clearCollection("bot_grup", "xp")
}


module.exports = {
    getLength,

    checkGroupVerify,
    addGrupVerifikasi,
    removeGrupVerifikasi,

    absenMember,

    tambahStrike,
    tambahXp,
    tambahKataKasar,

    changeNowDay,
    changeKickTrue,

    checkMemberIsJoin,
    joinMember,
    editMember,

    clearStrike,
    clearXP,
}