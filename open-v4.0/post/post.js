Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    Lw,
    FS,
    state,
    snd,
    getDate,
    c_path,
    Kakaocord,
    msg,
    Pos,
    chat_log,
    random,
    addID,
    User,
    Coin,
    Nickname,
    ogimg
} = require("A");

function onMessage(event) {
        let target = event.message.replace(A.prefix + "우편 ", "").split(" ` ")[0];
        let msg = event.message.replace(A.prefix + "우편 ", "").split(" ` ")[1];

        if (event.message.startsWith(prefix + "우편")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (User.edit(event.sender.name, false).ban) return event.room.send(msg.noti + '나 너 싫어!');
            if (!User.edit(event.sender.name, false).admin) return event.room.send(msg.noti + '우리 가족이 아냐!');
            if (User.read(target)) {
                if (!snd[target]) snd[target] = [];
                event.room.send(event.sender.name + '가 ' + target + '에게 메세지를 보냈어!');
                snd[target].push([
                    '메시지 : ' + msg,
                    ,
                    ,
                    '관리자 이름 : ' + event.sender.name
                ].join("\n"));
            } else {
                event.room.send("해당 친구를 찾을 수 없어!(" + target + ")");
            }
        }
        let snd_ = JSON.stringify(snd);
        if (snd[event.sender.name]) {
            event.room.send(' [' + event.sender.name + ']님, 아래 우편 확인바랍니다. \n' + '우편 개수 : ' + snd[event.sender.name].length + '' + A.Lw + '\n\n\n' + snd[event.sender.name].join('\n\n\n\n'));
            delete snd[event.sender.name];
        }

        if (event.message == "post Test") event.room.send(snd_);
}