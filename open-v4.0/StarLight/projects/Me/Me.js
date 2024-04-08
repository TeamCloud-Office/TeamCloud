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

    if (event.message.startsWith(prefix + "내정보")) {
        if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
        if (User.edit(event.sender.name, false).ban == true) return event.room.send(msg.ban);

        let stocks;
        if (Object.keys(User.edit(event.sender.name, false).stocks) == "") {
            stocks = "없음";
        } else {
            stocks = JSON.stringify(User.edit(event.sender.name, false)["stocks"], null, 4);
        }

        let stars;
        if (String(User.edit(event.sender.name, false).stocks["date"]) == "") {
            stars = "";
        } else {
            stars = [
                "Stars 가입 날짜: " + User.edit(event.sender.name, false).stars["date"] + "(" + User.edit(event.sender.name, false).stars["D_date"] + "일 남음)",
                "Ai 사용 가능 횟수: " + User.edit(event.sender.name, false).stars["ai"]
            ].join("\n");
        }

        event.room.send([
            msg.noti,
            LM("[내정보]"),
            "사용자: " + "[" + User.edit(event.sender.name, false).nickname[0] + "]" + event.sender.name,
            Line(3),
            Lw,
            "이름: " + User.edit(event.sender.name, false).name,
            "ID: " + User.edit(event.sender.name, false).id,
            "등록 날짜: " + User.edit(event.sender.name, false).date,
            "닉네임: " + User.edit(event.sender.name, false).nickname,
            "관리자: " + (User.edit(event.sender.name, false).admin ? "예" : "아니오"),
            "팀클 코인: " + User.edit(event.sender.name, false).coin + "코인",
            "경고 횟수: " + User.edit(event.sender.name, false).warn + "회",
            "주식 보유 종목: " + stocks,
            "호감도: " + User.edit(event.sender.name, false).like,
            stars,
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