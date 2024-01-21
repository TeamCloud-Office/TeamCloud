Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "wakelock");

import {
    json_reply,
    setTimeout2,
    array_random,
    isOpen,
    get_delay,
    price,
    process,
    user,
    path1,
    path2,
    assess,
    company,
    open,
    toFixed
} from "index";

let {
    prefix,
    User,
    Coin
} = require("A")

function aaaaa(sender) {
    if (A.user.edit(sender) == null || A.user.edit(sender)["stock"] == undefined) {
        user[sender] = undefined
    } else {
        user[sender] = A.user.edit(sender)["stock"]
    }
}

const scriptName = ProjectManager.project.info.name;

price(get_delay());

function onMessage(event) {

    try {

        let not_open = ["장이 열렸을때만 사용 가능합니다", "장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시"].join('\n');

        let today = new Date().getFullYear() + '년 ' + (new Date().getMonth() + 1) + '월 ' + new Date().getDate() + '일 ' + new Date().getHours() + "시 " + new Date().getMinutes() + "분 " + new Date().getSeconds() + "초";

        if (event.message.startsWith(prefix + "주식 ")) {
            if (Object.keys(user["stocks"]).length === 0) event.room.send("아직 주식게임을 시작하지 않았습니다.");
            if (!isOpen()) event.room.send(not_open);
            let cmd = {
                b: event.message.match(/^(에릭아 주식 구매)\s*(.*?)\s*([\d\s]+)$/).slice(1),
                rb: event.message.match(/^(에릭아 주식 예약구매)\s*(.*?)\s*([\d\s]+)$/).slice(1),
                stb: event.message.match(/^(에릭아 주식 특정시각구매)\s*(.*?)\s*([\d\s]+)$/).slice(1),
                p: event.message.match(/^(에릭아 주식 판매)\s*(.*?)\s*([\d\s]+)$/).slice(1),
                rp: event.message.match(/^(에릭아 주식 예약판매)\s*(.*?)\s*([\d\s]+)$/).slice(1),
                srp: event.message.match(/^(에릭아 주식 특정시각판매)\s*(.*?)\s*([\d\s]+)$/).slice(1),
            }
            switch (A.cut[2]) {

                case "시작":
                    if (Object.keys(user["stocks"]).length !== 0) event.room.send("이미 시작했습니다");
                    event.room.send(Coin(event.sender.name, "주식게임 시작!", 200, false));
                    event.room.send("주식게임을 시작합니다");
                    break;

                case '구매 ': //에릭아 주식 구매 a기업 1
                    aaaaa(sender)
                    event.room.send(process(cmd.b[1], cmd.b[2], event.sender.name, 1, 1)); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    break;

                case '예약구매 ': //에릭아 주식 예약구매 a기업 1
                    event.room.send(process(cmd.rb[1], cmd.rb[2], event.sender.name, 1, 1)); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
                    break;

                case '특정시각구매 ': //에릭아 주식 특정시각구매 a기업 1 11-30
                    if (cmd.stb[3].split("-")[1] == undefined) cmd.stb[3].split("-")[1] = "0";
                    if (!cmd.stb[3].split("-")[1].endsWith("0")) {
                        event.room.send("10분단위로만 예약구매가 가능합니다");
                    } else if (cmd.stb[3].split("-")[1] > 50) {
                        event.room.send("값을 다시 확인해주세요");
                    } else {
                        let time = cmd.stb[3].split("-")[0] + (cmd.stb[3].split("-")[1] / 60);
                        setTimeout2(() => {
                            event.room.send([
                                event.sender.name + "님이 " + today + "에 요청하신 예약 구매 결과 ", ,
                                process(cmd.stb[1], cmd.stb[2], event.sender.name, 1, 1)
                            ].join('\n'));
                        }, get_delay(time));
                    }
                    break;

                case '판매 ': //!주식판매 a기업 1
                    event.room.send(process(cmd.p[1], cmd.p[2], event.sender.name, 0, 1));
                    break;

                case '예약판매 ': //!주식예약판매 a기업 1
                    event.room.send(process(cmd.rp[1], cmd.rp[2], event.sender.name, 0, 0));
                    break;

                case '특정시각판매 ': //!주식예약구매 a기업 1 11-30
                    if (cmd.srp[3].split("-")[1] == undefined) {
                        cmd.srp[3].split("-")[1] = "0";
                    }
                    if (!cmd.srp[3].split("-")[1].endsWith("0")) {
                        event.room.send("10분단위로만 예약구매가 가능합니다");
                    } else if (cmd.srp[3].split("-")[1] > 50) {
                        event.room.send("값을 다시 확인해주세요");
                    } else {
                        let time = cmd.srp[3].split("-")[0] + (cmd.srp[3].split("-")[1] / 60);
                        setTimeout2(() => {
                            event.room.send([event.sender.name + "님이 " + today + "에 요청하신 예약 구매 결과", ,
                                process(cmd.srp[1], cmd.srp[2], event.sender.name, 0, 0)
                            ].join('\n'));
                        }, get_delay(time));
                    }
                    break;

                case "기업정보":
                    let mark = {};
                    Object.keys(company).map(e => {
                        mark[e] = company[e][3];
                    })
                    event.room.send(json_reply(mark));
                    break;
            }
        }

    } catch (e) {
        event.room.send(["오류가 발생했습니다",
            "아래메세지를 관리자에게 보내주세요", ,
            eㄴ,
            e.lineNumber
        ].join('\n'));
    }
}