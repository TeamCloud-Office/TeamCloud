Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let A = Bridge.getScopeOf("A");


function onMessage(event) {
    let today = new Date().getFullYear() + 'y/' + (new Date().getMonth() + 1) + 'm/' + new Date().getDate() + 'd';
    let time = new Date().getHours() + "h " + new Date().getMinutes() + "m " + new Date().getSeconds() + "s";

    let path = 'sdcard/BotData/chat/' + today + '.json';

    if (!A.fs.read(path)) A.fs.write(path, '{}');
    let json = JSON.parse(A.fs.read(path));

    if (json[event.room.name] == undefined) json[event.room.name] = {};
    if (json[event.room.name][event.sender.name] == undefined) json[event.room.name][event.sender.name] = [];

    if (event.message.startsWith(A.prefix)) {
        if(event.message.startsWith(A.prefix + "e")) return;
        json[event.room.name][event.sender.name].push(time + " : " + event.message);
        A.fs.write(path, JSON.stringify(json, null, 4));
        return;
    }

}