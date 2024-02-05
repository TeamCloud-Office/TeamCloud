
let {
  prefix,
  Lw,
  Line,
  LM,
  FS,
  UP,
  SP,
  CP,
  Set,
  getDate,
  User,
  LS,
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

  if (event.message.startsWith(prefix + "가위바위보 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    switch (cut[2]) {
      case '바위':
        array = ["가위\n" + event.sender.name + "님이 이기셨습니다.", "바위\n사용자님과 비겼습니다.", "보\n제가 이겼습니다."];
        event.room.send(msg.noti + array[random(3)]);
        break;
      case '가위':
        array = ["보\n" + event.sender.name + "님이 이기셨습니다.", "가위\n사용자님과 비겼습니다.", "바위\n제가 이겼습니다."];
        event.room.send(msg.noti + array[random(3)]);
        break;
      case '보':
        array = ["바위\n" + event.sender.name + "님이 이기셨습니다.", "보\사용자님과 비겼습니다.", "가위\n제가 이겼습니다."];
        event.room.send(msg.noti + array[random(3)]);
        break;
    }
  }

  if (event.message.startsWith(prefix + "디데이")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    let today = new Date(new Date().getYear(), new Date().getMonth() + 1, new Date().getDate());
    let day = new Date(new Date().getYear(), cut[2].split('/')[0], cut[2].split('/')[1]);
    let calculate = (today - day) / (1000 * 3600 * 24) * -1;
    if (calculate < 0) calculate = 365 - calculate * -1;
    if (calculate == 0) calculate = "Day";
    event.room.send(msg.noti + 'D-' + calculate);
  }

  if (event.message.startsWith(prefix + "날씨 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    let Weader = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + cut[2] + " 날씨").get();
    event.room.send(msg.noti + [
      cut[2] + "의 날씨",
      Weader.select("#wob_dc").text(), //요약
      "섭씨 : " + Weader.select("#wob_tm").text() + "°C",
      "화씨 : " + Weader.select("#wob_ttm").text() + "°F",
      "강수확률 : " + Weader.select("#wob_pp").text(),
      "습도 : " + Weader.select("#wob_hm").text(),
      "풍속 : " + Weader.select("#wob_tws").text(),
      "",
      "기준 시간 : " + Weader.select("#wob_dts").text().slice(5)
    ].join('\n'));
  }

  if (event.message.startsWith(prefix) && event.message.endsWith("확률은?")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    let split = event.message.replace(prefix, "").replace("확률은?", "");
    event.room.send(msg.noti + split + " 확률은 " + (Math.random() * 100).toFixed(3) + "% 이야.");
  }

  if (event.message.startsWith(prefix + "주사위")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    event.room.send(msg.noti + random(6));
  }


  if (event.message.startsWith(prefix + "홀짝 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    switch (cut[2]) {
      case '짝':
        if (random(10) % 2 == 0) {
          event.room.send(msg.noti, "정답입니다.\n숫자는 [" + random(10) + "] 입니다.");
        } else if (random(10) % 2 != 0) {
          event.room.send(msg.noti + "오답입니다.\n숫자는 [" + random(10) + "] 입니다.");
        }
        break;
      case '홀':
        if (random(10) % 2 != 0) {
          event.room.send(msg.noti, "정답입니다.\n숫자는 [" + random(10) + "] 입니다.");
        } else if (random(10) % 2 == 0) {
          event.room.send(msg.noti + "오답입니다.\n숫자는 [" + random(10) + "] 입니다.");
        }
    }
  }

  if (event.message.startsWith(prefix + "음악 차트 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    event.room.send(msg.noti + music_chart(cut[3]));
  }
  if (event.message.startsWith(prefix + "음악 검색 ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    event.room.send(msg.noti + music_search(event.message.replace(prefix + "음악 검색 ", "")));
  }

  if (event.message.startsWith(prefix + "ai ")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);
    if (!User.edit(event.sender.name).nickname.includes("Stars")) return event.room.send(msg.error_ + "본 기능은 Stars 전용 기능입니다.");

    event.room.send([
      msg.noti,
      "잠시만 기다려주세요."
    ].join("\n"));
    event.room.send(ai(2, event.message.replace(prefix + "ai ", ""))); //1: Bard | 2: ChatGPT 3.5 | 3: ChatGPT 4
  }

  if (event.message.startsWith(prefix + "n")) {
    event.room.send("본 기능은 테스트 기능입니다.(gemini)")
    event.room.send(gemini(event.message.replace(prefix + "n ", "")));
  }

  if (event.message.startsWith(prefix + "내정보")) {
    if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
    if (User.edit(event.sender.name).ban == true) return event.room.send(msg.admin);

    event.room.send([
      msg.noti,
      "이름: " + User.edit(event.sender.name).name,
      "ID: " + User.edit(event.sender.name).id,
      "닉네임: " + User.edit(event.sender.name).nickname,
      "관리자: " + (User.edit(event.sender.name).admin ? "예" : "아니오"),
      "팀클 코인: " + User.edit(event.sender.name).coin + "코인",
      "경고 횟수: " + User.edit(event.sender.name).warn + "회",
      "주식 보유 종목: " + User.edit(event.sender.name).stock,
      "에릭과의 호감도: " + User.edit(event.sender.name).like,
      "기타: " + User.edit(event.sender.name).etc
    ].join("\n"));
  }

  if (event.message == (prefix.slice(0, -1))) {
    let list = {
      hello: [
        "부르셨습니까, " + event.sender.name + "님.",
        "네, " + event.sender.name + "님.",
        "반갑습니다.",
        "무슨 일입니까?",
        "부르셨습니까?"
      ]
    };
    event.room.send(list["hello"][random(list["hello"].length - 1)]);
  }

}



//단순답장 명령어
//if (event.message == "응애")
//event.room.send("응애");


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