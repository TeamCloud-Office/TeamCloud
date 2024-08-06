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

User.open()


let rooms = {};

function onProjectButtonClicked(id) {
    let data = JSON.parse(FS.read(SP))
    if (id == "normal") {
        data["set"]["state"] = 1;
        Api.showToast('정상 모드', 0);
        Api.makeNoti("현재 상태", "정상 모드");
        FS.write(SP, JSON.stringify(data, null, 4))
        Api.replyRoom("TeamCloud 개발방", "정상모드로 변경되었습니다.")
    }
    if (id == "check") {
        data["set"]["state"] = 0;
        Api.showToast('점검 모드', 0);
        Api.makeNoti("현재 상태", "점검 모드");
        FS.write(SP, JSON.stringify(data, null, 4))
        Api.replyRoom("TeamCloud 개발방", "점검모드로 변경되었습니다.")
    }
    if (id == "test") {
        data["set"]["state"] = 2;
        Api.showToast('테스트 모드', 0);
        Api.makeNoti("현재 상태", "테스트 모드");
        FS.write(SP, JSON.stringify(data, null, 4))
        Api.replyRoom("TeamCloud 개발방", "테스트모드로 변경되었습니다.")
    }

    if (id == "reset") {
        Api.showToast('전체 리로드 시작', 0);
        Api.makeNoti("현재 상태", "리로드 시작");
        for (let room in rooms) {
            if (!rooms[room]) {
                Api.markAsRead(room);
            }
        }
        Api.compile();
        Api.showToast('전체 리로드 성공', 0);
        Api.makeNoti("현재 상태", "리로드 완료");
        Api.replyRoom("TeamCloud 개발방", "리로드가 완료되었습니다.")
    }
}

function onMessage(event) {

    let getDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        day: new Date().getDay(),
        today: (str) => String(new Date().getFullYear()).padStart(2, "0") + str + String(new Date().getMonth() + 1).padStart(2, "0") + str + String(new Date().getDate()).padStart(2, "0"),
        time: (str) => String(new Date().getHours()).padStart(2, "0") + str + String(new Date().getMinutes()).padStart(2, "0") + str + String(new Date().getSeconds()).padStart(2, "0")
    };

    let Udata = User.get(event.sender.name)


    if (!rooms[event.room.name]) {
        rooms[event.room.name] = false;
    } else {
        rooms[event.room.name] = false;
    }

    //테스트
    if (event.message == "!테스트") {
        let before = Date.now();
        event.room.send("TEST!");
        let after = Date.now();
        event.room.send("RunTime : " + (after - before) + "ms");

    }

    //읽음처리
    if (event.message == "!읽음") {
        try {
            for (let room in rooms) {
                if (!rooms[room]) {
                    Api.markAsRead(room);
                }
            }
            event.room.send("모든 채팅방을 읽음처리 했습니다.");
        } catch (e) {
            event.room.send(JSON.stringify(e));
        }
    }

    //스크립트 재설정
    if (event.message == "!재설정") {
        try {
            Api.compile();
            event.room.send("모든 스크립트를 재설정했습니다.");
        } catch (e) {
            event.room.send(JSON.stringify(e));
        }
    }

    /* ------ 도움말 ------ */
    if (event.message.startsWith(prefix + "도움말") || ["!도움말", "!명령어"].includes(event.message)) {
        KakaoLink(0, 110357, {
            HEADER: "도움말",
            LINK: "",

            TITLE1: "출석",
            DES1: "출석으로 우리 방의 출석왕이 되어보세요!",
            L_LINK1: "fun/attendance",
            IMG1: "https://res.cloudinary.com/teamcloud/image/upload/v1722846211/atten.png",

            TITLE2: "주식",
            DES2: "주식으로 돈 부자가 될 수 있어요!",
            L_LINK2: "game/stock",
            IMG2: "https://res.cloudinary.com/teamcloud/image/upload/v1722846211/stock.png",

            TITLE3: "음악",
            DES3: "음악을 검색하고 추천을 받아보세요!",
            L_LINK3: "search/music",
            IMG3: "https://res.cloudinary.com/teamcloud/image/upload/v1722846211/music.png",

            BUTTON: "더보기",
            B_LINK: ""
        }, event.room.name)
    }


    /* ------ 등록 ------ */
    if (event.message == prefix + '약관') {
        event.room.send([
            msg.noti,
            "✅ Eric 이용약관 동의",
            "에릭의 대부분의 기능을 이용하려면 등록해야 합니다.",
            "아래 약관 정독 후 [에릭아 등록]을 입력해주세요.",
            "▶개인정보처리방침 : https://www.team-cloud.kro.kr/privacy",
            "▶봇 사용약관 : https://www.team-cloud.kro.kr/terms"
        ].join('\n'));
    }

    if (event.message == prefix + "등록") {
        if (Boolean(Udata) == true) return event.room.send([
            msg.error_,
            "",
            LM("[시스템] 사용자 등록"),
            "이미 등록하셨습니다."
        ].join("\n"));

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
                chat: 0,
                //채팅 횟수
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

            Udata = User.get(Id)

            Nickname(event.sender.name, "사용자 등록 성공", "사용자", true, true, "System")
            Coin(event.sender.name, "사용자 등록", 50000, true, "System")
            User.put(Udata["id"], Udata);

            event.room.send([
                msg.noti,
                LM("[시스템] 사용자 등록"),
                "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                "사용자 ID: " + Udata["id"],
                "",
                "사용자 등록을 성공하였습니다."
            ].join("\n"));

            Api.replyRoom("TeamCloud 개발방", [
                LM("[시스템] 사용자 등록(성공)"),
                "사용자 등록 > " + event.sender.name,
                "사용자 ID: " + Udata["id"]
            ].join("\n"));

        } catch (e) {
            event.room.send(msg.error(e.name, e.fileName, e.message, e.lineNumber));
            Api.replyRoom("TeamCloud 개발방", [
                LM("[시스템] 사용자 등록(실패)"),
                "사용자 등록 > " + event.sender.name,
                "사용자 ID: " + undefined
            ].join("\n"));
        }
    }
}