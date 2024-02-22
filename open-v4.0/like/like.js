let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    state,
    getDate,
    c_path,
    Kakaocord,
    msg,
    Pos,
    chat_log,
    random,
    randomI,
    addCode,
    User,
    Coin,
    Nickname,
    Like,
    ogimg
} = require("A");

let cmd_list = [ 
    "가위바위보",
    "날씨",
    "디데이",
    "홀짝",
    "주사위",
    "음악",
    "주식",
    "출석 체크",
    "출석 순위",
    "AI",
    "내정보"
]

function onMessage(event) {
    let cut = event.message.split(" ");

    if (event.message.startsWith(prefix)) {
        if (cmd_list.includes(cut[1])) {
            //if(event.room.send() == "success")
            if (User.read(event.sender.name)) {
                if (random(40)) { //40%
                    java.lang.Thread.sleep(1500);
                    if (["Light Stars", "Stars"].includes(User.edit(event.sender.name).etc[0])) {
                        event.room.send(Like(event.sender.name, "up", randomI([
                            [2, 100],
                            [4, 50],
                            [6, 10]
                        ], Math.random().toFixed(2))));
                    } else {
                        event.room.send(Like(event.sender.name, "up", randomI([
                            [1, 100],
                            [2, 50],
                            [3, 10]
                        ], Math.random().toFixed(2))));
                    }
                }
            }
        }
    }
}