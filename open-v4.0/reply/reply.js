let {
  prefix,
  Lw,
  Line,
  LM,
  FS,
  getDate,
  User,
  msg,
  Pos,
  chat,
  random,
  Coin,
  Nickname,
  ogimg
} = require("A");


function onMessage(event) {
  let cut = event.message.split(" ");

  if (event.message.startsWith(prefix + "도움말")) {
    event.room.send(msg.noti + 'https://www.team-cloud.kro.kr/blog/manual');
  }

  let time = "";
  if (5 <= getDate.hour < 11) {
    time = "아침"
  } else if (12 <= getDate.hour < 15) {
    time = "점심"
  } else if (16 <= getDate.hour < 20) {
    time = "저녁"
  } else {
    time = "밤"
  }
  if (event.message == (prefix.slice(0, -1))) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    let list = {
      hello: [
        "부르셨습니까, " + event.sender.name + "님.",
        "네, " + event.sender.name + "님.",
        "반갑습니다.",
        "무슨 일입니까?",
        "부르셨습니까?",
        "좋은 " + time + "입니다."
      ]
    };
    event.room.send(list["hello"][Math.floor(random(list["hello"].length))]);
  }

  if (event.message == prefix + "지금 몇시야?") {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    event.room.send("지금은 " + getDate.today("/") + " " + getDate.time(":") + "입니다.");
  }


  if (event.message.startsWith(prefix + "가위바위보 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    switch (cut[2]) {
      case '바위':
        array = ["가위\n" + event.sender.name + "님이 이기셨습니다.", "바위\n" + event.sender.name + "님과 비겼습니다.", "보\n제가 이겼습니다."];
        event.room.send([
          msg.noti,
          LM("[가위바위보]"),
          "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
          Line(3),
          array[random(3)]
        ].join("\n"));
        break;
      case '가위':
        array = ["보\n" + event.sender.name + "님이 이기셨습니다.", "가위\n" + event.sender.name + "님과 비겼습니다.", "바위\n제가 이겼습니다."];
        event.room.send([
          msg.noti,
          LM("[가위바위보]"),
          "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
          Line(3),
          array[random(3)]
        ].join("\n"));
        break;
      case '보':
        array = ["바위\n" + event.sender.name + "님이 이기셨습니다.", "보\n" + event.sender.name + "님과 비겼습니다.", "가위\n제가 이겼습니다."];
        event.room.send([
          msg.noti,
          LM("[가위바위보]"),
          "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
          Line(3),
          array[random(3)]
        ].join("\n"));
        break;
    }
  }

  if (event.message.startsWith(prefix + "디데이")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    let today = new Date(new Date().getYear(), new Date().getMonth() + 1, new Date().getDate());
    let day = new Date(new Date().getYear(), cut[2].split('/')[0], cut[2].split('/')[1]);
    let calculate = (today - day) / (1000 * 3600 * 24) * -1;
    if (calculate < 0) calculate = 365 - calculate * -1;
    if (calculate == 0) calculate = "Day";
    event.room.send([
      msg.noti,
      LM("[디데이]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
      Line(3),
      'D-' + calculate
    ].join("\n"));
  }

  if (event.message.startsWith(prefix + "날씨 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    let Weader = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + event.message.replace(prefix + "날씨 ", "") + " 날씨").get();
    event.room.send([
      msg.noti,
      LM("[날씨]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
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
  }

  if (event.message.startsWith(prefix) && event.message.endsWith("확률은?")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    let split = event.message.replace(prefix, "").replace("확률은?", "");
    event.room.send([
      msg.noti,
      LM("[확률]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
      Line(3),
      "► " + split + " 확률: " + (Math.random() * 100).toFixed(3) + "%"
    ].join("\n"));
  }

  if (event.message.startsWith(prefix + "주사위")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    event.room.send([
      msg.noti,
      LM("[주사위]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
      Line(3),
      "► " + random(6)
    ].join("\n"));
  }


  if (event.message.startsWith(prefix + "홀짝 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    switch (cut[2]) {
      case '짝':
        if (random(10) % 2 == 0) {
          event.room.send([
            msg.noti,
            LM("[홀짝]"),
            "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
            Line(3),
            "정답입니다.",
            "정답는 [" + random(10) + "] 입니다."
          ].join("\n"));
        } else if (random(10) % 2 != 0) {
          event.room.send([
            msg.noti,
            LM("[홀짝]"),
            "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
            Line(3),
            "오답입니다.",
            "정답은 [" + random(10) + "] 입니다."
          ].join("\n"));
        }
        break;
      case '홀':
        if (random(10) % 2 != 0) {
          event.room.send([
            msg.noti,
            LM("[홀짝]"),
            "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
            Line(3),
            "정답입니다.",
            "정답는 [" + random(10) + "] 입니다."
          ].join("\n"));
        } else if (random(10) % 2 == 0) {
          event.room.send([
            msg.noti,
            LM("[홀짝]"),
            "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
            Line(3),
            "오답입니다.",
            "숫자는 [" + random(10) + "] 입니다."
          ].join("\n"));
        }
    }
  }

  if (event.message.startsWith(prefix + "음악 차트 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    event.room.send([
      msg.noti,
      LM("[음악 차트]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
      Line(3),
      Lw,
      music_chart(cut[3])
    ].join("\n"));
  }
  if (event.message.startsWith(prefix + "음악 검색 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);

    event.room.send([
      msg.noti,
      LM("[음악 검색]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
      Line(3),
      music_search(event.message.replace(prefix + "음악 검색 ", ""))
    ].join("\n"));
  }

  if (event.message.startsWith(prefix + "ai ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.ban);
    if (!User.edit(event.sender.name).User.edit(event.sender.name).nickname[0].includes("Stars")) return event.room.send([
      msg.error_,
      "본 기능은 Stars 전용 기능입니다.",
      "혹시 Stars 회원인데도 이 에러가 발생한다면, Stars 전용 메일로 연락바랍니다."
    ].join("\n"));

    event.room.send([
      msg.noti,
      LM("[AI]"),
      "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
      Line(3),
      "잠시만 기다려주세요."
    ].join("\n"));
    event.room.send(ai(2, event.message.replace(prefix + "ai ", ""))); //1: Bard | 2: ChatGPT 3.5 | 3: ChatGPT 4
  }

  /*if (event.message.startsWith(prefix + "n")) {
    event.room.send("본 기능은 테스트 기능입니다.(gemini)");
    event.room.send(gemini(event.message.replace(prefix + "n ", "")));
  }*/ 

}



/*카카오톡 봇 커뮤니티
if (event.message == "/봇목록 " && event.sender.name != "오픈채팅봇")
  event.room.send([
    "아래는 봇 목록입니다.",
    ">https://www.kabotco.kro.kr/invent",
  ].join('\n'));

/*if ((event.message).includes('방 하트') && event.sender.name == "오픈채팅봇")
  event.room.send([
    '👋',
    '𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄',
    '━━━━━━━━━━━━━━━━',
    event.room.name + '에 오신걸 환영해요!', ,
    '공지(규정)을 꼭 읽어주세요!'
  ].join('\n'));*/


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
    return (msg.error + JSON.stringify(e));
  }
}

function music_search(song) {
  try {
    let data = JSON.parse(
      org.jsoup.Jsoup.connect("https://www.melon.com/search/keyword/index.json?j&query=" + song)
      .ignoreContentType(true)
      .execute().body()
    )["SONGCONTENTS"][0];
    return ogimg(data.ARTISTNAME + " - " + data.SONGNAME,
      "앨범 이름 : " + data.ALBUMNAME,
      data.ALBUMIMG + "'");
  } catch (e) {
    return (msg.error + JSON.stringify(e));
  }

}


function ai(ai_, word) {
  let plusId = "SkyTf9-zmSJE";
  try {
    if (ai_ == 1) { //Bard
      return JSON.parse(
        org.jsoup.Jsoup.connect('https://vapis.run.goorm.site/api/bard?plusId=' + plusId + '&word=' + word)
        .ignoreContentType(true)
        .timeout(1000 * 60 * 2)
        .get()
        .text()
      )["message"].split('"');
    }
    if (ai_ == 2) { //ChatGPT 3.5
      return JSON.parse(
        org.jsoup.Jsoup.connect('https://vapis.run.goorm.site/api/chatgpt?plusId=' + plusId + '&word=' + word)
        .ignoreContentType(true)
        .timeout(1000 * 60 * 2)
        .get()
        .text()
      )["message"].split('"');
    }
    if (ai_ == 3) { //ChatGPT 4
      return JSON.parse(
        org.jsoup.Jsoup.connect('https://vapis.run.goorm.site/api/chatgpt4?plusId=' + plusId + '&word=' + word)
        .ignoreContentType(true)
        .timeout(1000 * 60 * 2)
        .get()
        .text()
      )["message"].split('"');
    }
  } catch (e) {
    return msg.noti + JSON.stringify(e)
  }
}

function gemini(msg) {
  let key = "AIzaSyC67uhwAN9UqC9fxtAITrcohhZk5xB0tA8"
  try {
    let response = JSON.parse(org.jsoup.Jsoup.connect("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + key)
      .header("Content-Type", "application/json").requestBody(JSON.stringify({
        "contents": [{
          "parts": [{
            "text": msg
          }]
        }]
      })).method(org.jsoup.Connection.Method.POST).ignoreContentType(true).ignoreHttpErrors(true).timeout(200000).post().text());
    result = response.candidates[0].content.parts[0].text;
  } catch (e) {
    Log.e(e);
    return JSON.stringify(e);
  }
  return result;
}

function ai(msg) {
  let key = "AIzaSyC67uhwAN9UqC9fxtAITrcohhZk5xB0tA8"
  try {
    let requestBody = {
      "contents": [{
          "role": "user",
          "parts": [{
            "text": msg
          }]
        },
        {
          "role": "Eric",
          "parts": [{
            "text": ""
          }]
        }
      ]
    };

    let response = JSON.parse(
      org.jsoup.Jsoup.connect("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + key)
      .header("Content-Type", "application/json")
      .requestBody(JSON.stringify(requestBody))
      .method(org.jsoup.Connection.Method.POST)
      .ignoreContentType(true)
      .ignoreHttpErrors(true)
      .timeout(200000)
      .post()
      .text()
    );
    result = response.candidates[0].content.parts[0].text;
  } catch (e) {
    Log.e(e);
    return JSON.stringify(e);
  }
  return result;
}