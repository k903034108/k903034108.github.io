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
  { date:"9/20",day:"日",city:"名古屋",title:"抵達日本・JX838｜彈性休息",detail:"搭乘星宇航空 JX838 抵達名古屋，前往 Central Nagoya Stays 辦理入住；若入境、入住後仍在傍晚前抵市中心，可先逛榮商圈，否則保留體力。",transport:"中部國際機場 → 名古屋市區",stay:"Central Nagoya Stays",tone:"sendai",notice:"黑膠唱片店的主安排在 9/24 晚上；抵達日不必硬塞行程。" },
  { date:"9/21",day:"一",city:"犬山",title:"犬山城與城下町",detail:"08:30 左右由名鐵名古屋出發；09:30 起參觀犬山城、城下町，午後回名古屋休息。",transport:"名鐵名古屋 ⇄ 犬山；犬山站步行至犬山城",stay:"Central Nagoya Stays",tone:"north",notice:"犬山城 09:00–17:00、最晚 16:30 入場；此日安排可避開比賽日前的長距離移動。" },
  { date:"9/22",day:"二",city:"清洲・名古屋・東海市",title:"清洲城＋名古屋城 → KAB04",detail:"09:00 清洲城；11:00 名古屋城，13:30 前離開市區並前往場館；16:00 女子 B 組：斯里蘭卡 vs. 中華台北。",transport:"名鐵名古屋 ⇄ 清洲／名古屋城 → 東海市民體育館",stay:"Central Nagoya Stays",tone:"match",notice:"清洲城週一休館，因此放週二；名古屋城採上午短訪，最晚 13:30 出發前往場館。" },
  { date:"9/23",day:"三",city:"墨俣・大垣・東海市",title:"墨俣一夜城＋大垣城 → KAB06",detail:"早上前往墨俣一夜城，約 11:30 轉往大垣城；13:00 前離開大垣並返回名古屋、轉往場館；16:00 女子 B 組：中華台北 vs. 尼泊爾。",transport:"名古屋 → 大垣／墨俣（公車）→ 名古屋 → 東海市民體育館",stay:"Central Nagoya Stays",tone:"match",notice:"兩座城館皆約 09:00 開館、17:00 閉館；此日仰賴墨俣公車銜接，出發前一週請再核對班次，若延誤優先保留墨俣一夜城與比賽，大垣城改列候補。" },
  { date:"9/24",day:"四",city:"東海市・西尾・榮",title:"KAB07 → 西尾城、抹茶、榮黑膠",detail:"09:30 女子 B 組：泰國 vs. 中華台北；賽後前往西尾歷史公園、西尾城與抹茶店，傍晚回榮商圈逛黑膠唱片店。",transport:"東海市民體育館 → 西尾 → 榮商圈 → 住宿",stay:"Central Nagoya Stays",tone:"match",notice:"西尾抹茶設施多於 17:00 前結束，公園 18:00 前；若 KAB07 賽程延後，依優先順序縮短西尾、保留榮商圈黑膠時間。" },
  { date:"9/25",day:"五",city:"東海市",title:"女子卡巴迪・KAB09／KAB10",detail:"13:00 與 18:00 為女子準決賽兩場；中華台北若晉級，將在其中一場出賽。",transport:"名古屋 → 東海市民體育館",stay:"Central Nagoya Stays",tone:"match",notice:"一天兩場，請確認中華台北所屬場次與入場安排。" },
  { date:"9/26",day:"六",city:"熱田・東海市",title:"熱田神宮 → KAB11 女子決賽",detail:"08:00 參拜熱田神宮；10:30 左右離開，提早抵達場館；13:00 女子決賽，若中華台北與印度皆晉級，可能是中華台北 vs. 印度。",transport:"名古屋市區 → 熱田神宮 → 東海市民體育館",stay:"Central Nagoya Stays",tone:"match",notice:"熱田神宮只排上午，保留足夠時間前往決賽；決賽對戰組合取決於準決賽結果。" },
  { date:"9/27",day:"日",city:"岩村・明智",title:"岩村城與日本大正村",detail:"早上搭 JR 中央本線至惠那、轉明知鐵道到岩村，走訪岩村城址與城下町；下午續往明智，參觀日本大正村後回名古屋。",transport:"名古屋 → 惠那（JR 中央本線）→ 岩村／明智（明知鐵道）→ 名古屋",stay:"Central Nagoya Stays",tone:"west",notice:"岩村歷史資料館週一休館；日本大正村各館有週二、週三、週五不同休館日，週日是最完整且安全的安排。" },
  { date:"9/28",day:"一",city:"長久手・岡崎",title:"LINIMO・長久手古戰場 → 八草 → 愛知環狀鐵道・岡崎城",detail:"由藤之丘搭 LINIMO 至長久手古戰場，參觀古戰場紀念館；續搭至八草，轉愛知環狀鐵道至中岡崎，步行前往岡崎城與岡崎公園。",transport:"名古屋地下鐵東山線 → 藤之丘 → LINIMO 長久手古戰場／八草 → 愛知環狀鐵道 中岡崎",stay:"Central Nagoya Stays",tone:"west",notice:"長久手古戰場紀念館週二休館，放在週一；岡崎城 09:00–17:00、最晚 16:30 入場，請在下午 16:00 前抵達。" },
  { date:"9/29",day:"二",city:"伊勢",title:"伊勢神宮（外宮 → 內宮）",detail:"早班近鐵前往伊勢市，依外宮、內宮、御蔭橫丁／托福橫丁順序參拜與散策；傍晚回名古屋，為隔日 JX839 留出餘裕。",transport:"近鐵名古屋 ⇄ 伊勢市／五十鈴川；市內公車往返外宮、內宮",stay:"Central Nagoya Stays",tone:"tokyo",notice:"伊勢神宮 9 月可參拜；此日為完整遠程日，建議先訂近鐵來回指定席，並在出發前再次確認班次。" },
  { date:"9/30",day:"三",city:"名古屋 → 台灣",title:"返程・JX839",detail:"從住宿前往中部國際機場，搭乘星宇航空 JX839 返回台灣。",transport:"名古屋市區 → 中部國際機場",stay:"返程",tone:"tokyo" },
];
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
      <span class="city-label">${item.city}</span><span class="day-title">${item.title}</span>
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
    item.notice ? { label:"注意事項",title:"出發前確認",detail:item.notice } : null,
  ].filter(Boolean);
  $("#dayPlanList").innerHTML = rows.map((row) => `
    <section class="plan-row"><span class="plan-dot" aria-hidden="true"></span><small>${escapeHtml(row.label)}</small><h3>${escapeHtml(row.title)}</h3><p>${escapeHtml(row.detail)}</p></section>`).join("");

  const customItems = itemsForDay(state.selectedDayKey);
  $("#dayAgenda").innerHTML = customItems.length ? customItems.map((agenda) => `
    <button class="agenda-item" type="button" data-itinerary-edit="${escapeAttr(agenda.id)}" aria-label="編輯 ${escapeAttr(agenda.title)}">
      <span class="agenda-time">${escapeHtml(agenda.time || "未定")}</span>
      <span class="agenda-main"><strong>${escapeHtml(agenda.title)}</strong>${agenda.location ? `<span class="agenda-location">⌖ ${escapeHtml(agenda.location)}</span>` : ""}${agenda.notes ? `<span class="agenda-note">注意：${escapeHtml(agenda.notes)}</span>` : ""}</span>
      <span class="agenda-more" aria-hidden="true">•••</span>
    </button>`).join("") : `<div class="agenda-empty"><span aria-hidden="true">＋</span><p>這天還沒有自己安排的細項<br>按「安排這一天」開始新增。</p></div>`;
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
