const FIREBASE_VERSION = "12.15.0";
const STORAGE_KEY = "tohoku-2026-resources-v1";
const ITINERARY_STORAGE_KEY = "tohoku-2026-itinerary-items-v1";
const BOARD_ID = window.TRIP_BOARD_ID || "tohoku-2026";

const categories = [
  { id: "ski", name: "滑雪", icon: "△", color: "#5B8FF9" },
  { id: "stay", name: "住宿", icon: "▱", color: "#9B72CF" },
  { id: "spot", name: "景點", icon: "⌖", color: "#30B0C7" },
  { id: "food", name: "美食", icon: "♨", color: "#FF9F0A" },
  { id: "transport", name: "交通", icon: "↝", color: "#34C759" },
  { id: "other", name: "其他", icon: "↗", color: "#8E8E93" },
];

const itinerary = [
  {
    date:"12/19",day:"六",city:"台北 → 山形",title:"JX862 抵達仙台，轉 JR 到山形",detail:"TPE T1 起飛，抵達 SDJ 後經仙台站轉仙山線。",stay:"山形 · 住宿未定",tone:"air",notice:"JX862 目前參考 11:40–16:00；請以電子機票為準。",
    schedule:[
      { time:"08:40–10:40",kind:"報到",title:"桃園機場 T1 報到",place:"桃園國際機場第一航廈",detail:"星宇國際線建議保留充足報到與安檢時間。",price:"依機票",official:"https://www.taoyuan-airport.com/",nav:mapsRoute("目前位置","桃園國際機場第一航廈"),status:"current" },
      { time:"11:40–16:00",kind:"航班",title:"JX862 台北 → 仙台",place:"仙台國際機場",detail:"目前公開班型參考；實際起降時間以星宇訂位單為準。",price:"已購機票",official:"https://www.starlux-airlines.com/en-TH/timetable",nav:mapsRoute("桃園國際機場第一航廈","仙台國際機場"),status:"pending" },
      { time:"17:00 後",kind:"鐵路",title:"仙台空港 Access Line → 仙台站",place:"JR 仙台站",detail:"入境與領行李後再選班次；車程約 25 分鐘。",price:"紙票 ¥680／IC ¥672",official:"https://www.senat.co.jp/en/sendaiair",nav:mapsRoute("仙台空港","仙台駅"),status:"current" },
      { time:"傍晚",kind:"鐵路",title:"JR 仙山線前往山形",place:"JR 山形站",detail:"仙台轉車前往山形約 90 分鐘；12 月確切班次近行程再鎖定。",price:"紙票 ¥1,230",official:"https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1600",nav:mapsRoute("仙台駅","山形駅"),status:"pending" },
      { time:"抵達後",kind:"住宿",title:"山形站附近入住",place:"JR 山形站",detail:"住宿未定；優先選東口或西口步行 5–8 分鐘內，隔天首班巴士較輕鬆。",price:"住宿未定",nav:mapsRoute("山形駅","山形駅"),status:"pending" },
    ],
  },
  {
    date:"12/20",day:"日",city:"山形 → 藏王溫泉",title:"第一班巴士上山、租雪具與看山頂",detail:"首班上藏王，先準備雪具、雪票，再依天候搭纜車上山。",stay:"蔵王温泉 岩清水料理の宿 季の里 ①",tone:"snow",notice:"12 月仍屬初雪季；部分雪道或纜車可能未全開。",
    schedule:[
      { time:"06:25",kind:"集合",title:"山形站前 1 號站牌排隊",place:"山形駅前バスのりば 1番",detail:"官方提醒熱門時段提早約 20 分鐘排隊；巴士不可預約、滿座即止。",price:"準備現金／交通卡",official:"https://travel.yamagatakotsu.jp/zh-tw/timetable/routebus-yamagata-zaoline.html",nav:mapsRoute("山形駅","山形駅前バスのりば 1番"),status:"current" },
      { time:"06:50–07:26",kind:"巴士",title:"山形站 → 藏王溫泉",place:"蔵王温泉バスターミナル",detail:"目前首班時刻；2026 冬季班表出發前再確認。",price:"成人單程 ¥1,200",official:"https://travel.yamagatakotsu.jp/zh-tw/timetable/routebus-yamagata-zaoline.html",nav:mapsRoute("山形駅","蔵王温泉バスターミナル"),status:"pending" },
      { time:"07:35–08:20",kind:"住宿",title:"季之里寄放行李",place:"蔵王温泉 岩清水料理の宿 季の里",detail:"可先聯絡旅館安排巴士總站接送；正式入住依旅館規定。",price:"已預訂／依訂單",official:"https://www.zao-kinosato.co.jp/",nav:mapsRoute("蔵王温泉バスターミナル","岩清水料理の宿 季の里"),status:"confirmed" },
      { time:"08:30–10:00",kind:"滑雪",title:"租雪具、試穿與購買雪票",place:"蔵王ロープウェイ 蔵王山麓駅",detail:"2026/27 雪票尚未公布；租借完成後先把隔天教練集合點走一次。",price:"雪票上一季：1 日 ¥7,500；雪具 1 日 ¥6,000 起",official:"https://zaomountainresort.com/chrage/",ticket:"https://www.zaoropeway.co.jp/winter/rental.php",nav:mapsRoute("岩清水料理の宿 季の里","蔵王ロープウェイ 蔵王山麓駅"),status:"pending" },
      { time:"10:15–12:15",kind:"景觀",title:"藏王纜車前往地藏山頂",place:"蔵王ロープウェイ 地蔵山頂駅",detail:"依風速與能見度決定；上山末班目前為 16:00。",price:"成人往返 ¥4,400",official:"https://www.zaoropeway.co.jp/winter/guide.php",nav:mapsRoute("蔵王ロープウェイ 蔵王山麓駅","蔵王ロープウェイ 地蔵山頂駅"),status:"current" },
      { time:"12:30–14:30",kind:"散步",title:"藏王溫泉街、午餐與湯巡",place:"蔵王温泉街",detail:"先熟悉巴士站、超商、餐廳與隔天前往雪場動線。",price:"餐飲／入浴依店家",official:"https://zao-spa.or.jp/taiwan/",nav:mapsRoute("蔵王ロープウェイ 蔵王山麓駅","蔵王温泉街"),status:"current" },
      { time:"15:00 後",kind:"住宿",title:"季之里入住、晚餐與溫泉",place:"蔵王温泉 岩清水料理の宿 季の里",detail:"把雪具與隔天教練集合資訊先整理好。",price:"依住宿方案",official:"https://www.zao-kinosato.co.jp/",nav:mapsRoute("蔵王温泉街","岩清水料理の宿 季の里"),status:"confirmed" },
    ],
  },
  {
    date:"12/21",day:"一",city:"藏王溫泉",title:"滑雪教練課 Day 1",detail:"完整初學者課程，先建立煞車、轉彎與纜車乘坐基礎。",stay:"蔵王温泉 岩清水料理の宿 季の里 ②",tone:"snow",notice:"教練學校、語言與集合點尚待訂妥。",
    schedule:[
      { time:"07:00–08:15",kind:"準備",title:"早餐、著裝與雪具檢查",place:"蔵王温泉 岩清水料理の宿 季の里",detail:"帶雪票、手套、護目鏡、防曬與暖暖包。",price:"依住宿方案",official:"https://www.zao-kinosato.co.jp/",nav:mapsRoute("岩清水料理の宿 季の里","蔵王温泉スキー場"),status:"confirmed" },
      { time:"08:30",kind:"集合",title:"與滑雪教練會合",place:"蔵王温泉スキー場",detail:"實際學校與集合點確認後，可用「自己加一筆」補上。",price:"教練費待預訂",official:"https://www.zao-spa.or.jp/taiwan/ski/",nav:mapsRoute("岩清水料理の宿 季の里","蔵王温泉スキー場"),status:"pending" },
      { time:"09:00–12:00",kind:"課程",title:"上午滑雪課",place:"蔵王温泉スキー場",detail:"初學者基本站姿、煞車與安全規則。",price:"依教練方案",official:"https://zaomountainresort.com/ski/",nav:mapsRoute("蔵王温泉スキー場","蔵王温泉スキー場"),status:"pending" },
      { time:"13:00–15:30",kind:"課程",title:"下午滑雪課",place:"蔵王温泉スキー場",detail:"依教練評估練習轉彎與搭乘纜車。",price:"依教練方案",official:"https://zaomountainresort.com/ski/",nav:mapsRoute("蔵王温泉スキー場","蔵王温泉スキー場"),status:"pending" },
      { time:"16:30 後",kind:"休息",title:"回季之里泡湯與晚餐",place:"蔵王温泉 岩清水料理の宿 季の里",detail:"晾乾手套、襪子與雪衣，確認隔日下山行李。",price:"依住宿方案",official:"https://www.zao-kinosato.co.jp/",nav:mapsRoute("蔵王温泉スキー場","岩清水料理の宿 季の里"),status:"confirmed" },
    ],
  },
  {
    date:"12/22",day:"二",city:"藏王 → 仙台",title:"滑雪教練課 Day 2，傍晚下山",detail:"第二天課程提早結束，預留取行李與前往仙台的時間。",stay:"仙台 · 住宿未定",tone:"snow",notice:"2026/27 藏王直達仙台巴士尚未公布；頁面同時保留山形轉乘備案。",
    schedule:[
      { time:"07:30–08:30",kind:"住宿",title:"退房並寄放行李",place:"蔵王温泉 岩清水料理の宿 季の里",detail:"與旅館確認下午取行李及前往巴士站方式。",price:"退房時間依旅館",official:"https://www.zao-kinosato.co.jp/",nav:mapsRoute("岩清水料理の宿 季の里","蔵王温泉スキー場"),status:"confirmed" },
      { time:"09:00–14:20",kind:"課程",title:"第二天滑雪教練課",place:"蔵王温泉スキー場",detail:"預約時先說明需要在 14:20 前結束，才有下山緩衝。",price:"依教練方案",official:"https://www.zao-spa.or.jp/taiwan/ski/",nav:mapsRoute("岩清水料理の宿 季の里","蔵王温泉スキー場"),status:"pending" },
      { time:"15:30–16:55",kind:"首選交通",title:"冬季直達巴士：藏王 → 仙台",place:"JR 仙台站東口",detail:"上一季有此班次、需預約；2026/27 尚未公布，不可先視為確定。",price:"上一季成人 ¥2,500",official:"https://zaomountainresort.com/parking/",nav:mapsRoute("蔵王温泉バスターミナル","仙台駅東口"),status:"pending" },
      { time:"16:20 起",kind:"交通備案",title:"藏王 → 山形 → 仙台",place:"JR 仙台站",detail:"若直達車未開：山交巴士到山形，再轉山形—仙台高速巴士或 JR。",price:"巴士轉乘約 ¥2,300",official:"https://travel.yamagatakotsu.jp/zh-tw/timetable/ys.php",nav:mapsRoute("蔵王温泉バスターミナル","仙台駅"),status:"current" },
      { time:"抵達後",kind:"住宿",title:"仙台站附近入住",place:"JR 仙台站",detail:"住宿未定；建議東口或西口步行 8 分鐘內。",price:"住宿未定",official:"https://www.sentabi.jp/",nav:mapsRoute("仙台駅","仙台駅"),status:"pending" },
    ],
  },
  {
    date:"12/23",day:"三",city:"仙台 → 青森",title:"新幹線北上，開始青森市散步",detail:"Hayabusa 到新青森，轉奧羽本線到青森站。",stay:"青森 · 住宿未定 ①",tone:"north",notice:"Hayabusa 全車指定席，12/23 車票約 11/23 10:00 JST 開賣。",
    schedule:[
      { time:"08:00 左右",kind:"新幹線",title:"仙台 → 新青森",place:"JR 新青森站",detail:"確切車次待 2026/12 班表；抵達後轉一站到青森。",price:"Hayabusa e-ticket 約 ¥11,240",official:"https://www.eki-net.com/top/e-ticket/",nav:mapsRoute("仙台駅","新青森駅"),status:"pending" },
      { time:"11:00 左右",kind:"轉車",title:"新青森 → 青森",place:"JR 青森站",detail:"奧羽本線一站，記得新幹線不是停青森站。",price:"紙票 ¥200／IC ¥199",official:"https://www.jreast.co.jp/estation/station/info.aspx?StationCd=25",nav:mapsRoute("新青森駅","青森駅"),status:"current" },
      { time:"12:00–13:15",kind:"午餐",title:"古川市場吃のっけ丼",place:"青森魚菜センター",detail:"先買餐券，再向各攤挑海鮮組成丼飯。",price:"依餐券組合",official:"https://nokkedon.jp/",nav:mapsRoute("青森駅","青森魚菜センター"),status:"current" },
      { time:"13:30–15:00",kind:"景點",title:"睡魔之家 WA RASSE",place:"ねぶたの家 ワ・ラッセ",detail:"冬季 9:00–18:00；12/23 原則開館。",price:"成人 ¥620",official:"https://www.nebuta.jp/warasse/shisetsu/business-day.html",ticket:"https://www.nebuta.jp/warasse/shisetsu/pay.html",nav:mapsRoute("青森魚菜センター","ねぶたの家 ワ・ラッセ"),status:"current" },
      { time:"15:10–16:30",kind:"散步",title:"A-FACTORY 與青森灣",place:"A-FACTORY",detail:"蘋果甜點、伴手禮與海灣步道；免費入場。",price:"免費／購物自理",official:"https://www.jre-abc.com/wp/afactory/",nav:mapsRoute("ねぶたの家 ワ・ラッセ","A-FACTORY"),status:"current" },
      { time:"17:00 後",kind:"住宿",title:"青森站附近入住",place:"JR 青森站",detail:"住宿未定；同一間連住三晚最省力。",price:"住宿未定",nav:mapsRoute("A-FACTORY","青森駅"),status:"pending" },
    ],
  },
  {
    date:"12/24",day:"四",city:"青森 ⇄ 八戶",title:"八戶海鮮一日，晚上回青森",detail:"陸奧湊吃海鮮、八食中心採買；館鼻岸壁朝市週四不營業。",stay:"青森 · 住宿未定 ②",tone:"north",notice:"12/24 館鼻岸壁朝市沒有開；已改排陸奧湊與八食中心。",
    schedule:[
      { time:"06:20 左右",kind:"鐵路",title:"青森 → 八戶",place:"JR 八戶站",detail:"使用青い森鐵道外國旅客一日券較划算；確切早班近行程再查。",price:"一日券成人 ¥2,270",official:"https://aoimorirailway.com/lang_en/ticket_list/aoimori-tourist-pass-one-day-pass-for-foreign-visitors/",nav:mapsRoute("青森駅","八戸駅"),status:"current" },
      { time:"08:15–10:00",kind:"市場",title:"陸奧湊站前朝市",place:"陸奥湊駅前朝市",detail:"平日早晨吃刺身、烤魚與市場早餐；個別店家營業不同。",price:"依店家",official:"https://visithachinohe.com/stories/mutsuminato/",nav:mapsRoute("八戸駅","陸奥湊駅前朝市"),status:"current" },
      { time:"10:45–14:15",kind:"海鮮",title:"八食中心",place:"八食センター",detail:"12/24 週四原則開；市場 9:00–18:00，巴士費另計。",price:"免費入場／餐飲自理",official:"https://849net.com/guide/outline.html",nav:mapsRoute("陸奥湊駅前朝市","八食センター"),status:"current" },
      { time:"15:30–17:30",kind:"鐵路",title:"八戶 → 青森",place:"JR 青森站",detail:"回青森續住，避免搬行李。",price:"已含青い森一日券",official:"https://aoimorirailway.com/時刻表",nav:mapsRoute("八食センター","青森駅"),status:"current" },
      { time:"晚上",kind:"住宿",title:"青森連住",place:"JR 青森站",detail:"整理隔天弘前行李，只帶小包出發。",price:"住宿未定",nav:mapsRoute("青森駅","青森駅"),status:"pending" },
    ],
  },
  {
    date:"12/25",day:"五",city:"青森 ⇄ 弘前",title:"弘前雪景城下町",detail:"弘前公園、睡魔村與蘋果甜點，晚上回青森。",stay:"青森 · 住宿未定 ③",tone:"north",notice:"弘前城天守冬季不開放；公園付費區冬季免費。",
    schedule:[
      { time:"08:15–09:00",kind:"鐵路",title:"青森 → 弘前",place:"JR 弘前站",detail:"JR 奧羽本線普通車約 40–45 分鐘。",price:"單程 ¥720",official:"https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1344",nav:mapsRoute("青森駅","弘前駅"),status:"current" },
      { time:"09:30–11:15",kind:"景點",title:"弘前公園雪景散步",place:"弘前公園",detail:"冬季可逛公園與城跡；天守內部不開放。",price:"冬季公園免費",official:"https://www.city.hirosaki.aomori.jp/gaiyou/shisetsu/park/2015-0217-1525-48.html",nav:mapsRoute("弘前駅","弘前公園"),status:"current" },
      { time:"11:20–13:00",kind:"文化",title:"津輕藩睡魔村",place:"津軽藩ねぷた村",detail:"12–3 月 9:00–17:00，官網列全年無休。",price:"票價依官網當期公告",official:"https://neputamura.com/",nav:mapsRoute("弘前公園","津軽藩ねぷた村"),status:"current" },
      { time:"13:15–16:00",kind:"散步",title:"弘前市區與蘋果派巡禮",place:"弘前市立観光館",detail:"以觀光館周邊、洋館街與開店中的甜點店彈性安排。",price:"餐飲自理",official:"https://www.hirosaki-kanko.or.jp/",nav:mapsRoute("津軽藩ねぷた村","弘前市立観光館"),status:"current" },
      { time:"16:30–17:15",kind:"鐵路",title:"弘前 → 青森",place:"JR 青森站",detail:"回青森續住。",price:"單程 ¥720",official:"https://www.jreast.co.jp/",nav:mapsRoute("弘前駅","青森駅"),status:"current" },
    ],
  },
  {
    date:"12/26",day:"六",city:"青森 → 秋田",title:"上午青森，午後搭 Resort 白神 4 號",detail:"青森 13:52 發，沿五能線到秋田 19:01。",stay:"秋田 · 住宿未定",tone:"west",notice:"白神 4 號 12/26 運轉與時刻已由 JR 東日本官方確認；全車指定席。",
    schedule:[
      { time:"09:00–10:30",kind:"散步",title:"青森灣晨間散步與補買伴手禮",place:"青森ベイブリッジ",detail:"保留輕行程，避免影響下午指定席列車。",price:"免費",official:"https://www.aptinet.jp/",nav:mapsRoute("青森駅","青森ベイブリッジ"),status:"current" },
      { time:"10:30–12:30",kind:"準備",title:"早午餐、取行李與車站採買",place:"JR 青森站",detail:"至少 30 分鐘前回到車站，準備車上飲食。",price:"餐飲自理",official:"https://www.jreast.co.jp/estation/station/info.aspx?StationCd=25",nav:mapsRoute("青森ベイブリッジ","青森駅"),status:"current" },
      { time:"13:52–19:01",kind:"觀光列車",title:"Resort 白神 4 號：青森 → 秋田",place:"JR 秋田站",detail:"2026/12/25–31 官方運轉；全車指定席，建議 11/26 10:00 JST 開賣即訂。",price:"總價參考約 ¥5,460（指定席 ¥840）",official:"https://www.jreast.co.jp/railway/joyful/shirakami.html",ticket:"https://www.eki-net.com/",nav:mapsRoute("青森駅","秋田駅"),status:"confirmed" },
      { time:"19:15 後",kind:"住宿",title:"秋田站附近入住",place:"JR 秋田站",detail:"住宿未定；優先站內或西口步行 5 分鐘內。",price:"住宿未定",nav:mapsRoute("秋田駅","秋田駅"),status:"pending" },
    ],
  },
  {
    date:"12/27",day:"日",city:"秋田 → 仙台",title:"秋田半日，傍晚新幹線到仙台",detail:"千秋公園、秋田縣立美術館，再搭 Komachi。",stay:"仙台 · 住宿未定 ①",tone:"west",notice:"秋田縣立美術館 12/27 官方日曆顯示開館；千秋公園御隅櫓冬季休館。",
    schedule:[
      { time:"09:00–10:15",kind:"戶外",title:"千秋公園與久保田城跡",place:"千秋公園",detail:"公園免費；御隅櫓 12/1–3/31 冬季休館，積雪結冰留意腳下。",price:"公園免費",official:"https://www.city.akita.lg.jp/kurashi/doro-koen/1003685/1007159/1007194.html",nav:mapsRoute("秋田駅","千秋公園"),status:"current" },
      { time:"10:30–12:00",kind:"美術",title:"秋田縣立美術館",place:"秋田県立美術館",detail:"10:00–18:00；官方 2026 年休館日未包含 12/27。",price:"常設成人 ¥310；特展另計",official:"https://www.akita-museum-of-art.jp/contents/contents_show.php?contents_id=71",nav:mapsRoute("千秋公園","秋田県立美術館"),status:"confirmed" },
      { time:"12:15–15:30",kind:"市區",title:"秋田站周邊午餐與採買",place:"秋田駅ビル トピコ",detail:"取行李前保留彈性，不安排離站太遠的館舍。",price:"餐飲／購物自理",official:"https://www.caoca.net/",nav:mapsRoute("秋田県立美術館","秋田駅ビル トピコ"),status:"current" },
      { time:"17:00 左右",kind:"新幹線",title:"Komachi：秋田 → 仙台",place:"JR 仙台站",detail:"全車指定席；12 月確切晚間車次近行程選定。",price:"e-ticket 成人約 ¥10,480",official:"https://www.eki-net.com/top/e-ticket/",nav:mapsRoute("秋田駅","仙台駅"),status:"pending" },
      { time:"抵達後",kind:"住宿",title:"仙台連住三晚",place:"JR 仙台站",detail:"住宿未定；12/27–30 同一間連住。",price:"住宿未定",official:"https://www.sentabi.jp/",nav:mapsRoute("仙台駅","仙台駅"),status:"pending" },
    ],
  },
  {
    date:"12/28",day:"一",city:"仙台 ⇄ 松島",title:"松島遊船與日本三景",detail:"遊船全年無休，搭配瑞巖寺、五大堂與海灣散步。",stay:"仙台 · 住宿未定 ②",tone:"sendai",notice:"遊船 12/28 原則運航，但強風或高浪仍可能臨時停航。",
    schedule:[
      { time:"08:15–09:00",kind:"鐵路",title:"仙台 → 松島海岸",place:"JR 松島海岸站",detail:"搭 JR 仙石線；確切班次近行程再選。",price:"JR 車資依當期運賃",official:"https://www.jreast.co.jp/",nav:mapsRoute("仙台駅","松島海岸駅"),status:"current" },
      { time:"09:00–09:50",kind:"遊船",title:"松島島巡り觀光船・仁王丸",place:"松島海岸観光桟橋",detail:"冬季原則 9:00–15:00 每小時一班，航程約 50 分鐘。",price:"成人 ¥1,500；二樓展望席另加 ¥600",official:"https://www.matsushima.or.jp/timesheet/",ticket:"https://www.matsushima.or.jp/",nav:mapsRoute("松島海岸駅","松島海岸観光桟橋"),status:"current" },
      { time:"10:10–11:20",kind:"寺院",title:"國寶・瑞巖寺",place:"瑞巌寺",detail:"冬季日落較早，上午參拜最穩。",price:"成人 ¥700",official:"https://zuiganji.or.jp/",nav:mapsRoute("松島海岸観光桟橋","瑞巌寺"),status:"current" },
      { time:"11:30–14:30",kind:"散步",title:"五大堂、海鮮午餐與海灣",place:"五大堂",detail:"依天候在戶外景點與商店街之間彈性切換。",price:"五大堂免費／餐飲自理",official:"https://www.matsushima-kanko.com/",nav:mapsRoute("瑞巌寺","五大堂"),status:"current" },
      { time:"15:30–16:30",kind:"鐵路",title:"松島海岸 → 仙台",place:"JR 仙台站",detail:"回仙台休息與晚餐。",price:"JR 車資依當期運賃",official:"https://www.jreast.co.jp/",nav:mapsRoute("松島海岸駅","仙台駅"),status:"current" },
    ],
  },
  {
    date:"12/29",day:"二",city:"仙台",title:"仙台城與城下町",detail:"仙台城跡戶外區、見聞館與青葉城展示館。",stay:"仙台 · 住宿未定 ③",tone:"sendai",notice:"仙台市博物館 12/28–31 官方休館，因此本日不排入。",
    schedule:[
      { time:"09:00–09:40",kind:"交通",title:"前往仙台城跡",place:"仙台城跡",detail:"可搭 Loople Sendai；年末班次近行程再查。",price:"巴士票價依當期公告",official:"https://loople-sendai.jp/",nav:mapsRoute("仙台駅","仙台城跡"),status:"pending" },
      { time:"09:45–11:00",kind:"城跡",title:"伊達政宗騎馬像與展望台",place:"仙台城跡 伊達政宗公騎馬像",detail:"戶外本丸跡 24 小時可進、免費。",price:"免費",official:"https://www.city.sendai.jp/shisekichosa/question.html",nav:mapsRoute("仙台駅","仙台城跡 伊達政宗公騎馬像"),status:"confirmed" },
      { time:"11:00–11:40",kind:"展館",title:"仙台城見聞館",place:"仙台城見聞館",detail:"9:00–17:00、全年無休，適合先理解城跡配置。",price:"免費",official:"https://www.city.sendai.jp/bunkazai-kanri/kennbunnkann.html",nav:mapsRoute("仙台城跡 伊達政宗公騎馬像","仙台城見聞館"),status:"confirmed" },
      { time:"11:45–12:40",kind:"展館",title:"青葉城資料展示館",place:"青葉城資料展示館",detail:"冬季 9:00–16:00；原則全年無休，仍可能臨時維修。",price:"成人 ¥770",official:"https://honmarukaikan.com/s/docs/tenji/",nav:mapsRoute("仙台城見聞館","青葉城資料展示館"),status:"current" },
      { time:"13:30–17:00",kind:"市區",title:"一番町、定禪寺通與仙台晚餐",place:"仙台一番町",detail:"百貨與餐廳年末營業時間依各店 12 月公告。",price:"餐飲／購物自理",official:"https://www.sentabi.jp/",nav:mapsRoute("青葉城資料展示館","仙台一番町"),status:"pending" },
    ],
  },
  {
    date:"12/30",day:"三",city:"仙台 → 東京・錦糸町",title:"仙台上午散步，下午新幹線進東京",detail:"年末最繁忙期搭 Hayabusa，轉 JR 到錦糸町入住。",stay:"SUKE HOMES KINSHICHO ①",tone:"tokyo",notice:"12/30 是 JR 最繁忙期；車票約 11/30 10:00 JST 開賣即訂指定席。",
    schedule:[
      { time:"09:00–10:15",kind:"市場",title:"仙台朝市早餐與最後採買",place:"仙台朝市",detail:"個別店家年末時段不同，現場以實際營業為準。",price:"餐飲自理",official:"https://sendaiasaichi.com/",nav:mapsRoute("仙台駅","仙台朝市"),status:"pending" },
      { time:"10:30–11:30",kind:"展望",title:"AER 展望テラス",place:"AER 展望テラス",detail:"免費眺望仙台市區；若年末臨時調整則改車站商場。",price:"免費",official:"https://www.sendai-aer.jp/",nav:mapsRoute("仙台朝市","AER 展望テラス"),status:"pending" },
      { time:"12:00–13:30",kind:"準備",title:"午餐、取行李與進站",place:"JR 仙台站",detail:"至少提早 30 分鐘到新幹線月台。",price:"餐飲自理",official:"https://www.jreast.co.jp/estation/station/info.aspx?StationCd=913",nav:mapsRoute("AER 展望テラス","仙台駅"),status:"current" },
      { time:"14:00 左右",kind:"新幹線",title:"Hayabusa：仙台 → 東京",place:"JR 東京站",detail:"12 月確切班次尚未公布；選午後直達指定席。",price:"最繁忙期 e-ticket 約 ¥11,830",official:"https://www.eki-net.com/top/e-ticket/",nav:mapsRoute("仙台駅","東京駅"),status:"pending" },
      { time:"抵京後",kind:"鐵路",title:"東京 → 錦糸町",place:"JR 錦糸町站",detail:"總武快速約 8 分鐘；新幹線 e-ticket 不含東京都區內在來線。",price:"約 ¥200",official:"https://www.jreast.co.jp/",nav:mapsRoute("東京駅","錦糸町駅"),status:"current" },
      { time:"16:00 後",kind:"住宿",title:"SUKE HOMES KINSHICHO 入住",place:"SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo",detail:"先把電子門鎖、房號與入住說明離線截圖保存。",price:"依訂單",official:"https://booking-sukehome-jp-kinshicho.smartorder.ai/",nav:mapsRoute("錦糸町駅","SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo"),status:"confirmed" },
      { time:"18:00",kind:"採買",title:"西友錦糸町店補貨",place:"西友 錦糸町店",detail:"先買 2–3 天早餐、飲水與簡單食物，降低元旦休店風險。",price:"平價超市",official:"https://www.seiyu.co.jp/shop/西友錦糸町店/",nav:mapsRoute("SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo","西友 錦糸町店"),status:"current" },
    ],
  },
  {
    date:"12/31",day:"四",city:"東京",title:"丸之內、銀座與東京年末",detail:"先逛提早打烊的百貨，再走戶外街區。",stay:"SUKE HOMES KINSHICHO ②",tone:"tokyo",notice:"2026/27 百貨年末時間尚未公布；12/31 多半提早打烊。",
    schedule:[
      { time:"09:30–11:30",kind:"百貨",title:"東京站・大丸與丸之內",place:"大丸東京店",detail:"以 2026 年 12 月公布時段為準；若休店就改逛東京車站街。",price:"購物自理",official:"https://www.daimaru.co.jp/tokyo/",nav:mapsRoute("錦糸町駅","大丸東京店"),status:"pending" },
      { time:"11:45–14:30",kind:"百貨",title:"銀座百貨與午餐",place:"銀座四丁目交差点",detail:"三越、松屋、GINZA SIX 擇有開者；避免排到傍晚才去。",price:"購物／餐飲自理",official:"https://www.gotokyo.org/en/destinations/central-tokyo/ginza.html",nav:mapsRoute("大丸東京店","銀座四丁目交差点"),status:"pending" },
      { time:"15:00–17:00",kind:"戶外",title:"淺草寺與隅田川",place:"浅草寺",detail:"館舍關門後仍可散步；跨年前人潮會快速增加。",price:"境內免費",official:"https://www.senso-ji.jp/",nav:mapsRoute("銀座四丁目交差点","浅草寺"),status:"current" },
      { time:"18:00 前",kind:"返程",title:"回錦糸町吃晚餐",place:"JR 錦糸町站",detail:"年末餐廳縮時，早點用餐並補齊隔日食物。",price:"餐飲自理",nav:mapsRoute("浅草寺","錦糸町駅"),status:"pending" },
    ],
  },
  {
    date:"1/1",day:"五",city:"東京",title:"元旦初詣與晴空塔周邊",detail:"上午明治神宮初詣，下午保留給可能營業的 Solamachi。",stay:"SUKE HOMES KINSHICHO ③",tone:"tokyo",notice:"元旦多數百貨休館；Solamachi 仍須等 2026/27 官方公告。",
    schedule:[
      { time:"08:00–10:30",kind:"初詣",title:"明治神宮元旦參拜",place:"明治神宮",detail:"提早出門避開中午尖峰；神宮境內人潮極多，保管好隨身物品。",price:"參拜免費",official:"https://www.meijijingu.or.jp/",nav:mapsRoute("錦糸町駅","明治神宮"),status:"current" },
      { time:"10:45–13:30",kind:"散步",title:"原宿與表參道",place:"表参道",detail:"以戶外散步與有開店家為主，不預設所有商場都營業。",price:"購物／餐飲自理",official:"https://www.gotokyo.org/en/destinations/western-tokyo/harajuku/",nav:mapsRoute("明治神宮","表参道"),status:"current" },
      { time:"15:00–18:00",kind:"商場",title:"東京晴空街道 Solamachi",place:"東京ソラマチ",detail:"從錦糸町前往方便；元旦營業樓層與時段需近行程再確認。",price:"購物自理",official:"https://www.tokyo-solamachi.jp/",nav:mapsRoute("表参道","東京ソラマチ"),status:"pending" },
      { time:"晚上",kind:"住宿",title:"回 SUKE HOMES KINSHICHO",place:"SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo",detail:"利用房內設備簡單用餐，避開元旦餐廳排隊。",price:"依住宿訂單",official:"https://booking-sukehome-jp-kinshicho.smartorder.ai/",nav:mapsRoute("東京ソラマチ","SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo"),status:"confirmed" },
    ],
  },

  {
    date:"1/2",day:"六",city:"東京",title:"皇居新年參賀與百貨初賣",detail:"上午先保留皇居；午後回到丸之內、銀座看初賣。",stay:"SUKE HOMES KINSHICHO ④",tone:"tokyo",notice:"2027 新年參賀與各店初賣時段尚未發布，必須在 2026 年 12 月重新確認。",
    schedule:[
      { time:"08:00–12:00",kind:"節慶",title:"皇居新年一般參賀",place:"皇居正門 二重橋",detail:"若宮內廳公告 1/2 舉辦，依指定入口、入場時段與禁帶物規定前往。",price:"免費",official:"https://www.kunaicho.go.jp/event/sanga/sanga01.html",nav:mapsRoute("錦糸町駅","皇居正門 二重橋"),status:"pending" },
      { time:"12:15–14:30",kind:"百貨",title:"丸之內初賣與午餐",place:"丸の内",detail:"大丸、丸大樓與新丸大樓擇有開者；先查當日整理券資訊。",price:"購物／餐飲自理",official:"https://www.marunouchi.com/",nav:mapsRoute("皇居正門 二重橋","丸の内"),status:"pending" },
      { time:"15:00–18:00",kind:"百貨",title:"銀座初賣",place:"銀座三越",detail:"三越、松屋、GINZA SIX 擇一至兩間，不追太多福袋動線。",price:"購物自理",official:"https://www.mistore.jp/store/ginza.html",nav:mapsRoute("丸の内","銀座三越"),status:"pending" },
      { time:"18:30 後",kind:"晚餐",title:"回錦糸町晚餐",place:"錦糸町駅",detail:"整理東京最後一天與隔天前往橫濱的行李。",price:"餐飲自理",nav:mapsRoute("銀座三越","錦糸町駅"),status:"current" },
    ],
  },
  {
    date:"1/3",day:"日",city:"東京 → 橫濱",title:"東京百貨收尾，下午移動橫濱",detail:"上午退房後在東京站周邊收尾，下午到橫濱。",stay:"橫濱 · 住宿未定 ①",tone:"harbor",notice:"SUKE HOME 目前規定 10:00 前退房；先確認橫濱住宿能否寄放行李。",
    schedule:[
      { time:"09:30 前",kind:"退房",title:"SUKE HOMES KINSHICHO 退房",place:"SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo",detail:"垃圾與房內規則依入住訊息完成，確認沒有遺留充電器。",price:"依住宿訂單",official:"https://booking-sukehome-jp-kinshicho.smartorder.ai/",nav:mapsRoute("目前位置","SUKE HOME KINSHICHO, 4-7-10 Kotobashi, Sumida City, Tokyo"),status:"confirmed" },
      { time:"10:30–13:30",kind:"百貨",title:"日本橋／東京站最後採買",place:"日本橋髙島屋S.C.",detail:"依 2027/1/3 實際開店時段，在日本橋高島屋或東京站商場擇一。",price:"購物／餐飲自理",official:"https://www.takashimaya.co.jp/nihombashi/",nav:mapsRoute("錦糸町駅","日本橋髙島屋S.C."),status:"pending" },
      { time:"15:00–16:15",kind:"鐵路",title:"東京 → 橫濱",place:"JR 横浜駅",detail:"普通 JR 路線即可；先到住宿寄放或入住。",price:"JR 單程約 ¥490 起",official:"https://www.jreast.co.jp/",nav:mapsRoute("東京駅","横浜駅"),status:"current" },
      { time:"17:00–19:30",kind:"夜景",title:"港未來夜景散步",place:"横浜みなとみらい21",detail:"紅磚倉庫外觀、汽車道與港灣夜景，風大時縮短戶外時間。",price:"戶外免費",official:"https://www.yokohamajapan.com/",nav:mapsRoute("横浜駅","横浜みなとみらい21"),status:"current" },
    ],
  },

  {
    date:"1/4",day:"一",city:"橫濱",title:"港未來、紅磚與中華街",detail:"用一整天走橫濱經典海港路線。",stay:"橫濱 · 住宿未定 ②",tone:"harbor",notice:"2027/1/4 館舍年初日曆尚未公布；杯麵博物館若休館，改港未來與山下公園。",
    schedule:[
      { time:"09:30–11:00",kind:"博物館",title:"杯麵博物館 橫濱",place:"カップヌードルミュージアム 横浜",detail:"My CUPNOODLES Factory 另需整理券／預約；出發前查 2027 年初開館日。",price:"成人入館 ¥500；體驗另計",official:"https://www.cupnoodles-museum.jp/ja/yokohama/",nav:mapsRoute("横浜駅","カップヌードルミュージアム 横浜"),status:"pending" },
      { time:"11:15–13:00",kind:"景點",title:"橫濱紅磚倉庫",place:"横浜赤レンガ倉庫",detail:"逛商店與海港，餐廳候位過長就先往山下公園。",price:"公共區域免費",official:"https://www.yokohama-akarenga.jp/",nav:mapsRoute("カップヌードルミュージアム 横浜","横浜赤レンガ倉庫"),status:"pending" },
      { time:"13:30–15:00",kind:"戶外",title:"山下公園與港灣散步",place:"山下公園",detail:"沿海步行，遇強風或下雨可改搭港未來線縮短路程。",price:"免費",official:"https://www.welcome.city.yokohama.jp/spot/details.php?bbid=190",nav:mapsRoute("横浜赤レンガ倉庫","山下公園"),status:"current" },
      { time:"15:00–18:30",kind:"美食",title:"橫濱中華街",place:"横浜中華街",detail:"先散步再提早晚餐，避開熱門餐廳晚間尖峰。",price:"餐飲自理",official:"https://www.chinatown.or.jp/",nav:mapsRoute("山下公園","横浜中華街"),status:"current" },
    ],
  },
  {
    date:"1/5",day:"二",city:"橫濱 → 成田",title:"移動到成田市，住機場前一晚",detail:"中午前離開橫濱，下午逛成田山表參道。",stay:"JR／京成成田站附近 · 住宿未定",tone:"air",notice:"住宿優先選有 NRT T2 免費接駁或靠京成成田站者，別住需多次轉車的郊區。",
    schedule:[
      { time:"09:00–10:30",kind:"準備",title:"橫濱早餐、退房與取行李",place:"JR 横浜駅",detail:"確認隔天航班時間、行李重量與飯店機場接駁預約。",price:"餐飲自理",nav:mapsRoute("目前位置","横浜駅"),status:"current" },
      { time:"11:00–13:30",kind:"鐵路",title:"橫濱 → JR／京成成田",place:"京成成田駅",detail:"依當日班次選 JR 或京急／京成路線，預留轉車與大行李緩衝。",price:"成人約 ¥2,000 起",official:"https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/index.php",nav:mapsRoute("横浜駅","京成成田駅"),status:"pending" },
      { time:"14:30–17:00",kind:"散步",title:"成田山表參道與新勝寺",place:"成田山新勝寺",detail:"從車站沿表參道步行；1 月仍有初詣人潮，回程別壓太晚。",price:"參拜免費",official:"https://www.nrtk.jp/enjoy/attraction/omotesando.html",nav:mapsRoute("京成成田駅","成田山新勝寺"),status:"current" },
      { time:"17:30 後",kind:"住宿",title:"成田站附近入住",place:"京成成田駅",detail:"住宿未定；入住時再次確認隔日到 NRT T2 的第一段交通。",price:"住宿未定",nav:mapsRoute("成田山新勝寺","京成成田駅"),status:"pending" },
    ],
  },
  {
    date:"1/6",day:"三",city:"成田 → 台北",title:"JX803 從 NRT T2 返回 TPE T1",detail:"提早抵達第二航廈，完成退稅、報到與安檢。",stay:"回家",tone:"air",notice:"JX803 的 2027/1/6 起飛時間尚未有可引用的靜態官方班表；以電子機票為準。",
    schedule:[
      { time:"起飛前 3.5 小時",kind:"交通",title:"飯店 → 成田機場 T2",place:"成田国際空港 第2ターミナル",detail:"搭飯店接駁、京成或 JR；冬季列車延誤時仍保有緩衝。",price:"依住宿與路線",official:"https://www.narita-airport.jp/zh-tc/access/",nav:mapsRoute("京成成田駅","成田国際空港 第2ターミナル"),status:"pending" },
      { time:"起飛前 2.5 小時",kind:"報到",title:"星宇航空 NRT T2 報到",place:"成田国際空港 第2ターミナル 3F",detail:"星宇使用成田第二航廈；櫃檯區域以當日機場看板為準。",price:"依機票",official:"https://www.narita-airport.jp/zh-tc/flight/airline-search/sjx/",nav:mapsRoute("成田国際空港 第2ターミナル","成田国際空港 第2ターミナル 3F"),status:"confirmed" },
      { time:"依電子機票",kind:"航班",title:"JX803：NRT T2 → TPE T1",place:"桃園國際機場第一航廈",detail:"請把最新電子機票與登機證存到手機離線區。",price:"已購機票",official:"https://www.starlux-airlines.com/en-TH/timetable",nav:mapsRoute("成田国際空港 第2ターミナル","桃園國際機場第一航廈"),status:"pending" },
      { time:"抵達後",kind:"返家",title:"桃園機場入境",place:"桃園國際機場第一航廈",detail:"領行李後依抵達時間選機捷或接送。",price:"依返家方式",official:"https://www.taoyuan-airport.com/",nav:mapsRoute("桃園國際機場第一航廈","目前位置"),status:"current" },
    ],
  },

];

