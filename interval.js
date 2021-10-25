const { weekAndDay, getTime } = require("./helpers/date");
const { createPromise, simulateAsyncPause } = require("./helpers/promise");
const { changeNowDay, changeKickTrue } = require("./models");
const { showCollection } = require("./models/ModelMongoDB");

// get collection
global.strike = false;
global.xp = false;
const collection = [
    "absen_mingguan",
    "block",
    "join",
    "kata_kasar",
    "kurangi_xp",
    "strike",
    "xp",
];

function TimestampToDays(ts) {
    return Math.floor(ts / 1000 / 60 / 60 / 24)
}

const interval = async (delay) => {
    await setTimeout(async () => {
        //// GET ALL COLLECTION
        const get_collection = await showCollection("bot_grup", collection);
        const key_collection = await Object.keys(get_collection);
        // console.log({
        //     length: key_collection
        //         .filter(key => {
        //             return key !== "system";
        //         })
        //         .map(key => {
        //             return {
        //                 [key]: get_collection[key].length,
        //             };
        //         })
        // }); // debug
        for (key in key_collection) {
            global[key_collection[key]] = await get_collection[key_collection[key]];
        }

        //// check if new week
        const {
            _id,
            group_verify,
        } = await get_collection["system"];
        const days_now = TimestampToDays((new Date()).getTime())
        const join = global.join ? global.join : false;
        if (join) {
            const bot = await global.bot;
            await createPromise(group_verify, async (group_id, resolve, reject) => {
                // execute per group verify
                const participant = (await bot.getGroupParticipants(group_id, true))
                    .filter(v => {
                        return !v.isSuperAdmin // bukan super admin
                    })
                    .filter(v => {
                        return !v.isAdmin // bukan admin
                    })
                    .map(v => v.jid)
                // console.log({ participant });
                const this_user = join.filter(v => {
                    return participant.some(a => String(v.number).split("@")[0] === String(a).split("@")[0]);
                })
                // console.log({ this_user });
                for (let i = 0; i < this_user.length; i++) {
                    const user = this_user[i];
                    const time = user.terakhir_time;
                    const days_user = TimestampToDays((new Date(time)).getTime())
                    //
                    if (!user.kick && days_now - days_user >= 8) { // auto
                        // kick
                        console.log({ group_id, user, days_now, days_user }); // 1634633915000
                        await bot.sendMessage(group_id, bot.templateFormat("KICK DADAKAN!", [
                            bot.templateItemVariable("NAMA", user.name),
                            bot.templateItemVariable("UNIV", user.university),
                            bot.templateItemVariable("KELAS", user.member_class),
                            bot.templateItemVariable("ALASAN", "karena sudah 8 hari atau lebih tidak aktif di dalam grup", true),
                        ]), async () => {
                            console.log("sending...");
                            await bot.kickGroupMember(group_id, [user.number])
                            await changeKickTrue(user._id);
                        })
                    }
                }
                // await simulateAsyncPause(2000);
                resolve();
            }, async () => {
                await changeNowDay(_id, days_now);
            }, error => {
                //
            })
        }
        interval(1000);
    }, delay);
}
interval(3000); // first delay