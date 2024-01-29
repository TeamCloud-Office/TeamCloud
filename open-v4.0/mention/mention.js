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
    addCode,
    User,
    Coin,
    Nickname,
    ogimg
} = require("A");

let mentions = {};
let nicknames = [];
let block_room = ["노란콩대화 자동응답기 공동체", "카카오톡봇 RPG Maker 공식방 (코드:1345z)"];
let Lw = '\u200b'.repeat(500);

function onMessage(event) {
    if (!nicknames.includes(event.sender.name))
        nicknames.push(event.sender.name);

    if (block_room.includes(event.room.name)) return;

    let time = (t) => {
        let seconds = Math.floor(t / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let day = Math.floor(hours / 24);

        return dat + "일" + hours % 24 + "시간 " + minutes % 60 + "분 " + seconds % 60 + "초"
    };

    if ((Object.keys(mentions).includes(event.sender.name)) && mentions[event.sender.name].room == event.room.name) {
        let contents = mentions[event.sender.name]
            .map((e, v) => {
                return [
                    '[채팅방: ' + e.room + '] ' + e.sender + '의 메시지 | ' + time(Date.now() - e.time) + ' 전',
                    '→ ' + e.content
                ].join('\n');
            });

        Api.replyRoom(mentions[event.sender.name].room, [
            event.sender.name + '야! ' + contents.length + '개의 알림이 있어!',
            '전체보기를 눌러 확인해줘!',
            Lw,
            contents.join('\n\n')
        ].join('\n'));

        delete mentions[event.sender.name];
    }

    if ((/@.+/.test(event.message))) {
        let users = nicknames.filter(e => event.message.includes('@' + e + ' '));
        if (users.length === 0) return;

        let mention = {
            sender: event.sender.name,
            room: event.room.name,
            time: Date.now(),
            content: event.message
        };

        users.forEach(e => {
            if (e in mentions) {
                mentions[e].push(mention);
            } else {
                mentions[e] = [mention];
            }
        });
        event.room.send([
            event.sender.name + '가 ' + users.join(', ') + ' 를/을 멘션!',
            '→ ' + users.join(', ') + '가 오면 전달해줄게!'
        ].join('\n'));
    }
}