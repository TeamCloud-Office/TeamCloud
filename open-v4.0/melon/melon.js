Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
import {
    prefix,
    Lw,
    cut,
    msg,
    ogimg,
} from "A_module";

function onMessage(event) {
    if (event.message.startsWith(prefix + "음악")) {
        switch (cut[2]) {
            case "차트":
                event.room.send(music_chart(cut[2]));
                break;
            case "검색":
                event.room.send(music_search(event.message.replace(A.prefix + "음악검색 ", "")));
                break;
        }

    }
}

function music_chart(num) {
    try {
        if (num > 100) return (msg.error + "순위는 100위까지만 가능합니다.");
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