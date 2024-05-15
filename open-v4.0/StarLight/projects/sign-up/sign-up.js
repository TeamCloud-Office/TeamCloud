let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    User,
    LS,
    msg,
    Pos,
    post,
    chat,
    random,
    Coin,
    Nickname,
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

    let data = JSON.parse(FS.read(SP))

    if (event.message == prefix + '약관') {
        if (data["set"]["state"] == 1) {
            event.room.send([
                msg.noti,
                "✅ Eric 이용약관 동의",
                "에릭의 대부분의 기능을 이용하려면 등록해야 합니다.",
                "아래 약관 정독 후 [에릭아 등록]을 입력해주세요.",
                "약관을 읽지 않고 동의한 경우 약관에 동의한 것으로 간주되며, 약관을 위반한 경우에는 사용이 제한될 수 있습니다.",
                "▶개인정보처리방침 : https://www.team-cloud.kro.kr/privacy",
                "▶봇 사용약관 : https://www.team-cloud.kro.kr/terms"
            ].join('\n'));
        }
    }

    if (event.message == prefix + "등록") {
        if (data["set"]["state"] == 1) {
            let Udata = User.get(event.sender.name)

            if (Boolean(Udata) == true) {
                //사용자 정보 있음
                if (User.read(event.sender.name)) return event.room.send([
                    msg.error_,
                    "",
                    LM("[시스템] 사용자 등록"),
                    "이미 등록하셨습니다."
                ].join("\n"));
                if (User.edit(event.sender.name, false).name == event.sender.name) return event.room.send([
                    msg.error_,
                    "",
                    LM("[시스템] 사용자 등록"),
                    "동일한 이름이 있습니다.",
                    "이름을 변경하여 등록해주시길 바랍니다."
                ].join("\n"));
            }

            function addId() {
                let id = '';
                let list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

                do {
                    id = '';
                    for (let i = 0; i < 5; i++) {
                        id += list[Math.floor(Math.random() * list.length)];
                    }
                } while (User.get(id));
                return id;
            }

            try {
                let Id = addId();
                let Data = {
                    name: event.sender.name,
                    //이름
                    id: Id,
                    //사용자 Id
                    hash: event.sender.profileHash,
                    //해시
                    date: getDate.today("/"),
                    //가입 날짜
                    admin: false,
                    //관리자
                    ban: false,
                    //밴
                    coin: 0,
                    //팀클 코인
                    warn: 0,
                    //경고 횟수
                    nickname: [],
                    //닉네임
                    like: 0,
                    //호감도
                    stocks: {},
                    //보유 주식
                    stars: {
                        date: "",
                        //가입 날짜
                        D_day: 0,
                        //남은 일
                        D: "",
                        //
                        M: 0,
                        //달
                        ai: 0,
                        //ai 기능 횟수
                    },
                    change: 0,
                    //Stars
                    etc: []
                    //기타
                };
                User.put(Id, Data);


                event.room.send(Coin(event.sender.name, "사용자 등록", 50000, false, "시스템"));
                java.lang.Thread.sleep(1500)
                event.room.send(Nickname(event.sender.name, "사용자 등록 성공", "사용자", false, true, "시스템"));
                java.lang.Thread.sleep(1500)
                event.room.send([
                    msg.noti,
                    LM("[시스템] 사용자 등록"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    "사용자 ID: " + Udata["id"],
                    "",
                    "사용자 등록을 성공하였습니다."
                ].join("\n"));
                Api.replyRoom("TeamCloud 팀원", [
                    LM("[시스템] 사용자 등록(성공)"),
                    "사용자 등록 > " + event.sender.name,
                    "사용자 ID: " + Udata["id"]
                ].join("\n"));
                //event.room.send(Coin(event.sender.name, "정식 오픈 기념", 3000, false));
                //event.room.send("현재 나랑 친구할 수 없어..");
            } catch (e) {
                event.room.send([
                    msg.noti,
                    LM("[시스템] 사용자 등록"),
                    "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                    "사용자 ID: " + undefined,
                    "",
                    "사용자 등록을 실패하였습니다."
                ].join("\n"));
                Api.replyRoom("TeamCloud 팀원", [
                    LM("[시스템] 사용자 등록(실패)"),
                    "사용자 등록 > " + event.sender.name,
                    "사용자 ID: " + undefined
                ].join("\n"));
            }
        }
    }

}