const seedResources = [
  { id:"official-1",categoryId:"transport",title:"JR 東日本｜Resort Shirakami 2026 運轉日",url:"https://www.jreast.co.jp/press/2025/akita/20260116_a02.pdf",note:"12/26 已確認運轉，全車指定席。",location:"五能線",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-3000 },
  { id:"official-2",categoryId:"transport",title:"山交巴士｜山形－藏王溫泉線",url:"https://travel.yamagatakotsu.jp/zh-tw/timetable/routebus-yamagata-zaoline.html",note:"12/20 預計搭 06:50 首班；2026 冬季班表公布後再確認。",location:"藏王／山形",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-2000 },
  { id:"official-3",categoryId:"spot",title:"仙台市博物館｜2026 開館日曆",url:"https://www.city.sendai.jp/museum/kidscorner/kids-05.html",note:"官方日曆確認 12/28–12/31 休館，仙台三天改排松島與仙台城。",location:"仙台",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-1000 },
];

const state = {
  tab: "itinerary",
  category: "all",
  query: "",
  resources: [],
  itineraryItems: [],
  editingId: null,
  editingItineraryId: null,
  backend: "local",
  firebase: null,
  firebaseError: false,
  user: null,
  authorized: false,
  resourceAuthorized: false,
  itineraryAuthorized: false,
  unsubscribeResources: null,
  unsubscribeItinerary: null,
  selectedDayKey: null,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadLocalResources() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(stored) ? stored : structuredClone(seedResources);
  } catch {
    return structuredClone(seedResources);
  }
}

