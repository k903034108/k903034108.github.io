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
  { date:"9/20",cardTime:"20:45–21:15 入住",day:"日",city:"中部國際機場・名古屋",title:"抵達日本・JX838｜晚抵休息",detail:"目前夏季班表為桃園 14:55 起飛、名古屋 18:45 落地；通關取 60 分鐘，抵市區後直接入住休息。",transport:"中部國際機場 → 名鐵名古屋（μSKY 約 28 分鐘）→ 住宿步行 14 分鐘",timing:"無須設定日本起床時間；19:45 左右離開航廈、搭第一班適合的 μSKY，預計 20:45–21:15 到 Central Nagoya Stays。",stay:"Central Nagoya Stays",tone:"sendai",notice:"JX838／JX839 班表仍可能調整；抵達日晚間不再安排榮商圈。" },
  { date:"9/21",cardTime:"07:50 出發 · 09:00 犬山城",day:"一",city:"犬山",title:"犬山城與城下町",detail:"上午入犬山城，午後走城下町後回名古屋休息。",transport:"住宿步行 14 分鐘 → 名鐵名古屋；名鐵約 25 分鐘至犬山 → 步行 20 分鐘至犬山城",timing:"07:00 起床，07:50 離開住宿；09:00 抵達犬山城。回程同路約 60 分鐘，16:00 左右離開犬山可在 17:00 前回住宿。",stay:"Central Nagoya Stays",tone:"north",notice:"犬山城 09:00–17:00、最晚 16:30 入場；此日安排可避開比賽日前的長距離移動。" },
  { date:"9/22",cardTime:"09:00 清洲城 · 16:00 KAB04",day:"二",city:"清洲・名古屋・東海市",title:"清洲城＋名古屋城 → KAB04",detail:"上午清洲城、名古屋城；16:00 女子 B 組：斯里蘭卡 vs. 中華台北。",transport:"名鐵名古屋 ⇄ 新清洲；地下鐵名古屋城站；名鐵尾張橫須賀站步行至東海市民體育館",timing:"07:15 起床，08:10 離開住宿；住宿→清洲城約 45 分鐘，09:00 入城。10:10 離開清洲城，約 35 分鐘到名古屋城、11:00 抵達；12:45 離開名古屋城，轉地下鐵＋名鐵＋步行約 55 分鐘，14:00 前抵場館。",stay:"Central Nagoya Stays",tone:"match",notice:"清洲城週一休館，因此放週二；名古屋城採上午短訪，最晚 12:45 離開以保留比賽緩衝。" },
  { date:"9/23",cardTime:"09:00 墨俣 · 16:00 KAB06",day:"三",city:"墨俣・大垣・東海市",title:"墨俣一夜城＋大垣城 → KAB06",detail:"早上墨俣一夜城，續往大垣城；16:00 女子 B 組：中華台北 vs. 尼泊爾。",transport:"JR 名古屋 → 大垣；岐垣線公車至墨俣；JR＋名鐵至尾張橫須賀站 → 場館步行",timing:"06:15 起床，07:00 離開住宿；目標搭 JR 於 08:00 前到大垣，接平日 08:20 岐垣線、08:48 到墨俣，步行 12 分鐘後 09:00 到一夜城。10:27 公車回大垣、10:50 到站，步行 7 分鐘至大垣城；12:45 離城，JR＋名鐵＋步行約 65 分鐘，14:30 前到場館。",stay:"Central Nagoya Stays",tone:"match",notice:"墨俣公車是本日關鍵銜接；若延誤優先保留墨俣一夜城與比賽，大垣城改列候補。出發前一週請再次核對公車。" },
  { date:"9/24",cardTime:"09:30 KAB07 · 17:50 榮黑膠",day:"四",city:"東海市・西尾・榮",title:"KAB07 → 西尾城、抹茶、榮黑膠",detail:"09:30 女子 B 組：泰國 vs. 中華台北；賽後前往西尾歷史公園與抹茶店，傍晚回榮商圈逛黑膠。",transport:"名鐵尾張橫須賀 → 西尾（約 74 分鐘、2 次轉乘）→ 步行 15 分鐘至歷史公園；西尾 → 名鐵名古屋 → 地下鐵榮",timing:"06:40 起床，07:45 離開住宿；住宿→場館約 50 分鐘，08:35 前抵達。以賽程 12:00 左右結束估算，場館→西尾城約 89 分鐘，13:30 抵達；16:35 離開西尾，西尾→榮約 75 分鐘，17:50 左右開始逛黑膠。",stay:"Central Nagoya Stays",tone:"match",notice:"西尾抹茶設施多於 17:00 前結束，公園 18:00 前；若 KAB07 賽程延後，依優先順序縮短西尾、保留榮商圈黑膠時間。" },
  { date:"9/25",cardTime:"13:00 · 18:00 女子準決賽",day:"五",city:"東海市",title:"女子卡巴迪・KAB09／KAB10",detail:"13:00 與 18:00 為女子準決賽兩場；中華台北若晉級，將在其中一場出賽。",transport:"住宿步行 14 分鐘 → 名鐵名古屋；名鐵約 17–23 分鐘至尾張橫須賀 → 步行 12 分鐘至場館",timing:"08:30 起床；11:00 離開住宿，門到門抓 50–60 分鐘，12:00 前抵場館並用餐。18:00 場次結束後，同路回住宿約 50–60 分鐘。",stay:"Central Nagoya Stays",tone:"match",notice:"一天兩場，請確認中華台北所屬場次與入場安排；兩場之間不另排外出景點。" },
  { date:"9/26",cardTime:"08:05 熱田神宮 · 13:00 決賽",day:"六",city:"熱田・東海市",title:"熱田神宮 → KAB11 女子決賽",detail:"早上參拜熱田神宮；13:00 女子決賽，若中華台北與印度皆晉級，可能是中華台北 vs. 印度。",transport:"太閤通 → 名古屋 → JR 熱田站 → 步行至熱田神宮；熱田神宮 → 神宮前 → 名鐵尾張橫須賀 → 場館步行",timing:"06:45 起床，07:30 離開住宿；住宿→熱田神宮約 35 分鐘，08:05 左右抵達。10:20 離開神宮，走至神宮前站後搭名鐵，約 45 分鐘到場館，11:15 前抵達決賽場地。",stay:"Central Nagoya Stays",tone:"match",notice:"熱田神宮只排上午，保留足夠時間前往決賽；決賽對戰組合取決於準決賽結果。" },
  { date:"9/27",cardTime:"08:34 岩村 · 13:50 大正村",day:"日",city:"岩村・明智",title:"岩村城與日本大正村",detail:"上午岩村城址與城下町，下午日本大正村；這天步行爬坡量最大。",transport:"JR 中央本線名古屋 → 惠那；明知鐵道惠那 → 岩村 → 明智；明智站步行至日本大正村",timing:"05:15 起床，05:50 離開住宿；必須在 07:55 前到惠那轉乘 08:05 明知鐵道，08:34 到岩村。岩村站→城址步行上坡約 60 分鐘，09:35 抵達；11:45 下山回站，搭 12:53 往明智、約 13:43 到，步行 7 分鐘進日本大正村。17:14 從明智返惠那、18:04 到；再搭 JR，約 19:40 回住宿。",stay:"Central Nagoya Stays",tone:"west",notice:"岩村歷史資料館週一休館；日本大正村各館有週二、週三、週五不同休館日，週日是最完整且安全的安排。請穿防滑鞋並攜水。" },
  { date:"9/28",cardTime:"08:50 古戰場 · 11:45 岡崎城",day:"一",city:"長久手・岡崎",title:"LINIMO・長久手古戰場 → 八草 → 愛知環狀鐵道・岡崎城",detail:"由藤之丘搭 LINIMO 至長久手古戰場，續至八草轉愛知環狀鐵道，前往岡崎城。",transport:"太閤通 → 名古屋 → 地下鐵東山線藤之丘 → LINIMO 長久手古戰場／八草 → 愛知環狀鐵道中岡崎 → 步行至岡崎城",timing:"07:00 起床，07:45 離開住宿；住宿→長久手古戰場約 65 分鐘，08:50 前到紀念館旁。10:30 離開古戰場，LINIMO 至八草約 10 分鐘，愛知環狀鐵道至中岡崎約 45 分鐘、再走 10 分鐘，11:45 左右到岡崎城。16:00 離城，整段回住宿約 110 分鐘。",stay:"Central Nagoya Stays",tone:"west",notice:"長久手古戰場紀念館週二休館，放在週一；岡崎城 09:00–17:00、最晚 16:30 入場，請在下午 16:00 前抵達。" },
  { date:"9/29",cardTime:"09:30 外宮 · 11:10 內宮",day:"二",city:"伊勢",title:"伊勢神宮（外宮 → 內宮）",detail:"早班近鐵前往伊勢市，依外宮、內宮、御蔭橫丁／托福橫丁順序參拜與散策。",transport:"住宿步行至近鐵名古屋；近鐵特急至伊勢市；市內巴士外宮 → 內宮；宇治山田／伊勢市搭特急返名古屋",timing:"06:00 起床，06:45 離開住宿；步行 14 分鐘至近鐵名古屋，搭 07:30–08:00 的直達特急（75–80 分鐘），09:30 前到伊勢市；步行 5 分鐘至外宮。10:40 左右搭巴士約 20 分鐘至內宮；16:30 前離開御蔭橫丁，搭巴士回宇治山田／伊勢市，建議 17:30 前搭上返名古屋特急，約 19:00 回住宿。",stay:"Central Nagoya Stays",tone:"tokyo",notice:"伊勢神宮 9 月可參拜；近鐵特急請預訂指定席，並在出發前再次確認班次。" },
  { date:"9/30",cardTime:"15:55 出發 · 19:55 JX839",day:"三",city:"名古屋 → 台灣",title:"返程・JX839",detail:"JX839 目前夏季班表為 19:55 自中部國際機場起飛、22:00 抵桃園；此日只排退房與機場。",transport:"住宿步行 14 分鐘至名鐵名古屋 → μSKY 約 28 分鐘至中部國際機場",timing:"08:30 起床，11:00 前退房；因住宿為無人管理，先把行李寄放名古屋站置物櫃較安全。15:55 最晚離開住宿，約 17:00 到機場，保留近 3 小時辦理報到與安檢。",stay:"返程",tone:"tokyo",notice:"航班時刻仍請以星宇 App／訂位通知為準；不要安排 9/30 的遠程景點。" },
];

