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

    /*
        let value = FS.read(UP);
        if (Object.keys(Bridge.getScopeOf("User")).length == Object.keys(JSON.parse(value)).length || Object.keys(Bridge.getScopeOf("User")["Data"]).length == Object.keys(JSON.parse(value)).length) {
            Bridge.getScopeOf("User")["Data"] = JSON.parse(value);
            FS.write("sdcard/StarLight/projects/User/User.js",
                "let Data = " + JSON.stringify(JSON.parse(value), null, 4));
            Api.compile("User");
        }
        delete value
        */


    if (User.read(event.sender.name)) {
        let data = JSON.parse(FS.read(SP));
        if (!data["snd"][User.edit(event.sender.name, false).id]) {
            data["snd"][User.edit(event.sender.name, false).id] = [];
            FS.write(SP, JSON.stringify(data, null, 4));
        }

    }

    /**
     * @param {String} date Stars 가입 날짜   ####/#/##
     * @param {Number} D_date 남은 날짜   #
     * @param {Number} D 이번 날짜   #
     * @param {Number} ai AI 사용가능 횟수   #
     * @param {Number} re 이번 달   #
     */
    for (let key in User.getData()) {
        Log.i("ASet[Start] 대상 ID:" + key)
        if ((User.edit(key, true).nickname).includes("Stars")) {
            //갱신
            if ((User.edit(key, true).stars["re"]) != getDate.month) {
                User.edit(key, true).stars["ai"] = 30;
                User.edit(key, true).stars["re"] = getDate.month;
                User.save();
                Log.i("ASet[Stars Refresh]: " + getDate.date)
            }
            //남은 일 카운트
            if (User.edit(key, true).stars["D"] != getDate.date) {
                User.edit(key, true).stars["D_date"] -= 1;
                User.edit(key, true).stars["D"] = getDate.date;
                User.save();
                Log.i("ASet[Stars Count]: " + getDate.date)
            }
            //이용기간 종료
            if ((User.edit(key, true).stars["D_date"]) == 0) {
                User.edit(key, true).stars["date"] = "";
                User.edit(key, true).stars["D_date"] = undefined;
                User.edit(key, true).stars["D"] = "";
                User.edit(key, true).stars["re"] = 0;
                event.room.send(CoinA(User.edit(key, true).id, "Stars 이용기간 종료", "Stars", "m", "TeamCloud 시스템"));
                User.save();
                Log.i("ASet[Stars Quit]: " + getDate.date)
            }
        }
        if (User.getData()[key].nickname.includes("Light Stars")) {
            //갱신
            if ((User.edit(key, true).stars["re"]) != getDate.month) {
                User.edit(key, true).stars["ai"] = 60;
                User.edit(key, true).stars["re"] = getDate.month;
                event.room.send(CoinA(User.edit(key, true).id, "Light Stars 혜택", 50, "p", "TeamCloud 시스템"));
                User.save();
                Log.i("ASet[Light Stars Refresh]: " + getDate.date)
            }
            //남은 일 카운트
            if (User.edit(key, true).stars["D"] != getDate.date) {
                User.edit(key, true).stars["D_date"] -= 1;
                User.edit(key, true).stars["D"] = getDate.date;
                User.save();
                Log.i("ASet[Light Stars Count]: " + getDate.date)
            }
            //이용기간 종료
            if ((User.edit(key, true).stars["D_date"]) == 0) {
                User.edit(key, true).stars["date"] = "";
                User.edit(key, true).stars["D_date"] = undefined;
                User.edit(key, true).stars["D"] = "";
                User.edit(key, true).stars["ai"] = 0;
                User.edit(key, true).stars["re"] = 0;
                event.room.send(CoinA(User.edit(key, true).id, "Light Stars 이용기간 종료", "Light Stars", "m", "TeamCloud 시스템"));
                User.save();
                Log.i("ASet[Light Stars Quit]: " + getDate.date)
            }
        }
        Log.i("ASet[Success]");
    }



}