function saveLocalResources() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.resources));
}

function loadLocalItineraryItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(ITINERARY_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveLocalItineraryItems() {
  localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(state.itineraryItems));
}


function itineraryDays() {
  return itinerary.filter((item) => item && typeof item === "object" && typeof item.date === "string");
}

function itineraryDateKey(item) {
  if (!item || typeof item.date !== "string") return "";
  const [month, day] = item.date.split("/").map((value) => value.padStart(2,"0"));
  return `${month === "12" ? "2026" : "2027"}-${month}-${day}`;
}

function tripDay(dateKey) {
  return itineraryDays().find((item) => itineraryDateKey(item) === dateKey);
}

function itemsForDay(dateKey) {
  return state.itineraryItems
    .filter((item) => item.date === dateKey)
    .sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99")) || timestampValue(a.createdAt) - timestampValue(b.createdAt));
}

function renderItineraryDateOptions() {
  $("#itineraryDate").innerHTML = itineraryDays().map((item) => `<option value="${itineraryDateKey(item)}">${item.date}（週${item.day}） · ${item.city}</option>`).join("");
}

function openDayDialog(dateKey) {
  const item = tripDay(dateKey);
  if (!item) return;
  state.selectedDayKey = dateKey;
  renderDayDetails();
  const dialog = $("#dayDialog");
  if (!dialog.open) dialog.showModal();
  $$('[data-day]').forEach((button) => button.setAttribute("aria-expanded",String(button.dataset.day === dateKey)));
}


