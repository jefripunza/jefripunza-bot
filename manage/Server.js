const app = global.app;
const bot = global.bot;

const {
  MessageType,
} = require("@adiwajshing/baileys");
const { generateRandomOTP } = require("../helpers/generate");

app.get("/cek-nomor/:nomor", async (req, res, next) => {
  await bot.isRegisteredUser(req.params.nomor, () => {
    res.status(200).json({
      registered: true,
    });
  }, () => {
    res.status(200).json({
      registered: false,
    })
  })
});

app.get("/kirim-otp/:nomor", async (req, res, next) => {
  await bot.isRegisteredUser(req.params.nomor, () => {
    const otp = generateRandomOTP()
    bot.sendMessage(bot.formatter(req.params.nomor, "@s.whatsapp.net"), bot.templateFormat("OTP", [
      bot.templateItemVariable("Kode OTP", otp),
      bot.templateItemNormal(`_*jangan bagikan kode OTP ini ke orang lain*_`),
    ]), MessageType.text)
      .then(() => {
        res.status(200).json({
          status: true,
          message: "berhasil mengirimkan OTP",
          otp,
        });
      })
      .catch(() => {
        res.status(200).json({
          status: false,
          message: "gagal mengirimkan OTP",
        })
      })
  }, () => {
    res.status(200).json({
      status: false,
      message: "nomer whatsapp tidak terdaftar",
    })
  })
});

app.get("*", (req, res, next) => {
  return res.status(200).json({
    active: true,
  });
});