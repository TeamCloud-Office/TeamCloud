/**
 * 제작자: hello
 * 라이선스: 없음
 * 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따릅니다.
 * 기타: 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스를 따라야합니다.
 */

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
    timer
} = require("stock_m")
let {
    prefix,
    User,
    msg,
    Coin,
    LM,
    Line,
    Like
} = require("A")

let not_open = ["장이 열렸을때만 사용 가능합니다", "장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시"].join('\n')

let scriptName = ProjectManager.project.info.name;

let time = get_delay(open[0], open[1])
if (time !== undefined) {
    price(time);
} else if (time == undefined && JSON.parse(FileStream.read(path1))["date"] !== new Date().toLocaleDateString()) {
    price(0)
}



let data;

function onMessage(event) {

    try {

        if (event.message.startsWith(prefix + "주식 ")) {

            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (User.edit(event.sender.name).ban == true) return event.room.send([
                msg.error_,
                "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                Line(3),
                msg.ban
            ].join("\n"));
            if (!isOpen() && /주식 [구매|판매]/.test(event.message)) return event.room.send([
                msg.noti,
                LM("주식"),
                "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                Line(3),
                not_open
            ].join("\n"));

            data = User.edit(event.sender.name)["stock"];


            let cmd = event.message.split(" ").slice(2);
            //아리아 주식 구매 a기업 1 => [구매,a기업,1]


            if (cmd.length == 1) {


                if (cmd[0] == "!내정보") {
                    event.room.send(msg.noti + json_reply(User.edit(event.sender.name)["stock"]));
                }

                if (cmd[0] == "기업정보") {
                    let mark = {};

                    for (let i = 0; i <= Object.keys(company).length - 1; i++) {
                        mark[Object.keys(company)[i]] = company[Object.keys(company)[i]][3] + "\n" + company[Object.keys(company)[i]][0]
                    }
                    event.room.send(msg.noti + json_reply(mark));
                    event.room.send(JSON.stringify(company))
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
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        process(cmd[1], cmd[2], event.sender.name, 0, 0)
                    ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    event.room.send(Like(event.sender.name, "up", 1))
                }

                if (cmd[0] == "예약구매") {
                    event.room.send([
                        msg.noti,
                        LM("주식"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        process(cmd[1], cmd[2], event.sender.name, 0, 1)
                    ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    event.room.send(Like(event.sender.name, "up", 1))
                }

                if (cmd[0] == "판매") {
                    event.room.send([
                        msg.noti,
                        LM("주식"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                        Line(3),
                        process(cmd[1], cmd[2], event.sender.name, 1, 0)
                    ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    event.room.send(Like(event.sender.name, "up", 1))
                }

                if (cmd[0] == "예약판매") {
                    event.room.send([
                        msg.noti,
                        LM("주식"),
                        "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
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
                        setTimeout(() => {
                            event.room.send([
                                msg.noti,
                                LM("주식"),
                                "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
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
                        let send_date = java.text.SimpleDateFormat("y-M-d a h:mm").format(new Date())
                        setTimeout(() => {
                            event.room.send([
                                msg.noti,
                                LM("주식"),
                                "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
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


    } catch (e) {
        event.room.send(msg.error + JSON.stringify(e));
        Api.off(scriptName)
    }


}