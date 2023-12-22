Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let A = Bridge.getScopeOf("A");

function onMessage(event) {
    let cut = event.message.split(" ");
    if (event.message.startsWith(A.prefix + "멜론차트")) {
        event.room.send(melon_chart(cut[2]));
    }
    if (event.message.startsWith(A.prefix + "음악검색")) {
        event.room.send(melon_music(event.message.replace(A.prefix + "음악검색 ", "")));
    }
}

function melon_chart(num) {
    let data = org.jsoup.Jsoup.connect('https://www.melon.com/chart/').get();
    try {
        return data.select('[class$="year"]').text() + " " + data.select('[class$="hour"]').text() +
            " 멜론차트 \n" + 
            A.Lw +
            Array(Number(num)).fill().map((a, i) => (i + 1) + '위 : ' +
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
    } catch(e) {
        return "멜론 차트를 불러오는데 실패했어!"
    }
}

function melon_music(song) {
    let data = JSON.parse(org.jsoup.Jsoup.connect("https://www.melon.com/search/keyword/index.json?j&query=" + encodeURIComponent(song)).ignoreContentType(true).get().text()).SONGCONTENTS[0];
    return [
        "노래 이름 : " + data.SONGNAME,
        "앨범 이름 : " + data.ALBUMNAME,
        "가수(그룹) 이름 : " + data.ARTISTNAME, ,
        "앨범 사진 : " + data.ALBUMIMG
    ].join("\n");

}