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

/* ------ 주식 ------ */
let {
    json_reply,
    isOpen,
    get_delay,
    price,
    process,
    company,
    open,
    get_remain,
    change_m,
    path1,
    timer,
    fix_date,
    f_delay
} = require("stock_m")


let not_open = [
    "장이 열렸을때만 사용 가능합니다",
    "장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시"
].join('\n')
let scriptName = ProjectManager.project.info.name;
let time = get_delay(open[0], open[1])
let result = JSON.parse(FS.read(path1))["date"];

function onStartCompile() {
    if (timer !== undefined) {
        f_delay(false, "", "", timer)
    }
}
/*
 * 기존에 작동하던게 쓰레드에 남아있다면 onStartCompile를 통해 중지
 * 이후, 아래에 있는 소스로 현재시각에 알맞게 시간 조정뒤 실행
 */
if (result !== new Date().toLocaleDateString()) { //날짜 미일치
    fix_date()
    price(time)
} else { //날짜 일치
    if (time !== 0) { //장이 열리는 시간까지 남은시간이 있을때
        Log.d("[주식] " + time + "후에 장이 열립니다")
        price(time)
    } else if (time == 0) { // 개장 시각이 지났을때
        Log.d("[주식] 리로드감지 / 1~2분정도의 오차가 존재할수있습니다")
        price(0)
    }
}

