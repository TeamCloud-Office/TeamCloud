Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    getDate,
    Coin,
} = require("A");

let atten_path = 'sdcard/BotData/check-in_list.json';
let atten_json = JSON.parse(A.fs.read(atten_path));

let today = new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate();

let random = (per) => {
    if (Math.random() * 100 < per) {
        return true;
    } else {
        return false;
    }
};

function onMessage(event) {

    let coin;
    let result;
    if (random(50)) {
        coin = 10 * 2;
        result = "2배";
    } else if (random(25.7)) {
        coin = 10 * 3;
        result = "3배";
    } else if (random(10.3)) {
        coin = 10 * 4;
        result = "4배";
    } else if (random(14)) {
        coin = 10 * 5;
        result = "5배";
    }

    if (event.message == prefix + "출석") {
        if (!["TeamCloud 커뮤니티", "TeamCloud 팀원"].includes(event.room.name)) return;
        if (![0, 6].includes(getDate.day)) return;
        if (Array(atten_json['list'][event.room.name]).includes(event.sender.name)) return;
        event.room.send(Coin(event.sender.name, "주말 출석 이벤트!(" + result + ")" + " #" + getDate.day, coin));

    }
}