/**
 * 제작자: TeamCloud
 * 라이선스: CCL BY-SA 2.0
 */

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
    KV,
    User,
    msg,
    Pos,
    chat,
    post,
    random,
    randomI,
    Coin,
    Nickname,
    Like,
    KakaoLink,
    graph,
    image,
    githubAPI
} = require("Basic")

User.open()

function onMessage(event) {

    let Udata = User.get(event.sender.name)

    let getDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        day: new Date().getDay(),
        today: (str) => String(new Date().getFullYear()).padStart(2, "0") + str + String(new Date().getMonth() + 1).padStart(2, "0") + str + String(new Date().getDate()).padStart(2, "0"),
        time: (str) => String(new Date().getHours()).padStart(2, "0") + str + String(new Date().getMinutes()).padStart(2, "0") + str + String(new Date().getSeconds()).padStart(2, "0")
    };


    let cut = event.message.split(" ");


    if (event.message.startsWith(prefix + "내정보")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        /* 주식 */
        let stocks;
        if (Object.keys(Udata["stocks"]) == "") {
            stocks = "없음";
        } else {
            stocks = JSON.stringify(Udata["stocks"], null, 4);
        }

        /* Stars */
        let stars;
        if (String(Udata["stars"]["date"]) == "") {
            stars = "";
        } else {
            a = ""
            if (Udata["stars"]["D_date"] == undefined) a = 0
            stars = [
                "Stars 가입 날짜: " + Udata["stars"]["date"] + "(" + a + "일 남음)",
                "Ai 사용 가능 횟수: " + Udata["stars"]["ai"]
            ].join("\n");
        }

        /* 출석 */
        let atten_log;
        let atten_json = JSON.parse(FS.read(AP))['store'][event.room.name][event.sender.name];
        if (JSON.stringify(atten_json) == undefined) {
            atten_log = "출석 기록이 없습니다.";
        } else {
            let list = [];
            for (i = 0; i < atten_json['achieve'].length; i++) list.push((i + 1) + '위 : ' + atten_json['achieve'][i] + '회');
            atten_log = ([
                '오늘순위 : ' + atten_json['today_ranking'],
                '누적 1등 횟수 : ' + atten_json['first_count'],
                '출석 횟수 : ' + atten_json['count'],
                list.join('\n')
            ].join('\n'));
        }

        event.room.send([
            msg.noti,
            LM("[내정보]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "전체보기를 눌러 확인하세요.",
            Lw,
            "이름: " + Udata["name"],
            "ID: " + Udata["id"],
            "등록 날짜: " + Udata["date"],
            "닉네임: " + Udata["nickname"],
            "관리자: " + (Udata["admin"] ? "예" : "아니오"),
            "팀클 코인: " + Udata["coin"] + "코인",
            "경고 횟수: " + Udata["warn"] + "회",
            "주식 보유 종목: " + stocks,
            "호감도: " + Udata["like"],
            stars,
            Line(3),
            atten_log
        ].join("\n"));
    }

}