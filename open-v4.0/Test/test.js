let A = Bridge.getScopeOf("A");

importClass(android.content.Context);

function onMessage(event) {
    if (event.message.startsWith(A.prefix + "og")) {
        if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
        if (!String(A.user.edit(event.sender.name, false).nickname).includes("VIP")) return event.room.send(A.msg.noti + "이 기능은 VIP만 사용할 수 있어!");
        let cut = event.message.split(' ');
        event.room.send(og(cut[1].split('`')[0], cut[1].split('`')[1], cut[1].split('`')[2]));
    }

    if (event.message.startsWith(A.prefix) && event.message.endsWith("알려줘")) {
        if (!A.user.read(event.sender.name)) return event.room.send(A.msg.noti + A.msg.terms);
        if (!String(A.user.edit(event.sender.name, false).nickname).includes("VIP")) return event.room.send(A.msg.noti + "이 기능은 VIP만 사용할 수 있어!");
        let msg = event.message.replace(A.prefix, "").replace("알려줘", "");
        event.room.send("잠시만 기다려줘!");
        event.room.send(ai(2, msg));
    }

    if (event.message.startsWith("!기기확인")) {
        event.room.send([
            "[ ℹ️구동기 정보 ]",
            A.Lw, , , ,
            "[🌡온도]: " + (Device.getBatteryTemperature() / 100) + "° C", ,
            "[🌊안드로이드 버전]: " + Device.getAndroidVersionName(), ,
            "[❄️안드로이드 코드]: " + Device.getAndroidVersionCode(), ,
            "[⚡️브랜드]: " + Device.getPhoneBrand(), ,
            "[🧱모델]: " + Device.getPhoneModel(), , , ,
            "[배터리 상태]", , ,
            "[🛰충전 여부]: " + (Device.isCharging() ? "O" : "X"), ,
            "[🚧충전기 타입]: " + Device.getPlugType(), ,
            "[🔋배터리 잔량]: " + Device.getBatteryLevel() + "%", ,
            "[🛡배터리 전압]: " + Device.getBatteryVoltage() + "mV"
        ].join("\n"))
    }
}



function og(title, des, img) {
    let url = "https://api.molya.kr/v1/image/create";
    let response = org.jsoup.Jsoup.connect(url)
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
        .timeout(1000 * 60 * 2)
        .execute();

    return (JSON.parse(response.body()).data.viewUrl).split('"');
    //return JSON.stringify(JSON.parse(response.body()).data.viewUrl.split('"'), null, 4);
}

function ai(ai_, word) {
    if (ai_ == 1) { //bard
        return JSON.parse(
            org.jsoup.Jsoup.connect('https://vapis.run.goorm.site/api/bard?plusId=SkvssAizmSJE&word=' + word)
            .ignoreContentType(true)
            .timeout(1000 * 60 * 2)
            .get()
            .text()
        ).message.split('"');
    }
    if (ai_ == 2) { //ChatGPT4
        return JSON.parse(
            org.jsoup.Jsoup.connect('https://vapis.run.goorm.site/api/chatgpt4?plusId=SkvssAizmSJE&word=' + word)
            .ignoreContentType(true)
            .timeout(1000 * 60 * 2)
            .get()
            .text()
        ).message.split('"');
    }
}