String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

require("./app/WhatsApp");
require("./app/Express");

require("./manage/BOT");
require("./manage/Server");

require("./interval"); // let's goo
