Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    Set,
    getDate,
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

    let path = 'sdcard/BotData/chat/' + getDate.today("/") + '.json';

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