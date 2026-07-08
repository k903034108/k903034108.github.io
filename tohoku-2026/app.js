const FIREBASE_VERSION = "12.15.0";
const STORAGE_KEY = "tohoku-2026-resources-v1";
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
  { date:"12/19",day:"六",city:"仙台",title:"抵達日本，前往仙台",detail:"入住後散步、暖身吃牛舌。",transport:"機場／東京 → 仙台",stay:"仙台 ①",tone:"sendai" },
  { date:"12/20",day:"日",city:"仙台",title:"仙台經典一日",detail:"瑞鳳殿、仙台城跡、大崎八幡宮。",stay:"仙台 ②",tone:"sendai" },
  { date:"12/21",day:"一",city:"松島",title:"日本三景・松島",detail:"瑞巖寺、五大堂、圓通院、海灣遊船。",transport:"仙台 ⇄ 松島海岸",stay:"仙台 ③",tone:"sendai" },
  { date:"12/22",day:"二",city:"八戶",title:"港町海鮮日",detail:"陸奧湊站前朝市、八食中心。",transport:"仙台 → 八戶",stay:"八戶",tone:"north",notice:"避開八食中心週三公休" },
  { date:"12/23",day:"三",city:"青森",title:"史前遺跡與青森藝術",detail:"三內丸山遺跡、青森縣立美術館。",transport:"八戶 → 新青森 → 青森",stay:"青森",tone:"north",notice:"美術館年末休館前最後機會" },
  { date:"12/24",day:"四",city:"青森 → 弘前",title:"睡魔與青森灣",detail:"WA RASSE、A-FACTORY；傍晚前往弘前。",stay:"弘前 ①",tone:"north" },
  { date:"12/25",day:"五",city:"弘前",title:"弘前城下町",detail:"弘前公園、津輕藩睡魔村、蘋果派。",stay:"弘前 ②",tone:"north",notice:"天守內部長期關閉，公園照常" },
  { date:"12/26",day:"六",city:"五能線 → 秋田",title:"Resort Shirakami",detail:"弘前 08:48 → 秋田 13:29；午後千秋公園。",transport:"全車指定席",stay:"秋田",tone:"west",notice:"2026 運轉日已確認" },
  { date:"12/27",day:"日",city:"山形",title:"移動到山形",detail:"霞城公園、文翔館、七日町散步。",transport:"秋田 → 仙台轉車 → 山形",stay:"山形",tone:"west" },
  { date:"12/28",day:"一",city:"藏王溫泉",title:"第一班巴士上山",detail:"約 07:00 出發；寄行李、租具、開始滑雪。",transport:"山形站 → 藏王溫泉",stay:"藏王 ①",tone:"snow" },
  { date:"12/29",day:"二",city:"藏王溫泉",title:"藏王全天滑雪",detail:"天候許可搭纜車看樹冰，晚上泡溫泉。",stay:"藏王 ②",tone:"snow" },
  { date:"12/30",day:"三",city:"藏王 → 東京",title:"上午滑雪，下午進東京",detail:"約 13:20 巴士下山；15:46／16:06 後 Tsubasa。",transport:"預估 18:36–18:56 抵東京",stay:"東京 ①",tone:"snow",notice:"年末尖峰：指定席 11/30 開賣即訂" },
  { date:"12/31",day:"四",city:"東京",title:"東京東側戶外日",detail:"淺草寺、隅田川、晴空塔；避開休館館舍。",stay:"東京 ②",tone:"tokyo" },
  { date:"1/1",day:"五",city:"東京",title:"新年初詣",detail:"明治神宮、原宿、表參道、澀谷街區。",stay:"東京 ③",tone:"tokyo",notice:"元旦人潮大，商場多縮時／休息" },
  { date:"1/2",day:"六",city:"東京",title:"新年一般參賀",detail:"皇居、丸之內、銀座初賣。",stay:"東京 ④",tone:"tokyo",notice:"皇居活動待 2027 官方公告" },
  { date:"1/3",day:"日",city:"東京",title:"自由行／返程",detail:"依航班安排最後採買與前往機場。",stay:"返程",tone:"tokyo" },
];

