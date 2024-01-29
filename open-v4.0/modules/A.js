/*
let {
    prefix, Lw, FS, state, snd, getDate, c_path,
    Kakaocord,
    msg,
    Pos, chat_log, random,
    User, Coin, Nickname,
    ogimg 
} = require("A");
*/

(function () {

    let prefix = '파이야 ';

    let Lw = '\u200b'.repeat(500),
        Line = (num) => "========".repeat(num),
        LM = (str) => Line(1) + str + Line(1);

    let FS = FileStream;

    let state = "";

    let snd = {};

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

    let {
        LocalStorage
    } = require('LocalStorage');

    let UP = "/sdcard/StarLight/BotData/admin/UseData.json";

    let LS = new LocalStorage(UP, false);

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
            Log.i(e)
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
            '[ Eric Ver : ' + 'Open v4.0.11' + ']',
            //'TeamCloud Eric 4.0 정식 출시!!',
            //"지금바로 사용해보세요!",
            "",
            "",
            //봇 답변
        ].join('\n'),
        //공지

        terms: [
            "해당 명령어를 실행할 수 없습니다.",
            "> 약관 미동의",
            "TeamCloud의 서비스를 사용하시려면 약관에 대해 동의해주세요.",
            "약관에 동의하시려면 [에릭아 약관]을 입력해주세요."
        ].join('\n'), //약관

        admin: [
            "해당 명령어를 실행할 수 없습니다.",
            "> 관리자 명령어입니다."
        ].join('\n'),

        ban: [
            "해당 명령어를 실행할 수 없습니다.",
            "> 사용제한된 사용자입니다."
        ].join("\n"),

        error: [
            "해당 명령어를 실행할 수 없습니다.",
            "> 아래 오류 내용을 TeamCloud 문의 메일로 전송해주세요.",
            "help@team-cloud.kro.kr",
            "",
            "",
            //오류 내용
        ].join('\n'),
        
        error_: [
            "해당 명령어를 실행할 수 없습니다.",
            "> "
        ].join("\n")

    };


    function Pos(str, t, f) {
        return (str) + (str.slice(-1).normalize("NFKD")[2] != undefined) ? t : f;
    } //Pos("누구", "이가", "가")

    let c_path = 'sdcard/StarLight/BotData/log/' + getDate.year + 'y/' + (getDate.month) + 'm/' + getDate.day + 'd' + '.json';

    let chat = {
        save: (room, sender, msg) => {
            JSON.parse(FS.read(c_path))[room][sender][getDate.time(":")] = msg;
            FS.write(c_path, JSON.stringify(chat_log, null, 4));
        }
    }

    function random(num) {
        return Math.floor(Math.random() * num) + 1;
    }

    function post(s, m) {
        snd[s].push(m)
    }

    /**
     * 
     * @param {String} s 사용자
     * @param {String} e 증감/감소 사유
     * @param {Number} c 코인 개수
     * @param {Boolean} tf 쪽지 전송 여부
     * @returns 
     */
    function Coin(s, e, c, tf) {
        let _coin = User.edit(s).coin
        c = Number(c);
        if (!snd[s]) snd[s] = [];
        if (c > 0) { //증감
            let coin = User.edit(s).coin += c;
            User.edit(s).coin = coin;
            User.save();
            if (tf == true) {
                post(s, [
                    '메시지: ',
                    LM("[코인 증감]"),
                    "사용자: " + "[" + "[" + User.edit(s).nickname[0] + "]" + s + "]",
                    "사유: " + e,
                    "증감 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s).coin + "coin",
                    "",
                    "",
                    '관리자 이름: ' + "TeamCloud"
                ].join("\n"));
                return (s + '님의 코인이 ' + c + ' 증감하였습니다.');
            } else if (tf == false) {
                return [
                    LM("[코인 증감]"),
                    "사용자: " + "[" + "[" + User.edit(s).nickname[0] + "]" + s + "]",
                    "사유: " + e,
                    "증감 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s).coin + "coin"
                ].join("\n")
            }

        }
        if (c < 0) { //감소
            let coin = User.edit(s).coin += c;
            User.edit(s).coin = coin;
            User.save();
            if (tf == true) {
                post(s, [
                    '메시지: ',
                    LM("[코인 감소]"),
                    "사용자: " + "[" + "[" + User.edit(s).nickname[0] + "]" + s + "]",
                    "사유: " + e,
                    "감소 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s).coin + "coin",
                    "",
                    "",
                    '관리자 이름: ' + "TeamCloud"
                ].join("\n"));
                return (s + '님의 코인이 ' + c + ' 감소하였습니다.');
            } else if (tf == false) {
                return [
                    LM("[코인 감소]"),
                    "사용자: " + "[" + "[" + User.edit(s).nickname[0] + "]" + s + "]",
                    "사유: " + e,
                    "감소 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s).coin + "coin"
                ].join('\n');
            }
        }
    }


    /**
     * 
     * @param {String} s 사용자
     * @param {String} e 증감/감소 사유
     * @param {String} n 닉네임
     * @param {Boolean} tf 쪽지 전송 여부
     * @returns 
     */
    function Nickname(s, e, n, tf) {
        let _nickname = User.edit(s).nickname;
        if (!snd[s]) snd[s] = [];
        (User.edit(s).nickname).unshift(n);
        User.save();
        if (tf == true) {
            post(s, [
                '메시지: ',
                LM("[호칭 지급]"),
                "사용자: " + "[" + "[" + User.edit(s).nickname + "]" + s + "]",
                "사유: " + e,
                "지급 호칭: " + c + "coin",
                _nickname + " → " + User.edit(s).nickname + "coin",
                "",
                "",
                '관리자 이름: ' + "TeamCloud"
            ].join("\n"));
            return (s + '님께 [' + n + ']닉네임이 지급됐습니다.');
        } else if (tf == false) {
            return [
                LM("[호칭 지급]"),
                "사용자: " + "[" + "[" + _nickname + "]" + s + "]",
                "사유: " + e,
                "지급 호칭: " + c + "coin",
                _nickname + " → " + User.edit(s).nickname + "coin"
            ].join('\n'); //닉네임 지급
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
            Log.d('{Name: ' + e.name + ', Message: ' + e.message + ', Line: ' + e.lineNumber + '}')
        }
    }

    module.exports = {
        prefix: prefix,
        Lw: Lw,
        Line: Line,
        LM: LM,
        FS: FS,
        state: state,
        snd: snd,
        getDate: getDate,
        Kakaocord: Kakaocord,
        User: User,
        LS: LS,
        msg: msg,
        c_path: c_path,
        Pos: Pos,
        chat: chat,
        random: random,
        Coin: Coin,
        Nickname: Nickname,
        ogimg: ogimg
    }


})()