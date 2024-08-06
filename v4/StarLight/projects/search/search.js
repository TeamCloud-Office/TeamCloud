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


    /* ------ 날씨 ------ */
    if (event.message.startsWith(prefix + "날씨 ")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        let Weader = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + event.message.replace(prefix + "날씨 ", "") + " 날씨").get();
        if (Weader.select("#wob_dc") == undefined || Weader.select("#wob_dc") == "") return event.room.send([
            msg.noti,
            LM("[날씨]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "위치: " + event.message.replace(prefix + "날씨 ", ""),
            "해당 위치의 날씨를 찾을 수 없습니다."
        ].join("\n"))

        event.room.send([
            msg.noti,
            LM("[날씨]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "위치: " + event.message.replace(prefix + "날씨 ", ""),
            Weader.select("#wob_dc").text(), //요약
            "섭씨: " + Weader.select("#wob_tm").text() + "°C",
            "화씨: " + Weader.select("#wob_ttm").text() + "°F",
            "강수확률: " + Weader.select("#wob_pp").text(),
            "습도: " + Weader.select("#wob_hm").text(),
            "풍속: " + Weader.select("#wob_tws").text(),
            "",
            "기준 시간:" + Weader.select("#wob_dts").text().slice(5)
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }

    /* --------- 음악 --------- */
    if (event.message.startsWith(prefix + "음악 순위")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        event.room.send([
            msg.noti,
            LM("[음악 순위]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            Lw,
            music_chart(cut[3]),
            "",
            "Taken from the \"Melon\" chart"
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }


    if (event.message.startsWith(prefix + "음악 검색")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        let music = music_search(event.message.replace(prefix + "음악 검색 ", ""))

        event.room.send([
            msg.noti,
            LM("[음악 검색]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "[" + music["albumname"] + "]" + " " + music["artistname"] + " - " + music["songname"],
            "전체보기를 눌러 확인하세요.",
            Lw,
            "[음악 가사]",
            music_lyrics(music["songid"]),
            "",
            "Taken from the \"Melon\""
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }


    if (event.message.startsWith(prefix + "음악 추천")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        let data = org.jsoup.Jsoup.connect('https://www.melon.com/chart/').get();
        let chart = []
        for (let i = 0; i <= 10; i++) {
            chart.push(data.select('[class$="rank01"]').get(i).select('span').text())
        }
        let music = music_search(chart[Math.floor(Math.random() * chart.length)])

        event.room.send([
            msg.noti,
            LM("[음악 추천]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "[" + music["albumname"] + "]" + " " + music["artistname"] + " - " + music["songname"],
            "전체보기를 눌러 확인하세요.",
            Lw,
            "[음악 가사]",
            music_lyrics(music["songid"]),
            "",
            "Taken from the \"Melon\""
        ].join("\n"));
        event.room.send(Like(event.sender.name, true, 20))
    }


    /* --------- ai --------- */
    if (event.message.startsWith(prefix + "ai ")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        if ((Udata["nickname"]).some(item => ["Light Stars", "Stars"].includes(item)) == false) return event.room.send([
            msg.error_,
            "본 기능은 Stars 회원 전용 기능입니다.",
            "혹시 Stars 회원인데도 이 에러가 발생한다면, Stars 전용 메일로 연락바랍니다."
        ].join("\n"));
        if (Udata["stars"]["ai"] == 0) return event.room.send(msg.error_ + "AI 기능의 사용 횟수를 모두 소진하였습니다.")

        event.room.send([
            msg.noti,
            LM("[AI]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "잠시만 기다려주세요."
        ].join("\n"));
        event.room.send(ai("ge", event.message.replace(prefix + "ai ", "")));
        event.room.send(Like(event.sender.name, true, 40))
        Udata["stars"]["ai"]--
        User.put(Udata["id"], Udata)
    }

    /* ------ 코인 보유 랭킹 ------ */
    if (event.message.startsWith(prefix + "코인 순위")) {
        if (Boolean(Udata) == false) return event.room.send(msg.terms);
        if (Udata["ban"] == true) return event.room.send(msg.ban);

        event.room.send([
            msg.noti,
            LM("[코인 순위]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "잠시만 기다려주세요."
        ].join("\n"));

        function coin() {
            let userIds = User.id();
            let coins = [];

            for (let k = 0; k < userIds.length; k++) {
                let data = User.get(userIds[k]);
                coins.push({
                    name: "[" + data["nickname"][0] + "]" + data["name"],
                    coin: parseInt(data["coin"])
                });
            }

            coins.sort(function (a, b) {
                return b.coin - a.coin;
            });

            let top10 = coins.slice(0, 10);

            let result = top10.map(function (entry, index) {
                return (index + 1) + "위: " + entry.name + " - " + entry.coin + "coin";
            }).join("\n");

            return result;
        }

        event.room.send([
            msg.noti,
            LM("[코인 순위]"),
            "사용자: " + "[" + Udata["nickname"][0] + "]" + event.sender.name,
            Line(3),
            "전체보기를 눌러 확인하세요.",
            Lw,
            coin()
        ].join("\n"));
    }

}


/* ------ 음악 ------ */
function music_chart(num) {
    try {
        if (num > 100) return (msg.error_ + "순위는 100위까지만 가능합니다.");
        let data = org.jsoup.Jsoup.connect('https://www.melon.com/chart/').get();
        return data.select('[class$="year"]').text() + " " + data.select('[class$="hour"]').text() +
            "음악차트\n" +
            Lw +
            Array(Number(num)).fill().map((_a, i) => (i + 1) + '위 : ' +
                data.select('[class$="rank01"]')
                .get(i)
                .select('span')
                .text() +
                ' - ' +
                data.select('[class$="rank02"]')
                .get(i)
                .select('span')
                .text()
            ).join('\n');
    } catch (e) {
        return (msg.error(e.name, e.fileName, e.message, e.lineNumber));
    }
}

function music_search(song) {
    try {
        let data = JSON.parse(
            org.jsoup.Jsoup.connect("https://www.melon.com/search/keyword/index.json?j&query=" + song)
            .ignoreContentType(true)
            .execute().body()
        )["SONGCONTENTS"][0];
        return {
            "albumimg": data["ALBUMIMG"].replace("resize/40/quality/80/optimize", ""),
            "albumname": data["ALBUMNAME"],
            "artistname": data["ARTISTNAME"],
            "songname": data["SONGNAME"],
            "songid": data["SONGID"],
        }
    } catch (e) {
        return (msg.error(e.name, e.fileName, e.message, e.lineNumber));
    }
}

function music_lyrics(songId) {
    try {
        return org.jsoup.Jsoup.connect("https://www.melon.com/song/detail.htm?songId=" + songId)
            .ignoreContentType(true)
            .get()
            .select("div#d_video_summary")
            .html()
            .split("--> ")[1]
            .replace(/<br>/g, "\n");
    } catch (e) {
        return msg.error_ + "해당 노래에 대한 가사를 찾지 못했어요.";
    }
}


/* ------ ai ------ */
function ai(ai_, word) {
    try {
        if (ai_ == "ko") { //KoGPT
            let REST_API_KEY = "040494f435b6579b88465c01f300a91d";
            return JSON.parse(org.jsoup.Jsoup.connect("https://api.kakaobrain.com/v1/inference/kogpt/generation")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "KakaoAK" + REST_API_KEY) //api키 입력
                    .requestBody(JSON.stringify({
                        "prompt": word,
                        "max_tokens": 60,
                        "temperature": 0.5,
                        "top_p": 0.5,
                        "n": 1
                    }))
                    .ignoreHttpErrors(true)
                    .ignoreContentType(true)
                    .post().text())
                .generations[0].text
        }
        if (ai_ == "ge") {
            let key = "AIzaSyC67uhwAN9UqC9fxtAITrcohhZk5xB0tA8"
            return JSON.parse(org.jsoup.Jsoup.connect("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key)
                    .header("Content-Type", "application/json")
                    .requestBody(JSON.stringify({
                        "contents": [{
                                "role": "user",
                                "parts": [{
                                    "text": "앞으로 당신의 성격은 다음과 같습니다.\n" +
                                        "1. 이름 : Eric\n" +
                                        "2. 성격 : 대답을 존댓말로 합니다..\n" +
                                        "3. 특이사항 : 당신은 집사로, 주인의 생활을 더욱 편리하게 하는 역할을 가지고 있습니다."
                                }]
                            },
                            {
                                "role": "model",
                                "parts": [{
                                    "text": "네 알겠습니다"
                                }]
                            },
                            {
                                "role": "user",
                                "parts": [{
                                    "text": word
                                }]
                            }
                        ]
                    }))
                    .method(org.jsoup.Connection.Method.POST)
                    .ignoreContentType(true)
                    .ignoreHttpErrors(true)
                    .timeout(20000)
                    .post().text())
                .candidates[0].content.parts[0].text
        }
    } catch (e) {
        return (msg.error(e.name, e.fileName, e.message, e.lineNumber))
    }
}