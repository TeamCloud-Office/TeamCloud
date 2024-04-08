let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    AP,
    Kakaocord,
    User,
    LS,
    msg,
    Pos,
    chat,
    post,
    random,
    Coin,
    Nickname,
    Like,
    ogimg
} = require("A");

let json = JSON.parse(FS.read(SP))
let mentions = json['mentions'];
let nicknames = [];
let block_room = ["노란콩대화 자동응답기 공동체", "카카오톡봇 RPG Maker 공식방", "TeamCloud 팀원"];

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

    if (!nicknames.includes(event.sender.name))
        nicknames.push(event.sender.name);

    if (block_room.includes(event.room.name)) return;

    let time = (t) => {
        let seconds = Math.floor(t % 60);
        let minutes = Math.floor((t % 3600) / 60);
        let hours = Math.floor((t % (3600 * 24)) / 3600);
        let day = Math.floor(t / (3600 * 24));

        return day + "일 " + hours + "시간 " + minutes + "분 " + seconds + "초"
    };


    if ((Object.keys(mentions).includes(event.sender.name))) {
        let items = mentions[event.sender.name];
        let contents = [];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item["room"] == event.room.name) {
                contents.push('[채팅방: ' + item.room + '] ' + item.sender + '의 메시지 | ' + time(Math.floor(Date.now() / 1000) - item.time) + ' 전' +
                    "\n" +
                    '→ ' + item.content);
            }
        }
        event.room.send([
            msg.noti,
            LM("멘션"),
            event.sender.name + '님, ' + contents.length + '개의 알림이 있습니다.',
            Lw,
            contents.join('\n' + Line(3) + '\n')
        ].join('\n'));

        delete mentions[event.sender.name];
        FS.write(SP, JSON.stringify(json, null, 4));
    }

    if ((/@.+/.test(event.message))) {
        let users = nicknames.filter(e => event.message.includes('@' + e + ' '));
        if (users.length === 0) return;

        let mention = {
            sender: event.sender.name,
            room: event.room.name,
            time: Math.floor(Date.now() / 1000),
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
            msg.noti,
            LM("멘션"),
            event.sender.name + '님이 ' + users.join(', ') + '님을 멘션하였습니다.',
            '→ ' + users.join(', ') + '님이 오면 전달하겠습니다.'
        ].join('\n'));
        FS.write(SP, JSON.stringify(json, null, 4));
    }

    if (event.message == "!1") event.room.send(JSON.stringify(mentions, null, 4));
    if (event.message == "!2") {
        mentions = {};
        FS.write(SP, JSON.stringify(json, null, 4));
        event.room.send("success");
    }

}