const venueMapUrl = "https://www.google.com/maps/place/%E6%9D%B1%E6%B5%B7%E5%B8%82%E6%B0%91%E9%AB%94%E8%82%B2%E9%A4%A8/@35.0152105,136.8821004,17z/data=!4m9!1m2!2m1!1sTokai+Citizen+Gymnasium,+Masugata-1-1+Takayokosukamachi,+Tokai,+Aichi+477-0037!3m5!1s0x60037e674802d5df:0xbf255fefc20dcac7!8m2!3d35.0151126!4d136.884416!16s%2Fg%2F1tnhy80v?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D";
const timedSchedule = {
  "2026-09-20": [
    { time:"18:45", title:"JX838 抵達中部國際機場", location:"中部國際機場第 1 航廈", transport:"先完成入境、領行李；預留約 60 分鐘。", note:"航班時刻仍可能調整，請以星宇 App／訂位通知為準。", url:"https://www.centrair.jp/en/", urlLabel:"機場資訊", map:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport" },
    { time:"19:45", title:"搭名鐵 μSKY 前往名古屋", location:"中部國際空港站", transport:"μSKY 至名鐵名古屋站約 28 分鐘，再步行約 14 分鐘到住宿。", note:"抵達日只安排入住；班機延誤時直接搭下一班合適列車即可。", url:"https://www.meitetsu.co.jp/eng/", urlLabel:"名鐵資訊", map:"https://www.google.com/maps/search/?api=1&query=Central+Japan+International+Airport+Station" },
    { time:"20:45", title:"入住 Central Nagoya Stays", location:"中村區若宮町 1-28-8", transport:"名鐵名古屋站出站後步行約 14 分鐘。", note:"無人住宿請先確認入住說明與門禁密碼。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" }
  ],
  "2026-09-21": [
    { time:"07:50", title:"從住宿出發", location:"Central Nagoya Stays", transport:"步行約 14 分鐘至名鐵名古屋站。", note:"07:00 起床、簡單早餐後出發。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" },
    { time:"09:00", title:"犬山城", location:"國寶犬山城", transport:"名鐵名古屋→犬山約 25 分鐘，步行約 20 分鐘。", note:"開放 09:00–17:00、最晚 16:30 入場；天守樓梯陡，建議穿防滑鞋。", url:"https://inuyama-castle.jp/", urlLabel:"犬山城官網", map:"https://www.google.com/maps/search/?api=1&query=Inuyama+Castle" },
    { time:"11:00", title:"犬山城下町散策", location:"本町通・三光稻荷神社一帶", transport:"由犬山城步行即可抵達。", note:"午餐與甜點留在城下町；傍晚前回名古屋休息。", url:"https://inuyama.gr.jp/", urlLabel:"犬山旅遊", map:"https://www.google.com/maps/search/?api=1&query=Inuyama+Jokamachi" },
    { time:"16:00", title:"返回名古屋", location:"犬山站", transport:"名鐵回名古屋約 25 分鐘，回住宿全程約 60 分鐘。", note:"隔天有 16:00 比賽，今晚不另排遠程行程。", map:"https://www.google.com/maps/search/?api=1&query=Inuyama+Station" }
  ],
  "2026-09-22": [
    { time:"08:10", title:"從住宿出發", location:"Central Nagoya Stays", transport:"前往名鐵名古屋站，轉名鐵至新清洲。", note:"07:15 起床；今天上午景點要準時切換。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" },
    { time:"09:00", title:"清洲城", location:"清洲城・五條川畔", transport:"新清洲站步行約 15 分鐘。", note:"開放 09:00–17:00；週一休館，所以安排在週二。", url:"https://www.nagoya-info.jp/spot/detail/169/", urlLabel:"景點資訊", map:"https://www.google.com/maps/search/?api=1&query=Kiyosu+Castle" },
    { time:"11:00", title:"名古屋城", location:"名古屋城正門／本丸御殿", transport:"由清洲轉回市區，約 35 分鐘。", note:"天守閣目前不可進入；請在出發前確認亞運期間的特別開放與門票。", url:"https://www.nagoyajo.city.nagoya.jp/", urlLabel:"名古屋城官網", map:"https://www.google.com/maps/search/?api=1&query=Nagoya+Castle" },
    { time:"12:45", title:"離開名古屋城前往場館", location:"名城線／名鐵轉乘", transport:"地鐵＋名鐵至尾張橫須賀站，步行約 12 分鐘；全程約 55 分鐘。", note:"下午比賽優先，務必保留延誤緩衝。", map:venueMapUrl },
    { time:"14:00", title:"抵達東海市民體育館", location:"Tokai Citizen Gymnasium", transport:"入館、找座位與用餐緩衝。", note:"16:00 KAB04：女子 B 組 Sri Lanka vs. Chinese Taipei。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-23": [
    { time:"07:00", title:"從住宿出發", location:"Central Nagoya Stays", transport:"前往 JR 名古屋站，搭東海道線至大垣。", note:"06:15 起床；今天的關鍵是 08:20 從大垣站出發的公車。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" },
    { time:"08:20", title:"大垣站搭巴士往墨俣", location:"大垣站前", transport:"岐阜巴士約 28 分鐘，08:48 到墨俣。", note:"這是平日銜接；出發前一週請再次核對時刻表。", url:"https://www.gifubus.co.jp/", urlLabel:"巴士資訊", map:"https://www.google.com/maps/search/?api=1&query=Ogaki+Station" },
    { time:"09:00", title:"墨俣一夜城", location:"墨俣一夜城址・犀川堤", transport:"墨俣巴士站步行約 12 分鐘。", note:"小型城館，若公車延誤則縮短停留，優先保留比賽。", url:"https://www.kankou-gifu.jp/spot/detail_6038.html", urlLabel:"景點資訊", map:"https://www.google.com/maps/search/?api=1&query=Sunomata+Ichiyajo+Castle" },
    { time:"11:00", title:"大垣城", location:"大垣公園", transport:"10:27 巴士回大垣、10:50 左右到站，再步行約 7 分鐘。", note:"通常 09:00–17:00，最晚入館 16:30；若上午延誤，這站可移至候補。", url:"https://www.city.ogaki.lg.jp/0000000577.html", urlLabel:"大垣城資訊", map:"https://www.google.com/maps/search/?api=1&query=Ogaki+Castle" },
    { time:"12:45", title:"離開大垣前往場館", location:"大垣→名古屋→尾張橫須賀", transport:"JR＋名鐵＋步行約 65 分鐘。", note:"目標 14:30 前到場館。", map:venueMapUrl },
    { time:"16:00", title:"KAB06 中華台北女子隊", location:"東海市民體育館", transport:"賽後原路回名古屋。", note:"女子 B 組 Chinese Taipei vs. Nepal。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-24": [
    { time:"07:45", title:"從住宿前往場館", location:"Central Nagoya Stays→東海市民體育館", transport:"名鐵＋步行約 50 分鐘。", note:"06:40 起床；08:35 前抵達，預留入館時間。", map:venueMapUrl },
    { time:"09:30", title:"KAB07 中華台北女子隊", location:"東海市民體育館", transport:"賽程結束後才往西尾移動。", note:"女子 B 組 Thailand vs. Chinese Taipei；若轉播調整，依官方賽程為準。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl },
    { time:"13:30", title:"西尾歷史公園・西尾城", location:"西尾市歷史公園", transport:"場館至西尾約 89 分鐘、需轉乘；公園步行遊覽。", note:"園區在傍晚前關閉；比賽延後時先縮短這站。", url:"https://www.city.nishio.aichi.jp/shisetsu/1005437/1002603.html", urlLabel:"西尾市資訊", map:"https://www.google.com/maps/search/?api=1&query=Nishio+Historical+Park" },
    { time:"15:00", title:"西尾抹茶時間", location:"西尾市歷史公園周邊", transport:"由公園步行選擇茶店／抹茶體驗。", note:"多數抹茶設施約 17:00 前結束，最晚 16:35 離開西尾。", url:"https://nishio-matcha.jp/", urlLabel:"西尾抹茶資訊", map:"https://www.google.com/maps/search/?api=1&query=Nishio+Matcha" },
    { time:"17:50", title:"榮商圈逛黑膠・Face Records", location:"中日大樓 2F", transport:"西尾回名古屋後轉地下鐵至榮，約 75 分鐘。", note:"營業 10:00–20:00（依中日大樓休館日）；今晚可慢慢逛。", url:"https://nagoya.facerecords.com/", urlLabel:"唱片店官網", map:"https://www.google.com/maps/search/?api=1&query=Face+Records+Nagoya+Chunichi+Building" }
  ],
  "2026-09-25": [
    { time:"11:00", title:"從住宿前往場館", location:"Central Nagoya Stays→東海市民體育館", transport:"名鐵＋步行約 50–60 分鐘。", note:"08:30 起床；12:00 前到場用午餐、確認賽程和座位。", map:venueMapUrl },
    { time:"13:00", title:"KAB09 女子準決賽", location:"東海市民體育館", transport:"兩場間不另外排景點。", note:"若中華台北晉級，請依最終對戰表確認是否在此場出賽。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl },
    { time:"18:00", title:"KAB10 女子準決賽", location:"東海市民體育館", transport:"賽後原路回名古屋。", note:"若中華台北晉級，請依最終對戰表確認是否在此場出賽。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-26": [
    { time:"07:30", title:"從住宿前往熱田神宮", location:"Central Nagoya Stays→熱田神宮", transport:"經名古屋站轉 JR 熱田站，步行入神宮；約 35 分鐘。", note:"06:45 起床，僅安排上午參拜。", map:"https://www.google.com/maps/search/?api=1&query=Atsuta+Jingu" },
    { time:"08:05", title:"熱田神宮參拜", location:"熱田神宮", transport:"由 JR 熱田站步行約 10 分鐘。", note:"神宮可 24 小時參拜；御守授與約日出至日落。", url:"https://www.atsutajingu.or.jp/", urlLabel:"熱田神宮官網", map:"https://www.google.com/maps/search/?api=1&query=Atsuta+Jingu" },
    { time:"10:20", title:"離開神宮前往女子決賽", location:"神宮前站→尾張橫須賀站", transport:"步行至神宮前站、搭名鐵，至場館約 45 分鐘。", note:"請在 11:15 前到場，決賽日前保留充足緩衝。", map:venueMapUrl },
    { time:"13:00", title:"KAB11 女子決賽", location:"東海市民體育館", transport:"賽後直接回名古屋休息。", note:"若中華台北與印度皆晉級，可能在此爭冠；仍以準決賽結果為準。", url:"./kabaddi-schedule.html", urlLabel:"完整賽程", map:venueMapUrl }
  ],
  "2026-09-27": [
    { time:"05:50", title:"從住宿前往恵那", location:"Central Nagoya Stays→JR 名古屋站", transport:"搭 JR 中央本線至恵那，務必趕上 08:05 明知鐵道。", note:"05:15 起床；全日爬坡最多，備水與防滑鞋。", map:"https://www.google.com/maps/search/?api=1&query=Ena+Station" },
    { time:"08:34", title:"抵達岩村站", location:"明知鐵道・岩村站", transport:"由站走到岩村城址約 60 分鐘上坡。", note:"先走城下町後上城較順；若下雨，調整為城下町為主。", map:"https://www.google.com/maps/search/?api=1&query=Iwamura+Station" },
    { time:"09:35", title:"岩村城址與城下町", location:"岩村城址", transport:"站→城下町→城址一路上坡。", note:"城址為戶外；歷史資料館週一休館，但今日為週日可順道入館。", url:"https://www.kankou-ena.jp/455.php", urlLabel:"岩村旅遊", map:"https://www.google.com/maps/search/?api=1&query=Iwamura+Castle+Ruins" },
    { time:"13:50", title:"日本大正村", location:"明智町・大正村", transport:"12:53 從岩村搭明知鐵道，13:43 到明智站，步行約 7 分鐘。", note:"各館休館日不同；週日安排可看到較完整內容，入館票券依要進的館舍購買。", url:"https://taishomura.jp/", urlLabel:"大正村官網", map:"https://www.google.com/maps/search/?api=1&query=Japan+Taisho+Village" },
    { time:"17:14", title:"從明智返程", location:"明智站", transport:"明知鐵道返恵那後轉 JR，約 19:40 回住宿。", note:"別錯過末段列車；全日不再安排晚間景點。", map:"https://www.google.com/maps/search/?api=1&query=Akechi+Station+Gifu" }
  ],
  "2026-09-28": [
    { time:"07:45", title:"從住宿前往長久手", location:"Central Nagoya Stays→藤之丘站", transport:"經名古屋站轉地下鐵東山線，再接 LINIMO。", note:"07:00 起床；今天全程依 LINIMO、愛知環狀鐵道轉乘。", map:"https://www.google.com/maps/search/?api=1&query=Fujigaoka+Station+Aichi" },
    { time:"08:50", title:"長久手古戰場", location:"長久手古戰場公園・色金山歷史公園", transport:"LINIMO 長久手古戰場站步行前往。", note:"古戰場公園可先走；紀念館週二休館，週一安排可參觀。", url:"https://kosenjo-kinenkan.com/", urlLabel:"古戰場資訊", map:"https://www.google.com/maps/search/?api=1&query=Nagakute+Battlefield+Museum" },
    { time:"10:30", title:"LINIMO 至八草・轉愛知環狀鐵道", location:"八草站", transport:"LINIMO 約 10 分鐘；轉愛知環狀鐵道至中岡崎約 45 分鐘。", note:"轉乘月台與班次間隔需於當日再確認。", url:"https://www.linimo.jp/", urlLabel:"LINIMO 資訊", map:"https://www.google.com/maps/search/?api=1&query=Yakusa+Station" },
    { time:"11:45", title:"岡崎城", location:"岡崎公園", transport:"中岡崎站步行約 10 分鐘。", note:"開放 09:00–17:00、最晚 16:30 入場；目標 16:00 前離城。", url:"https://okazaki-kanko.jp/point/2", urlLabel:"岡崎觀光", map:"https://www.google.com/maps/search/?api=1&query=Okazaki+Castle" },
    { time:"16:00", title:"從岡崎返回名古屋", location:"中岡崎站", transport:"愛知環狀鐵道＋轉乘，回住宿約 110 分鐘。", note:"若上午延誤，優先保留岡崎城的入場時間。", map:"https://www.google.com/maps/search/?api=1&query=Nakaokazaki+Station" }
  ],
  "2026-09-29": [
    { time:"06:45", title:"從住宿前往近鐵名古屋站", location:"Central Nagoya Stays→近鐵名古屋站", transport:"步行約 14 分鐘。", note:"06:00 起床；特急指定席請先訂好並在出發前確認班次。", map:"https://www.google.com/maps/search/?api=1&query=Kintetsu+Nagoya+Station" },
    { time:"07:30", title:"近鐵特急前往伊勢市", location:"近鐵名古屋站", transport:"直達特急約 75–80 分鐘。", note:"搭最接近 07:30–08:00 的直達特急，讓外宮能從容開始。", url:"https://www.kintetsu.co.jp/foreign/chinese-tw/", urlLabel:"近鐵資訊", map:"https://www.google.com/maps/search/?api=1&query=Kintetsu+Nagoya+Station" },
    { time:"09:30", title:"伊勢神宮・外宮", location:"豐受大神宮（外宮）", transport:"伊勢市站步行約 5 分鐘。", note:"九月參拜時間通常為 05:00–18:00；依外宮→內宮順序參拜。", url:"https://www.isejingu.or.jp/", urlLabel:"伊勢神宮官網", map:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Geku" },
    { time:"10:40", title:"巴士前往內宮", location:"外宮前→內宮前", transport:"市內巴士約 20 分鐘，當日依車流調整。", note:"假日／連假車流會影響時間，先把回程特急當作固定目標。", map:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Naiku" },
    { time:"11:10", title:"伊勢神宮・內宮與御蔭橫丁", location:"皇大神宮（內宮）・おかげ横丁", transport:"內宮前下車即達。", note:"九月參拜時間通常為 05:00–18:00；16:30 前離開、往宇治山田或伊勢市搭車。", url:"https://www.isejingu.or.jp/", urlLabel:"伊勢神宮官網", map:"https://www.google.com/maps/search/?api=1&query=Ise+Jingu+Naiku" },
    { time:"17:30", title:"近鐵特急返回名古屋", location:"宇治山田站／伊勢市站", transport:"特急約 75–80 分鐘，約 19:00 回住宿。", note:"請預先保留指定席；若巴士塞車，直接改由伊勢市站回程。", map:"https://www.google.com/maps/search/?api=1&query=Ujiyamada+Station" }
  ],
  "2026-09-30": [
    { time:"08:30", title:"起床與收拾行李", location:"Central Nagoya Stays", transport:"11:00 前退房。", note:"無人住宿請依退房指示；行李可先寄在名古屋站置物櫃。", map:"https://www.google.com/maps/search/?api=1&query=Central+Nagoya+Stays+1+Chome-28-8+Wakamiyacho+Nakamura+Ward+Nagoya" },
    { time:"15:55", title:"從住宿前往中部國際機場", location:"名鐵名古屋站", transport:"步行至名鐵名古屋站，搭 μSKY 約 28 分鐘至機場。", note:"最晚 15:55 出發，目標 17:00 到機場，保留近 3 小時報到與安檢。", url:"https://www.meitetsu.co.jp/eng/", urlLabel:"名鐵資訊", map:"https://www.google.com/maps/search/?api=1&query=Meitetsu+Nagoya+Station" },
    { time:"17:00", title:"抵達中部國際機場・辦理報到", location:"中部國際機場第 1 航廈", transport:"依星宇櫃檯與航班看板辦理。", note:"國際線報到截止規則請以星宇通知為準。", url:"https://www.centrair.jp/en/", urlLabel:"機場資訊", map:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport" },
    { time:"19:55", title:"JX839 起飛返台", location:"中部國際機場→桃園", transport:"航程後預計 22:00 抵桃園。", note:"飛行時刻仍請以星宇 App／訂位通知為準。", url:"https://www.starlux-airlines.com/", urlLabel:"星宇航空", map:"https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport" }
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