/* ------ 출석 ------ */
let line = '···'.repeat(9);
if (!FS.read(AP)) FS.write(AP, '{}');
let json = JSON.parse(FS.read(AP));
if (json['today'] == undefined) json['today'] = getDate.today(".");
if (json['list'] == undefined) json['list'] = {};
if (json['store'] == undefined) json['store'] = {};
let room = [];



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

    let Udata = User.get(event.sender.name)

    let cut = event.message.split(" ");

    /* ------ 출석 ------ */
    let today = getDate.today(".")

    if (!room.includes(event.room.name)) room.push(event.room.name);

    if (json['today'] != today) {
        //만약 하루가 지났다면 초기화
        json['today'] = today;
        json['list'] = {};
        for (let i = 0; i < room.length; i++){
            if (json['list'][event.room.name] == undefined) json['list'][room[i]] = {};
        }
        FS.write(AP, JSON.stringify(json, null, 4));
    }

    if (json['list'][event.room.name] == undefined) json['list'][event.room.name] = {};
    if (json['store'][event.room.name] == undefined) json['store'][event.room.name] = {};
    FS.write(AP, JSON.stringify(json, null, 4));



    if (event.message.startsWith(prefix + "출석")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        switch (cut[2]) {
            case "체크":
                if (Object.keys(json['list'][event.room.name]).includes(event.sender.name)) {
                    event.room.send([
                        msg.noti,
                        LM("[출석체크]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "출석체크를 " + json["list"][event.room.name][event.sender.name] + "에 이미 완료하였습니다."
                    ].join('\n'));
                } else {
                    let rank = (Number(Object.keys(json['list'][event.room.name]).length) + 1);
                    let time = String(getDate.time(":"));
                    event.room.send([
                        msg.noti,
                        LM("[출석체크]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "출석체크를 " + time + "에 완료하였습니다.",
                        "► 오늘의 순위: " + rank
                    ].join("\n"));
                    event.room.send(Coin(event.sender.name, "출석체크 완료", 500, true, "System"));
                    event.room.send(Like(event.sender.name, true, 60))
                    json['list'][event.room.name][event.sender.name] = time;
                    FS.write(AP, JSON.stringify(json, null, 4));
                    if (json['store'][event.room.name][event.sender.name] == undefined) json['store'][event.room.name][event.sender.name] = {
                        'today': "",
                        'today_ranking': 0,
                        'first_count': 0,
                        'count': 0,
                        'achieve': [0,
                            0,
                            0,
                            0,
                            0
                        ]
                    };
                    json['store'][event.room.name][event.sender.name]['today'] = time;
                    json['store'][event.room.name][event.sender.name]['today_ranking'] = rank;
                    json['store'][event.room.name][event.sender.name]['count']++;
                    if (rank > 0 && rank <= 10) json['store'][event.room.name][event.sender.name]['achieve'][(rank - 1)]++;
                    if (rank == 1) {
                        json['store'][event.room.name][event.sender.name]['first_count']++;
                        event.room.send(Coin(event.sender.name, "출석체크 1등", 500, true, "System"));
                    }
                    if (json['store'][event.room.name][event.sender.name]['first_count'] >= 100) {
                        if (Udata.nickname.includes("출석왕!") == false) {
                            event.room.send(Nickname(event.sender.name, "출석 100회 이상 1등", "출석왕!", true, true, "System"));
                        }
                    }
                    if (json['store'][event.room.name][event.sender.name]['count'] >= 500) {
                        if (Udata.nickname.includes("다(多)출석자") == false) {
                            event.room.send(Nickname(event.sender.name, "출석 500회 이상", "다(多)출석자", true, true, "Systme"));
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
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "현재 " + '[' + event.room.name + ']' + "의 출석순위가 없습니다.",
                        "출석체크를 진행해주세요."
                    ].join('\n'));
                } else {
                    event.room.send([
                        msg.noti,
                        LM("[출석순위]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "현재 " + '[' + event.room.name + ']' + " 의 출석순위입니다.",
                        Lw,
                        Object.keys(json['list'][event.room.name]).map(e => (Object.keys(json['list'][event.room.name]).indexOf(e) + 1) + '위ㅣ' + e + "(" + json['list'][event.room.name][e] + ")").join('\n\n')
                    ].join('\n'));
                }
                break;
        }
    }




    /* ------ 주식 ------ */
    if (event.message.startsWith(prefix + "주식 ")) {
        if (!Boolean(Udata)) return event.room.send(msg.noti + msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        if (!isOpen() && /주식 [구매|판매]/.test(event.message)) return event.room.send([
            msg.noti,
            LM("주식"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            not_open
        ].join("\n"));


        let cmd = event.message.split(" ").slice(2);
        //에릭아 주식 구매 a기업 1 => [구매,a기업,1]


        if (cmd.length == 1) {
            if (cmd[0] == "내정보") {
                event.room.send(msg.noti + json_reply(User.get(event.sender.name)["stocks"]));
            }

            if (cmd[0] == "기업정보") {
                let mark = {};

                let company_file = JSON.parse(FS.read(path1))["company"]
        
                for (let i = 0; i <= Object.keys(company_file).length - 1; i++) {
                    mark[Object.keys(company_file)[i]] = company_file[Object.keys(company_file)[i]][3] + "\n" + company_file[Object.keys(company_file)[i]][0]
                }
                event.room.send(msg.noti + json_reply(mark));
            }
        }

        if ((/^[구매|예약구매|판매|예약판매|주식특정시각구매|주식특정시각판매] .+ [1-9]+/).test(cmd.join(" "))) {
            cmd = cmd.join(" ").match(/^(구매|예약구매|판매|예약판매|주식특정시각구매|주식특정시각판매) (.+?) (\d+)(\s([0-2][1-4]:[0-5][0-9])|)/).slice(1)
            cmd.splice(3, 1)
            cmd.filter(i => i !== undefined)
        }


        if (cmd.length == 3) {
            if (cmd[0] == "구매") {
                event.room.send([
                    msg.noti,
                    LM("주식"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    process(cmd[1], cmd[2], event.sender.name, 0, 0)
                ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                event.room.send(Like(event.sender.name, "up", 1))
            }

            if (cmd[0] == "예약구매") {
                event.room.send([
                    msg.noti,
                    LM("주식"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    process(cmd[1], cmd[2], event.sender.name, 0, 1)
                ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                event.room.send(Like(event.sender.name, "up", 1))
            }

            if (cmd[0] == "판매") {
                event.room.send([
                    msg.noti,
                    LM("주식"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    process(cmd[1], cmd[2], event.sender.name, 1, 0)
                ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                event.room.send(Like(event.sender.name, "up", 1))
            }

            if (cmd[0] == "예약판매") {
                event.room.send([
                    msg.noti,
                    LM("주식"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    Line(3),
                    process(cmd[1], cmd[2], event.sender.name, 1, 1)
                ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                event.room.send(Like(event.sender.name, "up", 1))
            }
        }

        if (cmd.length == 4) {
            if (cmd[0] == "특정시각구매") {
                let time = cmd[3].split("-").map(v => +v[0] + +v[1] / 60);
                if (open[0] < time && open[1] > time) {
                    event.room.send(msg.noti + "장이 열린시간에만 구매가 가능합니다");
                } else {
                    let send_date = java.text.SimpleDateFormat("y-M-d a h:mm").format(new Date())
                    event.room.send([
                        msg.noti,
                        LM("주식"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "구매 요청이 완료되었습니다"
                    ])
                    setTimeout(() => {
                        event.room.send([
                            msg.noti,
                            LM("주식"),
                            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                            Line(3),
                            "예약 구매 요청 일: " + send_date,
                            "",
                            process(cmd[1], cmd[2], event.sender.name, 0, 0)
                        ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    }, get_remain(cmd[3].split("-")));
                }
            }

            if (cmd[0] == "특정시각판매") {
                let time = cmd[3].split("-").map(v => +v[0] + +v[1] / 60);
                if (open[0] < time && open[1] > time) {
                    event.room.send(msg.noti + "장이 열린시간에만 구매가 가능합니다");
                } else {
                    event.room.send([
                        msg.noti,
                        LM("주식"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "판매 요청이 완료되었습니다"
                    ])
                    let send_date = java.text.SimpleDateFormat("y-M-d a h:mm").format(new Date())
                    setTimeout(() => {
                        event.room.send([
                            msg.noti,
                            LM("주식"),
                            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                            Line(3),
                            "예약 판매 요청 일: " + send_date,
                            "",
                            process(cmd[1], cmd[2], event.sender.name, 1, 0)
                        ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    }, get_remain(cmd[3].split("-")));
                }
            }
        }
    }


    /* ------ 도박 ------ */
    if (event.message.startsWith(prefix + "도박 ")) {
        let number = Number(event.message.replace(prefix + "도박 ", ""))

        if (Number.isSafeInteger(number) == false) {
            event.room.send([
                LM("도박"),
                "사용자: " + Udata["name"],
                Line(3),
                "수가 너무 커 진행할수 없습니다"
            ].join("\n"))
        } else if (number <= 0 || isNaN(number)) {
            event.room.send([
                LM("도박"),
                "사용자: " + Udata["name"],
                Line(3),
                "올바른 값을 입력해주세요"
            ].join("\n"))
        } else if (number > Udata["coin"]) {
            event.room.send([
                LM("도박"),
                "사용자: " + Udata["name"],
                Line(3),
                "잔액이 부족합니다"
            ].join("\n"))
        } else {
            let chance = Math.floor(Math.random() * 100)
            if (Number.isSafeInteger(Number(Udata["coin"])) == false) return event.room.send([
                LM("도박"),
                "사용자: " + Udata["name"],
                Line(3),
                "현재 가지고 있는 돈이 너무 많아 진행할수 없습니다"
            ].join("\n")) //예외처리
            if (chance < 20) { //20%
                //실패
                event.room.send(Coin(event.sender.name, "도박 - 실패..", -(number), false, "System"))
            } else if (chance < 70) { //50%
                //1.1배
                event.room.send(Coin(event.sender.name, "도박 - 성공! (1.1배)", +(number * 0.1), false, "System"))
            } else { //30%
                //1.5배
                event.room.send(Coin(event.sender.name, "도박 - 성공! (1.5배)", +(number * 0.5), false, "System"))
            } //도박 게임 진행
        } //예외처리
    }

}