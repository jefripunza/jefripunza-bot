const path = require('path');
const config = require('../config');
const { weekAndDay, getTime } = require('../helpers/date');
const { absenMember, checkGroupVerify } = require("../models");

const WhatsApp = require('../app/WhatsAppBOT');
const { writeFileSync } = require('fs');
const bot = new WhatsApp(path.join(__dirname, "..", "manage", config.whatsapp_session), {
    // debug: true,
    reconnect: true,
    bot_name: "Keep Smart BOT"
})
global.bot = bot;

bot.listenConnected(client => {
    console.log({ client });
});
bot.listenGroupParticipantsUpdate(activity => {
    console.log({ activity });
})
bot.listenMessage(async receive => {
    const {
        // system info
        botNumber,
        ownerNumber,
        // group manage
        groupMetadata,
        groupName,
        groupId,
        groupMembers,
        groupDesc,
        groupAdmins,
        isBotGroupAdmins,
        isGroupAdmins,
        // message manage
        from,
        user_id,
        //
        totalchat,
        chat,
        type,
        isGroup,
        pushname,
        message_prefix,
        message,
        link,
        messagesLink,
        command,
        args,
        far,
        isCmd,
        isMedia,
        isQuotedImage,
        isQuotedVideo,
        isQuotedSticker,
    } = receive;
    console.log({ receive, far: String(far).replaceAll("\n", " ") });
    // writeFileSync("anu.txt", far)

    // standard
    await receive.ping();

    // add-on
    await receive.tts();
    await receive.tanya();
    await receive.makeSticker(); //
    await receive.ytdl(); //
    await receive.ytmp3(); //

    // api
    await receive.meme(); //
    await receive.resepmasak(); //
    await receive.playstore(); //
    await receive.nonton(); //
    await receive.google(); //
    await receive.alquran(); //
    await receive.jadwaltv(); //
    await receive.kbbi(); //
    await receive.katacinta(); //
    await receive.ig(); //
    await receive.catatan(); //
    await receive.hartatahta(); //

    // extra response
    await receive.p(); //
    await receive.salam(); //
    await receive.greetings(); //
    await receive.slebew(); //
    await receive.tag_semua(); //
    await receive.send_contact_to_join(); //

    // testing
    await receive.inject(); //
    await receive.test(); //

    const fungsi = require('../manage/function')(bot, from, chat, message_prefix, message);
    if (checkGroupVerify(from)) {
        await fungsi.kata_kasar(async () => {
            console.log("Lolos...");
            if (await fungsi.isJoined(chat)) {
                console.log("Joined....");
                // absen
                try {
                    await absenMember(chat, isCmd ? message_prefix : message, getTime());
                } catch (error) {
                    console.log({ error });
                }
                if (isCmd) {
                    console.log("isCmd....");
                    if (String(message_prefix).toLowerCase().startsWith(config.prefix + "edit member")) {
                        if (isGroup) {
                            await fungsi.edit_member();
                        } else {
                            await receive.only_group();
                        }
                    } else if ([
                        config.prefix + "deskripsi",
                    ].some(v => command === v)) {
                        if (isGroup) {
                            if (isBotGroupAdmins) {
                                await fungsi.info_grup();
                            }else{
                                await receive.reply("maaf, bot belum jadi admin, jadikan admin bot nya donk biar *full service*")
                            }
                        } else {
                            await receive.only_group();
                        }
                    } else if ([
                        config.prefix + "info",
                        config.prefix + "saya",
                    ].some(v => command === v)) {
                        if (isGroup) {
                            await fungsi.info_user();
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(args[0]).toLowerCase() === "saya") {
                        if (isGroup) {
                            if (command === config.prefix + "strike") {
                                const strike_saya = global.strike.filter(v => {
                                    return v.number === String(chat.participant).split("@")[0];
                                }).map((v, i) => {
                                    const date = new Date(v.time).toLocaleDateString();
                                    return `${i + 1}. ${v.reason} (${date})`;
                                })
                                console.log("sini...", { strike: global.strike, strike_saya });
                                await fungsi.reply(bot.templateFormat("STRIKE SAYA", [
                                    bot.templateItemList("List", [
                                        ...strike_saya,
                                    ], true),
                                    bot.templateItemNormal("tolong jangan mengulangi kesalahan yang sama...", true),
                                ]));
                            } else if (command === config.prefix + "xp") {
                                const xp_saya = global.xp.filter(v => {
                                    return v.number === String(chat.participant).split("@")[0];
                                }).map((v, i) => {
                                    const date = new Date(v.time).toLocaleDateString();
                                    return `${i + 1}. ${v.reason} (${date})`;
                                })
                                await fungsi.reply(bot.templateFormat("XP SAYA", [
                                    bot.templateItemList("List", [
                                        ...xp_saya,
                                    ], true),
                                    bot.templateItemNormal("tetap semangat menjadi orang yang luar biasa...", true),
                                ]));
                            }
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "list ")) {
                        if (isGroup) {
                            const menu = message_prefix.toLowerCase().replace(config.prefix + "list ", "");
                            if (menu === "join") {
                                await fungsi.list_join();
                            } else if (menu === "belum join") {
                                await fungsi.belum_join();
                            }
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "execute ")) {
                        if (isGroup) {
                            await fungsi.only_su(async () => {
                                const menu = message_prefix.toLowerCase().replace(config.prefix + "execute ", "");
                                if (menu === "kick belum join") {
                                    await fungsi.kick_belum_join();
                                }
                            })
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "clear ")) {
                        if (isGroup) {
                            await fungsi.only_su(async () => {
                                const menu = message_prefix.toLowerCase().replace(config.prefix + "clear ", "");
                                if (menu === "strike") {
                                    await fungsi.clear_strike();
                                } else if (menu === "xp") {
                                    await fungsi.clear_xp();
                                }
                            });
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "tentang ")) {
                        if (isGroup) {
                            const menu = message_prefix.toLowerCase().replace(config.prefix + "tentang ", "");
                            if (menu === "strike") {
                                await fungsi.reply(bot.templateFormat("TENTANG STRIKE", [
                                    bot.templateItemVariable("PENJELASAN", [
                                        "Strike dibuat untuk sekuriti pengelola grup agar suasana grup dapat kondusif.",
                                    ], true),
                                    bot.templateItemList("Rule", [
                                        "Tidak boleh berkata kasar (auto)\n",
                                        "Tidak boleh SARA\n",
                                        "Tidak boleh menghina\n",
                                        "Tidak boleh mengirimkan konten negatif\n",
                                        "Tidak boleh mengirimkan link yang mencurigakan\n",
                                        "Tidak boleh menggunakan perintah Super User (system command)\n",
                                    ], true),
                                    bot.templateItemVariable("MAX STRIKE", 3),
                                    bot.templateItemNormal("jika sudah 3 strike ? maka akan otomatis kena kick dari grub oleh BOT", true),
                                ]));
                            } else if (menu === "xp") {
                                await fungsi.reply(bot.templateFormat("TENTANG XP", [
                                    bot.templateItemVariable("PENJELASAN", [
                                        "XP (Experience) adalah sebuah penilaian untuk member ketika mendapatkan hal baru saat masuk kedalam grup.",
                                    ], true),
                                    bot.templateItemList("Rule", [
                                        "Mengajari teman yang belum paham\n",
                                        "Mempelajari hal baru\n",
                                        "Berbuat hal positif lainnya yang membuat dirinya sendiri ada perubahan\n",
                                    ], true),
                                    bot.templateItemVariable("JIKA SUDAH MENCAPAI 20 XP ?", [
                                        "Akan otomatis dibuat admin grup oleh BOT sebagai apresiasi kontribusi dalam komunitas ini",
                                    ], true),
                                    bot.templateItemList("KEUNTUNGAN", [
                                        "Tidak perlu lagi absen mingguan\n",
                                        "Boleh membantu mengeluarkan paksa member yang terindikasi rusuh (tetap izin dulu)\n",
                                        "Akan menjadi team inti menentukan kebijakan komunitas ini\n",
                                        "Bisa request materi\n",
                                    ], true),
                                ]));
                            }
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "add ")) {
                        if (isGroup) {
                            await fungsi.only_su(async () => {
                                const pisah = message_prefix.toLowerCase().split(" ");
                                const menu = pisah[1]
                                const value = pisah[2]
                                if (menu === "katakasar") {
                                    await fungsi.tambahKataKasar(value);
                                }
                            });
                        } else {
                            await receive.only_group();
                        }
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "strike ")) {
                        await fungsi.only_su(async () => {
                            await fungsi.execute_strike();
                        });
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "xp ")) {
                        await fungsi.only_su(async () => {
                            await fungsi.execute_xp();
                        });
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "tutorial-su")) {
                        await fungsi.only_su(async () => {
                            await receive.reply(bot.templateFormat("Super User Command", [
                                bot.templateItemSkip(),
                                bot.templateItemCommand("verifikasi grup", "*!grup verifikasi*", [
                                    "untuk mencopot verifikasi : *!grup copot*",
                                ]),
                                bot.templateItemCommand("Eksekusi", "*!execute*  _perintah_", [
                                    "*!execute*  kick belum join",
                                ]),
                                bot.templateItemCommand("Add Kata Kasar", "*!add katakasar*  _kata_"),
                                bot.templateItemCommand("Add Strike", "*!strike*  _@target_  _keterangan_"),
                                bot.templateItemCommand("Add XP", "*!xp*  _@target_  _keterangan_"),
                                bot.templateItemCommand("Menghapus Semua", "*!clear*  _perintah_", [
                                    "*!clear*  strike",
                                    "*!clear*  xp",
                                ]),
                            ]))
                        });
                    } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "test")) {
                        if (isGroup) {
                            //
                        } else {
                            await receive.only_group();
                        }
                    } else {
                        // await receive.reply(`maaf, perintah *${command}* tidak tersedia!`)
                    }
                }
            } else {// non join
                if (isCmd) {
                    if (isGroup) {
                        if (String(message_prefix).toLowerCase().startsWith(config.prefix + "join")) { // pake startWith karena sistem enter datanya
                            await fungsi.join_member();
                        } else if (String(message_prefix).toLowerCase().startsWith(config.prefix + "list ")) {
                            const menu = message_prefix.toLowerCase().replace(config.prefix + "list ", "");
                            if (menu === "join") {
                                await fungsi.list_join();
                            }
                        } else {
                            // harus join dulu
                            await fungsi.access_denied();
                        }
                    } else {
                        receive.only_group();
                    }
                } else {
                    // chat bebas
                    await fungsi.hey_belum_daftar();
                }
            }
        })
    }

    // for SU
    if (isCmd && isGroup) {
        if (String(message_prefix).toLowerCase().startsWith(config.prefix + "grup ")) {
            if (isGroup) {
                await fungsi.only_su(async () => {
                    const menu = message_prefix.toLowerCase().replace(config.prefix + "grup ", "");
                    if (menu === "verifikasi") {
                        await fungsi.grup_verifikasi();
                    } else if (menu === "copot") {
                        await fungsi.grup_copot();
                    }
                })
            } else {
                await receive.only_group();
            }
        }
    }

    // tutorial wajib di paling bawah
    const add_tutorial = [
        bot.templateItemTitle("INFORMASI"),
        bot.templateItemCommand("Edit Info Member", "_formulir ada dipaling bawah tutorial_"),
        bot.templateItemCommand("Info Variabel", "*!tentang*  _variabel_", [
            "apa itu STRIKE ? *!tentang*  strike",
            "apa itu XP ? *!tentang*  xp",
        ]),
        bot.templateItemCommand("Lihat yang Sudah Join", "*!list*  join", [
            "jika yang belum join : *!list belum join* "
        ]),
        bot.templateItemCommand("Info Grup", "*!deskripsi*", [
            "bisa juga *!grup*"
        ]),
        bot.templateItemCommand("Info Member", "*!saya*", [
            "bisa juga *!info*",
            "melihat record XP : *!xp  saya*",
            "melihat record STRIKE : *!strike  saya*",
        ]),
    ];
    await receive.tutorial(checkGroupVerify(from), add_tutorial);
})
