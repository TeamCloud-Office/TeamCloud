/*
 * Google Gemini AI token : AIzaSyC67uhwAN9UqC9fxtAITrcohhZk5xB0tA8
 */

(function () {

    let prefix = '아리아 ';

    let Lw = '\u200b'.repeat(500),
        Line = (num) => "━━━━".repeat(num),
        LM = (str) => "======".repeat(1) + str + "======".repeat(1);

    let FS = FileStream;

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


    let UserPath = "/sdcard/StarLight/BotData/admin/UseData.json",
        SetPath = "/sdcard/StarLight/BotData/Set.json",
        ChatPath = '/sdcard/StarLight/BotData/Chat/' + getDate.year + 'y/' + (getDate.month) + 'm/' + getDate.day + 'd' + '.json',
        AttenPath = '/sdcard/BotData/check-in_list.json';

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


    let {
        LocalStorage
    } = require('LocalStorage');

    let LS = new LocalStorage(UserPath, false);

    function findUser(k, d) {
        try {
            if (d === true) // ID로 검색
                return LS.getItem(k);

            // 유저명대로 검색
            let storageData = LS.getData();
            let nUser;
            for (let key in storageData) {
                nUser = storageData[key];
                if (nUser && nUser.name === k)
                    return nUser;
            }
            return null;
        } catch (e) {
            Log.i(e);
        }
    }

    let User = {
        set: (k, v) => LS.setItem(k, v),
        edit: (k, d) => findUser(k, d),
        read: (k, d) => {
            let result = findUser(k, d);
            return result !== null && result !== void 0;
        },
        save: () => LS.save(),
        delete: (k) => {
            LS.removeItem(k);
            LS.save();
        },
        search: (k) => {
            let target = {};
            let storageData = LS.getData();
            for (let key in storageData) {
                if (storageData[key].id === k) {
                    target[key] = storageData[key];
                }
            }
            return JSON.stringify(target);
        },
        addID: () => {
            let id = '';
            let list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            do {
                id = '';
                for (let i = 0; i < 5; i++) {
                    id += list[Math.floor(Math.random() * list.length)];
                }
            } while (LS.hasItem(id));
            return id;
        }
    };

    let msg = {

        noti: [
            '[ Eric Ver : ' + 'Alpha-v4.0.18' + ']',
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

        error: [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> 아래 오류 내용을 TeamCloud 문의 메일로 전송해주세요.",
            "help@team-cloud.kro.kr",
            "",
            "",
            "",
            //오류 내용
        ].join('\n'),

        error_: [
            LM("[Error]"),
            "해당 명령어를 실행할 수 없습니다.",
            "> "
        ].join("\n")

    };


    function Pos(str, t, f) {
        return (str) + (str.slice(-1).normalize("NFKD")[2] != undefined) ? t : f;
    } //Pos("누구", "이가", "가")

    let chat = {
        save: (room, sender, msg) => {
            JSON.parse(FS.read(ChatPath))[room][sender][getDate.time(":")] = msg;
            FS.write(ChatPath, JSON.stringify(chat_log, null, 4));
        }
    }

    function random(per) {
        if (Math.random() * 100 < per) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 
     * @param {String} s 받을 사용자
     * @param {String} m 메시지
     * @param {String} an 관리자 이름
     * @returns 
     */
    function post(s, m, an) {
        let data = JSON.parse(FS.read(SetPath));
        let snd = data['snd'];

        let stc = {
            sender: s,
            time: getDate.today("/"),
            content: m,
            admin: an
        };

        if (s in snd) {
            snd[s].push(stc);
        } else {
            snd[s] = [stc];
        }
        return FS.write(SetPath, JSON.stringify(data, null, 4))
    }

    /**
     * 
     * @param {String} s 사용자
     * @param {String} e 증감/감소 사유
     * @param {Number} c 코인 개수
     * @returns 
     */
    function Coin(s, e, c) {
        let _coin = User.edit(s).coin
        c = Number(c);
        if (c > 0) { //증감
            let coin = User.edit(s).coin += c;
            User.edit(s).coin = coin;
            User.save();
            return [
                LM("[코인 증감]"),
                "사용자: " + "[" + "[" + User.edit(s).nickname[0] + "]" + s + "]",
                "사유: " + e,
                "증감 코인: " + c + "coin",
                _coin + "coin" + " → " + User.edit(s).coin + "coin"
            ].join("\n")
        } else if (c < 0) { //감소
            let coin = User.edit(s).coin += c;
            User.edit(s).coin = coin;
            User.save();
            return [
                LM("[코인 감소]"),
                "사용자: " + "[" + "[" + User.edit(s).nickname[0] + "]" + s + "]",
                "사유: " + e,
                "감소 코인: " + c + "coin",
                _coin + "coin" + " → " + User.edit(s).coin + "coin"
            ].join('\n');
        }
    }


    /**
     * 
     * @param {String} s 사용자
     * @param {String} e 지급 사유
     * @param {String} n 닉네임
     * @returns 
     */
    function Nickname(s, e, n) {
        let _nickname = User.edit(s).nickname;
        (User.edit(s).nickname).unshift(n);
        User.save();
        return [
            LM("[호칭 지급]"),
            "사용자: " + "[" + "[" + _nickname + "]" + s + "]",
            "사유: " + e,
            "지급 호칭: " + n,
            _nickname + " → " + User.edit(s).nickname
        ].join('\n'); //닉네임 지급
    }


    /**
     * 
     * @param {String} s 사용자
     * @param {String} e 사유
     * @param {Boolean} tf 코인t/닉네임f
     * @param {String} cn 코인/닉네임
     * @param {String} a 관리자 이름
     * @returns 
     */
    function Admin(s, e, tf, cn, a) {
        if (tf == true) {
            let _coin = User.edit(s, true).coin
            cn = Number(cn);
            if (cn > 0) { //증감
                let coin = User.edit(s, true).coin += cn;
                User.edit(s, true).coin = coin;
                User.save();
                post(s, [
                    LM("[코인 증감]"),
                    "사유: " + e,
                    "증감 코인: " + cn + "coin",
                    _coin + "coin" + " → " + User.edit(s, true).coin + "coin",
                    ""
                ].join("\n"), a);
                return (s + '님의 코인이 ' + cn + ' 증감하였습니다.');
            } else if (cn < 0) {
                let coin = User.edit(s, true).coin += cn;
                User.edit(s, true).coin = coin;
                User.save();
                post(s, [
                    LM("[코인 감소]"),
                    "사유: " + e,
                    "감소 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s, true).coin + "coin",
                    "",
                ].join("\n"), a);
                return (s + '님의 코인이 ' + cn + ' 감소하였습니다.');
            }
        } else if (tf == false) {
            let _nickname = User.edit(s, true).nickname;
            cn = String(cn);
            if (cn == 1) {
                (User.edit(s, true).nickname).unshift(n);
                User.save();
                post(s, [
                    LM("[호칭 지급]"),
                    "사유: " + e,
                    "지급 호칭: " + n,
                    _nickname + " → " + User.edit(s, true).nickname,
                    ""
                ].join("\n"), a);
                return (s + '님께 [' + n + ']호칭이 지급되었습니다.');
            }
        }
    }




    /**
     * 
     * @param {String} s 사용자
     * @param {String} ud 상승/하락
     * @param {String} l 호감도
     * @returns 
     */
    function Like(s, ud, l) {
        if (ud = "up") {
            User.edit(s, false).like += l;
            User.save();
            return ([
                LM("호감도 상승"),
                "♥ + " + l
            ].join("\n"));
        } else if (ud = "down") {
            User.edit(s, false).like -= l;
            User.save();
            return ([
                LM("호감도 하락"),
                "♥ - " + l
            ].join("\n"));
        }
    }


    function ogimg(title, des, img) {
        try {
            let response = org.jsoup.Jsoup.connect("https://api.molya.kr/v1/image/create")
                .header('x-api-key', '82d1547b-d50a-436c-83f6-0795e8f79303')
                .method(org.jsoup.Connection.Method.POST)
                .data({
                    "type": "url",
                    "image": img,
                    "title": title,
                    "description": des
                })
                .ignoreHttpErrors(true)
                .ignoreContentType(true)
                .timeout(1000 * 60 * 5)
                .execute();

            let data = JSON.parse(response.body()).data.viewUrl.split('"');
            return data;
            //return JSON.stringify(JSON.parse(response.body()).data.viewUrl.split('"'), null, 4);
        } catch (e) {
            Log.d(JSON.stringify(e))
        }
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
        getDate: getDate,
        Kakaocord: Kakaocord,
        User: User,
        LS: LS,
        msg: msg,
        Pos: Pos,
        chat: chat,
        post: post,
        random: random,
        Coin: Coin,
        Nickname: Nickname,
        Admin: Admin,
        Like: Like,
        ogimg: ogimg
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
    getDate,
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
    Like,
    ogimg
} = require("A");
*/