/**
 * 제작자: Yellu#1794 , hello
 * 라이선스: TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따릅니다.
 * 기타: 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스를 따라야합니다.
 * 
 * Ver: Alpha 4.2.5.03
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


    if (User.read(event.sender.name)) {
        let data = JSON.parse(FS.read(SP));
        let Udata = User.get(event.sender.name)
        if (!data["snd"][Udata_id["id"]]) {
            data["snd"][Udata_id["id"]] = [];
            FS.write(SP, JSON.stringify(data, null, 4));
        }
        if (Object.keys(data["snd"]).includes(Udata_id["id"]) && data["snd"][Udata_id["id"]].length >= 1) {
            let items = data["snd"][Udata_id["id"]];
            let contents = [];

            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                contents.push(User.edit(item.sender, true).name + '의 메시지 | ' + item.time +
                    "\n" +
                    '→ ' + item.content +
                    "\n" +
                    '관리자 이름: ' + item.admin);
            }
            event.room.send([
                msg.noti,
                LM("우편"),
                "사용자: " + "[" + Udata_id["nickname"][0] + "]" + event.sender.name,
                '우편 개수: ' + contents.length,
                Lw,
                contents.join('\n━━━━━━━━━━━━━━━━━━━━━━━━\n')
            ].join('\n'));

            delete data["snd"][Udata_id["id"]];
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
    for (let k in User.id()) {
        let Udata = User.get(User.id()[k])
        if ((Udata["nickname"]).includes("Stars")) {
            //갱신
            if (Udata["stars"]["M"] != getDate.month) {
                Udata["stars"]["M"] = getDate.month;
                Udata["stars"]["ai"] = 30;
                User.put(Udata["id"], Udata)
            }
            //남은 일 카운트
            if (Udata["stars"]["D"] != getDate.date) {
                Udata["stars"]["D_day"]--
                Udata["stars"]["D"] = getDate.date;
                User.put(Udata["id"], Udata)
            }
            //이용기간 종료
            if ((Udata["stars"]["D_day"]) == 0) {
                Udata["stars"]["date"] = "";
                Udata["stars"]["D_day"] = 0;
                Udata["stars"]["D"] = 0;
                Udata["stars"]["M"] = 0;
                event.room.send(Nickname(Udata["id"], "Stars 이용기간 종료", "Stars", false, true, "TeamCloud 시스템"));
                User.put(Udata["id"], Udata)
            }
            Log.i("Setting[Success]");
        }
        if (Udata["nickname"].includes("Light Stars")) {
            //갱신
            if ((Udata["stars"]["M"]) != getDate.month) {
                Udata["stars"]["M"] = getDate.month;
                Udata["stars"]["ai"] = 60;
                event.room.send(Coin(Udata["id"], "Light Stars 혜택", 5000, true, "TeamCloud 시스템"));
                User.put(Udata["id"], Udata)
            }
            //남은 일 카운트
            if (Udata["stars"]["D"] != getDate.date) {
                Udata["stars"]["D_day"]--
                Udata["stars"]["D"] = getDate.date;
                User.put(Udata["id"], Udata)
            }
            //이용기간 종료
            if ((Udata["stars"]["D_day"]) == 0) {
                Udata["stars"]["date"] = "";
                Udata["stars"]["D_day"] = 0;
                Udata["stars"]["D"] = 0;
                Udata["stars"]["M"] = 0;
                Udata["stars"]["ai"] = 0;
                event.room.send(Coin(Udata["id"], "Light Stars 이용기간 종료", "Light Stars", "m", "TeamCloud 시스템"));
                User.put(Udata["id"], Udata)
            }
            Log.i("Setting[Success]");
        }
    }



}