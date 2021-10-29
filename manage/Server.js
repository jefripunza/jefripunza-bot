const app = global.app;
const bot = global.bot;

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

app.get("*", (req, res, next) => {
  return res.status(200).json({
    active: true,
  });
});