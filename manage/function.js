
const {
    tambahStrike, tambahXp, getLength, joinMember, editMember, clearStrike, clearXP, tambahKataKasar, absenMember, checkGroupVerify, addGrupVerifikasi, removeGrupVerifikasi,
} = require("../models")
const {
    replaceAll,
} = require("../helpers/data.js");
const config = require('../config');

const {
    MessageType,
    Presence,
} = require("@adiwajshing/baileys");

module.exports = (bot, from, chat, message_prefix, message) => {
    const fungsi = {
        perintah_tidak_tersedia: async () => {
            const pisah = String(message_prefix).split(" ");
            await fungsi.reply(`maaf, perintah *${pisah[0]}* tidak tersedia !!`, () => {
                console.log("wrong, command!");
            });
        },
        reply: async (message, onSuccess = false) => {
            await bot.reply(from, message, MessageType.text, chat, () => {
                console.log("sending...");
                if (onSuccess) onSuccess();
            })
        },
        only_su: async (yes) => {
            if (String(chat.participant).includes(global.system.su)) {
                yes();
            } else {
                await fungsi.reply(`maaf, perintah hanya bisa dilakukan oleh *${global.system.nama_su}* !!`, () => {
                    console.log("wrong , other user use command!");
                });
            }
        },
        // ===============================================================================================
        join_member: async () => {
            const pisah = String(message_prefix).split("\n");
            const nama = pisah[1]
            const univ = pisah[2]
            const kelas = pisah[3]
            if (nama && univ && kelas) {
                await joinMember(chat.participant, nama, univ, kelas, async () => {
                    await bot.replyWithPictureQuoteButton(chat, bot.templateFormat("NEW MEMBER!", [
                        bot.templateItemVariable("NAMA", nama),
                        bot.templateItemVariable("UNIV", univ),
                        bot.templateItemVariable("KELAS", kelas),
                    ]), {
                        button: [
                            "!tentang strike",
                            "!tentang xp",
                            "!tutorial",
                        ],
                        message: "untuk pengguna baru silahkan klik tombol-tombol berikut untuk mempelajari hal-hal mengenai peraturan dan apa saja yang ada didalam grup ini",
                        footer: "ttd : Mas Jefri",
                    }, async () => {
                        console.log("new member!");
                    })
                }, async () => {
                    await bot.reply(from, chat, `maaf, anda sudah pernah join!`, () => {
                        console.log("member is joined!");
                    });
                });
            } else {
                await bot.reply(from, chat, `maaf, format join kamu salah, lihatlah baik2 formatnya!`, () => {
                    console.log("member is joined!");
                });
            }
        },
        edit_member: async () => {
            const pisah = String(message_prefix).split("\n");
            const nama = pisah[1]
            const univ = pisah[2]
            const kelas = pisah[3]
            if (nama && univ && kelas) {
                if (await editMember(chat.participant, nama, univ, kelas)) {
                    await bot.replyWithPictureAndQuote(chat, bot.templateFormat("UPDATE MEMBER!", [
                        bot.templateItemVariable("NAMA", nama),
                        bot.templateItemVariable("UNIV", univ),
                        bot.templateItemVariable("KELAS", kelas),
                    ]), () => {
                        console.log("update member!", pisah);
                    })
                }
            } else {
                await bot.reply(from, chat, `maaf, format join kamu salah, lihatlah baik2 formatnya!`, () => {
                    console.log("member is joined!");
                });
            }
        },
        // ===============================================================================================
        info_grup: async () => {
            await bot.getGroupInfo(from);
        },
        info_user: async () => {
            const jumlah_strike = await getLength("strike", String(chat.participant).split("@")[0]);
            const jumlah_xp = await getLength("xp", String(chat.participant).split("@")[0]);
            const user_meta = global.join.filter(v => {
                return String(v.number).split("@")[0] === String(chat.participant).split("@")[0]
            })[0];
            const inject_user_meta = user_meta !== undefined ? [
                bot.templateItemVariable("UNIV", user_meta.university),
                bot.templateItemVariable("KELAS", user_meta.member_class),
            ] : [];
            const nama_user = user_meta !== undefined ? user_meta.name : bot.getNameUser(await bot.getUserMeta(chat))
            console.log({
                jumlah_strike,
                jumlah_xp,
                user_meta,
                nama_user,
                inject_user_meta,
            });
            await bot.replyWithPictureAndQuote(chat, bot.templateFormat("INFO MEMBER", [
                bot.templateItemVariable("NAMA", nama_user),
                ...inject_user_meta,
                bot.templateItemVariable("XP", jumlah_xp),
                bot.templateItemVariable("STRIKE", jumlah_strike + " (max 3 ? kick)"),
            ]));
        },
        // ===============================================================================================
        strike: async (number, reason) => {
            let member = await bot.getInfoGroupMember(from)
            member = member.filter(v => {
                return v.id === number + "@c.us"
            })[0];
            const member_name = member.notify || member.vname || number;
            const jumlah_strike = await getLength("strike", number) + 1;
            console.log({ number, reason, member, member_name, jumlah_strike });
            if (jumlah_strike < 3) {
                if (await tambahStrike(number, reason)) {
                    await fungsi.reply(bot.templateFormat("STRIKE!", [
                        bot.templateItemVariable("NAMA", member_name),
                        bot.templateItemVariable("NOMOR", number),
                        bot.templateItemVariable("TOTAL STRIKE", jumlah_strike),
                        bot.templateItemVariable("ALASAN", reason, true),
                        bot.templateItemNext("jangan mengulangi lagi ya..."),
                    ]), () => {
                        console.log("strike OK!");
                    });
                } else {
                    console.log("gagal menambahkan strike!");
                }
            } else {
                // banned dari grup
                await bot.sendMessage(from, bot.templateFormat("KICK GRUP!", [
                    bot.templateItemVariable("NAMA", member_name),
                    bot.templateItemVariable("NOMOR", number),
                    bot.templateItemNormal("terkena strike untuk terakhir kalinya!", true),
                    bot.templateItemNormal("tidak ada kata maaf untuk orang2 pelanggar."),
                    bot.templateItemNormal("semua wajib menaati peraturan sesuai deskripsi grup ini"),
                    bot.templateItemEnter(),
                    bot.templateItemVariable("TOTAL STRIKE", jumlah_strike),
                ]), async () => {
                    console.log("Max Strike!");
                    await bot.kickGroupMember(from, [number]);
                });
            }
        },
        execute_strike: async () => {
            const pisah = String(message_prefix).split(" ");
            if (replaceAll(String(message_prefix).toLowerCase(), " ", "") !== config.prefix + "strike") {
                try {
                    const number = pisah[1]
                        .split("@")[1]
                    const reason = pisah
                        .filter((v, i) => {
                            return i > 1
                        })
                        .join(" ")
                    if (String(reason).length > 0) {
                        await fungsi.strike(number, reason);
                    } else {
                        fungsi.reply("bro, kamu lupa menambahkan alasan strike!", () => {
                            console.log("wrong cmd!");
                        })
                    }
                } catch (error) {
                    await fungsi.send_error(error);
                }
            } else {
                fungsi.reply("perintah tidak komplit...", () => {
                    console.log("wrong cmd!");
                })
            }
        },
        clear_strike: async () => {
            try {
                await clearStrike();
            } finally {
                await fungsi.reply(`berhasil mereset strike!`, () => {
                    console.log(`data strike is gone!`);
                });
            }
        },
        kata_kasar: async (lolos) => {
            const list_kata_kasar = global.kata_kasar ? global.kata_kasar.map(v => {
                return v.kata;
            }) : [];
            if (list_kata_kasar.some(v => String(message).toLowerCase().includes(v))) {
                const user_number = chat.participant.split("@")[0];
                console.log({ user_number });
                await fungsi.strike(user_number, "berkata kasar...");
            } else {
                if (lolos)
                    lolos()
            }
        },
        tambahKataKasar: async (value) => {
            try {
                await tambahKataKasar(value)
            } finally {
                await fungsi.reply(`berhasil menambahkan kata kasar!`, () => {
                    console.log(`jerk word is inserted!`);
                });
            }
        },
        // ===============================================================================================
        execute_xp: async () => {
            const pisah = String(message_prefix).split(" ");
            if (replaceAll(String(message_prefix).toLowerCase(), " ", "") !== config.prefix + "xp") {
                try {
                    const number = pisah[1]
                        .split("@")[1];
                    const reason = pisah.filter((v, i) => {
                        return i > 1
                    }).join(" ");
                    if (String(reason).length > 0) {
                        const jumlah_xp = await getLength("xp", number) + 1;
                        let member = await bot.getInfoGroupMember(from)
                        member = member.filter(v => {
                            return v.id === number + "@c.us"
                        })[0];
                        const member_name = member.notify || member.vname || number;
                        if (await tambahXp(number, reason)) {
                            await bot.sendMessage(from, bot.templateFormat("TAMBAH XP!", [
                                bot.templateItemVariable("NAMA", member_name),
                                bot.templateItemVariable("NOMOR", number),
                                bot.templateItemVariable("ALASAN", reason, true),
                                bot.templateItemNext("ayo tetap semangat !!"),
                                bot.templateItemVariable("TOTAL XP", jumlah_xp),
                            ]), () => {
                                console.log("xp OK!");
                                const batas_xp = 20;
                                if (jumlah_xp >= batas_xp) {
                                    if (!member.isAdmin) {
                                        // jadikan admin
                                        fungsi.reply(`hey!\n*${member_name}* telah mencapai *${batas_xp} XP*. saya akan jadikan dia sebagai _*admin*_ di grup ini untuk merayakan selamat kepada ${member_name}`, () => {
                                            console.log("add admin!");
                                            bot.promoteAdmin(from, [number])
                                        })
                                    }
                                }
                            });
                        } else {
                            console.log("gagal menambahkan xp!");
                        }
                    } else {
                        fungsi.reply("bro, kamu lupa menambahkan alasan!", () => {
                            console.log("wrong cmd!");
                        })
                    }
                } catch (error) {
                    await fungsi.send_error(error);
                }
            } else {
                fungsi.reply("perintah tidak komplit...", () => {
                    console.log("wrong cmd!");
                })
            }
        },
        clear_xp: async () => {
            try {
                await clearXP();
            } finally {
                await fungsi.reply(`berhasil mereset XP!`, () => {
                    console.log(`data xp is gone!`);
                });
            }
        },
        // list
        list_join: async () => {
            const list_join = global.join;
            const sudah_join = list_join.filter(v => {
                return String(v.number).split("@")[0] === String(chat.participant).split("@")[0];
            }).length > 0;
            const join = list_join.map((v, i) => {
                const date = new Date(v.time).toLocaleDateString();
                const date_pisah = String(date).split("/")
                return `${i + 1}. ${v.name}\nuniversitas : ${v.university}\nkelas : ${v.member_class}\njoin sejak : ${date_pisah[1]}/${date_pisah[0]}/${date_pisah[2]}\n\n`;
            })
            fungsi.reply(bot.templateFormat("SUDAH JOIN", [
                bot.templateItemList("List", [
                    ...join,
                ], true),
                bot.templateItemVariable("SUDAH JOIN", sudah_join ? "*SUDAH*" : String(chat.participant).split("@")[0] === global.system.su ? "*SYSTEM*" : "*BELUM*"),
            ]));
        },
        user_belum_join: async () => {
            const group_meta = await bot.getGroupParticipants(from, true);
            const list_join = global.join
                .map(v => v.number)
            const participant = group_meta
                .filter(v => {
                    return !v.isSuperAdmin
                })
                .filter(v => {
                    return !v.isAdmin
                })
                .filter(v => {
                    return v.jid !== bot.conn.user.jid
                })
                .map(v => v.jid)
            const belum_join = participant
                .filter(user => {
                    return !list_join.some(join => {
                        return user === join
                    })
                })
            return {
                belum_join,
                belum_join_text: belum_join.map(user => {
                    const this_user = group_meta.filter(v => {
                        return v.jid === user
                    })[0];
                    const name_user = bot.getNameUser(this_user) === user ? "No Name" : bot.getNameUser(this_user)
                    return `@${user.split('@')[0]} ${name_user}\n\n`
                }),
            }
        },
        belum_join: async () => {
            const {
                belum_join,
                belum_join_text
            } = (await fungsi.user_belum_join());
            await bot.conn.sendMessage(from, bot.templateFormat("BELUM JOIN", [
                bot.templateItemList("List", [
                    ...belum_join_text,
                ], true),
                bot.templateItemNormal("diharapkan untuk yang belum join sesegeralah untuk join kalau tidak maka akan admin *Kick* secara paksa\ncara join adalah isi formulir dibawah ini"),
            ]), MessageType.text, { contextInfo: { mentionedJid: [...belum_join] }, quoted: chat })
                .then(async () => {
                    console.log("list belum join...");
                    await fungsi.reply(`!join\nnama panjang\nuniversitas\nnama kelas`);
                })
        },
        kick_belum_join: async () => {
            const {
                belum_join,
                belum_join_text
            } = (await fungsi.user_belum_join());
            await bot.conn.sendMessage(from, bot.templateFormat("KICK SEMUA BELUM JOIN", [
                bot.templateItemList("List", [
                    ...belum_join_text,
                ], true),
                bot.templateItemNormal("maafkan admin, ini keputusan bersama bahwasanya sebelumnya sudah diberitahu namun tidak di indahkan. Sayonara yang kena KICK !!"),
            ]), MessageType.text, { contextInfo: { mentionedJid: [...belum_join] }, quoted: chat })
                .then(() => {
                    console.log("kick semua manusia yang belum join...");
                })
            await bot.kickGroupMember(from, belum_join)
        },
        grup_verifikasi: async () => {
            if (await addGrupVerifikasi(from)) {
                await fungsi.reply(bot.templateFormat("GRUP TER-VERIFIKASI", [
                    bot.templateItemNormal("Selamat menikmati service dari BOT..."),
                    bot.templateItemNormal("silahkan ketik *!tutorial* dan kirimkan ke grub ini agar mengetahui perintah BOT"),
                ]));
            } else {
                await fungsi.reply(bot.templateFormat("GRUP SUDAH VERIFIKASI", [
                    bot.templateItemNormal("Grup ini sudah ter-verifikasi oleh BOT..."),
                ]));
            }
        },
        grup_copot: async () => {
            if (await removeGrupVerifikasi(from)) {
                await fungsi.reply(bot.templateFormat("GRUP DI COPOT", [
                    bot.templateItemNormal("Grup berhasil dicopot..."),
                    bot.templateItemNormal("silahkan ketik *!tutorial* dan kirimkan ke grub ini agar mengetahui perintah BOT"),
                ]));
            } else {
                await fungsi.reply(bot.templateFormat("GRUP TIDAK VERIFIKASI", [
                    bot.templateItemNormal("Grup ini memang tidak ter-verifikasi..."),
                ]));
            }
        },
        // ===============================================================================================
        isJoined: (chat) => {
            return global.join ?
                global.join.filter(v => {
                    return v.number === chat.participant;
                }).length > 0
                || String(chat.participant).includes(global.system.su) // sudah join / SU bisa akses
                : false;
        },
        access_denied: async () => {
            await fungsi.reply(bot.templateFormat("ACCESS DENIED!", [
                bot.templateItemNormal("maaf, anda harus join terlebih dahulu untuk mengakses bot", true),
                bot.templateItemList("CARA JOIN", [
                    "copy / salin format pesan yang ada dibawah ini (kiriman bot)",
                    "paste / tempel format kedalan input pesan",
                    `rubahlah _*"HANYA"*_ *nama panjang, universitas,* dan *nama kelas* sesuai fakta`,
                    "setelah selesai, kirim pesan ke grup ini. dan akan menerima balasan bot ketika berhasil join."
                ], true),
                bot.templateItemList("CATATAN", [
                    "Jika data tidak benar maka admin akan memperingatkan untuk merubah data dengan benar. Dan jika masih belum berubah maka konsekuensinya adalah *kick grup*.",
                ], true),
            ]));
            await fungsi.reply(`!join\nnama panjang\nuniversitas\nnama kelas`);
        },
        hey_belum_daftar: async () => {
            await fungsi.reply(bot.templateFormat("HEY KAMU!", [
                bot.templateItemNormal("Kamu Belum Join, silahkan secepatnya join atau akan kami _*Kick*_ dari grup !!\nsilahkan isi formulir join berikut ini..."),
            ]), async () => {
                console.log("heeyyyy!");
            });
            await fungsi.reply(`!join\nnama panjang\nuniversitas\nnama kelas`);
        },
    }
    return fungsi;
};