const seedResources = [
  { id:"official-1",categoryId:"transport",title:"JR 東日本｜Resort Shirakami 2026 運轉日",url:"https://www.jreast.co.jp/press/2025/akita/20260116_a02.pdf",note:"12/26 已確認運轉，全車指定席。",location:"五能線",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-3000 },
  { id:"official-2",categoryId:"transport",title:"山交巴士｜山形－藏王溫泉線",url:"https://www.yamagatakotsu.jp/busroute1/z90/",note:"12/28 第一班與 12/30 下山班次，秋季再複核。",location:"藏王／山形",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-2000 },
  { id:"official-3",categoryId:"spot",title:"青森縣立美術館｜開館資訊",url:"https://www.aomori-museum.jp/visit/?target=facility",note:"2026/12/24–2027/1/1 休館，因此排 12/23。",location:"青森",status:"shortlist",pinned:true,updatedBy:"行程整理",updatedAt:Date.now()-1000 },
];

const state = {
  tab: "itinerary",
  category: "all",
  query: "",
  resources: [],
  editingId: null,
  backend: "local",
  firebase: null,
  user: null,
  authorized: false,
  unsubscribe: null,
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

function renderItinerary() {
  $("#dayGrid").innerHTML = itinerary.map((item) => `
    <article class="day-card tone-${item.tone}">
      <div class="day-date"><strong>${item.date}</strong><span>週${item.day}</span></div>
      <div class="day-content">
        <p class="city-label">${item.city}</p><h3>${item.title}</h3><p>${item.detail}</p>
        ${item.transport ? `<small>${item.transport}</small>` : ""}
        ${item.notice ? `<em>${item.notice}</em>` : ""}
      </div>
      <span class="stay-chip">${item.stay}</span>
    </article>`).join("");
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
    if (state.backend === "cloud" && state.authorized) {
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
    if (state.backend === "cloud" && state.authorized) {
      const { doc,deleteDoc } = state.firebase.firestore;
      await deleteDoc(doc(state.firebase.db,"boards",BOARD_ID,"resources",resource.id));
    } else {
      state.resources = state.resources.filter((item) => item.id !== resource.id); saveLocalResources(); renderResources(); setSyncStatus("local");
    }
    $("#editorDialog").close(); showToast("已刪除連結");
  } catch (error) { console.error(error); setSyncStatus("error"); showToast("暫時無法刪除"); }
}

function setSyncStatus(mode) {
  const dot = $("#syncDot"); dot.className = "sync-dot";
  if (mode === "local") { dot.classList.add("local"); $("#syncLabel").textContent = "本機草稿"; }
  if (mode === "saving") { dot.classList.add("saving"); $("#syncLabel").textContent = "正在儲存…"; }
  if (mode === "cloud") { $("#syncLabel").textContent = "已即時同步"; }
  if (mode === "error") { dot.classList.add("error"); $("#syncLabel").textContent = "連線異常"; }
}

function updateModeBanner() {
  const banner = $("#modeBanner");
  if (state.backend === "cloud") {
    banner.className = "mode-banner cloud"; banner.innerHTML = `<span class="banner-icon">✓</span><div><strong>Firebase 即時同步已連線</strong><p>你和女朋友會看到同一份資料。</p></div><button type="button" id="modeAction">帳號資訊</button>`;
  } else if (firebaseConfigured() && state.user) {
    banner.className = "mode-banner local"; banner.innerHTML = `<span class="banner-icon">!</span><div><strong>已登入，等待資料庫授權</strong><p>複製 UID，加入 Firestore members 後即可同步。</p></div><button type="button" id="modeAction">查看 UID</button>`;
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
  else if (state.authorized) { $("#shareHeading").textContent = "雲端同步已連線"; $("#shareDescription").textContent = "把網址傳給已加入 members 的另一位編輯者。"; }
  else { $("#shareHeading").textContent = "還差 Firestore 授權"; $("#shareDescription").textContent = "複製下方 UID，加入 boards/tohoku-2026/members 後即可使用。"; }
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
      state.user = user; state.authorized = false;
      state.unsubscribe?.(); state.unsubscribe = null;
      if (!user) { state.backend = "local"; state.resources = loadLocalResources(); setSyncStatus("local"); updateModeBanner(); renderResources(); return; }
      $("#currentAvatar").textContent = initials(user.displayName || user.email || "我");
      listenToCloud(); updateModeBanner();
    });
  } catch (error) { console.error(error); setSyncStatus("error"); showToast("Firebase 連線失敗"); }
}