function renderCategories() {
  $("#categoryRow").innerHTML = [
    `<button class="category-pill ${state.category === "all" ? "active" : ""}" type="button" data-category="all"><i style="background:linear-gradient(135deg,#007aff,#bf5af2)"></i>全部</button>`,
    ...categories.map((category) => `<button class="category-pill ${state.category === category.id ? "active" : ""}" type="button" data-category="${category.id}"><i style="background:${category.color}"></i>${category.name}</button>`),
  ].join("");
  $("#resourceCategory").innerHTML = categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("");
}

function sortedResources(resources) {
  return [...resources].sort((a, b) => Number(b.pinned) - Number(a.pinned) || timestampValue(b.updatedAt) - timestampValue(a.updatedAt));
}

function filteredResources(query = state.query, includeCategory = true) {
  const needle = query.trim().toLocaleLowerCase("zh-Hant");
  return sortedResources(state.resources).filter((resource) => {
    const category = categories.find((item) => item.id === resource.categoryId);
    const matchesCategory = !includeCategory || state.category === "all" || resource.categoryId === state.category;
    const haystack = `${resource.title} ${resource.note || ""} ${resource.location || ""} ${category?.name || ""}`.toLocaleLowerCase("zh-Hant");
    return matchesCategory && (!needle || haystack.includes(needle));
  });
}

