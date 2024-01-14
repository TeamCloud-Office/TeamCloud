import {
  prefix,
  Lw,
  fs,
  cut,
  getDate,
  Kakaocord,
  User,
  msg,
  Pos,
  chat_log,
  random,
  Coin,
  Nickname,
  ogimg,
  c_path,
} from "A";

function onMessage(event) {

  if (event.message.startsWith(prefix)) {
    if (User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
    if (User.edit(event.sender.name, false).ban) return event.room.send(msg.noti + '나 너 싫어!');

    switch (cut[1]) {

      case "도움말":
        event.room.send('https://www.team-cloud.kro.kr/blog/manual');
        chat_log[event.room.name][event.sender.name].push(time + " : " + ("도움말") + " 기능 사용함.");
        chat_log[event.room.name][event.sender.name].push("> " + "[" + ("") + " 답장됨.]");
        fs.write(c_path, JSON.stringify(chat_log, null, 4));
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
          "풍속 : " + Weader.select("#wob_tws").text(), ,
          "기준 시간 : " + Weader.select("#wob_dts").text()
        ].join('\n'));
        break;

      case "주사위":
        event.room.send(msg.noti + "데구르르....");
        java.lang.Thread.sleep(500);
        event.room.send(msg.noti + random(6));
        break;

      case "홀짝 ":
        switch (A.cut[2]) {
          case '짝':
            if (random(10) % 2 == 0) {
              event.room.send(msg.noti + "정답!\n숫자는 " + random(10) + "이었어!");
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
      case "내 정보":
        event.room.send([
          msg.noti,
          "이름 : " + User.edit(event.sender.name, false).name,
          "닉네임 : " + User.edit(event.sender.name, false).nickname,
          "관리자 : " + (User.edit(event.sender.name, false).admin ? "예" : "아니오"),
          "팀클 코인 : " + User.edit(event.sender.name, false).coin + "코인",
          "경고 횟수 : " + User.edit(event.sender.name, false).warn + "회",
          "주식 보유 종목: " + User.edit(event.sender.name, false).stock,
          "에릭과의 호감도 : " + User.edit(event.sender.name, false).like,
          "기타 : " + User.edit(event.sender.name, false).etc
        ].join("\n"));
        break;

      case "정보 ":
        if (!A.user.edit(event.sender.name, false).admin) return event.room.send(A.msg.noti + '우리 가족이 아냐!')
        event.room.send([
          msg.noti,
          "이름 : " + User.edit(event.message.replace("에릭아 정보 ", ""), false).name,
          "닉네임 : " + User.edit(event.message.replace("에릭아 정보 ", ""), false).nickname,
          "관리자 : " + (User.edit(event.message.replace("에릭아 정보 ", ""), false).admin ? "예" : "아니오"),
          "팀클 코인 : " + User.edit(event.message.replace("에릭아 정보 ", ""), false).teamcloud_coin + "코인",
          "경고 횟수 : " + User.edit(event.message.replace("에릭아 정보 ", ""), false).warning_count + "회",
          "주식 보유 종목: " + User.edit(event.message.replace("에릭아 정보 ", ""), false).stock,
          "에릭과의 호감도 : " + User.edit(event.message.replace("에릭아 정보 ", ""), false).like,
          "기타 : " + User.edit(event.message.replace("에릭아 정보 ", ""), false).etc
        ].join("\n"));
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