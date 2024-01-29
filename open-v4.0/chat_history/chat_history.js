Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix, Lw, FS, state, snd, getDate, c_path,
    Kakaocord,
    msg,
    Pos, chat_log, random,
    addCode, User, Coin, Nickname,
    ogimg 
} = require("A");


function onMessage(event) {
    let today = getDate.year + 'y/' + (getDate.month + 1) + 'm/' + getDate.day + 'd';
    let time = getDate.hour + "h " + getDate.minutes + "m " + getDate.seconds + "s";

    let path = 'sdcard/BotData/chat/' + today + '.json';

    if (!FS.read(path)) FS.write(path, '{}');
    let json = JSON.parse(FS.read(path));

    if (json[event.room.name] == undefined) json[event.room.name] = {};
    if (json[event.room.name][event.sender.name] == undefined) json[event.room.name][event.sender.name] = [];

    if (event.message.startsWith(prefix)) {
        if (event.message.startsWith(prefix + "e")) return;
        json[event.room.name][event.sender.name].push(time + " : " + event.message);
        A.fs.write(path, JSON.stringify(json, null, 4));
        return;
    }

}