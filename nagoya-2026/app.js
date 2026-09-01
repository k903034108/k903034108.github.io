const STORAGE_KEY = "nagoya-2026-resources-v1";
const ITINERARY_STORAGE_KEY = "nagoya-2026-itinerary-items-v1";
const BOARD_ID = window.TRIP_BOARD_ID || "nagoya-2026";

const categories = [
  { id: "match", name: "比賽", icon: "●", color: "#D23B57" },
  { id: "stay", name: "住宿", icon: "▱", color: "#9B72CF" },
  { id: "spot", name: "景點", icon: "⌖", color: "#30B0C7" },
  { id: "food", name: "美食", icon: "♨", color: "#FF9F0A" },
  { id: "transport", name: "交通", icon: "↝", color: "#34C759" },
  { id: "other", name: "其他", icon: "↗", color: "#8E8E93" },
];
function mapsRoute(origin, destination) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api","1");
  if (origin && origin !== "目前位置") url.searchParams.set("origin",origin);
  if (destination && destination !== "目前位置") url.searchParams.set("destination",destination);
  url.searchParams.set("travelmode","transit");
  return url.toString();
}

window.TRIP_DATA = { categories, itinerary:null, seedResources:null, mapsRoute };

const venueMap = "https://www.google.com/maps/place/%E6%9D%B1%E6%B5%B7%E5%B8%82%E6%B0%91%E9%AB%94%E8%82%B2%E9%A4%A8/@35.0152105,136.8821004,17z/data=!4m9!1m2!2m1!1sTokai+Citizen+Gymnasium,+Masugata-1-1+Takayokosukamachi,+Tokai,+Aichi+477-0037!3m5!1s0x60037e674802d5df:0xbf255fefc20dcac7!8m2!3d35.0151126!4d136.884416!16s%2Fg%2F1tnhy80v?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D";

