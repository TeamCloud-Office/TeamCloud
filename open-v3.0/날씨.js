const File = java.io.File;
let UseData = "sdcard/BotData/admin/UseData.json";

// LocalStorage :)
const _storageData = loadStorageData(UseData);
const localStorage = {
  hasItem: (key) => {
    return _storageData.containsKey(key);
  },
  setItem: (key, value) => {
    _storageData[key] = value;
    localStorage.save();
  },
  getItem: (key, /* @optional */ def) => {
    if (!def) def = null;

    let data = _storageData[key];
    if (!data)
      return def;
    return data;
  },
  save: () => FileStream.write(UseData, JSON.stringify(_storageData))
};

function loadStorageData(filePath) {
  let exists = new File(filePath).exists();
  if (!exists)
    return {};

  try {
    let raw = FileStream.read(filePath);
    return JSON.parse(raw);
  } catch (e) {
    Log.e("Failed to parse LocalStorage data: " + e);
  }

  return {};
}

// Prototypes..
Object.prototype.containsKey = function (key) {
  return Object.keys(this).includes(key);
};

let user = localStorage.getItem(sender);

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
  if (msg.startsWith("ㄴㅅ ")) {
    if (fs.read(UseData).includes(sender) == true) {
      if (user.ban == false) replier.reply('나 너 싫어!');
      날씨 = msg.substr(3);
      var data = Utils.getWebText("https://m.search.naver.com/search.naver?query=" + 날씨 + " 날씨");
      data = data.replace(/<[^>]+>/g, "");
      data = data.split("현재")[1];
      data = data.split("시간별")[0];
      data = data.trim().replace(/\n/g, "            ");
      data = data.replace(/(    ){1,}/g, "");
      data = data.split(" ");
      replier.reply(날씨 + "의 날씨\n" +
        "온도" + ": " + data[0].substr(2) + "(" + data[2] + " " + data[3] + " " + data[4] + ")" +
        "\n" + data[6] +
        "\n" + "체감온도" + ": " + data[9] +
        "\n" + "습도" + ": " + data[11] +
        "\n" + data[12] + "(" + data[13] + ")" +
        "\n" + "미세먼지" + ": " + data[17] +
        "\n" + data[18] + ": " + data[19] +
        "\n" + "자외선" + ": " + data[21]
      );
    } else {
      replier.reply("🔹약관 미동의\n" + Lw + "[" + sender + "]" + ' 야, 약관 동의를 하지않았어. \n약관 동의는 "!약관" 을 입력해줘');
    }
  }
}