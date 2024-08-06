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

User.open();

let h_count = {};

function onMessage(event) {

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

    let Udata = User.get(event.sender.name)

    let cut = event.message.split(" ");


    function time_text() {
        let time = "";
        if (5 <= getDate.hour && getDate.hour < 11) {
            time = "아침"
        } else if (12 <= getDate.hour && getDate.hour < 15) {
            time = "점심"
        } else if (16 <= getDate.hour && getDate.hour < 20) {
            time = "저녁"
        } else {
            time = "밤"
        }
        return time;
    }

    if (h_count[event.sender.name] == undefined) h_count[event.sender.name] = 0 // 에릭 다수 호출

    /* ------ 일반 답변 ------ */
    if (event.message.startsWith(prefix)) {
        let list = {
            hello: [
                "부르셨습니까, " + event.sender.name + "님.",
                "네, " + event.sender.name + "님.",
                "반갑습니다.",
                "무슨 일입니까?",
                "부르셨습니까?",
                "좋은 " + time_text() + "입니다.",
            ],
            what_time: [
                "지금은 " + getDate.today("/") + " " + getDate.time(":") + "입니다.",
            ]
        };

        switch (event.message.replace(prefix, "")) {

            case "":
                if (Boolean(Udata) == false) return event.room.send(msg.terms)
                if (Udata["ban"] == true) return event.room.send(msg.ban)

                h_count[event.sender.name] += 1

                if (h_count[event.sender.name] >= 5) {
                    event.room.send("귀찮게 하지마십시오.")
                    event.room.send(Like(event.sender.name, false, 100))
                    h_count[event.sender.name] = 0
                    return;
                }

                event.room.send(list["hello"][Math.floor(Math.random() * list["hello"].length)])

                event.room.send(Like(event.sender.name, true, 50))
                break;

            case "몇시야":
                if (Boolean(Udata) == false) return event.room.send(msg.terms)
                if (Udata["ban"] == true) return event.room.send(msg.ban)

                event.room.send(list["what_time"][Math.floor(Math.random() * list["what_time"].length)])

                event.room.send(Like(event.sender.name, true, 30))
                break;

        }
    }


    /* ------ 주사위 ------ */
    if (event.message.startsWith(prefix + "주사위")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        if (cut[3] != undefined) return;

        event.room.send([
            msg.noti,
            LM("[주사위]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "► " + Math.floor(Math.random() * 6)
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }


    /* ------ 가위바위보 ------ */
    if (event.message.startsWith(prefix + "가위바위보 ")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        if (cut[3] != undefined) return;

        switch (cut[2]) {
            case '바위':
                array = ["가위\n" + event.sender.name + "님이 이기셨습니다.", "바위\n" + event.sender.name + "님과 비겼습니다.", "보\n제가 이겼습니다."];
                event.room.send([
                    msg.noti,
                    LM("[가위바위보]"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    array[Math.floor(Math.random() * array.length)]
                ].join("\n"));
                event.room.send(Like(event.sender.name, true, 20)) // 호감도
                break;
            case '가위':
                array = ["보\n" + event.sender.name + "님이 이기셨습니다.", "가위\n" + event.sender.name + "님과 비겼습니다.", "바위\n제가 이겼습니다."];
                event.room.send([
                    msg.noti,
                    LM("[가위바위보]"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    array[Math.floor(Math.random() * array.length)]
                ].join("\n"));
                event.room.send(Like(event.sender.name, true, 20)) // 호감도
                break;
            case '보':
                array = ["바위\n" + event.sender.name + "님이 이기셨습니다.", "보\n" + event.sender.name + "님과 비겼습니다.", "가위\n제가 이겼습니다."];
                event.room.send([
                    msg.noti,
                    LM("[가위바위보]"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    array[Math.floor(Math.random() * array.length)]
                ].join("\n"));
                event.room.send(Like(event.sender.name, true, 20)) //호감도
                break;
        }
    }

    /* ------ 디데이 ------ */
    if (event.message.startsWith(prefix + "디데이")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        if (cut[3] != undefined) return;

        let today = new Date(new Date().getYear(), new Date().getMonth() + 1, new Date().getDate());
        let day = new Date(new Date().getYear(), cut[2].split('/')[0], cut[2].split('/')[1]);
        let calculate = (today - day) / (1000 * 3600 * 24) * -1;
        if (calculate < 0) calculate = 365 - calculate * -1;
        if (calculate == 0) calculate = "Day";
        event.room.send([
            msg.noti,
            LM("[디데이]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            'D-' + calculate
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }
    /* ------ 확률은? ------ */
    if (event.message.startsWith(prefix) && event.message.endsWith("확률은?")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        let split = event.message.replace(prefix, "").replace("확률은?", "");
        event.room.send([
            msg.noti,
            LM("[확률]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "► " + split + " 확률: " + (Math.random() * 100).toFixed(3) + "%"
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }


    /* ------ 홀짝 ------ */
    if (event.message.startsWith(prefix + "홀짝")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        if (cut[3] != undefined) return;

        let random_ = Math.floor(Math.random() * 10)

        switch (cut[2]) {
            case '짝':
                if (random_ % 2 == 0) {
                    event.room.send([
                        msg.noti,
                        LM("[홀짝]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "정답입니다.",
                        "정답는 [" + random_ + "] 입니다."
                    ].join("\n"));
                    event.room.send(Like(event.sender.name, true, 20))
                } else if (random_ % 2 != 0) {
                    event.room.send([
                        msg.noti,
                        LM("[홀짝]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "오답입니다.",
                        "정답은 [" + random_ + "] 입니다."
                    ].join("\n"));
                    event.room.send(Like(event.sender.name, true, 20))
                }
                break;
            case '홀':
                if (random_ % 2 != 0) {
                    event.room.send([
                        msg.noti,
                        LM("[홀짝]"),
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "정답입니다.",
                        "정답는 [" + random_ + "] 입니다."
                    ].join("\n"));
                    event.room.send(Like(event.sender.name, true, 20))
                } else if (random_ % 2 == 0) {
                    event.room.send([
                        msg.noti,
                        LM("[홀짝]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "오답입니다.",
                        "숫자는 [" + random_ + "] 입니다."
                    ].join("\n"));
                    event.room.send(Like(event.sender.name, true, 20))
                }
        }
    }


    /* ------ vs ------ */
    if (event.message.startsWith(prefix) && event.message.includes("vs")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        let vs = event.message.replace(prefix, "").split("vs")

        if (vs[0] && vs[1]) {
            event.room.send([
                msg.noti,
                LM("[선택]"),
                "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                Line(3),
                "저는 [" + vs[Math.floor(Math.random() * vs.length)] + "] 를 고르겠습니다."
            ].join("\n"));
        }
    }

}