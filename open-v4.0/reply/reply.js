Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
  prefix,
  Lw,
  FS,
  state,
  snd,
  getDate,
  c_path,
  Kakaocord,
  msg,
  Pos,
  chat,
  random,
  addID,
  User,
  Coin,
  Nickname,
  ogimg
} = require("A");

function onMessage(event) {

  if (event.message.startsWith(prefix)) {
    if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
    if (User.edit(event.sender.name, false).ban) return event.room.send(msg.noti + msg.ban);

    //let reply = "";

    //chat.save(event.room.name, event.sender.name, ("[" + cut[1] + "]" + " 기능 사용함."));
    switch (cut[1]) {

      /*
      case "도움말":
        reply = 'https://www.team-cloud.kro.kr/blog/manual'
        event.room.send(msg.noti + reply);
        chat.save(event.room.name, event.sender.name, ("> " + "[" + reply + "]" + " 답장됨."));
        break;
        */

      case "도움말":
        event.room.send(msg.noti + 'https://www.team-cloud.kro.kr/blog/manual');
        break;

      case "디데이 ":
        let today = new Date(new Date().getYear(), new Date().getMonth() + 1, new Date().getDate());
        let day = new Date(new Date().getYear(), cut[2].split('/')[0], cut[2].split('/')[1]);
        let calculate = (today - day) / (1000 * 3600 * 24) * -1;
        if (calculate < 0) calculate = 365 - calculate * -1;
        if (calculate == 0) calculate = "Day";
        event.room.send(msg.noti + 'D-' + calculate);
        break;

      case "가위바위보 ":
        switch (cut[2]) {
          case '바위':
            array = ["가위\n내가 졌네..ㅠㅠ", "바위\n비겼네!", "보\n내가 이겼당"];
            event.room.send(msg.noti + array[random(3)]);
            break;
          case '가위':
            array = ["보\n내가 졌네..ㅠㅠ", "가위\n비겼네!", "바위\n내가 이겼당"];
            event.room.send(msg.noti + array[random(3)]);
            break;
          case '보':
            array = ["바위\n내가 졌네..ㅠㅠ", "보\n비겼네", "가위\n내가 이겼당"];
            event.room.send(msg.noti + array[random(3)]);
            break;
        }
        break;

      case "날씨 ":
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
          "기준 시간 : " + Weader.select("#wob_dts").text()
        ].join('\n'));
        break;

      case "주사위":
        event.room.send(msg.noti + random(6));
        break;

      case "홀짝 ":
        switch (cut[2]) {
          case '짝':
            if (random(10) % 2 == 0) {
              event.room.send([msg.noti,"정답입니다.\n숫자는 " + random(10) + "이었어!"].join("\n"));
            } else if (random(10) % 2 != 0) {
              event.room.send(msg.noti + "오답!\n숫자는" + random(10) + "이었어ㅠㅠ");
            }
            break;
          case '홀':
            if (random(10) % 2 != 0) {
              event.room.send(msg.noti + "정답!\n숫자는 " + random(10) + "이었어!");
            } else if (random(10) % 2 == 0) {
              event.room.send(msg.noti + "오답!\n숫자는" + random(10) + "이었어ㅠㅠ");
            }
        }
        break;

      case "음악":
        switch (cut[2]) {
          case "차트 ":
            event.room.send(msg.noti + music_chart(cut[2]));
            break;
          case "검색 ":
            event.room.send(msg.noti + music_search(event.message.replace(prefix + "음악 검색 ", "")));
            break;
        }
        break;

      case "ai ":
        if (User.edit(event.sender.name).nickname.includes("Stars")) {
          event.room.send([
            msg.noti,
            "잠시만 기다려주세요."
          ].join("\n"));
          event.room.send(ai(2, event.message.replace(prefix + "ai ", ""))); //1: Bard | 2: ChatGPT 3.5 | 3: ChatGPT 4
        } else {
          event.room.send(msg.error_ + "본 기능은 Stars 전용 기능입니다.")
        }


        case "내 정보":
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
          break;

    }
  }

  if (event.message.startsWith(prefix) && event.message.endsWith("확률은?")) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    let split = event.message.cut[1].replace(" 확률은?", "");
    event.room.send(A.msg.noti + split + " 확률은 " + (Math.random() * 100).toFixed(3) + "% 이야.");
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


}


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