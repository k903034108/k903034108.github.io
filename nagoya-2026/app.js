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

const itinerary = [
  { date:"9/20",cardTime:"20:45–21:15 入住",day:"日",city:"中部國際機場・名古屋",title:"抵達日本・JX838｜晚抵休息",detail:"桃園 14:55 起飛、名古屋 18:45 落地的現行夏季班表為參考；通關後直接入住。",transport:"中部國際機場 → 名鐵名古屋（μSKY 約 28 分鐘）→ 住宿步行 14 分鐘",timing:"不安排日本起床時間；19:45 左右離開航廈，預計 20:45–21:15 到 Central Nagoya Stays。",stay:"Central Nagoya Stays",tone:"sendai",notice:"JX838／JX839 時刻仍以星宇 App／訂位通知為準；抵達日晚間不安排景點。" },
  { date:"9/21",cardTime:"07:50 出發 · 09:00 犬山城",day:"一",city:"犬山",title:"犬山城與城下町",detail:"五連休第一天只安排犬山一區：開門即入城，午後走城下町後回名古屋。",transport:"住宿步行 14 分鐘 → 名鐵名古屋；名鐵約 25 分鐘至犬山 → 步行 20 分鐘至犬山城",timing:"07:00 起床、07:50 離開住宿；08:50 前到城下町，09:00 入城。15:00 左右離開犬山，16:00 前回住宿。",stay:"Central Nagoya Stays",tone:"north",notice:"敬老之日，五連休人潮高；犬山城 09:00–17:00、最晚 16:30 入場，請開門即進。" },
  { date:"9/22",cardTime:"09:00 清洲城 · 16:00 KAB04",day:"二",city:"清洲・東海市",title:"清洲城 → KAB04",detail:"比賽日只放上午的清洲城；中午回名古屋用餐、休息後再往場館。",transport:"名鐵名古屋 ⇄ 新清洲；尾張橫須賀站步行至東海市民體育館",timing:"07:15 起床、08:10 離開住宿；09:00–10:30 清洲城。13:20 由名古屋市區出發，14:20 前抵場館。",stay:"Central Nagoya Stays",tone:"match",notice:"國民之休日，仍在五連休；清洲城週一休館、週二開館。今天不再塞入名古屋城。" },
  { date:"9/23",cardTime:"09:00 名古屋城 · 16:00 KAB06",day:"三",city:"名古屋・東海市",title:"名古屋城 → KAB06",detail:"秋分日的比賽日只安排名古屋城上午短訪，下午保留完整前往場館與入場緩衝。",transport:"地下鐵名古屋城站；市區 → 名鐵尾張橫須賀站 → 場館步行",timing:"07:30 起床、08:10 離開住宿；09:00–11:15 名古屋城。13:25 由市區出發，14:30 前抵場館。",stay:"Central Nagoya Stays",tone:"match",notice:"秋分之日、五連休最後一天，名古屋城預期排隊；開門進場。天守閣不可入內，開園 09:00–16:30。" },
  { date:"9/24",cardTime:"09:30 KAB07 · 17:50 榮黑膠",day:"四",city:"東海市・西尾・榮",title:"KAB07 → 西尾城、抹茶、榮黑膠",detail:"上午只看比賽；賽後一個下午景點放西尾歷史公園與抹茶，晚上回榮逛黑膠。",transport:"名鐵尾張橫須賀 → 西尾（約 74 分鐘、2 次轉乘）→ 步行 15 分鐘至歷史公園；西尾 → 名鐵名古屋 → 地下鐵榮",timing:"06:40 起床、07:45 離開住宿；08:35 前到場館。賽後目標 13:30 到西尾、16:35 離開，17:50 左右抵榮。",stay:"Central Nagoya Stays",tone:"match",notice:"西尾抹茶設施 17:00 前結束、公園 18:00 前；若賽程延後，縮短西尾，保留晚上的榮商圈。" },
  { date:"9/25",cardTime:"13:00 · 18:00 女子準決賽",day:"五",city:"東海市",title:"女子卡巴迪・KAB09／KAB10",detail:"兩場女子準決賽日，不另排任何景點。",transport:"住宿步行 14 分鐘 → 名鐵名古屋；名鐵至尾張橫須賀 → 步行至場館",timing:"08:30 起床；11:00 離開住宿，12:00 前到場用午餐。18:00 場次結束後原路回名古屋。",stay:"Central Nagoya Stays",tone:"match",notice:"請以最終對戰表確認中華台北所屬場次；兩場之間留在場館周邊休息。" },
  { date:"9/26",cardTime:"08:05 熱田神宮 · 13:00 決賽",day:"六",city:"熱田・東海市",title:"熱田神宮 → KAB11 女子決賽",detail:"上午一個景點：熱田神宮；中午前先到女子決賽場地。",transport:"太閤通 → 名古屋 → JR 熱田站 → 步行至熱田神宮；神宮前 → 名鐵尾張橫須賀 → 場館步行",timing:"06:45 起床、07:30 離開住宿；08:05–10:00 參拜。10:20 離開神宮，11:15 前抵決賽場地。",stay:"Central Nagoya Stays",tone:"match",notice:"熱田神宮可 24 小時參拜，御守授與約日出至日落；決賽對戰組合取決於準決賽結果。" },
  { date:"9/27",cardTime:"09:03 墨俣 · 11:15 大垣",day:"日",city:"墨俣・大垣",title:"墨俣一夜城與大垣城",detail:"沒有比賽的週日安排兩個相近景點：先墨俣、再大垣；明知鐵道行程已移除。",transport:"JR 名古屋 → JR 岐阜；岐阜巴士 W65 至墨俣；回 JR 岐阜後搭 JR 至大垣",timing:"06:40 起床、07:20 離開住宿；08:32 從 JR 岐阜搭 W65，09:03 到墨俣。10:00 回程巴士，11:15 左右到大垣城；15:00 左右返名古屋。",stay:"Central Nagoya Stays",tone:"west",notice:"墨俣一夜城與大垣城週日皆開館；W65 目前日祝班表可銜接，出發前一週再核對時刻表。" },
  { date:"9/28",cardTime:"09:00 古戰場 · 11:45 岡崎城",day:"一",city:"長久手・岡崎",title:"LINIMO・長久手古戰場 → 八草 → 愛知環狀鐵道・岡崎城",detail:"無比賽日安排兩個交通順向景點：古戰場紀念館開門後入館，再轉往岡崎城。",transport:"太閤通 → 名古屋 → 地下鐵東山線藤之丘 → LINIMO 長久手古戰場／八草 → 愛知環狀鐵道中岡崎 → 步行至岡崎城",timing:"07:00 起床、07:45 離開住宿；09:00 入古戰場紀念館。10:30 離開、轉八草與愛知環狀鐵道，11:45 左右到岡崎城；16:00 離城返名古屋。",stay:"Central Nagoya Stays",tone:"west",notice:"古戰場紀念館 09:00–17:00、週二休館，因此放週一；岡崎城 09:00–17:00、最晚 16:30 入場。" },
  { date:"9/29",cardTime:"09:30 外宮 · 11:10 內宮",day:"二",city:"伊勢",title:"伊勢神宮（外宮 → 內宮）",detail:"無比賽日安排最遠的伊勢；依外宮、內宮、御蔭橫丁順序參拜與散策。",transport:"住宿步行至近鐵名古屋；近鐵特急至伊勢市；市內巴士外宮 → 內宮；宇治山田／伊勢市搭特急返名古屋",timing:"06:00 起床、06:45 離開住宿；搭 07:30–08:00 的直達特急，09:30 前到外宮。10:40 搭巴士、11:10 到內宮；16:30 離開返站，17:30 前搭上特急。",stay:"Central Nagoya Stays",tone:"tokyo",notice:"避開五連休後的週二，長程交通較平穩；特急指定席請預訂，出發前再確認班次。" },
  { date:"9/30",cardTime:"15:55 出發 · 19:55 JX839",day:"三",city:"名古屋 → 台灣",title:"返程・JX839",detail:"只安排退房、寄放行李與前往機場。",transport:"住宿步行 14 分鐘至名鐵名古屋 → μSKY 約 28 分鐘至中部國際機場",timing:"08:30 起床、11:00 前退房；15:55 最晚離開住宿，17:00 到機場，保留近 3 小時報到與安檢。",stay:"返程",tone:"tokyo",notice:"航班時刻以星宇 App／訂位通知為準；不安排遠程景點。" },
];
const venueMapUrl = "https://www.google.com/maps/place/%E6%9D%B1%E6%B5%B7%E5%B8%82%E6%B0%91%E9%AB%94%E8%82%B2%E9%A4%A8/@35.0152105,136.8821004,17z/data=!4m9!1m2!2m1!1sTokai+Citizen+Gymnasium,+Masugata-1-1+Takayokosukamachi,+Tokai,+Aichi+477-0037!3m5!1s0x60037e674802d5df:0xbf255fefc20dcac7!8m2!3d35.0151126!4d136.884416!16s%2Fg%2F1tnhy80v?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D";
const timedSchedule = {
  "2026-09-20": [
    { time:"18:45", title:"JX838 抵達中部國際機場", location:"中部國際機場第 1 航廈", transport:"完成入境、領行李，預留約 60 分鐘。", note:"航班時刻以星宇 App／訂位通知為準。", url:"https://www.centrair.jp/en/", urlLabel:"機場資訊", map:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport" },
    { time:"19:45", title:"搭名鐵 μSKY 前往名古屋", location:"中部國際空港站", transport:"μSKY 至名鐵名古屋約 28 分鐘，再步行約 14 分鐘到住宿。", note:"抵達日不再安排景點。", url:"https://www.meitetsu.co.jp/eng/", urlLabel:"名鐵資訊", map:"https://www.google.com/maps/search/?api=1&query=Central+Japan+International+Airport+Station" },
    { time:"20:45", title:"入住 Central Nagoya Stays", location:"中村區若宮町 1-28-8", transport:"由名鐵名古屋站步行約 14 分鐘。", note:"無人住宿請先確認入住說明與門禁密碼。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" }
  ],
  "2026-09-21": [
    { time:"07:50", title:"從住宿出發", location:"Central Nagoya Stays", transport:"步行約 14 分鐘至名鐵名古屋站。", note:"敬老之日、五連休第一天；07:00 起床，請準時出發。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" },
    { time:"08:50", title:"抵達犬山城下町", location:"犬山城前", transport:"名鐵名古屋→犬山約 25 分鐘，步行約 20 分鐘。", note:"先到門口等開門，避開五連休入場隊伍。", map:"https://www.google.com/maps/search/?api=1&query=Inuyama+Castle" },
    { time:"09:00", title:"犬山城", location:"國寶犬山城", transport:"城下町步行即可抵達。", note:"開放 09:00–17:00、最晚 16:30 入場；天守樓梯陡，穿防滑鞋。", url:"https://inuyama-castle.jp/", urlLabel:"犬山城官網", map:"https://www.google.com/maps/search/?api=1&query=Inuyama+Castle" },
    { time:"10:30", title:"犬山城下町散策與午餐", location:"本町通・三光稻荷神社一帶", transport:"由犬山城步行即可抵達。", note:"只逛同一區，15:00 離開犬山、傍晚前回住宿休息。", url:"https://inuyama.gr.jp/", urlLabel:"犬山旅遊", map:"https://www.google.com/maps/search/?api=1&query=Inuyama+Jokamachi" }
  ],
  "2026-09-22": [
    { time:"08:10", title:"從住宿前往新清洲", location:"Central Nagoya Stays→名鐵名古屋", transport:"步行到名鐵名古屋後轉名鐵，至新清洲站步行約 15 分鐘。", note:"07:15 起床；今天是國民之休日，景點只排一處。", map:"https://www.google.com/maps/search/?api=1&query=Shinkiyosu+Station" },
    { time:"09:00", title:"清洲城", location:"清洲城・五條川畔", transport:"新清洲站步行約 15 分鐘。", note:"開放 09:00–17:00；週一休館、週二開館。10:30 離開，不續排名古屋城。", url:"https://www.nagoya-info.jp/spot/detail/169/", urlLabel:"景點資訊", map:"https://www.google.com/maps/search/?api=1&query=Kiyosu+Castle" },
    { time:"13:20", title:"由名古屋市區前往場館", location:"名鐵名古屋→尾張橫須賀", transport:"名鐵至尾張橫須賀後步行約 12 分鐘，門到門約 55 分鐘。", note:"五連休移動可能擁擠，目標 14:20 前抵達。", map:venueMapUrl },
    { time:"16:00", title:"KAB04 中華台北女子隊", location:"東海市民體育館", transport:"賽後原路回名古屋。", note:"女子 B 組 Sri Lanka vs. Chinese Taipei。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-23": [
    { time:"08:10", title:"從住宿前往名古屋城", location:"Central Nagoya Stays→名古屋城站", transport:"步行至太閤通站、搭地鐵後步行入城。", note:"07:30 起床；秋分之日、人潮高，開門即入城。", map:"https://www.google.com/maps/search/?api=1&query=Nagoya+Castle" },
    { time:"09:00", title:"名古屋城", location:"名古屋城正門／本丸御殿", transport:"名古屋城站步行可達。", note:"開園 09:00–16:30；天守閣不可入內。11:15 前離開，下午不排第二個景點。", url:"https://www.nagoyajo.city.nagoya.jp/", urlLabel:"名古屋城官網", map:"https://www.google.com/maps/search/?api=1&query=Nagoya+Castle" },
    { time:"13:25", title:"由市區前往場館", location:"名鐵名古屋→尾張橫須賀", transport:"名鐵＋步行約 55 分鐘。", note:"五連休最後一天，目標 14:30 前抵場館。", map:venueMapUrl },
    { time:"16:00", title:"KAB06 中華台北女子隊", location:"東海市民體育館", transport:"賽後原路回名古屋。", note:"女子 B 組 Chinese Taipei vs. Nepal。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-24": [
    { time:"07:45", title:"從住宿前往場館", location:"Central Nagoya Stays→東海市民體育館", transport:"名鐵＋步行約 50 分鐘。", note:"06:40 起床；08:35 前抵達。", map:venueMapUrl },
    { time:"09:30", title:"KAB07 中華台北女子隊", location:"東海市民體育館", transport:"賽程結束後才往西尾移動。", note:"女子 B 組 Thailand vs. Chinese Taipei。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl },
    { time:"13:30", title:"西尾歷史公園・西尾城與抹茶", location:"西尾市歷史公園", transport:"場館至西尾約 89 分鐘、需轉乘；西尾站步行約 15 分鐘。", note:"公園開至 18:00，抹茶ラボ 10:00–17:00、呈茶至 16:00；16:35 前離開。", url:"https://www.city.nishio.aichi.jp/shisetsu/1005437/1002603.html", urlLabel:"西尾市資訊", map:"https://www.google.com/maps/search/?api=1&query=Nishio+Historical+Park" },
    { time:"17:50", title:"榮商圈逛黑膠・Face Records", location:"中日大樓 2F", transport:"西尾回名古屋後轉地下鐵至榮，約 75 分鐘。", note:"營業 10:00–20:00（依中日大樓休館日）；晚上可慢慢逛。", url:"https://nagoya.facerecords.com/", urlLabel:"唱片店官網", map:"https://www.google.com/maps/search/?api=1&query=Face+Records+Nagoya+Chunichi+Building" }
  ],
  "2026-09-25": [
    { time:"11:00", title:"從住宿前往場館", location:"Central Nagoya Stays→東海市民體育館", transport:"名鐵＋步行約 50–60 分鐘。", note:"08:30 起床；12:00 前到場用午餐。今天不另排景點。", map:venueMapUrl },
    { time:"13:00", title:"KAB09 女子準決賽", location:"東海市民體育館", transport:"兩場間留在場館周邊。", note:"中華台北若晉級，請依最終對戰表確認是否在此場。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl },
    { time:"18:00", title:"KAB10 女子準決賽", location:"東海市民體育館", transport:"賽後原路回名古屋。", note:"中華台北若晉級，請依最終對戰表確認是否在此場。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-26": [
    { time:"07:30", title:"從住宿前往熱田神宮", location:"Central Nagoya Stays→熱田神宮", transport:"經名古屋站轉 JR 熱田站，步行入神宮；約 35 分鐘。", note:"06:45 起床；上午只排這一處。", map:"https://www.google.com/maps/search/?api=1&query=Atsuta+Jingu" },
    { time:"08:05", title:"熱田神宮參拜", location:"熱田神宮", transport:"由 JR 熱田站步行約 10 分鐘。", note:"可 24 小時參拜；御守授與約日出至日落。10:00 離開。", url:"https://www.atsutajingu.or.jp/", urlLabel:"熱田神宮官網", map:"https://www.google.com/maps/search/?api=1&query=Atsuta+Jingu" },
    { time:"10:20", title:"離開神宮前往女子決賽", location:"神宮前站→尾張橫須賀站", transport:"步行至神宮前站、搭名鐵，至場館約 45 分鐘。", note:"11:15 前抵場，保留午餐和入場緩衝。", map:venueMapUrl },
    { time:"13:00", title:"KAB11 女子決賽", location:"東海市民體育館", transport:"賽後直接回名古屋休息。", note:"若中華台北與印度皆晉級，可能在此爭冠；以準決賽結果為準。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-27": [
    { time:"07:20", title:"從住宿前往 JR 岐阜", location:"Central Nagoya Stays→名古屋→JR 岐阜", transport:"步行至名古屋站後搭 JR 東海道線，約 18 分鐘至岐阜。", note:"06:40 起床；目標接 08:32 的岐阜巴士 W65。", map:"https://www.google.com/maps/search/?api=1&query=JR+Gifu+Station" },
    { time:"08:32", title:"岐阜巴士 W65 往墨俣", location:"JR 岐阜站 6 號乘車處", transport:"日祝班表約 31 分鐘，09:03 抵墨俣。", note:"目前 2026/4/1 班表可銜接；出發前一週請再查一次。", url:"https://www.gifubus.co.jp/rosen/timetable.html", urlLabel:"岐阜巴士時刻", map:"https://www.google.com/maps/search/?api=1&query=JR+Gifu+Station" },
    { time:"09:03", title:"墨俣一夜城", location:"墨俣一夜城址・犀川堤", transport:"墨俣站步行約 12 分鐘。", note:"週日開館；10:00 搭同線回 JR 岐阜，避免壓縮大垣城時間。", url:"https://www.kankou-gifu.jp/spot/detail_6038.html", urlLabel:"景點資訊", map:"https://www.google.com/maps/search/?api=1&query=Sunomata+Ichiyajo+Castle" },
    { time:"11:15", title:"大垣城", location:"大垣公園", transport:"10:00 巴士回 JR 岐阜約 10:27，轉 JR 至大垣後步行約 7 分鐘。", note:"09:00–17:00、最晚入館 16:30；成人 200 日圓。午後散步、15:00 左右返名古屋。", url:"https://www.city.ogaki.lg.jp/0000000577.html", urlLabel:"大垣城資訊", map:"https://www.google.com/maps/search/?api=1&query=Ogaki+Castle" }
  ],
  "2026-09-28": [
    { time:"07:45", title:"從住宿前往長久手", location:"Central Nagoya Stays→藤之丘站", transport:"經名古屋站轉地下鐵東山線，再接 LINIMO。", note:"07:00 起床；無比賽日，今天安排兩個交通順向景點。", map:"https://www.google.com/maps/search/?api=1&query=Fujigaoka+Station+Aichi" },
    { time:"09:00", title:"長久手古戰場紀念館", location:"長久手古戰場公園", transport:"LINIMO 長久手古戰場站步行前往。", note:"開館 09:00–17:00、最晚入館 16:30；週二休館，週一可參觀。", url:"https://kosenjo-kinenkan.com/info/", urlLabel:"紀念館資訊", map:"https://www.google.com/maps/search/?api=1&query=Nagakute+Battlefield+Museum" },
    { time:"10:30", title:"LINIMO 至八草・轉愛知環狀鐵道", location:"八草站", transport:"LINIMO 約 10 分鐘；愛知環狀鐵道至中岡崎約 45 分鐘。", note:"轉乘月台與班次間隔當日再確認。", url:"https://www.linimo.jp/", urlLabel:"LINIMO 資訊", map:"https://www.google.com/maps/search/?api=1&query=Yakusa+Station" },
    { time:"11:45", title:"岡崎城", location:"岡崎公園", transport:"中岡崎站步行約 15 分鐘。", note:"09:00–17:00、最晚入館 16:30；成人 300 日圓，16:00 離城返名古屋。", url:"https://okazaki-kanko.jp/okazaki-park/feature/okazakijo/riyouannai", urlLabel:"岡崎城資訊", map:"https://www.google.com/maps/search/?api=1&query=Okazaki+Castle" }
  ],
  "2026-09-29": [
    { time:"06:45", title:"從住宿前往近鐵名古屋站", location:"Central Nagoya Stays→近鐵名古屋站", transport:"步行約 14 分鐘。", note:"06:00 起床；避開五連休後的週二，仍請預訂特急指定席。", map:"https://www.google.com/maps/search/?api=1&query=Kintetsu+Nagoya+Station" },
    { time:"07:30", title:"近鐵特急前往伊勢市", location:"近鐵名古屋站", transport:"直達特急約 75–80 分鐘。", note:"搭接近 07:30–08:00 的直達特急。", url:"https://www.kintetsu.co.jp/foreign/chinese-tw/", urlLabel:"近鐵資訊", map:"https://www.google.com/maps/search/?api=1&query=Kintetsu+Nagoya+Station" },
    { time:"09:30", title:"伊勢神宮・外宮", location:"豐受大神宮（外宮）", transport:"伊勢市站步行約 5 分鐘。", note:"依外宮→內宮順序參拜；出發當日請再看神宮公布的參拜時間。", url:"https://www.isejingu.or.jp/", urlLabel:"伊勢神宮官網", map:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Geku" },
    { time:"10:40", title:"巴士前往內宮", location:"外宮前→內宮前", transport:"市內巴士約 20 分鐘；依車流調整。", note:"保留回程特急的時間，不在巴士延誤時硬撐行程。", map:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Naiku" },
    { time:"11:10", title:"伊勢神宮・內宮與御蔭橫丁", location:"皇大神宮（內宮）・おかげ横丁", transport:"內宮前下車即達。", note:"16:30 前離開、往宇治山田或伊勢市搭車；17:30 前搭上特急。", url:"https://www.isejingu.or.jp/", urlLabel:"伊勢神宮官網", map:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Naiku" }
  ],
  "2026-09-30": [
    { time:"08:30", title:"起床與收拾行李", location:"Central Nagoya Stays", transport:"11:00 前退房。", note:"無人住宿請依退房指示；行李可先寄在名古屋站置物櫃。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" },
    { time:"15:55", title:"從住宿前往中部國際機場", location:"名鐵名古屋站", transport:"步行至名鐵名古屋站，搭 μSKY 約 28 分鐘至機場。", note:"目標 17:00 到機場，保留近 3 小時報到與安檢。", url:"https://www.meitetsu.co.jp/eng/", urlLabel:"名鐵資訊", map:"https://www.google.com/maps/search/?api=1&query=Meitetsu+Nagoya+Station" },
    { time:"19:55", title:"JX839 起飛返台", location:"中部國際機場→桃園", transport:"航程後預計 22:00 抵桃園。", note:"飛行時刻仍以星宇 App／訂位通知為準。", url:"https://www.starlux-airlines.com/", urlLabel:"星宇航空", map:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport" }
  ]
};
const seedResources = [
  { id:"venue-map",categoryId:"match",title:"東海市民體育館｜比賽場地地圖",url:"https://www.google.com/maps/place/%E6%9D%B1%E6%B5%B7%E5%B8%82%E6%B0%91%E9%AB%94%E8%82%B2%E9%A4%A8/@35.0152105,136.8821004,17z/data=!4m9!1m2!2m1!1sTokai+Citizen+Gymnasium,+Masugata-1-1+Takayokosukamachi,+Tokai,+Aichi+477-0037!3m5!1s0x60037e674802d5df:0xbf255fefc20dcac7!8m2!3d35.0151126!4d136.884416!16s%2Fg%2F1tnhy80v?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D",note:"女子卡巴迪賽事場地：Masugata-1-1 Takayokosukamachi, Tokai, Aichi 477-0037。",location:"東海市",status:"booked",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-3000 },
  { id:"stay-map",categoryId:"stay",title:"Central Nagoya Stays｜住宿地圖",url:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya",note:"1 Chome-28-8 Wakamiyacho, Nakamura Ward, Nagoya, Aichi 453-0023。",location:"名古屋",status:"booked",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-2000 },
  { id:"games-site",categoryId:"match",title:"愛知・名古屋 2026 亞運官方網站",url:"https://www.aichi-nagoya2026.org/",note:"賽程、場館資訊與重要公告請以官方更新為準。",location:"愛知・名古屋",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-1000 },
  { id:"schedule-reference",categoryId:"match",title:"女子卡巴迪完整賽程表（附原始圖片）",url:"./kabaddi-schedule.html",note:"中華台北女子隊 B 組：斯里蘭卡、尼泊爾、泰國；附上 9/21–9/26 全賽程與淘汰賽時段。",location:"東海市民體育館",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now() },
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

function renderItinerary() {
  $("#dayGrid").innerHTML = itinerary.map((item) => `
    <button class="day-button tone-${item.tone}" type="button" data-day="${itineraryDateKey(item)}" aria-label="查看 ${item.date} ${item.city} 行程" aria-haspopup="dialog" aria-controls="dayDialog" aria-expanded="${state.selectedDayKey === itineraryDateKey(item) && $("#dayDialog")?.open ? "true" : "false"}">
      <span class="day-button-top"><strong>${item.date}</strong><span class="weekday">週${item.day}</span></span>
      <span class="card-time">${item.cardTime}</span><span class="city-label">${item.city}</span><span class="day-title">${item.title}</span>
      ${itemsForDay(itineraryDateKey(item)).length ? `<span class="day-button-count" aria-label="${itemsForDay(itineraryDateKey(item)).length} 筆自訂行程">${itemsForDay(itineraryDateKey(item)).length}</span>` : ""}
    </button>`).join("");
}

function itineraryDateKey(item) {
  const [month, day] = item.date.split("/").map((value) => value.padStart(2,"0"));
  return `2026-${month}-${day}`;
}

function tripDay(dateKey) {
  return itinerary.find((item) => itineraryDateKey(item) === dateKey);
}

function itemsForDay(dateKey) {
  return state.itineraryItems
    .filter((item) => item.date === dateKey)
    .sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99")) || timestampValue(a.createdAt) - timestampValue(b.createdAt));
}

function renderItineraryDateOptions() {
  $("#itineraryDate").innerHTML = itinerary.map((item) => `<option value="${itineraryDateKey(item)}">${item.date}（週${item.day}） · ${item.city}</option>`).join("");
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

function renderDayDetails() {
  const item = tripDay(state.selectedDayKey);
  if (!item) return;
  $("#dayDialogDate").textContent = `${item.date} · 週${item.day}`;
  $("#dayDialogTitle").textContent = item.title;
  $("#dayDialogCity").textContent = `${item.city} · 住宿：${item.stay}`;
  const rows = [
    { label:"主要行程",title:item.title,detail:item.detail },
    item.transport ? { label:"移動方式",title:"交通安排",detail:item.transport } : null,
    item.timing ? { label:"起床與交通",title:"今日節奏",detail:item.timing } : null,
    item.notice ? { label:"注意事項",title:"出發前確認",detail:item.notice } : null,
  ].filter(Boolean);
  $("#dayPlanList").innerHTML = rows.map((row) => `
    <section class="plan-row"><span class="plan-dot" aria-hidden="true"></span><small>${escapeHtml(row.label)}</small><h3>${escapeHtml(row.title)}</h3><p>${escapeHtml(row.detail)}</p></section>`).join("");

  const plannedItems = timedSchedule[state.selectedDayKey] || [];
  const customItems = itemsForDay(state.selectedDayKey);
  const plannedHtml = plannedItems.map((agenda) => `
    <article class="agenda-item planned">
      <span class="agenda-time">${escapeHtml(agenda.time || "未定")}</span>
      <span class="agenda-main"><strong>${escapeHtml(agenda.title)}</strong>${agenda.location ? `<span class="agenda-location">⌖ ${escapeHtml(agenda.location)}</span>` : ""}${agenda.transport ? `<span class="agenda-transport">交通：${escapeHtml(agenda.transport)}</span>` : ""}${agenda.note ? `<span class="agenda-note">注意：${escapeHtml(agenda.note)}</span>` : ""}<span class="agenda-actions">${agenda.url ? `<a class="agenda-link" href="${escapeAttr(agenda.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(agenda.urlLabel || "網站資訊")} ↗</a>` : ""}${agenda.map ? `<a class="agenda-link navigation" href="${escapeAttr(agenda.map)}" target="_blank" rel="noopener noreferrer">導航 ↗</a>` : ""}</span></span>
    </article>`).join("");
  const customHtml = customItems.map((agenda) => `
    <button class="agenda-item" type="button" data-itinerary-edit="${escapeAttr(agenda.id)}" aria-label="編輯 ${escapeAttr(agenda.title)}">
      <span class="agenda-time">${escapeHtml(agenda.time || "未定")}</span>
      <span class="agenda-main"><strong>${escapeHtml(agenda.title)}</strong>${agenda.location ? `<span class="agenda-location">⌖ ${escapeHtml(agenda.location)}</span>` : ""}${agenda.notes ? `<span class="agenda-note">注意：${escapeHtml(agenda.notes)}</span>` : ""}</span>
      <span class="agenda-more" aria-hidden="true">•••</span>
    </button>`).join("");
  $("#dayAgenda").innerHTML = plannedHtml + customHtml || `<div class="agenda-empty"><span aria-hidden="true">＋</span><p>這天還沒有自己安排的細項<br>按「安排這一天」開始新增。</p></div>`;
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

function canOpenItineraryEditor() { return true; }

function openItineraryEditor(id = null, dateKey = null) {
  if (!canOpenItineraryEditor()) return;
  state.editingItineraryId = id;
  const form = $("#itineraryForm");
  form.reset();
  renderItineraryDateOptions();
  $("#itineraryEditorTitle").textContent = id ? "編輯行程" : "新增行程";
  $("#deleteItineraryButton").hidden = !id;
  $("#itinerarySyncNote").textContent = false ? "儲存後會即時同步給兩個人。" : "任何人可直接編輯；變更只會儲存在此瀏覽器。";
  form.elements.date.value = dateKey || itineraryDateKey(itinerary[0]);

  if (id) {
    const item = state.itineraryItems.find((entry) => entry.id === id);
    if (!item) return;
    form.elements.date.value = item.date;
    form.elements.time.value = item.time || "";
    form.elements.title.value = item.title;
    form.elements.location.value = item.location || "";
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
  const notes = String(form.get("notes") || "").trim().slice(0,2000);
  if (!tripDay(date)) { showToast("請選擇這趟旅行中的日期"); return; }
  if (!title) { showToast("請輸入行程名稱"); return; }
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) { showToast("時間格式不正確"); return; }

  const current = state.itineraryItems.find((item) => item.id === state.editingItineraryId);
  const input = { date,time,title,location,notes };
  const personName = currentUserName();
  setSyncStatus("saving");
  try {
    if (false) {
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
    if (false) {
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
  if (mode === "local") { dot.classList.add("local"); $("#syncLabel").textContent = "本機儲存"; }
  if (mode === "saving") { dot.classList.add("saving"); $("#syncLabel").textContent = "正在儲存…"; }
  if (mode === "connecting") { dot.classList.add("saving"); $("#syncLabel").textContent = "同步連線中…"; }
  if (mode === "cloud") { $("#syncLabel").textContent = "已即時同步"; }
  if (mode === "error") { dot.classList.add("error"); $("#syncLabel").textContent = "連線異常"; }
}

function updateModeBanner() {
  const banner = $("#modeBanner");
  if (!banner) return;
  banner.className = "mode-banner local";
  banner.innerHTML = `<span class="banner-icon">✎</span><div><strong>任何人都可以直接編輯</strong><p>不需登入；新增或修改的內容會儲存在你目前使用的瀏覽器。</p></div>`;
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
function safeHostname(value) { if (String(value).startsWith("./")) return "網站內參考資料"; try { return new URL(value).hostname.replace(/^www\./,""); } catch { return value; } }
function initials(value) { const text = String(value || "我").trim(); const parts = text.split(/\s+/); return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)[0]}` : text.slice(0,2)).toUpperCase(); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g,(char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" })[char]); }
function escapeAttr(value) { return escapeHtml(value); }

state.resources = loadLocalResources();
state.itineraryItems = loadLocalItineraryItems();
renderItinerary(); renderItineraryDateOptions(); renderCategories(); renderResources(); bindEvents(); updateModeBanner(); setTab("itinerary");
/* 9/21 Klook 日歸行程的快速閱讀卡：不變更既有可編輯的行程資料。 */
(() => {
  const cardId = "sep21-klook-focus";
  const bookedKey = "nagoya-2026-sep21-klook-booked";
  const klookUrl =
    "https://www.klook.com/zh-TW/activity/175724-day-trip-to-magomejuku-tsumagojuku-and-enakyo-from-nagoya/?spm=SearchResult.SearchResult_LIST&clickId=696ede97e6";

  const renderFocusCard = () => {
    if (document.getElementById(cardId)) return true;

    const host =
      document.querySelector("#itinerary, [data-itinerary], main, .main-content, .app") ||
      document.body;
    if (!host) return false;

    const booked = localStorage.getItem(bookedKey) === "true";
    const section = document.createElement("section");
    section.id = cardId;
    section.setAttribute("aria-label", "9月21日行程重點");
    section.innerHTML = `
      <div class="sep21-focus__head">
        <div>
          <p class="sep21-focus__eyebrow">9/21（一）・當日行程重點</p>
          <h2 class="sep21-focus__title">名古屋近郊文化一日遊</h2>
          <p class="sep21-focus__summary">全日巴士跟團：犬山城 → 惠那峽 → 馬籠宿 → 妻籠宿</p>
        </div>
        <button class="sep21-focus__status" type="button" aria-pressed="${booked}" aria-label="切換預訂狀態">
          ${booked ? "✓ 已訂購" : "待訂購"}
        </button>
      </div>

      <div class="sep21-focus__timeline" aria-label="9月21日時間軸">
        <div class="sep21-focus__stop"><time>08:20</time><strong>到集合點</strong><span>預留 10 分鐘報到</span></div>
        <div class="sep21-focus__stop"><time>08:30</time><strong>名古屋出發</strong><span>以憑證集合資訊為準</span></div>
        <div class="sep21-focus__stop"><time>第 1 站</time><strong>犬山城・三光稻荷</strong><span>約 60 分鐘</span></div>
        <div class="sep21-focus__stop"><time>第 2 站</time><strong>惠那峽展望台</strong><span>約 30 分鐘</span></div>
        <div class="sep21-focus__stop"><time>第 3–4 站</time><strong>馬籠宿・妻籠宿</strong><span>約 90 + 60 分鐘</span></div>
        <div class="sep21-focus__stop"><time>18:20</time><strong>名古屋站解散</strong><span>晚餐再自由安排</span></div>
      </div>

      <div class="sep21-focus__actions">
        <a class="sep21-focus__book" href="${klookUrl}" target="_blank" rel="noopener noreferrer">開啟 Klook 預訂</a>
        <p class="sep21-focus__hint">集合點與導遊資料會在出發前一天以電子郵件通知。</p>
      </div>

      <details class="sep21-focus__details">
        <summary>查看集合、費用與行前提醒</summary>
        <ul>
          <li>商品頁目前列出 08:30 自名古屋出發，頁面集合點顯示為 Ministop；付款後請以憑證及前一天的通知信為準。</li>
          <li>行程含巴士與中文／英文／日文導覽；餐點與保險不含。可攜 1 件標準行李。</li>
          <li>犬山城樓梯較陡，兩個宿場町也以步行為主；穿防滑好走的鞋，並帶現金。</li>
          <li>目前規則為出發前 24 小時可免費取消；逾時、遲到或未到無法退款。天候或未滿 4 人時可能改期或退款。</li>
        </ul>
      </details>
    `;

    const statusButton = section.querySelector(".sep21-focus__status");
    statusButton.addEventListener("click", () => {
      const nextBooked = statusButton.getAttribute("aria-pressed") !== "true";
      localStorage.setItem(bookedKey, String(nextBooked));
      statusButton.setAttribute("aria-pressed", String(nextBooked));
      statusButton.textContent = nextBooked ? "✓ 已訂購" : "待訂購";
    });

    host.prepend(section);
    return true;
  };

  const start = () => {
    if (renderFocusCard()) return;
    const observer = new MutationObserver(() => {
      if (renderFocusCard()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 15000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