function renderResources() {
  const libraryItems = filteredResources();
  const searchQuery = $("#globalSearch").value;
  const searchItems = filteredResources(searchQuery, false);
  $("#resourceGrid").innerHTML = libraryItems.map(resourceCard).join("");
  $("#searchResults").innerHTML = searchItems.map(resourceCard).join("");
  $("#emptyState").hidden = libraryItems.length > 0;
  $("#searchEmpty").hidden = searchItems.length > 0;
  $("#resourceCount").textContent = `${state.resources.length} 筆共同收藏 · ${state.backend === "cloud" ? "即時同步" : "本機保存"}`;
  bindCardActions();
}

function resourceCard(resource) {
  const category = categories.find((item) => item.id === resource.categoryId) || categories.at(-1);
  const hostname = safeHostname(resource.url);
  const statusLabel = { idea:"想去",shortlist:"候選",booked:"已預訂" }[resource.status] || "想去";
  return `
    <article class="resource-card">
      <div class="resource-card-top">
        <span class="resource-icon" style="color:${category.color};background:${category.color}18">${category.icon}</span>
        <div class="card-actions">${resource.pinned ? `<span class="pinned-badge">⌖ 置頂</span>` : ""}<button type="button" data-edit="${escapeAttr(resource.id)}" aria-label="編輯 ${escapeAttr(resource.title)}">•••</button></div>
      </div>
      <div class="resource-card-body">
        <div class="metadata-row"><span>${escapeHtml(resource.location || "未指定地點")}</span><span>·</span><span>${category.name}</span><span class="resource-status status-${resource.status}">${statusLabel}</span></div>
        <h2>${escapeHtml(resource.title)}</h2>${resource.note ? `<p>${escapeHtml(resource.note)}</p>` : ""}
      </div>
      <footer><div><small>${escapeHtml(hostname)}</small><span>由 ${escapeHtml(resource.updatedBy || "旅伴")} 更新</span></div><a class="open-link" href="${escapeAttr(resource.url)}" target="_blank" rel="noreferrer" aria-label="開啟 ${escapeAttr(resource.title)}">↗</a></footer>
    </article>`;
}

