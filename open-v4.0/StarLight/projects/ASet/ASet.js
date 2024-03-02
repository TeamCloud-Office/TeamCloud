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
    CoinA,
    NicknameA,
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

    if (Boolean(event.message)) {
        let value = FS.read(UP);
        if (Object.keys(Bridge.getScopeOf("User")).length == Object.keys(JSON.parse(value)).length || Object.keys(Bridge.getScopeOf("User")["Data"]).length == Object.keys(JSON.parse(value)).length) {
            Bridge.getScopeOf("User")["Data"] = JSON.parse(value);
            FS.write("sdcard/StarLight/projects/User/User.js",
                "let Data = " + JSON.stringify(JSON.parse(value), null, 4));
            Api.compile("User");
        }
        delete value


        if (User.read(event.sender.name)) {
            let data = JSON.parse(FS.read(SP));
            if (!data["snd"][User.edit(event.sender.name).id]) {
                data["snd"][User.edit(event.sender.name).id] = [];
                FS.write(SP, JSON.stringify(data, null, 4));
            }

            if ((User.edit(event.sender.name).nickname).includes("Stars")) {
                if ((User.edit(event.sender.name).stars["re"]) != getDate.month) {
                    User.edit(event.sender.name).stars["ai"] = 30;
                    User.edit(event.sender.name).stars["re"] = getDate.month;
                    User.save();
                }
                if ((User.edit(event.sender.name).stars["D_date"]) == 0) {
                    User.edit(event.sender.name).stars["date"] = "";
                    User.edit(event.sender.name).stars["D_date"] = 0;
                    User.edit(event.sender.name).stars["D"] = "";
                    User.edit(event.sender.name).stars["re"] = 0;
                    event.room.send(CoinA(User.edit(event.sender.name).id, "Stars 이용기간 종료", "Stars", "m", "TeamCloud 시스템"));
                    User.save();
                } else {
                    //Stars 남은 일 카운트
                    if (User.edit(event.sender.name).stars["D"] != getDate.date) {
                        User.edit(event.sender.name).stars["D_date"] -= 1;
                        User.edit(event.sender.name).stars["D"] = getDate.date;
                        User.save();
                    }
                }
            }

            if ((User.edit(event.sender.name).nickname).includes("Light Stars")) {
                if ((User.edit(event.sender.name).stars["re"]) != getDate.month) {
                    if ((User.edit(event.sender.name).nickname).includes("Light Stars")) {
                        User.edit(event.sender.name).stars["ai"] = 60;
                        User.edit(event.sender.name).stars["re"] = getDate.month;
                        event.room.send(CoinA(User.edit(event.sender.name).id, "Stars 혜택", 50, "p", "TeamCloud 시스템"));
                        User.save();
                    }
                }
                if ((User.edit(event.sender.name).stars["D_date"]) == 0) {
                    //Stars 자동 해제
                    User.edit(event.sender.name).stars["date"] = "";
                    User.edit(event.sender.name).stars["D_date"] = 0;
                    User.edit(event.sender.name).stars["D"] = "";
                    User.edit(event.sender.name).stars["ai"] = 0;
                    User.edit(event.sender.name).stars["re"] = 0;
                    event.room.send(CoinA(User.edit(event.sender.name).id, "Stars 이용기간 종료", "Light Stars", "m", "TeamCloud 시스템"));
                    User.save();
                } else {
                    //Light Stars 남은 일 카운트
                    if (User.edit(event.sender.name).stars["D"] != getDate.date) {
                        User.edit(event.sender.name).stars["D_date"] -= 1;
                        User.edit(event.sender.name).stars["D"] = getDate.date;
                        User.save();
                    }
                }
            }

        }
    }
}