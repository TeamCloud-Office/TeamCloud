var URL = "https://api.openai.com/v1/chat/completions"; // GPT 주소

const BotName = "에릭아."; // 봇이름 자신이 맘에 드는걸로 쓴다.

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

    if(msg.indexOf(BotName) !== -1) {
        replier.reply(FindResponse(SendMsg("반말로 해"+RemoveName(msg))));
    }

}


function RemoveName(_msg) {
    var spl = _msg.split(" ");
    var rtnText = "";
    for(var i = 0; i < spl.length; ++i) {
        if(spl[i].indexOf(BotName) === -1) {
            rtnText += spl[i] + " ";
        }
    }

    return rtnText;
}

function SendMsg(_msg) {
    const response = org.jsoup.Jsoup.connect(URL)
        .header('Authorization','Bearer ' + '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')   // GPT에서 획득한 Authorization
        .header('Content-Type', 'application/json')
        .header('Accept', 'application/json')
        .method(org.jsoup.Connection.Method.POST)
        .requestBody(JSON.stringify({
            "model": "gpt-3.5-turbo",  // 찾은 모델명 ID >>> 찾아서 아무거나 쓴다.
            "messages": [{"role": "user", "content": _msg}]
        }))
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .timeout(1000 * 60 * 5)
        .execute();

    return JSON.parse(response.body());
}
function FindResponse(_json) {
    var rtnText = _json.choices[0].message.content;
    return rtnText.trim();
}
function log_i(_funcName, _data)
{
    if(libConst.def_Log)
      Log.i(_funcName + " func --- " + _data);
}
function log_e(_funcName, _data)
{
    if(libConst.def_Log)
      Log.e(_funcName + " func --- " + _data);
}