function bindCardActions() {
  $$('[data-edit]').forEach((button) => button.addEventListener("click", () => openEditor(button.dataset.edit)));
}

function setTab(tab) {
  state.tab = tab;
  $$(".view").forEach((view) => { view.hidden = view.id !== `${tab}View`; view.classList.toggle("active", view.id === `${tab}View`); });
  $$('[data-tab]').forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  $(".floating-add").hidden = tab === "itinerary";
  if (tab === "search") setTimeout(() => $("#globalSearch").focus(), 120);
  window.scrollTo({ top:0, behavior:"smooth" });
}

function openEditor(id = null) {
  state.editingId = id;
  const form = $("#resourceForm");
  form.reset();
  $("#resourceCategory").value = state.category === "all" ? "spot" : state.category;
  $("#editorTitle").textContent = id ? "編輯連結" : "加入旅行資訊";
  $("#deleteButton").hidden = !id;
  if (id) {
    const resource = state.resources.find((item) => item.id === id);
    if (!resource) return;
    form.elements.url.value = resource.url;
    form.elements.title.value = resource.title;
    form.elements.category.value = resource.categoryId || "other";
    form.elements.location.value = resource.location || "";
    form.elements.status.value = resource.status || "idea";
    form.elements.note.value = resource.note || "";
    form.elements.pinned.checked = Boolean(resource.pinned);
  }
  $("#editorDialog").showModal();
}

async function submitResource(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  let parsedUrl;
  try { parsedUrl = new URL(String(form.get("url"))); } catch { showToast("連結格式不正確"); return; }
  if (!/^https?:$/.test(parsedUrl.protocol)) { showToast("連結只支援 http 或 https"); return; }
  const current = state.resources.find((item) => item.id === state.editingId);
  const input = {
    title:String(form.get("title") || "").trim().slice(0,120), url:parsedUrl.toString(), note:String(form.get("note") || "").trim().slice(0,1200),
    location:String(form.get("location") || "").trim().slice(0,80), categoryId:String(form.get("category") || "other"), status:String(form.get("status") || "idea"),
    pinned:form.get("pinned") === "on", updatedBy:state.user?.displayName || "我", updatedAt:Date.now(),
  };
  setSyncStatus("saving");
  try {
    if (state.backend === "cloud" && state.resourceAuthorized) {
      const { collection,addDoc,doc,updateDoc,serverTimestamp } = state.firebase.firestore;
      const payload = { ...input, updatedAt:serverTimestamp(), updatedBy:state.user.displayName || state.user.email || "旅伴" };
      if (current) await updateDoc(doc(state.firebase.db,"boards",BOARD_ID,"resources",current.id),payload);
      else await addDoc(collection(state.firebase.db,"boards",BOARD_ID,"resources"),{ ...payload,createdAt:serverTimestamp(),createdBy:payload.updatedBy });
    } else {
      if (current) state.resources = state.resources.map((item) => item.id === current.id ? { ...item,...input } : item);
      else state.resources = [{ id:crypto.randomUUID?.() || `local-${Date.now()}`,createdAt:Date.now(),...input },...state.resources];
      saveLocalResources(); renderResources(); setSyncStatus("local");
    }
    $("#editorDialog").close(); showToast(current ? "已儲存修改" : "連結已加入資料庫");
  } catch (error) { console.error(error); setSyncStatus("error"); showToast("暫時無法儲存"); }
}

async function deleteCurrentResource() {
  const resource = state.resources.find((item) => item.id === state.editingId);
  if (!resource || !confirm(`確定要刪除「${resource.title}」嗎？`)) return;
  setSyncStatus("saving");
  try {
    if (state.backend === "cloud" && state.resourceAuthorized) {
      const { doc,deleteDoc } = state.firebase.firestore;
      await deleteDoc(doc(state.firebase.db,"boards",BOARD_ID,"resources",resource.id));
    } else {
      state.resources = state.resources.filter((item) => item.id !== resource.id); saveLocalResources(); renderResources(); setSyncStatus("local");
    }
    $("#editorDialog").close(); showToast("已刪除連結");
  } catch (error) { console.error(error); setSyncStatus("error"); showToast("暫時無法刪除"); }
}

function canOpenItineraryEditor() {
  if (!firebaseConfigured()) return true;
  if (state.firebaseError) { showToast("Firebase 目前連線失敗，請重新整理後再試"); return false; }
  if (state.user && state.itineraryAuthorized) return true;
  openShareDialog();
  showToast(state.user ? "行程同步權限尚未就緒" : "請先登入再共同編輯行程");
  return false;
}

function openItineraryEditor(id = null, dateKey = null) {
  if (!canOpenItineraryEditor()) return;
  state.editingItineraryId = id;
  const form = $("#itineraryForm");
  form.reset();
  renderItineraryDateOptions();
  $("#itineraryEditorTitle").textContent = id ? "編輯行程" : "新增行程";
  $("#deleteItineraryButton").hidden = !id;
  $("#itinerarySyncNote").textContent = firebaseConfigured() ? "儲存後會即時同步給兩個人。" : "目前會先儲存在這台裝置。";
  form.elements.date.value = dateKey || itineraryDateKey(itineraryDays()[0]);

  if (id) {
    const item = state.itineraryItems.find((entry) => entry.id === id);
    if (!item) return;
    form.elements.date.value = item.date;
    form.elements.time.value = item.time || "";
    form.elements.title.value = item.title;
    form.elements.location.value = item.location || "";
    form.elements.price.value = item.price || "";
    form.elements.officialUrl.value = item.officialUrl || "";
    form.elements.notes.value = item.notes || "";
  }
  $("#itineraryEditorDialog").showModal();
}

async function submitItineraryItem(event) {
  event.preventDefault();
  if (!canOpenItineraryEditor()) return;
  const form = new FormData(event.currentTarget);
  const date = String(form.get("date") || "");
  const time = String(form.get("time") || "");
  const title = String(form.get("title") || "").trim().slice(0,120);
  const location = String(form.get("location") || "").trim().slice(0,120);
  const price = String(form.get("price") || "").trim().slice(0,80);
  const officialInput = String(form.get("officialUrl") || "").trim();
  const officialUrl = safeHttpUrl(officialInput);
  const notes = String(form.get("notes") || "").trim().slice(0,2000);
  if (!tripDay(date)) { showToast("請選擇這趟旅行中的日期"); return; }
  if (!title) { showToast("請輸入行程名稱"); return; }
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) { showToast("時間格式不正確"); return; }

  if (officialInput && !officialUrl) { showToast("官網請輸入 http:// 或 https:// 網址"); return; }
  const current = state.itineraryItems.find((item) => item.id === state.editingItineraryId);
  const input = { date,time,title,location,price,officialUrl,notes };
  const personName = currentUserName();
  setSyncStatus("saving");
  try {
    if (firebaseConfigured()) {
      const { collection,addDoc,doc,updateDoc,serverTimestamp } = state.firebase.firestore;
      const updatedFields = { ...input,updatedByUid:state.user.uid,updatedByName:personName,updatedAt:serverTimestamp() };
      if (current) {
        await updateDoc(doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",current.id),updatedFields);
      } else {
        await addDoc(collection(state.firebase.db,"boards",BOARD_ID,"itineraryItems"),{
          ...updatedFields,createdByUid:state.user.uid,createdByName:personName,createdAt:serverTimestamp(),
        });
      }
    } else {
      const now = Date.now();
      if (current) {
        state.itineraryItems = state.itineraryItems.map((item) => item.id === current.id ? { ...item,...input,updatedAt:now,updatedByName:personName } : item);
      } else {
        state.itineraryItems.push({ id:crypto.randomUUID?.() || `local-${now}`,...input,createdAt:now,updatedAt:now,createdByName:personName,updatedByName:personName });
      }
      saveLocalItineraryItems();
      renderItinerary();
      setSyncStatus("local");
    }
    state.selectedDayKey = date;
    $("#itineraryEditorDialog").close();
    openDayDialog(date);
    showToast(current ? "行程已更新" : "行程已加入");
  } catch (error) {
    console.error(error);
    setSyncStatus("error");
    showToast(error?.code === "permission-denied" ? "這個帳號沒有行程編輯權限" : "暫時無法儲存行程");
  }
}

