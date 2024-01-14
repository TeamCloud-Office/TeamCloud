//let A = Bridge.getScopeOf("A"); 

(function () {

    let prefix = '에릭아 ';

    let Lw = '\u200b'.repeat(500);

    let FS = FileStream;

    let cut = event.message.split(" ");

    let state = "";

    let snd = {};

    let getDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        day: new Date().getDay()
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

    let UP = "/sdcard/BotData/admin/UseData.json";

    let LS = new LocalStorage(UP, false);

    let User = {
        set: (k, v) => LS.setItem(k, v),
        edit: (k, d) => LS.getItem(k, d),
        read: (k) => {
            let target = [];
            UP = JSON.parse(FS.read(UP));
            for (let key in UP) {
                if (UP[key].name == k) {
                    target.push(UP[key]);
                }
            }
            return Object.keys(target);
        },
        save: () => LS.save(),
        delete: (k) => LS.removeItem(k),
        search: (k) => {
            let target = [];
            for (let key in UP) {
                if (UP[key].code == k) {
                    target.push(UP[key]);
                }
            }
            return JSON.stringify(target);
        }
    };

    let msg = {

        noti: [
            '[ Eric Ver : ' + 'Open v4.0' + ']',
            'TeamCloud Eric 정식 출시!!',
            "",
        ].join('\n'),
        //공지

        terms: [
            "에릭의 대부분의 기능은 TeamCloud 봇 이용약관을 동의해야 사용할 수 있습니다.",
            "[에릭아 약관]을 입력해 약관에 동의해주세요."
        ].join('\n'), //약관

        admin: [
            "해당 명령어를 실행할 수 없습니다.",
            "> 관리자 명령어입니다."
        ],

        error: [
            "해당 명령어를 실행할 수 없습니다.",
            "> 아래 오류 내용을 TeamCloud 문의 메일로 전송해주세요.",
            "help@team-cloud.kro.kr",
            "",
        ]

    };


    function Pos(str, t, f) {
        return (str) + (str.slice(-1).normalize("NFKD")[2] != undefined) ? t : f;
    } //Pos("누구", "이가", "가")

    let c_path = 'sdcard/BotData/log/' + getDate.year + 'y/' + (getDate.month + 1) + 'm/' + getDate.day + 'd' + '.json';

    function chat_log() {
        return JSON.parse(FS.read(c_path));
    }

    function random(num) {
        return Math.floor(Math.random() * num) + 1;
    }

    function post(s, m) {
        return snd[s].push(m)
    }


    function Coin(s, e, c, tf) {
        let _coin = User.edit(s, false).coin
        c = Number(c);
        if (!snd[s]) snd[s] = [];
        if (c > 0) { //증감
            let coin = User.edit(s, false).coin += c;
            User.edit(s, false).coin = coin;
            User.save();
            if (tf == true) {
                post(s, [
                    '메시지: ',
                    "[코인 증감]",
                    "사용자: " + "[" + "[" + User.edit(s, false).nickname + "]" + s + "]",
                    "사유: " + e,
                    "증감 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s, false).coin + "coin",
                    "",
                    "",
                    '관리자 이름: ' + "TeamCloud"
                ].join("\n"));
                return (s + '님의 코인이 증감하였습니다.');
            } else if (tf == false) {
                return [
                    "[코인 증감]",
                    "사용자: " + "[" + "[" + User.edit(s, false).nickname + "]" + s + "]",
                    "사유: " + e,
                    "증감 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s, false).coin + "coin"
                ].join("\n")
            }

        }
        if (c < 0) { //감소
            let coin = User.edit(s, false).coin += c;
            User.edit(s, false).coin = coin;
            User.save();
            if (tf == true) {
                post(s, [
                    '메시지: ',
                    "[코인 감소]",
                    "사용자: " + "[" + "[" + User.edit(s, false).nickname + "]" + s + "]",
                    "사유: " + e,
                    "감소 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s, false).coin + "coin",
                    "",
                    "",
                    '관리자 이름: ' + "TeamCloud"
                ].join("\n"));
                return (s + '님의 코인이 감소하였습니다.');
            } else if (tf == false) {
                return [
                    "[코인 감소]",
                    "사용자: " + "[" + "[" + User.edit(s, false).nickname + "]" + s + "]",
                    "사유: " + e,
                    "감소 코인: " + c + "coin",
                    _coin + "coin" + " → " + User.edit(s, false).coin + "coin"
                ].join('\n');
            }
        }
    }

    function Nickname(s, e, n, tf) {
        let _nickname = User.edit(s, false).nickname;
        if (!snd[s]) snd[s] = [];
        (User.edit(s, false).nickname).push(n);
        User.save();
        if (tf == true) {
            post(s, ['메시지: ',
                "[호칭 지급]",
                "사용자: " + "[" + "[" + User.edit(s, false).nickname + "]" + s + "]",
                "사유: " + e,
                "지급 호칭: " + c + "coin",
                _nickname + " → " + User.edit(s, false).nickname + "coin",
                "",
                "",
                '관리자 이름: ' + "TeamCloud"
            ].join("\n"));
            return (s + '님께 [' + n + ']닉네임이 지급됐습니다.');
        } else if (tf == false) {
            return [
                "[호칭 지급]",
                "사용자: " + "[" + "[" + _nickname + "]" + s + "]",
                "사유: " + e,
                "지급 호칭: " + c + "coin",
                _nickname + " → " + User.edit(s, false).nickname + "coin"
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
        fs: fs,
        cut: cut,
        state: state,
        snd: snd,
        getDate: getDate,
        Kakaocord: Kakaocord,
        User: User,
        msg: msg,
        c_path: c_path,
        Pos: Pos,
        chat_log: chat_log,
        random: random,
        Coin: Coin,
        Nickname: Nickname,
        ogimg: ogimg
    }

})()