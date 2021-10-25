String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

require("./models/engine/MongoDB");
require("./interval"); // let's goo

require("./manage/BOT");
