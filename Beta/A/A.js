//let A = Bridge.getScopeOf("A");

let prefix = '에릭아 ';

let Lw = '\u200b'.repeat(500);

let fs = FileStream;

let Pos = (str, t, f) => (str.slice(-1).normalize("NFKD")[2] != undefined) ? t : f;

let random = (num) => Math.floor(Math.random() * num);

let chat_all = (year, month, day) => JSON.stringify(JSON.parse(fs.read("sdcard/BotData/chat/" + (year + "y/") + (month + "m/") + (day + "d") + ".json")), null, 4);
let chat = (year, month, day, room, sender) => JSON.stringify(JSON.parse(fs.read("sdcard/BotData/chat/" + (year + "y/") + (month + "m/") + (day + "d") + ".json"))[room][sender], null, 4);

let Kakaocord = {
    discord: {
        send: (server, channel, msg) => Discord.api.getServerById(server).get().getChannelById(channel).get().sendMessage(msg),
        embed: (msg, des, author, field1_tit, field1_des, field2_tit, field2_des, color) => org.javacord.api.entity.message.embed.EmbedBuilder()
            .setTitle(msg)
            .setDescription(des)
            .setAuthor(author)
            .addField(field1_tit, field1_des)
            .addInlineField(field2_tit, field2_des)
            .setColor(java.awt.Color.decode(color))
    },
    kakaotalk: {
        send: (channel, msg) => Api.replyRoom(channel, msg + "(Kakao-cord)")
    }
}

let {
    LocalStorage
} = require('LocalStorage');

let Local = new LocalStorage('/sdcard/BotData/admin/UseData.json', false);

let user = {
    set: (k, v) => Local.setItem(k, v),
    edit: (k, d) => Local.getItem(k, d),
    read: (k) => Local.hasItem(k),
    save: () => Local.save(),
    delete: (k) => Local.removeItem(k)
};

let msg = {

    noti: [
        '[ Eric Ver : ' + 'beta v4.2' + ']', , ,
    ].join('\n'),
    //공지

    terms: [
        "에릭의 대부분의 기능은 에릭 이용약관에 동의해야 사용할 수 있어!",
        "[에릭아 약관]을 입력해 약관에 동의해줘!"
    ].join('\n'),
    //약관

    coin: (s, e, c) => coin(s, e, c),

    nickname: (s, e, n) => nickname(s, e, n),

    og: (t, d, i) => ogimg(t, d, i)

}; //메세지


function coin(s, e, c) {
    if (c >= 0) {
        let coin = user.edit(s, false).teamcloud_coin += c;
        user.edit(s, false).teamcloud_coin = coin;
        user.save();
        return [
            "코인 증감➕🪙",
            e + Lw, ,
            "[" + "[" + user.edit(s, false).nickname + "]" + s + "]" + Pos(s, "아", "야") + ", <" + e + ">" + Pos(e, "으로", "로") + " <" + c + ">coin이 지급되었어!",
            "►현재 [" + "[" + user.edit(s, false).nickname + "]" + s + "]는 <" + user.edit(s, false).teamcloud_coin + ">coin이 있어!"
        ].join('\n'); //코인 지급
    }
    if (c <= 0) {
        let coin = user.edit(s, false).teamcloud_coin += c;
        user.edit(s, false).teamcloud_coin = coin;
        user.save();
        return [
            "코인 차감➖🪙",
            e + Lw, ,
            "[" + "[" + user.edit(s, false).nickname + "]" + s + "]" + Pos(s, "아", "야") + ", <" + e + ">" + Pos(e, "으로", "로") + " <" + c + ">coin이 지급되었어!",
            "►현재 [" + "[" + user.edit(s, false).nickname + "]" + s + "]는 <" + user.edit(s, false).teamcloud_coin + ">coin이 있어!"
        ].join('\n'); //코인 지급
    }
}

function nickname(s, e, n) {
    (user.edit(s, false).nickname).push(n);
    user.save();
    return [
        "닉네임 지급🏷️",
        e + Lw, ,
        "[" + "[" + user.edit(s, false).nickname + "]" + s + "]" + Pos(s, "아", "야") + ", <" + e + ">" + Pos(e, "으로", "로") + " 닉네임 <" + n + ">가 추가됐어!"
    ].join('\n'); //닉네임 지급
}


function ogimg(title, des, img) {
    let response = org.jsoup.Jsoup.connect("https://api.molya.kr/v1/image/create")
        .header('x-api-key', '82d1547b-d50a-436c-83f6-0795e8f79303')
        .method(org.jsoup.Connection.Method.POST)
        .data({
            "type": "url",
            "image": img,
            "title": title,
            "description": des
        })
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .timeout(1000 * 60 * 5)
        .execute();

    let data = JSON.parse(response.body()).data.viewUrl.split('"');
    return data;
    //return JSON.stringify(JSON.parse(response.body()).data.viewUrl.split('"'), null, 4);
}