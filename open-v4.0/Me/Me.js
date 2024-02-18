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
    getDate,
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

function onMessage(event) {
    if (event.messsage.startsWith(prefix + "내 정보")) {
        if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
        if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

        let stocks;
        if (String(JSON.stringify(User.edit(cut[2], true).stocks)) == "{}") {
            stocks = "없음";
        } else {
            stocks = Object.keys(User.edit(cut[2], true).stocks)
        }

        event.room.send([
            msg.noti,
            LM("[내정보]"),
            "사용자: " + "[" + User.edit(event.sender.name).nickname + "]" + event.sender.name,
            Line(3),
            Lw,
            "이름: " + User.edit(event.sender.name).name,
            "ID: " + User.edit(event.sender.name).id,
            "닉네임: " + User.edit(event.sender.name).nickname,
            "관리자: " + (User.edit(event.sender.name).admin ? "예" : "아니오"),
            "팀클 코인: " + User.edit(event.sender.name).coin + "코인",
            "경고 횟수: " + User.edit(event.sender.name).warn + "회",
            "주식 보유 종목: " + User.edit(event.sender.name).stock,
            "호감도: " + User.edit(event.sender.name).like,
            Line(3),
            atten(event.sender.name)
        ].join("\n"));
    }

    function atten(s) {
        let result;
        let atten_json = JSON.parse(FS.read(AP))['store'][event.room.name][s];
        if (JSON.stringify(atten_json) == undefined) {
            result = "출석 기록이 없습니다.";
        } else {
            let list = [];
            for (i = 0; i < atten_json['achieve'].length; i++) list.push((i + 1) + '위 : ' + atten_json['achieve'][i] + '회');
            result = ([
                '오늘순위 : ' + atten_json['today_ranking'],
                '누적 1등 횟수 : ' + atten_json['first_count'],
                '출석 횟수 : ' + atten_json['count'],
                list.join('\n')
            ].join('\n'));
        }
        return result;
    }
}