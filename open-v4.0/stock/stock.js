Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "wakelock");

let {
    json_reply,
    setTimeout2,
    isOpen,
    get_delay,
    price,
    process,
    company,
    open
} = require("stock"); 

let {
    prefix,
    User,
    msg,
    Coin,
    getDate
} = require("A");


price(get_delay());

function onMessage(event) {

    try {

        let not_open = ["장이 열렸을때만 사용 가능합니다", "장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시"].join('\n');

        if (event.message.startsWith(prefix + "주식 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (User.edit(event.sender.name, false).ban) return event.room.send(msg.noti + msg.ban);

            if (Object.keys(User.edit(event.sender.name)["stocks"]).length == 0) event.room.send(msg.noti + "아직 주식게임을 시작하지 않았습니다.");
            if (!isOpen()) event.room.send(not_open);
            let cut = event.message.split(" ");
            let cmd = event.message.replace(prefix + "주식 ", "").split(" ");

            if (cut[2] == "시작") {
                if (Object.keys(User.edit(event.sender.name)["stocks"]).length !== 0) event.room.send(msg.noti + "이미 시작했습니다");
                event.room.send(Coin(event.sender.name, "주식게임 시작!", 300, false));
                event.room.send(msg.noti + "주식게임을 시작합니다");
            }

            if (cut[2] == '구매 ') { //에릭아 주식 구매 a기업 1
                event.room.send([
                    msg.noti,
                    process(cmd[1], cmd[2], event.sender.name, 1, 1)
                ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
            }

            if (cut[2] == '예약구매 ') { //에릭아 주식 예약구매 a기업 1
                event.room.send([
                    msg.noti,
                    process(cmd[1], cmd[2], event.sender.name, 1, 0)
                ].join("\n")); //process(기업명, 개수, 사용자, 구매 판매 유무, 예약 유무)
            }

            if (cut[2] == '특정시각구매 ') { //에릭아 주식 특정시각구매 a기업 1 11-30
                if (cmd[3].split("-")[1] == undefined) cmd[3].split("-")[1] = "0";
                if (!cmd[3].split("-")[1].endsWith("0")) {
                    event.room.send(msg.noti + "10분단위로만 예약구매가 가능합니다");
                } else if (cmd[3].split("-")[1] > 50) {
                    event.room.send(msg.noti + "값을 다시 확인해주세요");
                } else {
                    let time = cmd[3].split("-")[0] + (cmd[3].split("-")[1] / 60);
                    setTimeout2(() => {
                        event.room.send([
                            msg.noti,
                            event.sender.name + "님이 " + getDate.today("/") + getDate.time(":") + "에 요청하신 예약 구매 결과 ",
                            "",
                            process(cmd[1], cmd[2], event.sender.name, 1, 0)
                        ].join('\n'));
                    }, get_delay(time));
                }
            }

            if (cut[2] == '판매 ') { //!주식판매 a기업 1
                event.room.send([
                    msg.noti,
                    process(cmd[1], cmd[2], event.sender.name, 0, 1)
                ].join("\n"));
            }

            if (cut[2] == '예약판매 ') { //!주식예약판매 a기업 1
                event.room.send([
                    msg.noti,
                    process(cmd[1], cmd[2], event.sender.name, 0, 0)
                ].join("\n"));
            }

            if (cut[2] == '특정시각판매 ') { //!주식예약구매 a기업 1 11-30
                if (cmd[3].split("-")[1] == undefined) {
                    cmd[3].split("-")[1] = "0";
                }
                if (!cmd[3].split("-")[1].endsWith("0")) {
                    event.room.send(msg.noti + "10분단위로만 예약구매가 가능합니다");
                } else if (cmd[3].split("-")[1] > 50) {
                    event.room.send(msg.noti + "값을 다시 확인해주세요");
                } else {
                    let time = cmd[3].split("-")[0] + (cmd[3].split("-")[1] / 60);
                    setTimeout2(() => {
                        event.room.send([
                            msg.noti,
                            event.sender.name + "님이 " + getDate.today("/") + getDate.time(":") + "에 요청하신 예약 구매 결과",
                            "",
                            process(cmd[1], cmd[2], event.sender.name, 0, 0)
                        ].join('\n'));
                    }, get_delay(time));
                }
            } 

            if (cut[2] == "기업정보") {
                let mark = {};
                Object.keys(company).map(e => {
                    mark[e] = company[e][3];
                });
                event.room.send(json_reply(mark));
            }
        }

    } catch (e) {
        event.room.send(msg.error + JSON.stringify(e));
    }
}