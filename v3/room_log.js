function getRoomInfo(link) {
  let g = org.jsoup.Jsoup.connect(link).ignoreContentType(true).get();
  let title = g.select("head > meta:nth-child(4)").attr("content");
  let result;
  if (title == "카카오톡 오픈채팅") {
    return {
      "page": 0,
      "count": 0,
      "totalCount": 0,
      "status": 0
    };
  } else {
    let urls = [
      `https://open.kakao.com/c/search/unified?q=` + title + `&c=100&p=1`,
      `https://open.kakao.com/c/search/unified?q=` + title + `&c=100&p=2`,
      `https://open.kakao.com/c/search/unified?q=` + title + `&c=100&p=3`,
      `https://open.kakao.com/c/search/unified?q=` + title + `&c=100&p=4`,
      `https://open.kakao.com/c/search/unified?q=` + title + `&c=100&p=5`
    ];
    let requests = urls.map(url => org.jsoup.Jsoup.connect(url).ignoreContentType(true).userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36").get().text())
    for (let c in requests) {
      let tar = JSON.parse(requests[c])
      if (tar.items.length == 0) {
        result = {
          "page": 0,
          "count": 0,
          "totalCount": 0,
          "status": 0
        };
        break;
      } else {
        let b = tar.items.find((obj) => obj.lu === link);
        if (b == undefined) {
          continue;
        } else {
          result = b;
          break;
        }
      }
    }
    return result;
  }
}





const list = [
  /*
  'https://open.kakao.com/o/gMv45SGe',//카봇커
  'https://open.kakao.com/o/gBWww7re',//옐루
  'https://open.kakao.com/o/gjepOxZd',//로나
  'https://open.kakao.com/o/gky5ystd',//다투맨
  'https://open.kakao.com/o/gvvu5K7c',//뽕상필
  'https://open.kakao.com/o/g3wp7UBb',//로젠다로
  'https://open.kakao.com/o/gPOkc4Be',//졸림
  'https://open.kakao.com/o/gO6rqG8e'//현이
  */
  'https://open.kakao.com/o/gDqNqUue'//test
];


const { parse, stringify } = JSON,
  { read, write } = FileStream,
  path = (link) => '/sdcard/BotData/history/' + link.split('/')[link.split('/').length - 1] + '.json';

const GET = (str) => getRoomInfo(str);

list.forEach(v => {
  let data = GET(v);
  const Path = path(v);
  if (!read(Path)) write(Path, stringify({
    방제: data.ln,
    잠금: data.lk,
    설명: data.desc,
    커버: data.liu,
    인원: data.mcnt,
    방장: data.nn,
    프사: data.pi,
    태그: data.tags,
    하트: data.rc
  }));
});


const interval = setInterval(() => {

  list.forEach(v => {

    const Path = path(v);

    const data1 = GET(v);

    let data2 = parse(read(Path));

    if (!['방제', '잠금', '설명', '커버', '인원', '방장', '프사', '태그', '하트'].map(v => data1[v] === data2[v]).includes(false)) return;

    /*
      현재 데이터 : data1
      과거 데이터 : data2
    */

    const 변경 = {

      방: {
        이름: data1.ln != data2.ln,
        잠금: data1.lk != data2.lk,
        설명: data1.desc != data2.desc,
        사진: data1.liu != data2.liu,
        입장: data1.mcnt > data2.mcnt,
        퇴장: data2.mcnt > data1.mcnt,
        하트: data1.rc > data2.rc
      },

      방장: {
        이름: data1.nn != data2.nn,
        프사: data1.pi != data2.pi
      },

      태그: data1.tags != data2.tags

    };

    const 현재 = {

      방: {
        이름: data1.ln,
        잠금: data1.lk,
        설명: data1.desc,
        사진: data1.liu
      },

      방장: {
        이름: data1.nn,
        사진: data1.pi
      },

      인원: data1.mcnt,
      하트: data1.rc,
      태그: data1.tags

    };

    const 과거 = {

      방: {
        이름: data2.ln,
        잠금: data2.lk,
        설명: data2.desc,
        사진: data2.liu
      },

      방장: {
        이름: data2.nn,
        사진: data2.pi
      },

      인원: data2.mcnt,
      하트: data2.rc,
      태그: data2.tags

    };


    const 점수 = data1.score.toFixed(3) * 100;


    const 전송 = function () {
      const args = Array.from(arguments);
      if (args.length === 1) Api.replyRoom(data1.ln, args[0]);
      else if (args.length === 2) Api.replyRoom(args[0], args[1]);
    };

    if (Info) Info(변경, 현재, 과거, 점수, 전송);

    data2.ln = data1.ln;
    data2.desc = data1.desc;
    data2.liu = data1.liu;
    data2.nn = data1.nn;
    data2.pi = data1.pi;
    data2.tags = data1.tags;
    data2.mcnt = data1.mcnt;
    data2.rc = data1.rc;

    write(Path, stringify(data2));


  });

}, 3 * list.length);


const onStartCompile = () => clearInterval(interval);



function Info(변경, 현재, 과거, 점수, 전송) {

  /*
    변경
      방
        이름/잠금/설명/사진/입장/퇴장
      방장
        이름/프사
      해시태그

    현재
      방
        이름/잠금/설명/배경
      방장
        이름/사진
      인원
      하트
      태그

    과거
      방
        이름/잠금/설명/배경
      방장
        이름/사진
      인원
      하트
      태그
  */


  const Lw = '\u200b'.repeat(500);

  /*참여코드*/
  if (현재.방.잠금 == true) {
    var 잠금 = "🔒";
  } else if (현재.방.잠금 == false) {
    var 잠금 = "🔓";
  }

  /*입퇴장*/
  if (변경.방.입장)
    전송(
      "[" + 현재.방.이름 + "] 에 온걸 환영해!"
      + "\n"
      + "\n"
      + "🖤 : " + 현재.방.하트 + "개 "
      + "👥️ : " + 현재.방.인원 + "명"
      + "\n"
      + "\n"
      + "방 상태 : " + 잠금
      + "\n"
      + "방 점수 : " + 점수
    );

  if (변경.방.퇴장)
    전송(
      "잘가ㅠㅠ\n담에 또 만나자"
      + "\n"
      + "\n"
      + "🖤 : " + 현재.방.하트 + "개 "
      + "👥️ : " + 현재.방.인원 + "명"
      + "\n"
      + "\n"
      + "방 상태 : " + 잠금
      + "\n"
      + "방 점수 : " + 점수
    );


  /*방장*/
  if (변경.방장.이름)
    전송(
      '방장 [' + 과거.방장.이름 + '] (이)가 이름을 바꿨어!'
      + Lw
      + "\n"
      + "\n"
      + "\n"
      + "변경 전 : " + 과거.방장.이름
      + "\n"
      + "\n"
      + "변경 후 : " + 현재.방장.이름
    );

  if (변경.방장.사진)
    전송(
      '방장 [' + 현재.방장.이름 + '] (이)가 프로필사진을 바꿨어!'
      + Lw
      + "\n"
      + "\n"
      + "\n"
      + "변경 전 : " + 과거.방장.사진
      + "\n"
      + "\n"
      + "변경 후 : " + 현재.방장.사진
    );

  /*방*/
  if (변경.방.사진)
    전송(
      '방 [' + 현재.방.이름 + '] 의 배경사진이 바꼈어!'
      + Lw
      + "\n"
      + "\n"
      + "\n"
      + "변경 전 : " + 과거.방.사진
      + "\n"
      + "\n"
      + "변경 후 : " + 현재.방.사진
    );

  if (변경.방.이름)
    전송(
      '방 [' + 과거.방.이름 + '] 의 이름이 바꼈어!'
      + Lw
      + "\n"
      + "\n"
      + "\n"
      + "변경 전 : " + 과거.방.이름
      + "\n"
      + "\n"
      + "변경 후 : " + 현재.방.이름
    );

  if (변경.방.설명)
    전송(
      '방 [' + 현재.방.이름 + '] 의 설명이 바꼈어!'
      + Lw
      + "\n"
      + "\n"
      + "\n"
      + "변경 전 : " + 과거.방.설명
      + "\n"
      + "\n"
      + "변경 후 : " + 현재.방.설명
    );


}