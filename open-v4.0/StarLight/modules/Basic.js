/**
 * 제작자: Yellu#1794 , hello
 * 라이선스: 없음
 * 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따릅니다.
 * 기타: 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스를 따라야합니다.
 *
 * Ver: Alpha 4.2.5.03
 */

(function () {


    let prefix = '아리아 ';


    let Lw = '\u200b'.repeat(500),
        Line = (num) => "━━━━".repeat(num),
        LM = (str) => "====".repeat(1) + str + "====".repeat(1);



    let FS = FileStream;



    let getDate = {
        year: () => new Date().getFullYear(),
        month: () => new Date().getMonth() + 1,
        date: () => new Date().getDate(),
        hour: () => new Date().getHours(),
        minute: () => new Date().getMinutes(),
        second: () => new Date().getSeconds(),
        day: () => new Date().getDay(),
        today: (str) => new Date().getFullYear() + str + (new Date().getMonth() + 1) + str + new Date().getDate(),
        time: (str) => new Date().getHours() + str + new Date().getMinutes() + str + new Date().getSeconds()
    };



    let UserPath = "/sdcard/StarLight/BotData/admin/UseData.db",
        SetPath = "/sdcard/StarLight/BotData/Set.json",
        ChatPath = '/sdcard/StarLight/BotData/Chat/' + getDate.year() + 'y/' + (getDate.month()) + 'm/' + getDate.day() + 'd' + '.json',
        AttenPath = '/sdcard/StarLight/BotData/check-in_list.json';



    let Kakaocord = {
        discord: {
            send: (server, channel, msg) => Discord.api.getServerById(server).get().getChannelById(channel).get().sendMessage(msg),
            embed: (msg, des, author, field1_tit, field1_des, field2_tit, field2_des, color) => org.javacord.api.entity.message.embed.EmbedBuilder()
                .setTitle(msg)
                .setDescription(des)
                .setAuthor(author)
                .addField(field1_tit, field1_des)
                .addInlineField(field2_tit, field2_des)
                .setColor(java.awt.Color.decode(color))
        },
        kakaotalk: {
            send: (channel, msg) => Api.replyRoom(channel, msg + "(Kakao-cord)")
        }
    }



    /*
    Set: {
        JSON.parse(FS.read(SetPath)),
        FS.write(SetPath, JSON.stringify(JSON.parse(FS.read(SetPath)), null, 4))
    }
    */



    let RhinoKV = require("KV");

    let KV = new RhinoKV();

    let User = {

        open: () => {
            KV.open(UserPath)
        }, // DB를 open합니다.

        close: () => {
            KV.close()
        }, // DB를 close합니다.

        get: (key) => {
            if (KV.get(key)["name"] == key) {
                for (let k in KV.listKeys()) {
                    if (KV.get(KV.listKeys()[k])["name"] == key) return KV.get(KV.listKeys()[k])
                }
                return KV.get(key)
            } else {
                return msg.error_ + "[User] 가져올 수 있는 정보가 2개 이상입니다."
            }
        }, // DB에서 key 값이 일치하는 record를 가져옵니다.

        put: (key, value) => {
            KV.put(key, value)
            return KV.get(key)
        }, // DB에 {key: key, value:value} 형태로 값을 넣습니다.

        delete: (key) => {
            KV.del(key)
        }, // DB에서 key 값을 삭제합니다.

        id: () => {
            return KV.listKeys()
        } // DB에서 key 값들을 모두 가져옵니다.

    }



    let msg = {

        noti: [
            '[ Eric Ver : ' + 'Alpha 4.2.5.03' + ']',
            "",
            //봇 답변
        ].join('\n'),
        //공지

        terms: [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> 약관 미동의",
            "TeamCloud의 서비스를 사용하시려면 약관에 대해 동의해주세요.",
            "약관에 동의하시려면 [에릭아 약관]을 입력해주세요."
        ].join('\n'), //약관

        admin: [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> 관리자 명령어입니다."
        ].join('\n'),

        ban: [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> 사용제한된 사용자입니다."
        ].join("\n"),

        error: (name, detail, line) => [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> 아래 오류 내용을 TeamCloud 문의 메일로 전송해주세요.",
            "help@team-cloud.kro.kr",
            "",
            "오류 이름: " + name,
            "오류 내용: " + detail,
            "오류 발생 줄: " + line
            //오류 내용
        ].join('\n'),

        error_: [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> "
        ].join("\n")

    };



    /**
     *
     * @param {String} str 이을 단어
     * @param {String} t 받침O
     * @param {String} f 받침X
     * @returns
     */
    function Pos(str, t, f) {
        return (str) + (str.slice(-1).normalize("NFKD")[2] != undefined) ? t : f;
    }



    let chat = {
        save: (room, sender, msg) => {
            JSON.parse(FS.read(ChatPath))[room][sender][getDate.time(":")] = msg;
            FS.write(ChatPath, JSON.stringify(chat_log, null, 4));
        }
    }



    function random(per) {
        if (Math.random() * 100 <= per) {
            return true;
        } else {
            return false;
        }
    };



    /**
     *
     * @param {Array} arr ex) [["A", 100], ["B", 50], ["C", 20]] //A
     * @param {Number} bias ex) Math.random().toFixed(2) //0.23
     * @returns
     */
    function randomI(arr, bias) {
        arr = arr.map(([a, pro]) => [a, Math.pow(pro, bias)]);

        let totalWeight = arr.reduce((total, item) => total + item[1], 0);

        let randomNum = Math.random() * totalWeight;

        let weightSum = 0;

        for (let i = 0; i < arr.length; i++) {
            weightSum += arr[i][1];

            weightSum = +weightSum.toFixed(2);
            if (randomNum <= weightSum) return arr[i][0];
        }
    }



    /**
     *
     * @param {String} s 받을 사용자
     * @param {String} m 메시지
     * @param {String} an 관리자 이름
     * @returns
     */
    function post(s, m, an) {
        let data = JSON.parse(FS.read(SetPath));
        let snd = data["snd"];

        let stc = {
            sender: User.search(s)["name"] + "(" + User.search(s)["id"] + ")",
            time: getDate.today("/"),
            content: m,
            admin: an
        };

        if (s in snd) {
            snd[s].push(stc);
        } else {
            snd[s] = [stc];
        }
        FS.write(SetPath, JSON.stringify(data, null, 4))

        return [
            LM("[시스템] 우편 전송"),
            "발신자: " + User.get(an)["name"],
            "수신자: " + User.get(s)["name"]
        ].join("\n") //우편 전송 완료 메시지 출력
    }



    /**
     * Coin(str|s:사용자이름, str|e:사유, num|c:코인, boo|p:우편, str|an:관리자이름)
     * Nickname(str|s:사용자이름, str|e:사유, str|n:닉네임, boo|pm:지급회수, boo|p:우편, str|an:관리자이름)
     * Like(str|s:사용자이름, boo|pm:지급회수, num|per:%)
     */



    /**
     *
     * @param {String} s 사용자 이름
     * @param {String} e 사유
     * @param {Number} c 코인 개수
     * @param {Boolean} p 우편 전송 여부
     * @param {String} an 관리자 이름
     * @returns
     */
    function Coin(s, e, c, p, an) {
        c = Number(c);
        try {
            User.open() //유저 데이터 수정 시작
            let Udata = User.get(s)

            if (c > 0) { //증감

                Udata["coin"] += c
                User.put(Udata["id"], Udata) //유저 데이터에 변경된 값 저장

                if (p == true) { //우편 전송 O
                    post(Udata["id"], [
                        "제목: 코인 증감",
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        Udata["coin"] + "coin" + "(+" + Math.abs(c) + "coin)"
                    ].join("\n"), User.get(an)["name"]) //관리자의 이름으로 우편 전송
                } else { //우편 전송 X
                    return [
                        LM("[시스템] 코인 증감"),
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        Udata["coin"] + "coin" + "(+" + Math.abs(c) + "coin)"
                    ].join("\n") // 코인 증감 메시지 출력
                }

            } else { //감소

                Udata["coin"] += c
                User.put(Udata["id"], Udata) //유저 데이터에 변경된 값 저장

                if (p == true) { //우편 전송 O
                    post(Udata["id"], [
                        "제목: 코인 감소",
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        Udata["coin"] + "coin" + "(-" + Math.abs(c) + "coin)"
                    ].join('\n'), User.get(an)["name"]) //관리자의 이름으로 우편 전송
                } else { //우편 전송 X
                    return [
                        LM("[시스템] 코인 감소"),
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        Udata["coin"] + "coin" + "(-" + Math.abs(c) + "coin)"
                    ].join('\n'); // 코인 감소 메시지 출력
                }
            }

        } catch (e) {

            User.close() //유저 데이터 수정 종료

            Log.e(msg.error(e.name, e.message, e.lineNumber)) //오류 로그 생성

        }
    }


    /**
     *
     * @param {String} s 사용자 이름
     * @param {String} e 지급/회수 사유
     * @param {String} n 닉네임
     * @param {Boolean} pm 지급/회수
     * @param {Boolean} p 우편 전송 여부
     * @param {String} an 관리자 이름
     * @returns
     */
    function Nickname(s, e, n, pm, p, an) {
        try {
            User.open() //유저 데이터 수정 시작
            let Udata = User.get(s)

            if (pm == true) { //호칭 지급

                (Udata["nickname"]).unshift(n); //유저 데이터에서 s의 nickname 리스트에 n 값 추가
                User.put(Udata["id"], Udata) //유저 데이터에 변경된 값 저장

                if (p == true) { //우편 전송 O
                    post(Udata["id"], [
                        "제목: 호칭 추가",
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        "지급 호칭: " + n
                    ].join('\n'), User.get(an)["name"]) //관리자의 이름으로 우편 전송
                } else {
                    return [
                        LM("[시스템] 호칭 지급"),
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        "지급 호칭: " + n
                    ].join('\n'); //호칭 지급 메시지 출력
                }

            } else { //호칭 회수

                (Udata["nickname"]).filter(item => item != n); //유저 데이터에서 s의 nickname 리스트에 n 값 제거
                User.put(Udata["id"], Udata) //유저 데이터에서 변경된 값 저장

                if (p == true) { //우편 전송 O
                    post(Udata["id"], [
                        "제목: 호칭 회수",
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        "회수 호칭: " + n
                    ].join('\n'), User.get(an)["name"]) //관리자의 이름으로 우편 전송
                } else {
                    return [
                        LM("[호칭 회수]"),
                        "사용자: " + "[" + "[" + Udata["nickname"][0] + "]" + Udata["name"] + "]",
                        "사유: " + e,
                        "회수 호칭: " + n
                    ].join('\n'); //호칭 회수 메시지 출력
                }

            }
        } catch (e) {
            User.close() //유저 데이터 수정 종료
            Log.e(msg.error(e.name, e.message, e.lineNumber))
        }
    }




    /**
     *
     * @param {String} s 사용자
     * @param {String} pm 상승/하락
     * @param {Number} per %
     * @returns
     */
    function Like(s, pm, per) {
        try {
            User.open(UserPath)
            let Udata = User.search(s)
            if (random(per)) {
                java.lang.Thread.sleep(500);
                if (pm = "up") {
                    if ((Udata["nickname"]).some(item => ["Light Stars", "Stars"].includes(item))) {
                        let r = randomI([
                            [2, 100],
                            [4, 50],
                            [6, 2]
                        ], Math.random().toFixed(2))
                        Udata["like"] += r;
                        User.put(Udata["id"], Udata)
                        return [
                            LM("호감도 상승"),
                            "♥ + " + r
                        ].join("\n");
                    } else {
                        let r = randomI([
                            [1, 100],
                            [2, 50],
                            [3, 2]
                        ], Math.random().toFixed(2))
                        Udata["like"] += r;
                        User.put(Udata["id"], Udata)
                        return [
                            LM("호감도 상승"),
                            "♥ + " + r
                        ].join("\n");
                    }
                } else if (pm = "down") {
                    let r = randomI([
                        [1, 100],
                        [2, 50],
                        [3, 2]
                    ], Math.random().toFixed(2))
                    Udata["like"] += r;
                    User.put(Udata["id"], Udata)
                    return [
                        LM("호감도 하락"),
                        "♥ - " + r
                    ].join("\n");
                }
            }
            User.close()
        } catch (e) {
            User.close()
            Log.e(msg.error(e.name, e.message, e.lineNumber))
        }
    }


    function getImageAsBase64(url) {
        let c = new java.net.URL(url).openConnection();
        let s = new java.io.ByteArrayOutputStream();
        let b = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
        for (let r, n = c.getInputStream();
            (r = n.read(b)) > 0;) {
            s.write(b, 0, r);
        }
        return android.util.Base64.encodeToString(s.toByteArray(), android.util.Base64.NO_WRAP);
    }

    function ogimg(title, description, image_url, onlyImage) {
        let APIKey = "24b8857b-cd44-4ffe-aa77-95580c993d9e";
        return org.jsoup.Jsoup.connect("https://api.molya.kr/v1/image/create")
            .header("Content-Type", "application/json")
            .header("x-api-key", APIKey)
            .requestBody(JSON.stringify({
                "image": getImageAsBase64(image_url),
                "title": title,
                "description": description,
                "onlyImage": onlyImage,
                "resize": true,
                "optOg": true
            }))
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .post()
            .text();
    }




    module.exports = {
        prefix: prefix,
        Lw: Lw,
        Line: Line,
        LM: LM,
        FS: FS,
        UP: UserPath,
        SP: SetPath,
        CP: ChatPath,
        AP: AttenPath,
        Kakaocord: Kakaocord,
        KV: KV,
        User: User,
        msg: msg,
        Pos: Pos,
        chat: chat,
        post: post,
        random: random,
        randomI: randomI,
        Coin: Coin,
        Nickname: Nickname,
        Like: Like,
        ogimg: ogimg,
        getImageAsBase64: getImageAsBase64
    }


})()

/*
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
*/