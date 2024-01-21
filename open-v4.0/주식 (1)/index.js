Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "wakelock")
var {
    json_reply,
    setTimeout2,
    array_random,
    isOpen,
    get_delay,
    price,
    process,
    path1,
    path2,
    assess,
    company,
    open,
    toFixed
} = require("index")
let A = Bridge.getScopeOf("A") //var { User } = require("A")
const scriptName = ProjectManager.project.info.name;
function aaaaa(sender) {
    if (A.user.edit(sender) == null || A.user.edit(sender)["stock"] == undefined) {
        user[sender] = undefined
    } else {
        user[sender] = A.user.edit(sender)["stock"]
    }
}
price(get_delay());
function onMessage(event) {
    try {
        if (event.message.startsWith("!주식구매 ")) { //!주식구매 a기업 1
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                if (isOpen()) {
                    let cmd = event.message.split(" ");
                    event.room.send(process(cmd[1], cmd[2], event.sender.name, 1, 1));
                } else {
                    event.room.send("장이 열렸을때만 사용가능합니다\n장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시");
                }
            }
        }
        if (event.message.startsWith("!주식예약구매 ")) { //!주식예약구매 a기업 1
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                if (!isOpen()) {
                    let cmd = event.message.split(" ");
                    event.room.send(process(cmd[1], cmd[2], event.sender.name, 1, 0));
                } else {
                    event.room.send("장이 열리지 않았을떄만 사용가능합니다\n장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시");
                }
            }
        }
        if (event.message.startsWith("!주식특정시각구매 ")) { //!주식예약구매 a기업 1 11-30
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                let cmd = event.message.split(" ");
                if (cmd[3].split("-")[1] == undefined) {
                    cmd[3].split("-")[1] = "0";
                }
                if (!cmd[3].split("-")[1].endsWith("0")) {
                    event.room.send("10분단위로만 예약구매가 가능합니다");
                } else if (cmd[3].split("-")[1] > 50) {
                    event.room.send("값을 다시 확인해주세요");
                } else {
                    let time = cmd[3].split("-")[0] + (cmd[3].split("-")[1] / 60);
                    if (!(open[0] < time && open[1] > time)) {
                        event.room.send("장이 열린시간에만 구매가 가능합니다");
                    } else {
                        let send_date = new Date();
                        setTimeout2(() => {
                            event.room.send(event.sender.name + "님이 " + send_date + "에 요청하신 예약 구매 결과 \n\n" + process(cmd[1], cmd[2], event.sender.name, 1, 0));
                        }, get_delay(time));
                    }
                }
            }
        }
        if (event.message.startsWith("!주식판매 ")) { //!주식판매 a기업 1
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                if (isOpen()) {
                    let cmd = event.message.split(" ");
                    event.room.send(process(cmd[1], cmd[2], event.sender.name, 0, 1));
                } else {
                    event.room.send("장이 열렸을때만 사용가능합니다\n장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시");
                }
            }
        }
        if (event.message.startsWith("!주식예약판매 ")) { //!주식예약판매 a기업 1
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                if (!isOpen()) {
                    let cmd = event.message.split(" ");
                    event.room.send(process(cmd[1], cmd[2], event.sender.name, 0, 0));
                } else {
                    event.room.send("장이 열리지 않았을떄만 사용가능합니다\n장 열리는 시간 매일 " + open[0] + "시 ~ " + open[1] + "시");
                }
            }
        }
        if (event.message.startsWith("!주식특정시각판매 ")) { //!주식예약구매 a기업 1 11-30
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                let cmd = event.message.split(" ");
                if (cmd[3].split("-")[1] == undefined) {
                    cmd[3].split("-")[1] = "0";
                }
                if (!cmd[3].split("-")[1].endsWith("0")) {
                    event.room.send("10분단위로만 예약구매가 가능합니다");
                } else if (cmd[3].split("-")[1] > 50) {
                    event.room.send("값을 다시 확인해주세요");
                } else {
                    let time = cmd[3].split("-")[0] + (cmd[3].split("-")[1] / 60);
                    if (!(open[0] < time && open[1] > time)) {
                        event.room.send("장이 열린시간에만 구매가 가능합니다");
                    } else {
                        let send_date = new Date();
                        setTimeout2(() => {
                            event.room.send(event.sender.name + "님이 " + send_date + "에 요청하신 예약 구매 결과 \n\n" + process(cmd[1], cmd[2], event.sender.name, 0, 0));
                        }, get_delay(time));
                    }
                }
            }
        }
        if (event.message == "!내정보") {
            aaaaa(sender)
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                event.room.send(event.sender.name + "님의 정보\n포인트 : " + user[event.sender.name]["money"] + "\n\n보유 종목\n" + json_reply(user[event.sender.name]["stocks"]));
            }
        }
        if (event.message == "!가입") {
            aaaaa(sender)
            if (user[event.sender.name] !== undefined) {
                event.room.send("이미 가입이 되어있습니다");
            } else {
                user[event.sender.name] = {};
                user[event.sender.name]["money"] = 10000;
                user[event.sender.name]["stocks"] = {};
                event.room.send("주식게임 가입이 완료되었습니다");
            }
        }
        if (event.message == "!기업정보") {
            if (user[event.sender.name] == undefined) {
                event.room.send("가입먼저 진행해주세요");
            } else {
                let mark = {};
                Object.keys(company).map(e => {
                    mark[e] = company[e][3];
                })
                event.room.send(json_reply(mark));
            }
        }
    } catch (e) {
        event.room.send("오류가 발생했습니다\n아래메세지를 관리자에게 보내주세요\n\n" + e + "\n" + e.lineNumber);
    }
}
function onStartCompile() {
    A.user.save()
}