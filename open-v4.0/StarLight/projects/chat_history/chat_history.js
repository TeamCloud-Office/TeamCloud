
let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    User,
    LS,
    msg,
    Pos,
    chat,
    random,
    Coin,
    Nickname,
    ogimg
  } = require("A");


function onMessage(event) {

    let getDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        day: new Date().getDay(),
        today: (str) => new Date().getFullYear() + str + (new Date().getMonth() + 1) + str + new Date().getDate(),
        time: (str) => new Date().getHours() + str + new Date().getMinutes() + str + new Date().getSeconds()
    };

    let path = 'sdcard/StarLight/BotData/chat/' + getDate.today("/") + '.json';

    if (!FS.read(path)) FS.write(path, '{}');
    let json = JSON.parse(FS.read(path));

    if (json[event.room.name] == undefined) json[event.room.name] = {};
    if (json[event.room.name][event.sender.name] == undefined) json[event.room.name][event.sender.name] = [];

    if (event.message.startsWith(prefix)) {
        if (event.message.startsWith(prefix + "e")) return;
        json[event.room.name][event.sender.name].push(getDate.time(":") + " : " + event.message);
        FS.write(path, JSON.stringify(json, null, 4));
        return;
    }

}