const itinerary = [
  {
    date:"9/20",day:"日",city:"中部國際機場・名古屋",title:"抵達日本・JX838｜晚抵休息",detail:"桃園 14:55 起飛、名古屋 18:45 落地的現行夏季班表為參考；通關後直接入住。",stay:"Central Nagoya Stays",tone:"sendai",notice:"JX838／JX839 時刻仍以星宇 App／訂位通知為準；抵達日晚間不安排景點。",
    schedule:[
      { id:"plan-20260920-01",time:"18:45",kind:"航班",title:"JX838 抵達中部國際機場",place:"中部國際機場第 1 航廈",detail:"完成入境、領行李，預留約 60 分鐘；航班時刻以星宇 App／訂位通知為準。",official:"https://www.centrair.jp/en/",nav:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport",status:"pending" },
      { id:"plan-20260920-02",time:"19:45",kind:"鐵路",title:"搭名鐵 μSKY 前往名古屋",place:"中部國際空港站",detail:"μSKY 至名鐵名古屋約 28 分鐘，再步行約 14 分鐘到住宿；抵達日不再安排景點。",official:"https://www.meitetsu.co.jp/eng/",nav:"https://www.google.com/maps/search/?api=1&query=Central+Japan+International+Airport+Station",status:"current" },
      { id:"plan-20260920-03",time:"20:45",kind:"住宿",title:"入住 Central Nagoya Stays",place:"中村區若宮町 1-28-8",detail:"由名鐵名古屋站步行約 14 分鐘；無人住宿請先確認入住說明與門禁密碼。",nav:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya",status:"confirmed" },
    ],
  },
  {
    date:"9/21",day:"一",city:"犬山・惠那峽・馬籠宿・妻籠宿",title:"Klook 一日遊：犬山城・惠那峽・馬籠宿・妻籠宿",detail:"五連休第一天改成整團跟車：犬山城、惠那峽展望台，再走馬籠宿與妻籠宿兩個宿場町，傍晚回名古屋解散。",stay:"Central Nagoya Stays",tone:"north",notice:"已完成 Klook 預訂；巴士只保證出發與解散時間，中途到站時間為估算，實際依當天導遊安排。集合點與導遊聯絡方式以出發前一天的電子憑證通知為準。",
    schedule:[
      { id:"plan-20260921-01",time:"08:20–08:30",kind:"集合",title:"集合並搭乘 Klook 一日遊巴士",place:"名古屋（依電子憑證資訊，商品頁列於 Ministop 附近）",detail:"預留約 10 分鐘報到，08:30 巴士出發；全程含中文／英文／日文導覽，餐點與保險不含，可攜 1 件標準行李。集合點與導遊聯絡方式以出發前一天的電子憑證通知為準。",official:"https://www.klook.com/zh-TW/activity/175724-day-trip-to-magomejuku-tsumagojuku-and-enakyo-from-nagoya/",status:"confirmed" },
      { id:"plan-20260921-02",time:"09:30–10:30",kind:"景點",title:"犬山城・三光稻荷",place:"國寶犬山城・三光稻荷神社",detail:"第 1 站，停留約 60 分鐘；到站時間為估算，實際依當天路況。天守樓梯較陡，建議穿防滑鞋。",official:"https://inuyama-castle.jp/",nav:"https://www.google.com/maps/search/?api=1&query=Inuyama+Castle",status:"confirmed" },
      { id:"plan-20260921-03",time:"11:00–11:30",kind:"景點",title:"惠那峽展望台",place:"惠那峽",detail:"第 2 站，停留約 30 分鐘。",nav:"https://www.google.com/maps/search/?api=1&query=Enakyo",status:"confirmed" },
      { id:"plan-20260921-04",time:"12:00–14:30",kind:"景點",title:"馬籠宿・妻籠宿",place:"馬籠宿・妻籠宿",detail:"第 3–4 站，兩個宿場町合計停留約 150 分鐘，含午餐時間；以步行為主，建議帶現金。結束後巴士直接返回名古屋。",nav:"https://www.google.com/maps/search/?api=1&query=Magome-juku",status:"confirmed" },
      { id:"plan-20260921-05",time:"18:20",kind:"解散",title:"名古屋站解散",place:"名鐵名古屋站",detail:"回程車程視路況而定，出發前 24 小時可免費取消、逾時或未到恕不退款，天候或未滿 4 人可能改期；晚餐請自行安排。",status:"confirmed" },
    ],
  },
  {
    date:"9/22",day:"二",city:"清洲・東海市",title:"清洲城 → KAB04",detail:"比賽日只放上午的清洲城；中午回名古屋用餐、休息後再往場館。",stay:"Central Nagoya Stays",tone:"match",notice:"國民之休日，仍在五連休；清洲城週一休館、週二開館。今天不再塞入名古屋城。",
    schedule:[
      { id:"plan-20260922-01",time:"08:10",kind:"交通",title:"從住宿前往新清洲",place:"Central Nagoya Stays→名鐵名古屋",detail:"步行到名鐵名古屋後轉名鐵，至新清洲站步行約 15 分鐘；07:15 起床，今天是國民之休日，景點只排一處。",nav:"https://www.google.com/maps/search/?api=1&query=Shinkiyosu+Station",status:"current" },
      { id:"plan-20260922-02",time:"09:00",kind:"景點",title:"清洲城",place:"清洲城・五條川畔",detail:"開放 09:00–17:00；週一休館、週二開館。10:30 離開，不續排名古屋城。",official:"https://www.nagoya-info.jp/spot/detail/169/",nav:"https://www.google.com/maps/search/?api=1&query=Kiyosu+Castle",status:"current" },
      { id:"plan-20260922-03",time:"13:20",kind:"交通",title:"由名古屋市區前往場館",place:"名鐵名古屋→尾張橫須賀",detail:"名鐵至尾張橫須賀後步行約 12 分鐘，門到門約 55 分鐘；五連休移動可能擁擠，目標 14:20 前抵達。",nav:venueMap,status:"current" },
      { id:"plan-20260922-04",time:"16:00",kind:"比賽",title:"KAB04 中華台北女子隊",place:"東海市民體育館",detail:"賽後原路回名古屋；女子 B 組 Sri Lanka vs. Chinese Taipei。",nav:venueMap,status:"current" },
    ],
  },
  {
    date:"9/23",day:"三",city:"名古屋・東海市",title:"名古屋城 → KAB06",detail:"秋分日的比賽日只安排名古屋城上午短訪，下午保留完整前往場館與入場緩衝。",stay:"Central Nagoya Stays",tone:"match",notice:"秋分之日、五連休最後一天，名古屋城預期排隊；開門進場。天守閣不可入內，開園 09:00–16:30。",
    schedule:[
      { id:"plan-20260923-01",time:"08:10",kind:"交通",title:"從住宿前往名古屋城",place:"Central Nagoya Stays→名古屋城站",detail:"步行至太閤通站、搭地鐵後步行入城；07:30 起床，秋分之日、人潮高，開門即入城。",nav:"https://www.google.com/maps/search/?api=1&query=Nagoya+Castle",status:"current" },
      { id:"plan-20260923-02",time:"09:00",kind:"景點",title:"名古屋城",place:"名古屋城正門／本丸御殿",detail:"開園 09:00–16:30；天守閣不可入內。11:15 前離開，下午不排第二個景點。",official:"https://www.nagoyajo.city.nagoya.jp/",nav:"https://www.google.com/maps/search/?api=1&query=Nagoya+Castle",status:"current" },
      { id:"plan-20260923-03",time:"13:25",kind:"交通",title:"由市區前往場館",place:"名鐵名古屋→尾張橫須賀",detail:"名鐵＋步行約 55 分鐘；五連休最後一天，目標 14:30 前抵場館。",nav:venueMap,status:"current" },
      { id:"plan-20260923-04",time:"16:00",kind:"比賽",title:"KAB06 中華台北女子隊",place:"東海市民體育館",detail:"賽後原路回名古屋；女子 B 組 Chinese Taipei vs. Nepal。",nav:venueMap,status:"current" },
    ],
  },
  {
    date:"9/24",day:"四",city:"東海市・西尾・榮",title:"KAB07 → 西尾城、抹茶、榮黑膠",detail:"上午只看比賽；賽後一個下午景點放西尾歷史公園與抹茶，晚上回榮逛黑膠。",stay:"Central Nagoya Stays",tone:"match",notice:"西尾抹茶設施 17:00 前結束、公園 18:00 前；若賽程延後，縮短西尾，保留晚上的榮商圈。",
    schedule:[
      { id:"plan-20260924-01",time:"07:45",kind:"交通",title:"從住宿前往場館",place:"Central Nagoya Stays→東海市民體育館",detail:"名鐵＋步行約 50 分鐘；06:40 起床，08:35 前抵達。",nav:venueMap,status:"current" },
      { id:"plan-20260924-02",time:"09:30",kind:"比賽",title:"KAB07 中華台北女子隊",place:"東海市民體育館",detail:"賽程結束後才往西尾移動；女子 B 組 Thailand vs. Chinese Taipei。",nav:venueMap,status:"current" },
      { id:"plan-20260924-03",time:"13:30",kind:"景點",title:"西尾歷史公園・西尾城與抹茶",place:"西尾市歷史公園",detail:"場館至西尾約 89 分鐘、需轉乘；西尾站步行約 15 分鐘；公園開至 18:00，抹茶ラボ 10:00–17:00、呈茶至 16:00，16:35 前離開。",official:"https://www.city.nishio.aichi.jp/shisetsu/1005437/1002603.html",nav:"https://www.google.com/maps/search/?api=1&query=Nishio+Historical+Park",status:"current" },
      { id:"plan-20260924-04",time:"17:50",kind:"購物",title:"榮商圈逛黑膠・Face Records",place:"中日大樓 2F",detail:"西尾回名古屋後轉地下鐵至榮，約 75 分鐘；營業 10:00–20:00（依中日大樓休館日），晚上可慢慢逛。",official:"https://nagoya.facerecords.com/",nav:"https://www.google.com/maps/search/?api=1&query=Face+Records+Nagoya+Chunichi+Building",status:"current" },
    ],
  },
  {
    date:"9/25",day:"五",city:"東海市",title:"女子卡巴迪・KAB09／KAB10",detail:"兩場女子準決賽日，不另排任何景點。",stay:"Central Nagoya Stays",tone:"match",notice:"請以最終對戰表確認中華台北所屬場次；兩場之間留在場館周邊休息。",
    schedule:[
      { id:"plan-20260925-01",time:"11:00",kind:"交通",title:"從住宿前往場館",place:"Central Nagoya Stays→東海市民體育館",detail:"名鐵＋步行約 50–60 分鐘；08:30 起床，12:00 前到場用午餐，今天不另排景點。",nav:venueMap,status:"current" },
      { id:"plan-20260925-02",time:"13:00",kind:"比賽",title:"KAB09 女子準決賽",place:"東海市民體育館",detail:"兩場間留在場館周邊；中華台北若晉級，請依最終對戰表確認是否在此場。",nav:venueMap,status:"pending" },
      { id:"plan-20260925-03",time:"18:00",kind:"比賽",title:"KAB10 女子準決賽",place:"東海市民體育館",detail:"賽後原路回名古屋；中華台北若晉級，請依最終對戰表確認是否在此場。",nav:venueMap,status:"pending" },
    ],
  },
  {
    date:"9/26",day:"六",city:"熱田・東海市",title:"熱田神宮 → KAB11 女子決賽",detail:"上午一個景點：熱田神宮；中午前先到女子決賽場地。",stay:"Central Nagoya Stays",tone:"match",notice:"熱田神宮可 24 小時參拜，御守授與約日出至日落；決賽對戰組合取決於準決賽結果。",
    schedule:[
      { id:"plan-20260926-01",time:"07:30",kind:"交通",title:"從住宿前往熱田神宮",place:"Central Nagoya Stays→熱田神宮",detail:"經名古屋站轉 JR 熱田站，步行入神宮，約 35 分鐘；06:45 起床，上午只排這一處。",nav:"https://www.google.com/maps/search/?api=1&query=Atsuta+Jingu",status:"current" },
      { id:"plan-20260926-02",time:"08:05",kind:"寺院",title:"熱田神宮參拜",place:"熱田神宮",detail:"由 JR 熱田站步行約 10 分鐘；可 24 小時參拜，御守授與約日出至日落，10:00 離開。",official:"https://www.atsutajingu.or.jp/",nav:"https://www.google.com/maps/search/?api=1&query=Atsuta+Jingu",status:"current" },
      { id:"plan-20260926-03",time:"10:20",kind:"交通",title:"離開神宮前往女子決賽",place:"神宮前站→尾張橫須賀站",detail:"步行至神宮前站、搭名鐵，至場館約 45 分鐘；11:15 前抵場，保留午餐和入場緩衝。",nav:venueMap,status:"current" },
      { id:"plan-20260926-04",time:"13:00",kind:"比賽",title:"KAB11 女子決賽",place:"東海市民體育館",detail:"賽後直接回名古屋休息；若中華台北與印度皆晉級，可能在此爭冠，以準決賽結果為準。",nav:venueMap,status:"pending" },
    ],
  },
  {
    date:"9/27",day:"日",city:"墨俣・大垣",title:"墨俣一夜城與大垣城",detail:"沒有比賽的週日安排兩個相近景點：先墨俣、再大垣；明知鐵道行程已移除。",stay:"Central Nagoya Stays",tone:"west",notice:"墨俣一夜城與大垣城週日皆開館；W65 目前日祝班表可銜接，出發前一週再核對時刻表。",
    schedule:[
      { id:"plan-20260927-01",time:"07:20",kind:"鐵路",title:"從住宿前往 JR 岐阜",place:"Central Nagoya Stays→名古屋→JR 岐阜",detail:"步行至名古屋站後搭 JR 東海道線，約 18 分鐘至岐阜；06:40 起床，目標接 08:32 的岐阜巴士 W65。",nav:"https://www.google.com/maps/search/?api=1&query=JR+Gifu+Station",status:"current" },
      { id:"plan-20260927-02",time:"08:32",kind:"巴士",title:"岐阜巴士 W65 往墨俣",place:"JR 岐阜站 6 號乘車處",detail:"日祝班表約 31 分鐘，09:03 抵墨俣；目前 2026/4/1 班表可銜接，出發前一週請再查一次。",official:"https://www.gifubus.co.jp/rosen/timetable.html",nav:"https://www.google.com/maps/search/?api=1&query=JR+Gifu+Station",status:"pending" },
      { id:"plan-20260927-03",time:"09:03",kind:"景點",title:"墨俣一夜城",place:"墨俣一夜城址・犀川堤",detail:"墨俣站步行約 12 分鐘；週日開館，10:00 搭同線回 JR 岐阜，避免壓縮大垣城時間。",official:"https://www.kankou-gifu.jp/spot/detail_6038.html",nav:"https://www.google.com/maps/search/?api=1&query=Sunomata+Ichiyajo+Castle",status:"current" },
      { id:"plan-20260927-04",time:"11:15",kind:"景點",title:"大垣城",place:"大垣公園",detail:"10:00 巴士回 JR 岐阜約 10:27，轉 JR 至大垣後步行約 7 分鐘；09:00–17:00、最晚入館 16:30，成人 200 日圓，午後散步、15:00 左右返名古屋。",official:"https://www.city.ogaki.lg.jp/0000000577.html",nav:"https://www.google.com/maps/search/?api=1&query=Ogaki+Castle",status:"current" },
    ],
  },
  {
    date:"9/28",day:"一",city:"長久手・岡崎",title:"LINIMO・長久手古戰場 → 八草 → 愛知環狀鐵道・岡崎城",detail:"無比賽日安排兩個交通順向景點：古戰場紀念館開門後入館，再轉往岡崎城。",stay:"Central Nagoya Stays",tone:"west",notice:"古戰場紀念館 09:00–17:00、週二休館，因此放週一；岡崎城 09:00–17:00、最晚 16:30 入場。",
    schedule:[
      { id:"plan-20260928-01",time:"07:45",kind:"交通",title:"從住宿前往長久手",place:"Central Nagoya Stays→藤之丘站",detail:"經名古屋站轉地下鐵東山線，再接 LINIMO；07:00 起床，無比賽日，今天安排兩個交通順向景點。",nav:"https://www.google.com/maps/search/?api=1&query=Fujigaoka+Station+Aichi",status:"current" },
      { id:"plan-20260928-02",time:"09:00",kind:"景點",title:"長久手古戰場紀念館",place:"長久手古戰場公園",detail:"LINIMO 長久手古戰場站步行前往；開館 09:00–17:00、最晚入館 16:30，週二休館，週一可參觀。",official:"https://kosenjo-kinenkan.com/info/",nav:"https://www.google.com/maps/search/?api=1&query=Nagakute+Battlefield+Museum",status:"current" },
      { id:"plan-20260928-03",time:"10:30",kind:"鐵路",title:"LINIMO 至八草・轉愛知環狀鐵道",place:"八草站",detail:"LINIMO 約 10 分鐘；愛知環狀鐵道至中岡崎約 45 分鐘，轉乘月台與班次間隔當日再確認。",official:"https://www.linimo.jp/",nav:"https://www.google.com/maps/search/?api=1&query=Yakusa+Station",status:"pending" },
      { id:"plan-20260928-04",time:"11:45",kind:"景點",title:"岡崎城",place:"岡崎公園",detail:"中岡崎站步行約 15 分鐘；09:00–17:00、最晚入館 16:30，成人 300 日圓，16:00 離城返名古屋。",official:"https://okazaki-kanko.jp/okazaki-park/feature/okazakijo/riyouannai",nav:"https://www.google.com/maps/search/?api=1&query=Okazaki+Castle",status:"current" },
    ],
  },
  {
    date:"9/29",day:"二",city:"伊勢",title:"伊勢神宮（外宮 → 內宮）",detail:"無比賽日安排最遠的伊勢；依外宮、內宮、御蔭橫丁順序參拜與散策。",stay:"Central Nagoya Stays",tone:"tokyo",notice:"避開五連休後的週二，長程交通較平穩；特急指定席請預訂，出發前再確認班次。",
    schedule:[
      { id:"plan-20260929-01",time:"06:45",kind:"交通",title:"從住宿前往近鐵名古屋站",place:"Central Nagoya Stays→近鐵名古屋站",detail:"步行約 14 分鐘；06:00 起床，避開五連休後的週二，仍請預訂特急指定席。",nav:"https://www.google.com/maps/search/?api=1&query=Kintetsu+Nagoya+Station",status:"pending" },
      { id:"plan-20260929-02",time:"07:30",kind:"鐵路",title:"近鐵特急前往伊勢市",place:"近鐵名古屋站",detail:"直達特急約 75–80 分鐘；搭接近 07:30–08:00 的直達特急。",official:"https://www.kintetsu.co.jp/foreign/chinese-tw/",nav:"https://www.google.com/maps/search/?api=1&query=Kintetsu+Nagoya+Station",status:"pending" },
      { id:"plan-20260929-03",time:"09:30",kind:"寺院",title:"伊勢神宮・外宮",place:"豐受大神宮（外宮）",detail:"伊勢市站步行約 5 分鐘；依外宮→內宮順序參拜，出發當日請再看神宮公布的參拜時間。",official:"https://www.isejingu.or.jp/",nav:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Geku",status:"current" },
      { id:"plan-20260929-04",time:"10:40",kind:"巴士",title:"巴士前往內宮",place:"外宮前→內宮前",detail:"市內巴士約 20 分鐘，依車流調整；保留回程特急的時間，不在巴士延誤時硬撐行程。",nav:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Naiku",status:"current" },
      { id:"plan-20260929-05",time:"11:10",kind:"寺院",title:"伊勢神宮・內宮與御蔭橫丁",place:"皇大神宮（內宮）・おかげ横丁",detail:"內宮前下車即達；16:30 前離開、往宇治山田或伊勢市搭車，17:30 前搭上特急。",official:"https://www.isejingu.or.jp/",nav:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Naiku",status:"current" },
    ],
  },
  {
    date:"9/30",day:"三",city:"名古屋 → 台灣",title:"返程・JX839",detail:"只安排退房、寄放行李與前往機場。",stay:"返程",tone:"tokyo",notice:"航班時刻以星宇 App／訂位通知為準；不安排遠程景點。",
    schedule:[
      { id:"plan-20260930-01",time:"08:30",kind:"準備",title:"起床與收拾行李",place:"Central Nagoya Stays",detail:"11:00 前退房；無人住宿請依退房指示，行李可先寄在名古屋站置物櫃。",nav:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya",status:"current" },
      { id:"plan-20260930-02",time:"15:55",kind:"交通",title:"從住宿前往中部國際機場",place:"名鐵名古屋站",detail:"步行至名鐵名古屋站，搭 μSKY 約 28 分鐘至機場；目標 17:00 到機場，保留近 3 小時報到與安檢。",official:"https://www.meitetsu.co.jp/eng/",nav:"https://www.google.com/maps/search/?api=1&query=Meitetsu+Nagoya+Station",status:"pending" },
      { id:"plan-20260930-03",time:"19:55",kind:"航班",title:"JX839 起飛返台",place:"中部國際機場→桃園",detail:"航程後預計 22:00 抵桃園；飛行時刻仍以星宇 App／訂位通知為準。",official:"https://www.starlux-airlines.com/",nav:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport",status:"pending" },
    ],
  },
];

const seedResources = [
  { id:"venue-map",categoryId:"match",title:"東海市民體育館｜比賽場地地圖",url:venueMap,note:"女子卡巴迪賽事場地：Masugata-1-1 Takayokosukamachi, Tokai, Aichi 477-0037。",location:"東海市",status:"booked",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-3000 },
  { id:"stay-map",categoryId:"stay",title:"Central Nagoya Stays｜住宿地圖",url:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya",note:"1 Chome-28-8 Wakamiyacho, Nakamura Ward, Nagoya, Aichi 453-0023。",location:"名古屋",status:"booked",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-2000 },
  { id:"games-site",categoryId:"match",title:"愛知・名古屋 2026 亞運官方網站",url:"https://www.aichi-nagoya2026.org/",note:"賽程、場館資訊與重要公告請以官方更新為準。",location:"愛知・名古屋",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-1000 },
  { id:"schedule-reference",categoryId:"match",title:"女子卡巴迪完整賽程表（附原始圖片）",url:"./kabaddi-schedule.html",note:"中華台北女子隊 B 組：斯里蘭卡、尼泊爾、泰國；附上 9/21–9/26 全賽程與淘汰賽時段。",location:"東海市民體育館",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now() },
];

window.TRIP_DATA.itinerary = itinerary;
window.TRIP_DATA.seedResources = seedResources;
