let A = Bridge.getScopeOf("A");

function onMessage(event) {

  let cut = event.message.split(" ");

  if (event.message == A.prefix + "도움말")
    event.room.send('https://www.team-cloud.kro.kr/blog/manual');


  if (event.message.startsWith(A.prefix + "디데이 ")) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    let today = new Date(new Date().getYear(), new Date().getMonth() + 1, new Date().getDate());
    let day = new Date(new Date().getYear(), cut[2].split('/')[0], cut[2].split('/')[1]);
    let calculate = (today - day) / (1000 * 3600 * 24) * -1;
    if (calculate < 0) calculate = 365 - calculate * -1;
    if (calculate == 0) calculate = "Day";
    event.room.send(A.msg.noti + 'D-' + calculate);
  }


  if (event.message.startsWith(A.prefix) && event.message.endsWith("확률은?")) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    let split = event.message.replace(A.prefix, "").replace(" 확률은?", "");
    event.room.send(A.msg.noti + split + " 확률은 " + (Math.random() * 100).toFixed(3) + "% 이야.");
  }


  if (event.message.startsWith(A.prefix + '가위바위보 ')) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    switch (cut[2]) {
      case '바위':
        array = ["가위\n내가 졌네..ㅠㅠ", "바위\n비겼네!", "보\n내가 이겼당"];
        event.room.send(A.msg.noti + array[A.random(3)]);
        break;
      case '가위':
        array = ["보\n내가 졌네..ㅠㅠ", "가위\n비겼네!", "바위\n내가 이겼당"];
        event.room.send(A.msg.noti + array[A.random(3)]);
        break;
      case '보':
        array = ["바위\n내가 졌네..ㅠㅠ", "보\n비겼네", "가위\n내가 이겼당"];
        event.room.send(A.msg.noti + array[A.random(3)]);
        break;
    }
  }


  if (event.message.startsWith(A.prefix + "날씨")) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    let Weader = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + event.message.replace(A.prefix + "날씨 ", "") + " 날씨").get();
    let C = Weader.select("#wob_tm").text(); //섭씨
    let F = Weader.select("#wob_ttm").text(); //화씨
    let Pre = Weader.select("#wob_pp").text(); //강수
    let Humidity = Weader.select("#wob_hm").text(); //습도
    let Wind = Weader.select("#wob_tws").text(); //풍속
    let Time = Weader.select("#wob_dts").text(); //측정시간
    let Summary = Weader.select("#wob_dc").text(); //요약
    event.room.send(A.msg.noti + [
      event.message.replace(A.prefix + "날씨 ", "") + "의 날씨",
      Summary,
      "섭씨 : " + C + "°C",
      "화씨 : " + F + "°F",
      "강수확률 : " + Pre,
      "습도 : " + Humidity,
      "풍속 : " + Wind, ,
      "기준 시간 : " + Time
    ].join('\n'));
  }


  if (event.message == A.prefix + "주사위") {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    event.room.send(A.msg.noti + "데구르르....");
    java.lang.Thread.sleep(500);
    event.room.send(A.msg.noti + A.random(6));
  }


  if (event.message.startsWith(A.prefix + "홀짝 ")) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    let random = A.random(10) + 1;
    switch (cut[2]) {
      case '짝':
        if (random % 2 == 0) {
          event.room.send(A.msg.noti + "정답!\n숫자는 " + random + "이었어!");
        } else if (random % 2 != 0) {
          event.room.send(A.msg.noti + "오답!\n숫자는" + random + "이었어ㅠㅠ");
        }
        break;
      case '홀':
        if (random % 2 != 0) {
          event.room.send(A.msg.noti + "정답!\n숫자는 " + random + "이었어!");
        } else if (random % 2 == 0) {
          event.room.send(A.msg.noti + "오답!\n숫자는" + random + "이었어ㅠㅠ");
        }
    }
  }



  //관리
  if (event.message == A.prefix + "내 정보") {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    event.room.send([
      A.msg.noti,
      "이름 : " + A.user.edit(event.sender.name, false).name,
      "닉네임 : " + A.user.edit(event.sender.name, false).nickname,
      "관리자 : " + (A.user.edit(event.sender.name, false).admin ? "예" : "아니오"),
      "팀클 코인 : " + A.user.edit(event.sender.name, false).teamcloud_coin + "코인",
      "경고 횟수 : " + A.user.edit(event.sender.name, false).warning_count + "회",
      "에릭과의 호감도 : " + A.user.edit(event.sender.name, false).like,
      "기타 : " + A.user.edit(event.sender.name, false).etc
    ].join("\n"));
  }

  if (event.message.startsWith(A.prefix + "정보")) {
    if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
    if (A.user.edit(event.sender.name, false).ban) return event.room.send(A.msg.noti + '나 너 싫어!');
    if (!A.user.edit(event.sender.name, false).admin) return event.room.send(A.msg.noti + '우리 가족이 아냐!')
    event.room.send([
      A.msg.noti,
      "이름 : " + A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).name,
      "닉네임 : " + A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).nickname,
      "관리자 : " + (A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).admin ? "예" : "아니오"),
      "팀클 코인 : " + A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).teamcloud_coin + "코인",
      "경고 횟수 : " + A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).warning_count + "회",
      "에릭과의 호감도 : " + A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).like,
      "기타 : " + A.user.edit(event.message.replace(A.prefix + "정보 ", ""), false).etc
    ].join("\n"));
  }



  //단순답장 명령어
  //if (event.message == "응애")
  //event.room.send("응애");


  //카카오톡 봇 커뮤니티
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