async function deleteCurrentItineraryItem() {
  const item = state.itineraryItems.find((entry) => entry.id === state.editingItineraryId);
  if (!item || !confirm(`確定要刪除「${item.title}」嗎？`)) return;
  setSyncStatus("saving");
  try {
    if (firebaseConfigured()) {
      if (!state.itineraryAuthorized) throw Object.assign(new Error("permission denied"),{ code:"permission-denied" });
      const { doc,deleteDoc } = state.firebase.firestore;
      await deleteDoc(doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",item.id));
    } else {
      state.itineraryItems = state.itineraryItems.filter((entry) => entry.id !== item.id);
      saveLocalItineraryItems();
      renderItinerary();
      renderDayDetails();
      setSyncStatus("local");
    }
    $("#itineraryEditorDialog").close();
    showToast("行程已刪除");
  } catch (error) {
    console.error(error);
    setSyncStatus("error");
    showToast(error?.code === "permission-denied" ? "這個帳號沒有行程編輯權限" : "暫時無法刪除行程");
  }
}

function currentUserName() {
  return String(state.user?.displayName || state.user?.email || "旅伴").trim().slice(0,80) || "旅伴";
}

function setSyncStatus(mode) {
  const dot = $("#syncDot"); dot.className = "sync-dot";
  if (mode === "local") { dot.classList.add("local"); $("#syncLabel").textContent = "本機草稿"; }
  if (mode === "saving") { dot.classList.add("saving"); $("#syncLabel").textContent = "正在儲存…"; }
  if (mode === "connecting") { dot.classList.add("saving"); $("#syncLabel").textContent = "同步連線中…"; }
  if (mode === "cloud") { $("#syncLabel").textContent = "已即時同步"; }
  if (mode === "error") { dot.classList.add("error"); $("#syncLabel").textContent = "連線異常"; }
}

function updateModeBanner() {
  const banner = $("#modeBanner");
  if (state.backend === "cloud" && state.authorized) {
    banner.className = "mode-banner cloud"; banner.innerHTML = `<span class="banner-icon">✓</span><div><strong>Firebase 即時同步已連線</strong><p>你和女朋友會看到同一份資料。</p></div><button type="button" id="modeAction">帳號資訊</button>`;
  } else if (firebaseConfigured() && state.user) {
    banner.className = "mode-banner local"; banner.innerHTML = `<span class="banner-icon">!</span><div><strong>已登入，等待資料庫授權</strong><p>請確認目前登入的是這趟旅程已授權的帳號。</p></div><button type="button" id="modeAction">查看 UID</button>`;
  } else if (firebaseConfigured()) {
    banner.className = "mode-banner local"; banner.innerHTML = `<span class="banner-icon">G</span><div><strong>雲端已設定，請先登入</strong><p>使用 Google 帳號登入共同資料庫。</p></div><button type="button" id="modeAction">登入</button>`;
  } else {
    banner.className = "mode-banner local"; banner.innerHTML = `<span class="banner-icon">i</span><div><strong>目前是本機草稿</strong><p>資料只存在這台裝置。連接 Firebase 後才會與女朋友即時同步。</p></div><button type="button" id="modeAction">查看設定</button>`;
  }
  $("#modeAction").addEventListener("click", () => firebaseConfigured() ? openShareDialog() : $("#setupDialog").showModal());
}

function openShareDialog() {
  const configured = firebaseConfigured();
  $("#shareUrl").value = location.href.split("#")[0];
  $("#googleSignIn").hidden = !configured || Boolean(state.user);
  $("#googleSignOut").hidden = !state.user;
  $("#uidCard").hidden = !state.user;
  if (state.user) { $("#userUid").textContent = state.user.uid; $("#currentAvatar").textContent = initials(state.user.displayName || state.user.email || "我"); }
  if (!configured) { $("#shareHeading").textContent = "分享行程頁面"; $("#shareDescription").textContent = "目前新增內容只存於這台裝置；設定 Firebase 後才是共同編輯。"; }
  else if (!state.user) { $("#shareHeading").textContent = "登入共同資料庫"; $("#shareDescription").textContent = "你和女朋友各自使用 Google 帳號登入。"; }
  else if (state.authorized) { $("#shareHeading").textContent = "雲端同步已連線"; $("#shareDescription").textContent = "把網址傳給另一位已授權的旅伴即可共同編輯。"; }
  else { $("#shareHeading").textContent = "還差 Firestore 授權"; $("#shareDescription").textContent = "目前登入的帳號尚未取得這趟旅程的共同編輯權限。"; }
  $("#shareDialog").showModal();
}

async function connectFirebase() {
  if (!firebaseConfigured()) { updateModeBanner(); return; }
  try {
    const [appModule,authModule,firestoreModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`),
    ]);
    const app = appModule.initializeApp(window.TRIP_FIREBASE_CONFIG);
    const auth = authModule.getAuth(app); const db = firestoreModule.getFirestore(app);
    state.firebase = { auth,db,authModule,firestore:firestoreModule };
    authModule.onAuthStateChanged(auth, async (user) => {
      state.user = user; state.authorized = false; state.resourceAuthorized = false; state.itineraryAuthorized = false;
      state.unsubscribeResources?.(); state.unsubscribeResources = null;
      state.unsubscribeItinerary?.(); state.unsubscribeItinerary = null;
      if (!user) {
        state.backend = "local";
        state.resources = loadLocalResources();
        state.itineraryItems = loadLocalItineraryItems();
        setSyncStatus("local"); updateModeBanner(); renderResources(); renderItinerary();
        if ($("#dayDialog").open) renderDayDetails();
        return;
      }
      $("#currentAvatar").textContent = initials(user.displayName || user.email || "我");
      listenToCloud(); updateModeBanner();
    });
  } catch (error) { console.error(error); state.firebaseError = true; setSyncStatus("error"); showToast("Firebase 連線失敗"); }
}

function listenToCloud() {
  const f = state.firebase.firestore;
  const resourceRef = f.collection(state.firebase.db,"boards",BOARD_ID,"resources");
  const itineraryRef = f.collection(state.firebase.db,"boards",BOARD_ID,"itineraryItems");
  state.unsubscribeResources = f.onSnapshot(resourceRef, async (snapshot) => {
    state.resourceAuthorized = true; state.authorized = state.resourceAuthorized && state.itineraryAuthorized; state.backend = "cloud";
    state.resources = snapshot.docs.map((item) => ({ id:item.id,...item.data() }));
    setSyncStatus(state.authorized ? "cloud" : "connecting"); updateModeBanner(); renderResources();
    if (snapshot.empty && !sessionStorage.getItem("trip-seeded")) {
      sessionStorage.setItem("trip-seeded","1");
      const localDrafts = loadLocalResources();
      await Promise.all(localDrafts.map((resource) => f.setDoc(
        f.doc(state.firebase.db,"boards",BOARD_ID,"resources",resource.id),
        {
          ...resource,
          createdAt:f.serverTimestamp(),
          updatedAt:f.serverTimestamp(),
          createdBy:resource.createdBy || resource.updatedBy || "旅伴",
          updatedBy:resource.updatedBy || "旅伴",
        },
      )));
    }
  }, (error) => {
    console.warn(error); state.resourceAuthorized = false; state.authorized = false; state.backend = "local"; state.resources = loadLocalResources();
    setSyncStatus(error.code === "permission-denied" ? "local" : "error"); updateModeBanner(); renderResources();
  });

  state.unsubscribeItinerary = f.onSnapshot(itineraryRef, (snapshot) => {
    state.itineraryAuthorized = true; state.authorized = state.resourceAuthorized && state.itineraryAuthorized;
    state.itineraryItems = snapshot.docs.map((item) => ({ id:item.id,...item.data() }));
    setSyncStatus(state.authorized ? "cloud" : "connecting");
    updateModeBanner(); renderItinerary();
    if ($("#dayDialog").open) renderDayDetails();
  }, (error) => {
    console.warn(error); state.itineraryAuthorized = false; state.authorized = false; state.itineraryItems = [];
    setSyncStatus("error"); updateModeBanner(); renderItinerary();
    if ($("#dayDialog").open) renderDayDetails();
    if (error.code === "permission-denied") showToast("行程功能尚未取得 Firebase 權限");
  });
}

async function googleSignIn() {
  if (!state.firebase) return;
  try { const provider = new state.firebase.authModule.GoogleAuthProvider(); await state.firebase.authModule.signInWithPopup(state.firebase.auth,provider); $("#shareDialog").close(); }
  catch (error) { console.error(error); showToast("Google 登入未完成"); }
}

function firebaseConfigured() {
  const config = window.TRIP_FIREBASE_CONFIG;
  return Boolean(config && ["apiKey","authDomain","projectId","appId","messagingSenderId"].every((key) => typeof config[key] === "string" && config[key]));
}

function bindEvents() {
  $$('[data-tab]').forEach((button) => button.addEventListener("click", () => setTab(button.dataset.tab)));
  $("#brandButton").addEventListener("click", () => setTab("itinerary"));
  $("#dayGrid").addEventListener("click", (event) => { const button = event.target.closest("[data-day]"); if (button) openDayDialog(button.dataset.day); });
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest('[data-action="add-itinerary"]');
    if (addButton) {
      const fromDayDialog = Boolean(addButton.closest("#dayDialog"));
      openItineraryEditor(null, fromDayDialog ? state.selectedDayKey : null);
      return;
    }
    const editButton = event.target.closest("[data-itinerary-edit]");
    if (editButton) openItineraryEditor(editButton.dataset.itineraryEdit);
  });
  $$('[data-action="add"]').forEach((button) => button.addEventListener("click", () => openEditor()));
  $("#categoryRow").addEventListener("click", (event) => { const button = event.target.closest("[data-category]"); if (!button) return; state.category = button.dataset.category; renderCategories(); renderResources(); });
  $("#librarySearch").addEventListener("input", (event) => { state.query = event.target.value; event.target.nextElementSibling.hidden = !event.target.value; renderResources(); });
  $("#globalSearch").addEventListener("input", (event) => { event.target.nextElementSibling.hidden = !event.target.value; renderResources(); });
  $$(".clear-search").forEach((button) => button.addEventListener("click", () => { const input = button.previousElementSibling; input.value = ""; button.hidden = true; if (input.id === "librarySearch") state.query = ""; renderResources(); input.focus(); }));
  $("#resourceForm").addEventListener("submit", submitResource); $("#deleteButton").addEventListener("click", deleteCurrentResource);
  $("#itineraryForm").addEventListener("submit", submitItineraryItem); $("#deleteItineraryButton").addEventListener("click", deleteCurrentItineraryItem);
  $("#resourceUrl").addEventListener("blur", () => { if ($("#resourceTitle").value || !$("#resourceUrl").value) return; try { $("#resourceTitle").value = new URL($("#resourceUrl").value).hostname.replace(/^www\./,""); } catch {} });
  $$('[data-close-dialog]').forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close()));
  $$('dialog').forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
  $("#shareButton").addEventListener("click", openShareDialog); $("#copyShareUrl").addEventListener("click", () => copyText($("#shareUrl").value,"網站網址已複製"));
  $("#copyUid").addEventListener("click", () => copyText($("#userUid").textContent,"UID 已複製"));
  $("#googleSignIn").addEventListener("click", googleSignIn); $("#googleSignOut").addEventListener("click", async () => { await state.firebase?.authModule.signOut(state.firebase.auth); $("#shareDialog").close(); });
  $("#dayDialog").addEventListener("close", () => {
    const dateKey = state.selectedDayKey;
    renderItinerary();
    requestAnimationFrame(() => document.querySelector(`[data-day="${dateKey}"]`)?.focus());
  });
}

function showToast(message) {
  clearTimeout(showToast.timer);
  $$(".dialog-toast").forEach((item) => item.remove());
  const openDialog = $$('dialog[open]').at(-1);
  if (openDialog) {
    const feedback = document.createElement("div");
    feedback.className = "dialog-toast";
    feedback.setAttribute("role","status");
    const icon = document.createElement("span");
    icon.textContent = "✓";
    const text = document.createElement("b");
    text.textContent = message;
    feedback.append(icon,text);
    openDialog.append(feedback);
    showToast.timer = setTimeout(() => feedback.remove(),3200);
    return;
  }
  const toast = $("#toast");
  $("#toastText").textContent = message;
  toast.hidden = false;
  if (typeof toast.showPopover === "function" && !toast.matches(":popover-open")) toast.showPopover();
  showToast.timer = setTimeout(() => {
    if (typeof toast.hidePopover === "function" && toast.matches(":popover-open")) toast.hidePopover();
    toast.hidden = true;
  },3200);
}
async function copyText(value,message) { try { await navigator.clipboard.writeText(value); showToast(message); } catch { showToast("請長按後手動複製"); } }
function timestampValue(value) { if (typeof value === "number") return value; if (value?.toMillis) return value.toMillis(); if (value?.seconds) return value.seconds * 1000; return 0; }
function safeHostname(value) { try { return new URL(value).hostname.replace(/^www\./,""); } catch { return value; } }
function initials(value) { const text = String(value || "我").trim(); const parts = text.split(/\s+/); return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)[0]}` : text.slice(0,2)).toUpperCase(); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g,(char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" })[char]); }
function escapeAttr(value) { return escapeHtml(value); }

function mapsRoute(origin, destination) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api","1");
  if (origin && origin !== "目前位置") url.searchParams.set("origin",origin);
  if (destination && destination !== "目前位置") url.searchParams.set("destination",destination);
  url.searchParams.set("travelmode","transit");
  return url.toString();
}

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["http:","https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderItinerary() {
  $("#dayGrid").innerHTML = itineraryDays().map((item) => {
    const dateKey = itineraryDateKey(item);
    const customCount = itemsForDay(dateKey).length;
    const scheduleCount = item.schedule?.length || 0;
    return `
      <button class="day-button tone-${escapeAttr(item.tone)}" type="button" data-day="${dateKey}" aria-label="查看 ${escapeAttr(item.date)} ${escapeAttr(item.city)} 的逐時行程" aria-haspopup="dialog" aria-controls="dayDialog" aria-expanded="${state.selectedDayKey === dateKey && $("#dayDialog")?.open ? "true" : "false"}">
        <span class="day-button-top"><strong>${escapeHtml(item.date)}</strong><span class="weekday">週${escapeHtml(item.day)}</span></span>
        <span class="city-label">${escapeHtml(item.city)}</span>
        <span class="day-title">${escapeHtml(item.title)}</span>
        <span class="day-button-meta"><span>${scheduleCount} 個時段</span><span>打開行程 <b aria-hidden="true">›</b></span></span>
        ${customCount ? `<span class="day-button-count" aria-label="${customCount} 筆自訂行程">＋${customCount}</span>` : ""}
      </button>`;
  }).join("");
}


function renderDayDetails() {
  const item = tripDay(state.selectedDayKey);
  if (!item) return;
  const statusLabels = { confirmed:"已確認",current:"目前資料",pending:"待再確認" };
  $("#dayDialogDate").textContent = `${item.date} · 週${item.day} · ${item.city}`;
  $("#dayDialogTitle").textContent = item.title;
  $("#dayDialogCity").textContent = `住宿：${item.stay}`;

  const scheduleCards = (item.schedule || []).map((plan) => {
    const officialUrl = safeHttpUrl(plan.official);
    const ticketUrl = safeHttpUrl(plan.ticket);
    const navUrl = safeHttpUrl(plan.nav) || mapsRoute("",plan.place);
    const status = statusLabels[plan.status] ? plan.status : "pending";
    return `
      <article class="timeline-card status-${status}">
        <div class="timeline-time"><strong>${escapeHtml(plan.time)}</strong><span>${escapeHtml(plan.kind)}</span></div>
        <div class="timeline-body">
          <div class="timeline-title-row"><h3>${escapeHtml(plan.title)}</h3><span class="verify-pill">${statusLabels[status]}</span></div>
          <p class="timeline-place"><span aria-hidden="true">⌖</span> ${escapeHtml(plan.place)}</p>
          <p class="timeline-detail">${escapeHtml(plan.detail)}</p>
          ${plan.price ? `<p class="price-pill"><span aria-hidden="true">票</span> ${escapeHtml(plan.price)}</p>` : ""}
          <div class="timeline-actions">
            <a class="nav-action" href="${escapeAttr(navUrl)}" target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span> 導航</a>
            ${officialUrl ? `<a href="${escapeAttr(officialUrl)}" target="_blank" rel="noreferrer">官網 <span aria-hidden="true">↗</span></a>` : ""}
            ${ticketUrl ? `<a href="${escapeAttr(ticketUrl)}" target="_blank" rel="noreferrer">票價／預約 <span aria-hidden="true">↗</span></a>` : ""}
          </div>
        </div>
      </article>`;
  }).join("");
  $("#dayPlanList").innerHTML = `${item.notice ? `<aside class="day-notice"><span aria-hidden="true">!</span><div><strong>出發前確認</strong><p>${escapeHtml(item.notice)}</p></div></aside>` : ""}${scheduleCards}`;

  const customItems = itemsForDay(state.selectedDayKey);
  $("#dayAgenda").innerHTML = customItems.length ? customItems.map((agenda) => {
    const officialUrl = safeHttpUrl(agenda.officialUrl);
    const navUrl = agenda.location ? mapsRoute("",agenda.location) : "";
    return `
      <article class="agenda-item">
        <div class="agenda-time">${escapeHtml(agenda.time || "未定")}</div>
        <div class="agenda-main">
          <div class="agenda-title-row"><strong>${escapeHtml(agenda.title)}</strong><span>你們新增</span></div>
          ${agenda.location ? `<span class="agenda-location">⌖ ${escapeHtml(agenda.location)}</span>` : ""}
          ${agenda.notes ? `<span class="agenda-note">注意：${escapeHtml(agenda.notes)}</span>` : ""}
          ${agenda.price ? `<span class="agenda-price">票價／預算：${escapeHtml(agenda.price)}</span>` : ""}
          <div class="timeline-actions">
            ${navUrl ? `<a class="nav-action" href="${escapeAttr(navUrl)}" target="_blank" rel="noreferrer">⌖ 導航</a>` : ""}
            ${officialUrl ? `<a href="${escapeAttr(officialUrl)}" target="_blank" rel="noreferrer">官網 ↗</a>` : ""}
            <button type="button" data-itinerary-edit="${escapeAttr(agenda.id)}">編輯</button>
          </div>
        </div>
      </article>`;
  }).join("") : `<div class="agenda-empty"><span aria-hidden="true">＋</span><p>這天還沒有自己安排的細項<br>按「安排這一天」開始新增。</p></div>`;
}


state.resources = loadLocalResources();
state.itineraryItems = loadLocalItineraryItems();
renderItinerary(); renderItineraryDateOptions(); renderCategories(); renderResources(); bindEvents(); updateModeBanner(); setTab("itinerary"); connectFirebase();
