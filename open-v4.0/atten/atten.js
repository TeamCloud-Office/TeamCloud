Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    state,
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

let path = 'sdcard/BotData/check-in_list.json';

let line = '\u2501'.repeat(9);

if (!FS.read(path)) FS.write(path, '{}'); //만약 해당 경로에 파일이 없다면 파일 생성
let json = JSON.parse(FS.read(path)); //파일에 있는 데이터를 JSON형식으로 json변수에 대입

let today = getDate.year + '.' + getDate.month + '.' + getDate.date;

if (json['today'] == undefined) json['today'] = today;
if (json['list'] == undefined) json['list'] = {};
if (json['store'] == undefined) json['store'] = {};


function onProjectButtonClicked(id) {
    if (id == "reset_tc") {
        Api.makeNoti("data reset", 'atten');
        json["list"]["TeamCloud 커뮤니티"] = {};
        FS.write(path, JSON.stringify(json, null, 4));
    }
}

function onMessage(event) {
    let cut = event.message.split(" ");

    var room_list = [];
    if (!room_list.includes(event.room.name)) room_list.push(event.room.name);


    if (json['today'] != today) { //만약 하루가 지났다면 초기화
        json['today'] = today;
        json['list'] = {};
        FS.write(path, JSON.stringify(json, null, 4));
    }

    if (json['list'][event.room.name] == undefined) json['list'][event.room.name] = {};
    if (json['store'][event.room.name] == undefined) json['store'][event.room.name] = {};

    let coin = User.edit(event.sender.name).coin,
        nickname = User.edit(event.sender.name).nickname[0];


    if (event.message.startsWith(prefix + "출석")) {
        if (User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
        if (User.edit(event.sender.name).ban) return event.room.send(msg.noti + '나 너 싫어!');

        switch (cut[2]) {
            case "체크":
                if (json['list'][event.room.name].includes(event.sender.name)) { //만약 출석목록에 이름이 있는경우
                    event.room.send([
                        msg.noti,
                        LM("[출석체크]"),
                        "사용자: " + "[" + nickname + "]" + event.sender.name,
                        Line(3),
                        "출석체크를 " + json["list"][event.room.name][event.sender.name] + "에 이미 완료하였습니다."
                    ].join('\n')); //출석체크
                } else { //없는 경우
                    let rank = (Number(json['list'][event.room.name].length) + 1);
                    let time = String(getDate.time(":"))
                    event.room.send([
                        msg.noti,
                        LM("[출석체크]"),
                        "사용자: " + "[" + nickname + "]" + event.sender.name,
                        Line(3),
                        "출석체크를 " + time + "에 완료하였습니다.",
                        "► 오늘의 순위: " + rank
                    ].join("\n"));

                    event.room.send(Coin(event.sender.name, "출석체크 완료", 5, false));

                    json['list'][event.room.name][event.sender.name] = time;

                    if (json['store'][event.room.name][event.sender.name] == undefined) json['store'][event.room.name][event.sender.name] = {
                        'today_ranking': 0,
                        'first_count': 0,
                        'count': 0,
                        'achieve': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    };
                    json['store'][event.room.name][event.sender.name]['today_ranking'] = rank;
                    json['store'][event.room.name][event.sender.name]['count']++;
                    if (rank > 0 && rank <= 10) json['store'][event.room.name][event.sender.name]['achieve'][(rank - 1)]++;

                    if (rank == 1) {
                        json['store'][event.room.name][event.sender.name]['first_count']++;
                        event.room.send(Coin(event.sender.name, "출석체크 1등", 10, false));
                    }

                    if (json['store'][event.room.name][event.sender.name]['first_count'] >= 50) {
                        if (!User.edit(event.sender.name).nickname.includes("출석왕!")) {
                            event.room.send(Nickname(event.sender.name, "출석 50회 이상 1등", "출석왕!", false));
                        }
                    }
                    if (json['store'][event.room.name][event.sender.name]['first_count'] >= 100) {
                        if (!User.edit(event.sender.name).nickname.includes("출석왕!!")) {
                            event.room.send(Nickname(event.sender.name, "출석 100회 이상 1등", "출석왕!!", false));
                        }
                    }

                    java.lang.Thread.sleep(1000);
                    FS.write(path, JSON.stringify(json, null, 4));
                }
                break;


            case "순위":
                if (json['list'][event.room.name] == undefined || json['list'][event.room.name].length < 1) {
                    event.room.send([
                        msg.noti,
                        LM("[출석순위]"),
                        "사용자: " + "[" + nickname + "]" + event.sender.name,
                        Line(3),
                        "현재 " + '[' + event.room.name + ']' + "의 출석순위가 없습니다.",
                        "출석체크를 진행해주세요."
                    ].join('\n'));
                }
                event.room.send([
                    msg.noti,
                    LM("[출석순위]"),
                    "사용자: " + "[" + nickname + "]" + event.sender.name,
                    Line(3),
                    "현재 " + '[' + event.room.name + ']' + " 의 출석순위입니다.",
                    Lw,
                    json['list'][event.room.name].map(e => Object.keys(json['list'][event.room.name]).indexOf(e) + 1 + '위ㅣ' + e).join('\n\n')
                ].join('\n'));
                break;


            case "내 출석":
                if (json['store'][event.room.name][event.sender.name] == undefined) {
                    event.room.send([
                        LM("[내 출석]"),
                        "사용자: " + "[" + nickname + "]" + event.sender.name,
                        Line(3),
                        "출석 기록이 없습니다.",
                        "출석체크를 진행해주세요."
                    ].join("\n"));
                }
                let myinfo = json['store'][event.room.name][event.sender.name];
                let list = [];
                for (i = 0; i < myinfo['achieve'].length; i++) list.push((i + 1) + '위 : ' + myinfo['achieve'][i] + '회');
                event.room.send([
                    LM("[내 출석]"),
                    "사용자: " + "[" + nickname + "]" + event.sender.name,
                    Lw,
                    "",
                    line,
                    '오늘순위 : ' + myinfo['today_ranking'],
                    '누적 1등 횟수 : ' + myinfo['first_count'],
                    '출석 횟수 : ' + myinfo['count'],
                    line,
                    list.join('\n')
                ].join('\n'));
                break;
        }
    }
}

function onStartCompile() {
    FS.write(path, JSON.stringify(json, null, 4));
}