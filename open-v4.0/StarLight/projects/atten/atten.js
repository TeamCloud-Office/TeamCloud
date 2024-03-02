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
    ogimg
} = require("A");

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

let state = JSON.parse(FS.read(SP))["set"]["state"];

let line = '···'.repeat(9);

if (!FS.read(AP)) FS.write(AP, '{}'); //만약 해당 경로에 파일이 없다면 파일 생성
let json = JSON.parse(FS.read(AP)); //파일에 있는 데이터를 JSON형식으로 json변수에 대입

let today = getDate.today(".");

if (json['today'] == undefined) json['today'] = today;
if (json['list'] == undefined) json['list'] = {};
if (json['store'] == undefined) json['store'] = {};

function onMessage(event) {

    let cut = event.message.split(" ");

    var room_list = [];
    if (!room_list.includes(event.room.name)) room_list.push(event.room.name);


    if (json['today'] != today) { //만약 하루가 지났다면 초기화
        json['today'] = today;
        json['list'] = {};
        FS.write(AP, JSON.stringify(json, null, 4));
    }

    if (json['list'][event.room.name] == undefined) json['list'][event.room.name] = {};
    if (json['store'][event.room.name] == undefined) json['store'][event.room.name] = {};


    if (event.message.startsWith(prefix + "출석")) {
        if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
        if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);
        if (state != 0) return;

        switch (cut[2]) {
            case "체크":
                if (Object.keys(json['list'][event.room.name]).includes(event.sender.name)) { //만약 출석목록에 이름이 있는경우
                    event.room.send([
                        msg.noti,
                        LM("[출석체크]"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        "출석체크를 " + json["list"][event.room.name][event.sender.name] + "에 이미 완료하였습니다."
                    ].join('\n')); //출석체크
                } else { //없는 경우
                    let rank = (Number(Object.keys(json['list'][event.room.name]).length) + 1);
                    let time = String(getDate.time(":"));
                    event.room.send([
                        msg.noti,
                        LM("[출석체크]"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        "출석체크를 " + time + "에 완료하였습니다.",
                        "► 오늘의 순위: " + rank
                    ].join("\n"));

                    event.room.send(Coin(event.sender.name, "출석체크 완료", 1000, false));

                    event.room.send(Like(event.sender.name, "up", 1))

                    json['list'][event.room.name][event.sender.name] = time;

                    if (json['store'][event.room.name][event.sender.name] == undefined) json['store'][event.room.name][event.sender.name] = {
                        'today': "",
                        'today_ranking': 0,
                        'first_count': 0,
                        'count': 0,
                        'achieve': [0, 0, 0, 0, 0]
                    };
                    json['store'][event.room.name][event.sender.name]['today_ranking'] = time;
                    json['store'][event.room.name][event.sender.name]['today_ranking'] = rank;
                    json['store'][event.room.name][event.sender.name]['count']++;
                    if (rank > 0 && rank <= 10) json['store'][event.room.name][event.sender.name]['achieve'][(rank - 1)]++;

                    if (rank == 1) {
                        json['store'][event.room.name][event.sender.name]['first_count']++;
                        event.room.send(Coin(event.sender.name, "출석체크 1등", 1000, false));
                    }

                    if (json['store'][event.room.name][event.sender.name]['first_count'] >= 100) {
                        if (User.edit(event.sender.name).nickname.includes("출석왕!") == false) {
                            event.room.send(Nickname(event.sender.name, "출석 100회 이상 1등", "출석왕!", false));
                        }
                    }
                    if (json['store'][event.room.name][event.sender.name]['count'] >= 500) {
                        if (User.edit(event.sender.name).nickname.includes("다(多)출석자") == false) {
                            event.room.send(Nickname(event.sender.name, "출석 500회 이상", "다(多)출석자", false));
                        }
                    }

                    java.lang.Thread.sleep(1000);
                    FS.write(AP, JSON.stringify(json, null, 4));
                }
                break;


            case "순위":
                if (String(JSON.stringify(json['list'][event.room.name])) == "{}") {
                    event.room.send([
                        msg.noti,
                        LM("[출석순위]"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        "현재 " + '[' + event.room.name + ']' + "의 출석순위가 없습니다.",
                        "출석체크를 진행해주세요."
                    ].join('\n'));
                } else {
                    event.room.send([
                        msg.noti,
                        LM("[출석순위]"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        "현재 " + '[' + event.room.name + ']' + " 의 출석순위입니다.",
                        Lw,
                        Object.keys(json['list'][event.room.name]).map(e => Object.keys(json['list'][event.room.name]).indexOf(e) + 1 + '위ㅣ' + e).join('\n\n')
                    ].join('\n'));
                }
                break;
        }
    }
}

/*function onStartCompile() {
    FS.write(AP, JSON.stringify(json, null, 4));
}*/