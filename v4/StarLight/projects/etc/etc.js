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

let json = JSON.parse(FS.read(SP))
let mentions = json['mentions'];
let nicknames = [];
let block_room = ["카봇커", "카알메", "데브로봇스", "TeamCloud 개발방", "미성년자 금융방"];


let path = 'sdcard/StarLight/BotData/chat_rank.json'
if (!FS.read(path)) FS.write(path, '{}'); //해당 경로에 파일이 없다면 파일 생성
let json_rank = JSON.parse(FS.read(path)); //파일을 JSON 형태로 json변수에 담음

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

    let cut = event.message.split(" ");

    /* ------ 멘션 ------ */
    if (!nicknames.includes(event.sender.name))
        nicknames.push(event.sender.name);

    if (block_room.includes(event.room.name)) return;

    let time = (t) => {
        let seconds = Math.floor(t % 60);
        let minutes = Math.floor((t % 3600) / 60);
        let hours = Math.floor((t % (3600 * 24)) / 3600);
        let day = Math.floor(t / (3600 * 24));

        return day + "일 " + hours + "시간 " + minutes + "분 " + seconds + "초"
    };

    if ((Object.keys(mentions).includes(event.sender.name))) {
        let items = mentions[event.sender.name];
        let contents = [];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item["room"] == event.room.name) {
                contents.push('[채팅방: ' + item.room + '] ' + item.sender + '의 메시지 | ' + time(Math.floor(Date.now() / 1000) - item.time) + ' 전' +
                    "\n" +
                    '→ ' + item.content);
            }
        }
        event.room.send([
            msg.noti,
            LM("멘션"),
            event.sender.name + '님, ' + contents.length + '개의 알림이 있습니다.',
            Lw,
            contents.join('\n' + Line(3) + '\n')
        ].join('\n'));

        delete mentions[event.sender.name];
        FS.write(SP, JSON.stringify(json, null, 4));
    }

    if ((/@.+/.test(event.message))) {
        if (Boolean(Udata) == false) return;
        let users = nicknames.filter(e => event.message.includes('@' + e + ' '));
        if (users.length === 0) return;

        let mention = {
            sender: event.sender.name,
            room: event.room.name,
            time: Math.floor(Date.now() / 1000),
            content: event.message
        };

        users.forEach(e => {
            if (e in mentions) {
                mentions[e].push(mention);
            } else {
                mentions[e] = [mention];
            }
        });

        event.room.send([
            msg.noti,
            LM("멘션"),
            event.sender.name + '님이 ' + users.join(', ') + '님을 멘션하였습니다.',
            '→ ' + users.join(', ') + '님이 오면 전달하겠습니다.'
        ].join('\n'));
        FS.write(SP, JSON.stringify(json, null, 4));
    }


    /* ------ 코인 송금 ------ */
    if (event.message.startsWith(prefix + "코인 송금")) {
        let Me = User.get(event.sender.name)
        if (Boolean(Me) == false) return event.room.send(msg.noti + msg.terms);
        if (Me["ban"] == true) return event.room.send(msg.ban);

        let user = event.message.split(" ")[3]
        let coin = Number(event.message.split(" ")[4])

        if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(user) && (user.length != 5) && /[A-Z]/.test(user)) return event.room.send([
            msg.error_,
            "사용자ID를 사용하여 송금하세요."
        ].join("\n"))
        let You = User.get(user)
        if (Boolean(You) == false) return event.room.send([
            msg.error_,
            "해당 사용자를 찾을 수 없습니다.",
            "사용자: " + user
        ].join("\n"));

        if (Me["id"] == You["id"]) return event.room.send([
            msg.error_,
            "해당 사용자에게 송금을 할 수 없습니다.",
            "사용자: " + user,
            "사유: " + "본인에게 송금함"
        ].join("\n"))
        if (You["ban"] == true) return event.room.send([
            msg.error_,
            "해당 사용자에게 송금을 할 수 없습니다.",
            "사용자: " + user,
            "사유: " + "사용 제한된 사용자에게 송금함"
        ].join("\n"))

        Coin(You["id"], "송금", coin, true, Me["id"])
        Coin(Me["id"], "송금", -(coin), false, "")

        event.room.send([
            msg.noti,
            LM("코인 송금"),
            "사용자: " + "[" + Me["nickname"][0] + "]" + Me["name"],
            Line(3),
            "받는 사람: " + "[" + You["nickname"][0] + "]" + You["name"],
            "송금한 코인: " + coin + "coin",
            Line(1),
            "잔액: " + Me["coin"] + "coin"
        ].join("\n"))
    }


    /* ------ 채팅 순위 ------ */
    if (!Object.keys(Udata).includes("chat")) {
        Udata["chat"] = 0
        User.put(Udata["id"], Udata)
    }

    if (Boolean(Udata)) {
        if (Udata["ban"]) return;
        if (json_rank[event.room.name] == undefined) json_rank[event.room.name] = {}
        if (json_rank[event.room.name][event.sender.name] == undefined) json_rank[event.room.name][event.sender.name] = 0
        json_rank[event.room.name][event.sender.name]++
        Udata["chat"] = json_rank[event.room.name][event.sender.name]

        FS.write(path, JSON.stringify(json_rank, null, 4));
        User.put(Udata["id"], Udata);
    }

    if (Udata["chat"] >= 5000) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        event.room.send(Nickname(Udata["id"], "채팅 횟수 다(多)사용", "수다쟁이", true, true, "System"))
    }
    if (Udata["chat"] >= 10000) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        event.room.send(Nickname(Udata["id"], "채팅 횟수 다(多)사용", "투머치토커", true, true, "System"))
    }
    if (Udata["chat"] >= 50000) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);
        event.room.send(Nickname(Udata["id"], "채팅 횟수 다(多)사용", "백수", true, true, "System"))
    }

    if (event.message == prefix + "채팅순위") {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        let rank = () => {
            let list = [];
            for (i in json_rank[event.room.name]) list.push(i + ' - 채팅횟수: ' + json[event.room.name][i] + '회')
            return list.sort((a, b) => b.split(' - 채팅횟수: ')[1].split('회')[0] - a.split(' - 채팅횟수: ')[1].split('회')[0])
                .map(e => (list.indexOf(e) + 1) + '위ㅣ' + "[" + Udata["nickname"][0] + "]" + e).join('\n')
        }

        event.room.send([
            msg.noti,
            LM("[채팅순위]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "전체보기를 눌러 확인하세요.",
            Lw,
            rank()
        ].join("\n"));
        return;
    }



    /* ------ 상점 ------ */
    let store = {
        //카테고리: {이름: [설명, 가격, 화폐(팀클코인:1/호감도:2)]}
        "nickname": {
            "사용자": ["기본 호칭입니다.", 0, 1],
            "부자": ["돈이 많으신가요?", 100000, 1],
            "아름다운": ["당신은 아름다워요", 3000, 1],
            "친구": ["에릭이랑 친구해요", 100, 2]
        }
        /*"ticket": {
            "ai 이용권": ["ai를 이용하세요.", 10000, 1],
            "가르치기권": ["에릭이에게 가르쳐주세요", 5000, 1]
        }*/
    }

    if (event.message.startsWith(prefix + "상점")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        function store_(category) {
            let list = []
            for (let i = 0; i < Object.keys(store[category]).length; i++) {
                if (store[category][Object.keys(store[category])[i]][2] == 1) {
                    list.push([
                        "이름: " + Object.keys(store[category])[i],
                        "설명: " + store[category][Object.keys(store[category])[i]][0],
                        "가격: " + store[category][Object.keys(store[category])[i]][1] + "팀클코인"
                    ].join("\n"))
                } else if (store[category][Object.keys(store[category])[i]][2] == 2) {
                    list.push([
                        "이름: " + Object.keys(store[category])[i],
                        "설명: " + store[category][Object.keys(store[category])[i]][0],
                        "가격: " + store[category][Object.keys(store[category])[i]][1] + "호감도"
                    ].join("\n"))
                }
            }
            return list.join("\n" + Line(3) + "\n")
        }

        if (cut[2] == undefined) {
            event.room.send([
                msg.noti,
                LM("[상점(베타)]"),
                "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                Line(3),
                "전체보기를 눌러 확인하세요.",
                Lw,
                "",
                LM("<칭호>"),
                store_("nickname"),
                //LM("<교환권>"),
                //store_("ticket")
            ].join("\n"))
        }

        if (cut[2] == "구매") {
            let category = ""
            switch (cut[3]) {
                case "칭호":
                    category = "nickname"
                    break
                case "교환권":
                    category = "ticket"
                    break
                default:
                    category = "null"
                    break
            }
            if (category == "null") return event.room.send([
                msg.error_,
                "해당 카테고리가 존재하지 않습니다."
            ].join("\n"))

            if (Object.keys(store[category]).includes(cut[4])) {
                if (category == "nickname") {
                    if (Udata["nickname"].includes(cut[4])) return event.room.send([
                        msg.error_,
                        "해당 상품을 이미 구매하셨습니다."
                    ].join("\n"))
                    event.room.send([
                        msg.noti,
                        LM("[상점(베타)]"),
                        "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
                        Line(3),
                        "[" + cut[3] + "]" + cut[4] + Pos(cut[4], "을", "를") + " 구매하셨습니다."
                    ].join("\n"))
                    if (store[category][cut[4]][2] == 1) event.room.send(Coin(Udata["id"], "[" + cut[3] + "]" + cut[4] + " 구매", -(store[category][cut[4]][1]), false, "System"))
                    event.room.send(Nickname(Udata["id"], cut[4] + " 구매", cut[4], true, false, "System"))
                }
            } else {
                event.room.send([
                    msg.error_,
                    "해당 상품이 존재하지 않습니다."
                ].join("\n"))
            }
        }
    }
}