function listenToCloud() {
  const f = state.firebase.firestore;
  const ref = f.collection(state.firebase.db,"boards",BOARD_ID,"resources");
  state.unsubscribe = f.onSnapshot(ref, async (snapshot) => {
    state.authorized = true; state.backend = "cloud";
    state.resources = snapshot.docs.map((item) => ({ id:item.id,...item.data() }));
    setSyncStatus("cloud"); updateModeBanner(); renderResources();
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
    console.warn(error); state.authorized = false; state.backend = "local"; state.resources = loadLocalResources();
    setSyncStatus(error.code === "permission-denied" ? "local" : "error"); updateModeBanner(); renderResources();
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
  $$('[data-action="add"]').forEach((button) => button.addEventListener("click", () => openEditor()));
  $("#categoryRow").addEventListener("click", (event) => { const button = event.target.closest("[data-category]"); if (!button) return; state.category = button.dataset.category; renderCategories(); renderResources(); });
  $("#librarySearch").addEventListener("input", (event) => { state.query = event.target.value; event.target.nextElementSibling.hidden = !event.target.value; renderResources(); });
  $("#globalSearch").addEventListener("input", (event) => { event.target.nextElementSibling.hidden = !event.target.value; renderResources(); });
  $$(".clear-search").forEach((button) => button.addEventListener("click", () => { const input = button.previousElementSibling; input.value = ""; button.hidden = true; if (input.id === "librarySearch") state.query = ""; renderResources(); input.focus(); }));
  $("#resourceForm").addEventListener("submit", submitResource); $("#deleteButton").addEventListener("click", deleteCurrentResource);
  $("#resourceUrl").addEventListener("blur", () => { if ($("#resourceTitle").value || !$("#resourceUrl").value) return; try { $("#resourceTitle").value = new URL($("#resourceUrl").value).hostname.replace(/^www\./,""); } catch {} });
  $$('[data-close-dialog]').forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close()));
  $$('dialog').forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
  $("#shareButton").addEventListener("click", openShareDialog); $("#copyShareUrl").addEventListener("click", () => copyText($("#shareUrl").value,"網站網址已複製"));
  $("#copyUid").addEventListener("click", () => copyText($("#userUid").textContent,"UID 已複製"));
  $("#googleSignIn").addEventListener("click", googleSignIn); $("#googleSignOut").addEventListener("click", async () => { await state.firebase?.authModule.signOut(state.firebase.auth); $("#shareDialog").close(); });
}

function showToast(message) { $("#toastText").textContent = message; $("#toast").hidden = false; clearTimeout(showToast.timer); showToast.timer = setTimeout(() => { $("#toast").hidden = true; },3200); }
async function copyText(value,message) { try { await navigator.clipboard.writeText(value); showToast(message); } catch { showToast("請長按後手動複製"); } }
function timestampValue(value) { if (typeof value === "number") return value; if (value?.toMillis) return value.toMillis(); if (value?.seconds) return value.seconds * 1000; return 0; }
function safeHostname(value) { try { return new URL(value).hostname.replace(/^www\./,""); } catch { return value; } }
function initials(value) { const text = String(value || "我").trim(); const parts = text.split(/\s+/); return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)[0]}` : text.slice(0,2)).toUpperCase(); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g,(char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" })[char]); }
function escapeAttr(value) { return escapeHtml(value); }

state.resources = loadLocalResources();
renderItinerary(); renderCategories(); renderResources(); bindEvents(); updateModeBanner(); setTab("itinerary"); connectFirebase();
