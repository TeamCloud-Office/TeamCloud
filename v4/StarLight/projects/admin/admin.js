/**
 * 제작자: TeamCloud
 * 라이선스: CCL BY-SA 2.0
 */

let {
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

let prefix = "tc "

function onMessage(event) {


    let Set = JSON.parse(FS.read(SP))

    let error_ = msg.error_


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


    let Udata = User.get(event.sender.name)

    //정규식
    let user = event.message.match(/u:([^,]+)/) ? event.message.match(/u:([^,]+)/)[1] : null
    let season = event.message.match(/e:([^,]+)/) ? event.message.match(/e:([^,]+)/)[1] : null
    let warn = event.message.match(/w:([^,]+)/) ? event.message.match(/w:([^,]+)/)[1] : null
    let ban = event.message.match(/b:([^,]+)/) ? event.message.match(/b:([^,]+)/)[1] : null
    let coin = event.message.match(/c:([^,]+)/) ? event.message.match(/c:([^,]+)/)[1] : null
    let nickname = event.message.match(/n:([^,]+)/) ? event.message.match(/n:([^,]+)/)[1] : null
    let pm = event.message.match(/p:([^,]+)/) ? event.message.match(/p:([^,]+)/)[1] : null
    let stars = event.message.match(/s:([^,]+)/) ? event.message.match(/s:([^,]+)/)[1] : null
    let nuser = event.message.match(/nu:([^,]+)/) ? event.message.match(/nu:([^,]+)/)[1] : null
    let message = event.message.match(/m:([^,]+)/) ? event.message.match(/m:([^,]+)/)[1] : null
    let room = event.message.match(/r:([^,]+)/) ? event.message.match(/r:([^,]+)/)[1] : null
    let ymd = event.message.match(/d:([^,]+)/) ? event.message.match(/d:([^,]+)/)[1] : null


    //snd 확인
    if (Boolean(Udata)) {
        if (Set["snd"][Udata["id"]] == undefined) FS.write(SP, JSON.stringify(Set))
    }


    //eval
    if (event.message.startsWith(prefix + "e")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["admin"] == false) return event.room.send(msg.admin);
        try {
            var before = Date.now();
            event.room.send(msg.noti + eval(event.message.replace(prefix + "e", "")));
            java.lang.Thread.sleep(0);
            var after = Date.now();
            event.room.send("RunTime : " + (after - before) + "ms");
        } catch (e) {
            event.room.send(msg.error(e.name, e.fileName, e.message, e.lineNumber));
        }
    }


    //기록
    if (event.message.startsWith(prefix + "기록 ")) {
        if (Boolean(Udata) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (ymd == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")

        let log = JSON.parse(FS.read("sdcard/StarLight/BotData/chat/" + (ymd.split(" ")[0] + "/" + ymd.split(" ")[1] + "/" + ymd.split(" ")[2]) + ".json"))

        if (room != null) {
            if (log[room] == undefined) {
                event.room.send([
                    error_,
                    "해당 채팅방을 찾을 수 없습니다.",
                    "채팅방: " + room
                ].join("\n"));
            } else {
                if (user != null) {
                    let target = Object.keys(log[room]).find(key => {
                        let match = key.match(/\(([^)]+)\)/g);
                        if (match) {
                            let value = match[0].slice(1, -1);
                            return value.includes(user);
                        }
                        return false;
                    });
                    if (target == undefined) return event.room.send([
                        error_,
                        "해당 사용자를 찾을 수 없습니다.",
                        "사용자: " + user
                    ].join("\n"));
                    event.room.send(JSON.stringify(log[room][target], null, 4))
                } else {
                    event.room.send(JSON.stringify(log[room], null, 4))
                }
            }
        } else {
            event.room.send(JSON.stringify((log), null, 4))
        }
    }



    /**
        @param {String} user 사용자 아이디 (또는 사용자 이름)
        @param {String} season 사유
        @param {Number} warn 지급/회수할 경고수
     */
    //경고
    if (event.message.startsWith(prefix + "경고 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || season == null || warn == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        Udata_id["warn"] += Number(warn)
        User.put(Udata_id["id"], Udata_id)

        if (warn > 0) {
            event.room.send(post(Udata_id["id"], [
                "제목: 경고 안내",
                "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                "사유: " + season,
                Udata_id["warn"] + "회" + "(+" + Math.abs(warn) + "회" + ")"
            ].join("\n"), Udata_name["name"], true))
        } else {
            event.room.send(post(Udata_id["id"], [
                "제목: 경고 안내",
                "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                "사유: " + season,
                Udata_id["warn"] + "회" + "(-" + Math.abs(warn) + "회" + ")"
            ].join("\n"), Udata_name["name"], true))
        }
    }


    //차단
    if (event.message.startsWith(prefix + "차단 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || season == null || ban == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        Udata_id["ban"] = Boolean(ban)
        User.put(Udata_id["id"], Udata_id)

        if (ban == true) {
            event.room.send(post(Udata_id["id"], [
                "제목: 차단 안내",
                "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                "사유: " + season,
                "차단: " + ban ? "O" : "X"
            ], Udata_name["name"], true))
        }
        if (ban == false) {
            event.room.send(post(Udata_id["id"], [
                "제목: 차단 안내",
                "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                "사유: " + season,
                "차단: " + ban ? "O" : "X"
            ], Udata_name["name"], true))
        }
    }


    //코인
    if (event.message.startsWith(prefix + "코인")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || season == null || coin == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        event.room.send(Coin(user, season, coin, true, Udata_name["name"]));
    }


    //닉네임
    if (event.message.startsWith(prefix + "닉네임")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || season == null || nickname == null || pm == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));


        event.room.send(Nickname(user, season, nickname, ((pm == "true") ? true : false), true, Udata_name["name"]));
    }


    //Stars 가입
    if (event.message.startsWith(prefix + "S")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || stars == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        switch (stars) {
            case "1":
                Udata_id["stars"]["date"] = getDate.today("/");
                Udata_id["stars"]["ai"] = 30;
                Udata_id["stars"]["re"] = getDate.month;
                Udata_id["stars"]["D"] = getDate.date;
                Udata_id["stars"]["D_date"] = 60;
                User.put(Udata_id["id"], Udata_id)
                event.room.send(Coin(Udata["id"], "Stars 가입", 10000, true, "System"));
                event.room.send(Nickname(Udata["id"], "Stars 가입", "Stars", true, true, "System"))
                break;
            case "2":
                Udata_id["stars"]["date"] = getDate.today("/");
                Udata_id["stars"]["ai"] = 60;
                Udata_id["stars"]["re"] = getDate.month;
                Udata_id["stars"]["D"] = getDate.date;
                Udata_id["stars"]["D_date"] = 120;
                User.put(Udata_id["id"], Udata_id)
                event.room.send(Coin(Udata["id"], "Stars 가입", 50000, true, "System"));
                event.room.send(Nickname(Udata["id"], "Stars 가입", "Light Stars", true, true, "System"))
                break;
        }
    }


    //계정 변경
    if (event.message.startsWith(prefix + "변경 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || nuser == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        if ((Udata_id["change"] > 5) == false) return event.room.send("해당 사용자는 계정 변경을 5번 이상 진행하였습니다.")
        Udata_id["name"] = User.get(nuser)["name"];
        Udata_id["change"]++
        User.put(Udata_id["id"], Udata_id);
        User.delete(nuser);
        event.room.send(post(Udata_id["id"], [
            "제목: " + "계정 변경 안내",
            "사용자: " + "[" + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"] + "]",
            "위 사용자의 계정 변경이 완료되었습니다."
        ], Udata_name["name"], true))
        event.room.send("계정 변경이 완료되었습니다.")
    }


    //정보
    if (event.message.startsWith(prefix + "정보 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        let stocks;
        if (Object.keys(Udata_id["stocks"]) == "") {
            stocks = "없음";
        } else {
            stocks = Object.keys(Udata_id["stocks"])
        }
        event.room.send([
            msg.noti,
            "이름: " + Udata_id["name"],
            "ID: " + Udata_id["id"],
            "등록 날짜: " + Udata_id["date"],
            "닉네임: " + Udata_id["nickname"],
            "관리자: " + (Udata_id["admin"] ? "예" : "아니오"),
            "팀클 코인: " + Udata_id["coin"] + "코인",
            "경고 횟수: " + Udata_id["warn"] + "회",
            "주식 보유 종목: " + stocks,
            "호감도: " + Udata_id["like"],
            "Stars 가입 날짜: " + Udata_id["stars"]["date"] + "(" + Udata_id["stars"]["D_date"] + "일 남음)",
            "Ai 사용 가능 횟수: " + Udata_id["stars"]["ai"],
            "기타: " + Udata_id["etc"]
        ].join("\n"));
    }


    //탈퇴
    if (event.message.startsWith(prefix + "탈퇴 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        event.room.send([
            msg.noti,
            LM("서비스 탈퇴"),
            '해당 사용자와의 연결을 종료했습니다.',
            "사용자명: " + Udata_id["name"]
        ].join("\n"));
        User.delete(user);
    }


    //공지
    if (event.message.startsWith(prefix + "공지")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        let rooms = {
            "Little women": false,
            "♡ 78 마굿간 ♡": false,
            "밀크초코 아이스🧊": false,
            "다잡방": false,
            "타장르 잡담방": false,
            "Heiiza Mr J의 이야기?방": false,
            "미성년자 금융방": false
        };
        let msg = event.message.replace(prefix + "공지", "");
        for (let room in rooms) {
            if (!rooms[room]) {
                Api.replyRoom(room, "[TeamCloud 공지]" + msg);
            }
        }
        event.room.send("공지를 모든 방에 전송했어!");
    }


    //우편
    if (event.message.startsWith(prefix + "우편 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        if (user == null || message == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
        let Udata_id = User.get(user)
        if (Boolean(Udata_id) == false) return event.room.send([
            error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        event.room.send(post(Udata_id["id"], message, Udata_name["name"], true))
    }


    //전체 우편
    if (event.message.startsWith(prefix + "전체우편 ")) {
        let Udata_name = User.get(event.sender.name)
        if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
        if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

        for (i = 0; i < (User.id()).length; i++) {
            let target = User.id()[i];
            post(target, message, Udata_name["name"], false);
        }
        event.room.send(msg.noti + "모든 사용자에게 우편을 전송하였습니다.")
    }


    //기록(생성)
    let path = 'sdcard/StarLight/BotData/chat/' + getDate.today("/") + '.json';

    if (!FS.read(path)) FS.write(path, '{}');
    let json = JSON.parse(FS.read(path));

    if (event.message.startsWith(prefix)) {
        if (Boolean(Udata) == false) return;
        if (event.message.startsWith(prefix + "e")) return;
        if (["TeamCloud 개발방", "TeamCloud"].includes(event.room.name)) return;

        if (json[event.room.name] == undefined) json[event.room.name] = {};
        if (json[event.room.name][Udata["name"] + "(" + Udata["id"] + ")"] == undefined) json[event.room.name][Udata["name"] + "(" + Udata["id"] + ")"] = [];

        json[event.room.name][Udata["name"] + "(" + Udata["id"] + ")"].push(getDate.time(":") + " : " + event.message);
        FS.write(path, JSON.stringify(json, null, 4));
    }



    //우편(확인)
    if (Boolean(Udata)) {
        let data = JSON.parse(FS.read(SP));
        if (!data["snd"][Udata["id"]]) {
            data["snd"][Udata["id"]] = [];
            FS.write(SP, JSON.stringify(data, null, 4));
        }
        if (data["snd"][Udata["id"]].length >= 1) {
            let items = data["snd"][Udata["id"]];
            let contents = [];

            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                contents.push(Udata["nickname"] + Udata["name"] + '의 우편 | ' + item.time +
                    "\n" +
                    '→ ' + item.content +
                    "\n" +
                    '관리자 이름: ' + item.admin);
            }
            event.room.send([
                msg.noti,
                LM("관리자 우편"),
                "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                '우편 개수: ' + contents.length,
                "본 메시지는 TeamCloud 관리자로부터 발송된 우편입니다.",
                Lw,
                '\n━━━━━━━━━━━━━━━━━━━━━━━━\n',
                contents.join('\n━━━━━━━━━━━━━━━━━━━━━━━━\n')
            ].join('\n'));

            data["snd"][Udata["id"]] = [];
            FS.write(SP, JSON.stringify(data, null, 4));
        }
    }




    //Stars(확인)
    /*
    try {
        if (count == 0) {
            clearInterval(interval(User, Udata))
            interval(User, Udata)
            count = 1
        }
    } catch (e) {
        event.room.send(msg.error(e.name, e.fileName, e.message, e.lineNumber));
    }

    */


    //GitHub 연동
    let owner = "TeamCloud"; // GitHub 저장소 소유자
    let repo = "TeamCloud"; // GitHub 저장소 이름
    let token = "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" //GitHub 토큰

    if (event.message == prefix + "불러오기") {
        event.room.send("[GitHub] GitHub에서 파일을 가져왔습니다.")
        for (let i = 0; i < file.length; i++) {
            let path = "sdcard/StarLight/projects/"
            let script = java.io.File(path).list().slice()[i]
            FS.write((path + script + "/" + script + ".js"), githubAPI(owner, repo, script + ".js", token))
        }
        java.lang.Thread.sleep(1000)
        event.room.send("[GitHub] 파일을 모두 적용했습니다.")
    }

}


//cafe
let path = "sdcard/StarLight/BotData/cafe.json"

if (!FS.read(path)) FS.write(path, JSON.stringify({
    today: "",
    headName: "",
    subject: "",
    id: "",
    detail: ""
}, null, 2));

let filter_word = "c"

let cafe = setInterval(() => {
    let json = JSON.parse(FS.read(path));

    let cafeId = "31241263" //TeamCloud Official Cafe

    let cafe = JSON.parse(
        org.jsoup.Jsoup.connect(
            "https://apis.naver.com/cafe-web/cafe2/ArticleListV2dot1.json?search.clubid=" + cafeId + "&search.queryType=lastArticle&search.page=1&search.perPage=1&ad=false"
        ).ignoreContentType(true)
        .get().text()
    );
    let headName = cafe["message"]["result"]["articleList"][0]["headName"]
    let subject = cafe["message"]["result"]["articleList"][0]["subject"]
    let today = {
        y: new Date(cafe["message"]["result"]["articleList"][0]["writeDateTimestamp"]).getFullYear(),
        m: new Date(cafe["message"]["result"]["articleList"][0]["writeDateTimestamp"]).getMonth() + 1,
        d: new Date(cafe["message"]["result"]["articleList"][0]["writeDateTimestamp"]).getDate()
    }
    let id = cafe["message"]["result"]["articleList"][0]["articleId"]
    let detail = JSON.parse(
            org.jsoup.Jsoup.connect(
                "https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/" + cafeId + "/articles/" + id
            ).ignoreContentType(true)
            .get().text()
        )["result"]["article"]["contentHtml"]
        .replace(/\n/g, "").replace(/  /g, "").trim()
        .replace(/([.,!?;:])\s/g, '\n')

    let data = {
        today: today.y + "." + today.m + "." + today.d + ".",
        headName: headName,
        subject: subject,
        id: id,
        detail: detail.substring(0, detail.indexOf("자세한 내용은 아래를 확인해주시길 바랍니다")) + "자세한 내용은 아래 링크를 확인해주시길 바랍니다"
    }

    if (Number(json["id"]) != Number(data["id"])) {
        if (Number(json["id"]) > Number(data["id"])) return;
        FS.write(path, JSON.stringify(data, null, 2))
        if (data.headName == undefined) {
            Api.replyRoom("TeamCloud 개발방", "[cafe] 사용자 게시물 - 제외 처리")
            Log.i("cafe", "사용자 게시물 - 제외 처리");
            return;
        } else {
            for (let i = 0; i < filter_word.length; i++) {
                if (data.headName.includes(filter_word[i]) == true) {
                    Api.replyRoom("TeamCloud 개발방", "[cafe] 공지 차단 게시물 - 제외 처리")
                    Log.i("cafe", "공지 차단 게시물 - 제외 처리");
                    return;
                }
            }
        }
        Api.replyRoom("TeamCloud 개발방", [
            "<TeamCloud " + data["headName"] + ">",
            "제목: " + data["subject"],
            "일시: " + data["today"],
            "",
            "내용: " + data["detail"],
            "https://cafe.naver.com/teamcloudcafe/" + data["id"]
        ].join("\n"));
        Log.d("cafe", "공지 전송 완료")
    }
}, 2 * 60 * 1000); //2분마다 변동 사항 체크


/**
 * @param {String} date Stars 가입 날짜   ####/#/##
 * @param {Number} D_date 남은 날짜   #
 * @param {Number} D 이번 날짜   #
 * @param {Number} ai AI 사용가능 횟수   #
 * @param {Number} M 이번 달   #
 */
/*
let Stars = (User, Udata) => setInterval(() => {

    if ((Udata["nickname"]).includes("Stars")) {
        //갱신
        if (Udata["stars"]["M"] != getDate.month) {
            Log.d("Setting", "Start")
            Udata["stars"]["M"] = getDate.month;
            Udata["stars"]["ai"] = 30;
            User.put(Udata["id"], Udata)
            Log.d("Setting", "Finish")
        }
        //남은 일 카운트
        if (Udata["stars"]["D"] != getDate.date) {
            Log.d("Setting", "Start")
            Udata["stars"]["D"] = getDate.date;
            Udata["stars"]["D_day"]--
            User.put(Udata["id"], Udata)
            Log.d("Setting", "Finish")
        }
        //이용기간 종료
        if ((Udata["stars"]["D_day"]) == 0) {
            Log.d("Setting", "Start")
            Udata["stars"]["date"] = "";
            Udata["stars"]["D_day"] = 0;
            Udata["stars"]["D"] = 0;
            Udata["stars"]["M"] = 0;
            Nickname(Udata["id"], "Stars 이용기간 종료", "Stars", false, true, "TeamCloud 시스템")
            User.put(Udata["id"], Udata)
            Log.d("Setting", "Finish")
        }
    }

    if (Udata["nickname"].includes("Light Stars")) {
        //갱신
        if ((Udata["stars"]["M"]) != getDate.month) {
            Log.d("Setting", "Start")
            Udata["stars"]["M"] = getDate.month;
            Udata["stars"]["ai"] = 60;
            Coin(Udata["id"], "Light Stars 혜택", 5000, true, "TeamCloud 시스템")
            User.put(Udata["id"], Udata)
            Log.d("Setting", "Finish")
        }
        //남은 일 카운트
        if (Udata["stars"]["D"] != getDate.date) {
            Log.d("Setting", "Start")
            Udata["stars"]["D_day"]--
            Udata["stars"]["D"] = getDate.date;
            User.put(Udata["id"], Udata)
            Log.d("Setting", "Finish")
        }
        //이용기간 종료
        if ((Udata["stars"]["D_day"]) == 0) {
            Log.d("Setting", "Start")
            Udata["stars"]["date"] = "";
            Udata["stars"]["D_day"] = 0;
            Udata["stars"]["D"] = 0;
            Udata["stars"]["M"] = 0;
            Udata["stars"]["ai"] = 0;
            Nickname(Udata["id"], "Light Stars 이용기간 종료", "Light Stars", false, true, "TeamCloud 시스템")
            User.put(Udata["id"], Udata)
            Log.d("Setting", "Finish")
        }
    }

}, 24 * 60 * 60 * 1000)

*/


function onStartCompile() {
    clearInterval(cafe);
    Log.d("cafe", "clear")
    clearInterval(Stars);
    Log.d("Stars", "clear")
}