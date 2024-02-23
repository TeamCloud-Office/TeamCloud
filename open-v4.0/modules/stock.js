/*
제작자: hello(TeamCloud)
라이선스: 없음(TeamCloud 라이선스: CCL BY-SA 2.0)
*/

let {
    prefix,
    User,
    Coin
} = require("A")

(function () {

    function toFixed(number) {
        return (~~(number * 1e4) / 1e4)
    }

    let open = [9, 15]; //장 여는 시간

    let path1 = "sdcard/BotData/assess.json";
    let path2 = "sdcard/BotData/admin/UseData.json";

    let company = {
        // "이름" : [가격:Number,  판매가능유무:Boolean[unfinished],  분류:Number[0:IT, 1:보건(건강), 2:환경, 3:엔터테이먼트],  type:Number[]  ,  arr:Object[] ]

        "TC반도체": [740, true, 0, "", 0, []],
        //TeamCloud 반도체 - 반도체 주식회사(IT)
        "For health": [500, true, 1, "", 0, []],
        //For health - 건강 주식회사(보건)
        "EP": [530, true, 2, "", 0, []],
        //Environmental Protection - 환경보호 주식회사(환경)
        "CBE": [700, true, 3, "", 0, []],
        //Cherry Blossom Entertainment - 벚꽃엔터 주식회사(엔터)
    }

    let assess = [
        [ //IT
            ["신규 기능 출시로 기대감 상승", "차세대 기술 도입으로 경쟁우위", "긍정적인 인터뷰로 신뢰 회복", "사용자 경험 개선에 긍정적인 피드백", "글로벌 시장에서 호조를 보이는 추세", "혁신적인 마케팅 전략으로 주목받음", "파트너십 강화로 사업 다각화", "환경 친화적 제품 출시로 호감도 상승", "효율적인 비즈니스 프로세스 구축", "사내 인재 발굴 및 육성으로 업무 성과 향상", "새로운 비즈니스 모델 도입으로 수익성 향상", "고객 중심의 서비스 개선", "글로벌 경제 여건에 대한 대응력 강화", "지속 가능한 경영으로 사회적 기업 이미지 강화", "신뢰성 높은 보안 시스템 도입", "사용자 데이터 보호 강화로 신뢰 회복"],
            ["서비스 장애로 불만족 증가", "보안 취약점으로 우려 상승", "경영진 변동에 불안감 표출", "고객 서비스 품질 하락으로 불신 증가", "사용자 데이터 유출 사건으로 신뢰 손상", "소송 발생으로 리스크 증가", "금융 위기로 인한 영향 커짐", "품질 관리 미흡으로 불량률 상승", "전략적 파트너십 해지로 영업 손실", "책임 회피 발언으로 인한 브랜드 이미지 하락", "비즈니스 모델 쇠퇴로 수익 감소", "기술 문제로 제품 불만족이 급증", "종업원 파업으로 인한 생산 차질", "관련 법규 위반으로 인한 소송 발생", "경영진 갈등으로 회사 내부 불안"],
            ["예측불가능한 사건으로 인한 영향 파악 어려움", "글로벌 이슈에 대한 대응 부재", "신기술 도입으로 미래 전망 긍정적", "경영진의 투명성 부족으로 신뢰 감소", "코로나19 대유행으로 인한 경영 난관", "비용 증가에 따른 수익 감소", "지속적인 연구 및 개발 부재로 혁신성 부족", "전략적 비전 부재로 사업 방향성 불분명", "글로벌 경제 불안으로 인한 영향", "핵심 임직원 이탈로 조직 안정성 저하", "자원 확보 어려움으로 인한 생산 차질", "기술력 미흡으로 시장 경쟁력 하락", "기업 내부 정보 유출에 대한 우려", "사회적 책임에 대한 불만이 커지는 추세"]
        ],
        [ //보건(건강)
            ["새로운 치료법 개발로 기대감 상승", "건강식품 수요 증가에 따른 성장", "환자 경험 개선으로 긍정적 평가", "의료 기술 혁신으로 인한 업계 선도", "글로벌 건강 트렌드에 부응하여 성과 향상", "환자 중심의 의료 서비스로 신뢰 회복", "생활습관 개선 프로그램으로 긍정적 평가", "건강 관리 솔루션으로 소비자 만족도 상승", "지속 가능한 건강 제품 개발로 호감도 상승", "의료 서비스 접근성 개선으로 긍정적 평가", "긴급 상황 대비를 위한 응급 의료 솔루션 개발", "건강 캠페인 및 교육으로 사회 기여 강화", "지역사회 건강 증진 프로젝트로 긍정적 평가", "협력 기관과의 파트너십 강화로 사업 다각화", "감염 예방을 위한 새로운 의약품 개발", "자연 속에 치유를 찾는 치유 여행 프로그램"],
            ["서비스 장애로 불만족 증가", "보안 취약점으로 우려 상승", "경영진 변동에 불안감 표출", "고객 서비스 품질 하락으로 불신 증가", "사용자 데이터 유출 사건으로 신뢰 손상", "소송 발생으로 리스크 증가", "금융 위기로 인한 영향 커짐", "품질 관리 미흡으로 불량률 상승", "전략적 파트너십 해지로 영업 손실", "책임 회피 발언으로 인한 브랜드 이미지 하락", "비즈니스 모델 쇠퇴로 수익 감소", "기술 문제로 제품 불만족이 급증", "종업원 파업으로 인한 생산 차질", "관련 법규 위반으로 인한 소송 발생", "경영진 갈등으로 회사 내부 불안"],
            ["예측불가능한 사건으로 인한 영향 파악 어려움", "글로벌 이슈에 대한 대응 부재", "신기술 도입으로 미래 전망 긍정적", "환경 변화에 대한 대비 부족으로 리스크 상승", "경영진의 투명성 부족으로 신뢰 감소", "코로나19 대유행으로 인한 경영 난관", "비용 증가에 따른 수익 감소", "지속적인 연구 및 개발 부재로 혁신성 부족", "전략적 비전 부재로 사업 방향성 불분명", "글로벌 경제 불안으로 인한 영향", "핵심 임직원 이탈로 조직 안정성 저하", "자원 확보 어려움으로 인한 생산 차질", "기술력 미흡으로 시장 경쟁력 하락", "기업 내부 정보 유출에 대한 우려", "사회적 책임에 대한 불만이 커지는 추세"]
        ],
        [ //환경
            ["신재생 에너지 투자진행", "환경 보호 정책의 긍정적 영향", "친환경 제품 수요 증가", "친환경 인프라 사업", "환경 혁신 기술 개발", "환경 산업 지속적인 성장", "탄소 배출 감소에 따른 긍정적 평가", "친환경 투자의 긍정적 영향", "환경 산업 리더십 인정", "지속 가능한 경영에 대한 긍정적 평가", "환경 기술 혁신", "환경 친화적 제품 라인업", "환경 규제 대응", "환경 책임 경영에 대한 긍정적 평가", "환경 산업 성과에 대한 긍정적 전망", "지속 가능한 비즈니스 전략"],
            ["환경 규제 변화", "친환경 투자 기대에 못미침", "환경 산업 경쟁 심화", "환경 문제로 인한 사회적 불신", "환경 투자 부진", "환경 산업 부정적 전망", "탄소 배출 감소 어려움", "환경 보호 정책 불확실성", "환경 변화에 대한 기업 대응 부재", "환경 산업 기술적 한계", "환경 인프라 사업 어려움", "환경 투자 수익 미달", "환경 산업 성과 부진", "환경 친화적 제품 수요 부진", "지속 가능한 경영 실패", "환경 기술 혁신 부재"],
            ["예측불가능한 환경 변화", "글로벌 환경 이슈에 대한 대응 부재", "신기술 도입으로 미래 전망 알수없음", "환경 변화에 대한 대비 부족으로 리스크 상승", "경영진의 투명성 부족으로 신뢰 감소", "코로나19 대유행으로 인한 경영 난관", "환경 비용 증가에 따른 수익 감소", "지속적인 연구 및 개발 부재로 혁신성 부족", "환경 전략 부재로 사업 방향성 불분명", "글로벌 경제 불안으로 인한 영향", "핵심 임직원 이탈로 조직 안정성 저하", "자원 확보 어려움으로 인한 생산 차질", "기술력 미흡으로 시장 경쟁력 하락", "환경 기업 내부 정보 유출에 대한 우려", "사회적 책임에 대한 불만이 커지는 추세"]
        ],
        [ //엔터테이먼트
            ["최신 인기 콘텐츠 진행", "글로벌 엔터테인먼트 시장 선도적 역할", "창의적인 콘텐츠 기획", "다양한 협업 및 파트너십", "독창적인 콘텐츠 생산", "엔터테인먼트 기술 혁신", "글로벌 엔터테인먼트 트렌드를 반영", "수요 증가에 따른 수익 상승", "사용자 경험 중심 서비스", "글로벌 팬덤 확대", "새로운 엔터테인먼트 플랫폼 도입", "엔터테인먼트 기술 혁신", "차별화된 콘텐츠 전략", "글로벌 시장 공략"],
            ["글로벌 엔터테인먼트 경쟁 심화", "콘텐츠 부진", "글로벌 엔터테인먼트 시장 불확실성", "엔터테인먼트 기술 경쟁 치열", "판권 문제로 수익 부진", "콘텐츠 기획 실패", "수익 하락", "엔터테인먼트 기술 부재", "글로벌 엔터테인먼트 트렌드 미흡", "시장 경쟁 악화", "수요 부진으로 수익 하락", "경영진 변동", "엔터테인먼트 기술 부재", "급격한 시장 변화", "글로벌 경제 불안", "수익성 하락"],
            ["글로벌 엔터테인먼트 이슈에 대한 대응 부재", "엔터테인먼트 기술 혁신", "경영진의 투명성 부족으로 신뢰 감소", "코로나19 대유행으로 인한 경영 난관", "경영 전략 부재", "지속적인 연구 및 개발 부재로 혁신성 부족", "글로벌 엔터테인먼트 전략 부재", "글로벌 경제 불안으로 인한 영향", "핵심 임직원 이탈로 조직 안정성 저하", "자원 확보 어려움으로 인한 생산 차질", "기술력 미흡으로 시장 경쟁력 하락", "엔터테인먼트 기업 내부 정보 유출에 대한 우려", "사회적 책임에 대한 불만이 커지는 추세"]
        ]
    ];
 

    /*
    저작자: 몽둥2
    원본: https://cafe.naver.com/nameyee/44010
    라이선스: 없음
    */
    function json_reply(data) {
        let result = "";
        if (typeof data !== "object") {
            throw new Error("타입이 올바르지 않습니다 / " + typeof data + " !== object");
        } else {
            if (Array.isArray(data)) {
                throw new Error("Json 값이 아닙니다");
            } else {
                if (Object.keys(data).length == 0) {
                    return "";
                } else {
                    for (let key in data) {
                        result += key + "\n";
                        if (typeof data[key] !== "object") {
                            result += data[key];
                        } else if (Array.isArray(data[key])) {
                            result += data[key].join(" , ");
                        } else {
                            result += json_reply(data[key]);
                        }
                        result += "\n\n";
                    }
                    return result.trim(); // 마지막에 있는 \n\n 삭제
                }
            }
        }
    }


    /**
     * 
     * @param {function} call 
     * @param {number} delay 
     * @returns 
     */
    function setTimeout2 (call, delay) {
        if ((typeof call == "function" && typeof delay == "number") && delay > 0) {
            var timer = java.util.Timer();
            var timerTask = java.util.TimerTask({
                run: function () {
                    call()
                }
            });
            timer.schedule(timerTask, delay)
            return true;
        } else {
            return "something is wrong";
        }
    }

    /**
     * @param {Object} arr array
     * @returns 
     */
    function array_random(arr) {
        let a = Math.floor(Math.random() * arr.length);
        return [arr[a], a];
    }

    /**
     * 장이 열렸는지 확인
     * @param {number} hours hour
     * @returns {boolean}
     */
    function isOpen (hours) {
        if (hours == undefined) {
            hours = Number(new Date().getHours());
        }
        if (open[0] <= hours && (open[1] - 1) >= hours) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 장이 열리는시각까지의 시간(ms)
     */
    /**
     * 
     * @param {Number} d 
     * @returns 
     */
    function get_delay(d) {
        if (d == undefined) d = open[0];
        let time = new Date();
        let delay = 0;
        delay -= time.getTime();
        if (time.getHours() < d) {
            time.setHours(0, 0, 0, 0);
            delay += time.getTime() + (1000 * 60 * 60 * d);
        } else if (time.getHours() > open[1]) {
            time.setHours(24, 0, 0, 0);
            delay += time.getTime() + (1000 * 60 * 60 * d);
        } else {
            delay = 0; // delay += time.getTIme()
        }
        return delay;
    }

    /**
     * 가격변동
     * @param {number} delay delay
     */
    function price (delay) {
        result = JSON.parse(FileStream.read(path1)).date;
        setTimeout2(() => {
            let hh = setInterval(() => {
                if (!Api.isOn(scriptName)) {
                    Log.d("봇전원이 꺼져있어 자동으로 해제합니다")
                    clearInterval(hh);
                } else if (new Date().getHours() !== open[1] || result !== new Date().toLocaleDateString()) {
                    price(get_delay());
                    clearInterval();
                } else {
                    setTimeout2(() => {
                        for (let i = 0; i <= Object.keys(company).lengtth - 1; i++) {
                            if (company[Object.keys(company)[i]][4] == 2) {
                                company[Object.keys(company)[i]][0] = company[Object.keys(company)[i]][0] + Math.floor(Math.random() * 10000) - 5000;
                            }
                            if (company[Object.keys(company)[i]][4] == 0) {
                                if (Math.random() > 0.4) { //60%
                                    company[Object.keys(company)[i]][0] = company[Object.keys(company)[i]][0] + Math.floor(Math.random() * 10000);
                                } else if (Math.random() > 0.4) { //24%
                                    company[Object.keys(company)[i]][0] = company[Object.keys(company)[i]][0] - Math.floor(Math.random() * 10000);
                                } else { //16%
                                    //가격유지
                                }
                            } else if (company[Object.keys(company)[i]][4] == 1) {
                                if (Math.random() > 0.4) { //60%
                                    company[Object.keys(company)[i]][0] = company[Object.keys(company)[i]][0] - Math.floor(Math.random() * 10000);
                                } else if (Math.random() > 0.4) { //24%
                                    company[Object.keys(company)[i]][0] = company[Object.keys(company)[i]][0] + Math.floor(Math.random() * 10000);
                                } else { //16%
                                    //가격유지
                                }
                            }
                        }
                    }, 1000 * 60 * 5);
                }
            });
        }, delay);
    }

    /**
     * @param {string} name 기업명
     * @param {number} number 갯수
     * @param {string} sender
     * @param {number|boolean} type1 구매 판매 구분
     * @param {number|boolean} type2 예약 유무
     * @returns {string} 결과
     * @etc1 type1 이 0 일때 구매 / 판매
     * @etc2 type2이 0일때 즉시처리 / 1일때 예약처리
     */
    function process (name, number, sender, type1, type2) {
        let data = User.edit(sender)
        number = Number(number)
        if (name == undefined || number == undefined) {
            return "형식을 확인해주세요";
        } else {
            if (!Object.keys(company).includes(name)) {
                return "존재하지 않는 기업명입니다";
            } else {
                if (data["stocks"][name] == undefined || typeof data["stocks"][name] == "string") {
                    data["stocks"][name] = 0
                }
                if (number <= 0.000099999999999999998) {
                    return "0.0001주 이상만 구매및 판매가 가능합니다";
                } else if (isNaN(number)) {
                    return "형식을 다시 확인해주세요"
                } else if (number.length > 6) {
                    return "소수점 4자리까지만 구매및 판매가 가능합니다";
                } else if (type1) {
                    if (company[name][0] * number > data["coin"]) {
                        return "잔액이 부족합니다";
                    } else if (type2) {
                        data["coin"] = toFixed(data["coin"] - company[name][0] * number);
                        data["stocks"][name] = toFixed(data["stocks"][name] + number)
                        if (!company[name][5].includes(sender)) {
                            company[name][5].push(sender)
                        }
                        return "구매가 완료되었습니다";
                    } else {
                        setTimeout2(() => {
                            if (company[name][0] * number > data["coin"]) {
                            } else {
                                data["coin"] = toFixed(data["coin"] - company[name][0] * number);
                                data["stocks"][name] = toFixed(data["stocks"][name] + number);
                                if (!company[name][5].includes(sender)) {
                                    company[name][5].push(sender);
                                }
                            }
                        }, get_delay());
                        User.save()
                        return "구매신청이 완료되었습니다";
                    }
                } else {
                    if (number > data["stocks"][name]) {
                        return "보유중인 주식이 부족합니다";
                    } else if (type2) {
                        data["stocks"][name] = Number((data["stocks"][name] - number).toFixed(4));
                        data["coin"] = Number((data["coin"] + company[name][0] * number).toFixed(4));
                        if (data["stocks"][name] == 0) {
                            company[name][5].splice(company[name][5].indexOf(sender), 1);
                        }
                        User.save()
                        return "판매가 완료되었습니다";
                    } else {
                        setTimeout2(() => {
                            data["stocks"][name] = Number((data["stocks"][name] - number).toFixed(4));
                            data["coin"] = Number((data["coin"] + company[name][0] * number).toFixed(4));
                            if (data["stocks"][name] == 0) {
                                company[name][5].splice(company[name][5].indexOf(sender), 1);
                            }
                        }, get_delay());
                        User.save()
                        return "판매신청이 완료되었습니다";
                    }
                }
            }
        }
    }

    let result = FileStream.read(path1);
    if (result == null) {
        FileStream.write(path1, JSON.stringify({
            "date": "00000000"
        }));
    }


    if (JSON.parse(result).date !== new Date().toLocaleDateString()) {
        result = JSON.parse(result);
        result.date = new Date().toLocaleDateString();
        for (let i = 0; i <= Object.keys(company).length - 1; i++) {
            let random = array_random(assess[company[Object.keys(company)[i]][2]]);
            company[Object.keys(company)[i]][3] = array_random(random[0])[0];
            company[Object.keys(company)[i]][4] = random[1];
            //0 - 상승위주 / 1 - 하락위주 / 2 - 랜덤
        }
        result["company"] = company
        FileStream.write(path1, JSON.stringify(result));
    } else {
        company = JSON.parse(result)["company"]
    }




    module.exports = {
        company: company,
        toFixed: toFixed,
        open: open,
        json_reply: json_reply,
        setTimeout2: setTimeout2,
        array_random: array_random,
        isOpen: isOpen,
        get_delay: get_delay,
        price: price,
        process: process,
        path1: path1,
        path2: path2,
        assess: assess
    }



})() 