window.__TOHOKU_V2__ = true;
await import("./app.js");

const { categories, itinerary, seedResources, mapsRoute } = window.TRIP_DATA;
const FIREBASE_VERSION = "12.15.0";
const STORAGE_KEY = "tohoku-2026-resources-v1";
const ITINERARY_STORAGE_KEY = "tohoku-2026-itinerary-items-v1";
const RESOURCE_OUTBOX_KEY = "tohoku-2026-resource-outbox-v1";
const BOARD_ID = window.TRIP_BOARD_ID || "tohoku-2026";
const TRIP_START = "2026-12-19";
const TRIP_END = "2027-01-06";
const ROUTE_COLORS = ["#5b8ff9","#30b0c7","#9b72cf","#ff9f0a","#34c759","#ff6b6b","#007aff"];
const DEFAULT_OVERNIGHT_CITIES = {
  "2026-12-19":"山形","2026-12-20":"藏王溫泉","2026-12-21":"藏王溫泉","2026-12-22":"仙台",
  "2026-12-23":"青森","2026-12-24":"青森","2026-12-25":"青森","2026-12-26":"秋田",
  "2026-12-27":"仙台","2026-12-28":"仙台","2026-12-29":"仙台","2026-12-30":"東京",
  "2026-12-31":"東京","2027-01-01":"東京","2027-01-02":"東京","2027-01-03":"橫濱",
  "2027-01-04":"橫濱","2027-01-05":"成田","2027-01-06":"回家"
};
// Firestore 規則同樣以這兩個 UID 為寫入邊界；前端只用來決定 UI，不是安全邊界。
const TRIP_EDITOR_UIDS = new Set([
  "vppVxbbeuSWpvwKfiI6M86xmsxk2",
  "hOiABKk0adcYs098cqrZyIs1KeC3"
]);
const PENCIL_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">' +
  '<path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-9.79a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/></svg>';

const state = {
  tab:"today", category:"all", query:"", resources:[], itineraryItems:[],
  editingId:null, editingItineraryId:null, selectedDayKey:null, highlightedItemId:null,
  backend:"local", firebase:null, firebaseError:false, user:null, authorized:false,
  resourceAuthorized:false, itineraryAuthorized:false, migratingItinerary:false,
  resourceReadable:false, itineraryReadable:false, signingOut:false,
  unsubscribeResources:null, unsubscribeItinerary:null, returnToDayAfterEditor:false,
  editorBaseline:"", editorRevision:0, conflictItem:null, keepMineAfterConflict:false,
  deferredInstallPrompt:null, resourcePending:false, itineraryPending:false, lastSyncAt:0, toastAction:null,
  swipeStartX:0, swipeStartY:0, swipeBlocked:false, preserveDayOnClose:false, routeReady:false,
  resourceEditorBaseline:"", historyEntries:[], syncConflictRemotes:new Map(),
  dayMeta:new Map(), unsubscribeDayMeta:null, editingDayMetaKey:null, dayMetaBaseline:"", dayMetaReturnKey:null,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function canEditTrip() {
  return Boolean(state.user) && TRIP_EDITOR_UIDS.has(state.user.uid);
}

function clone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function readArray(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(value) ? value : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function saveArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadLocalResources() { return readArray(STORAGE_KEY, seedResources); }
function saveLocalResources() { saveArray(STORAGE_KEY, state.resources); }
function loadLocalItineraryItems() { return readArray(ITINERARY_STORAGE_KEY, []); }
function saveLocalItineraryItems() { saveArray(ITINERARY_STORAGE_KEY, state.itineraryItems); }
function loadOutbox() { return readArray(RESOURCE_OUTBOX_KEY, []); }
function saveOutbox(value) { saveArray(RESOURCE_OUTBOX_KEY, value); }

function timestampValue(value) {
  if (typeof value === "number") return value;
  if (value && typeof value.toMillis === "function") return value.toMillis();
  if (value && value.seconds) return value.seconds * 1000;
  return 0;
}

function safeHostname(value) {
  try { return new URL(value).hostname.replace(/^www\./,""); } catch { return String(value || ""); }
}

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["http:","https:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>'"]/g, (char) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  })[char]);
}

function escapeAttr(value) { return escapeHtml(value); }
function initials(value) {
  const text = String(value || "我").trim();
  const parts = text.split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : text.slice(0,2)).toUpperCase();
}
function currentUserName() {
  return String((state.user && (state.user.displayName || state.user.email)) || "旅伴").trim().slice(0,80) || "旅伴";
}

function itineraryDays() {
  return itinerary.filter((item) => item && typeof item.date === "string");
}

function itineraryDateKey(item) {
  if (!item || typeof item.date !== "string") return "";
  const parts = item.date.split("/").map((value) => value.padStart(2,"0"));
  return (parts[0] === "12" ? "2026" : "2027") + "-" + parts[0] + "-" + parts[1];
}

function tripDay(dateKey) {
  return itineraryDays().find((item) => itineraryDateKey(item) === dateKey);
}

function parseLegacyTime(value) {
  const text = String(value || "").trim();
  const matches = Array.from(text.matchAll(/(?:^|\D)([01]?\d|2[0-3]):([0-5]\d)/g));
  const startTime = matches[0] ? String(matches[0][1]).padStart(2,"0") + ":" + matches[0][2] : "";
  const endTime = matches[1] ? String(matches[1][1]).padStart(2,"0") + ":" + matches[1][2] : "";
  const pureRange = /^\s*\d{1,2}:\d{2}\s*[–—~～-]\s*\d{1,2}:\d{2}\s*$/.test(text);
  const exactTime = /^\s*\d{1,2}:\d{2}\s*$/.test(text);
  return { startTime, endTime, timeLabel:pureRange || exactTime ? "" : text };
}

function displayTime(item) {
  if (item.timeLabel) return item.timeLabel;
  if (item.startTime && item.endTime) return item.startTime + "–" + item.endTime;
  if (item.startTime) return item.startTime;
  return item.time || "時間未定";
}

function itineraryTimeValue(item) {
  const value = item.startTime || parseLegacyTime(item.time || item.timeLabel).startTime;
  const match = String(value || "").match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : 1440;
}

function baseItineraryItems() {
  return itineraryDays().flatMap((day) => {
    const date = itineraryDateKey(day);
    return (day.schedule || []).map((plan,index) => {
      const id = plan.id || "plan-" + date.replaceAll("-","") + "-" + String(index + 1).padStart(2,"0");
      const parsed = parseLegacyTime(plan.time);
      return {
        id, baseId:id, isBase:true, date, startTime:parsed.startTime, endTime:parsed.endTime,
        timeLabel:parsed.timeLabel, time:plan.time || "", title:plan.title || "",
        location:plan.place || "", notes:plan.detail || "", price:plan.price || "",
        officialUrl:plan.official || "", ticketUrl:plan.ticket || "",
        navigationUrl:plan.nav || "", kind:plan.kind || "行程",
        status:plan.status || "current", sortOrder:index, revision:0, revisions:[]
      };
    });
  });
}

function effectiveItineraryItems(options) {
  const includeHidden = Boolean(options && options.includeHidden);
  const overrides = new Map(state.itineraryItems.filter((item) => item && item.baseId).map((item) => [item.baseId,item]));
  const planned = baseItineraryItems().map((item) => {
    const override = overrides.get(item.baseId);
    return override ? Object.assign({}, item, override, { id:item.id,baseId:item.baseId,isBase:true }) : item;
  });
  const added = state.itineraryItems
    .filter((item) => item && !item.baseId)
    .map((item) => Object.assign({ kind:"行程",status:"current",sortOrder:999,isBase:false,revision:0,revisions:[] },item));
  return planned.concat(added).filter((item) => includeHidden || !item.hidden);
}

function itineraryItemById(id, includeHidden) {
  return effectiveItineraryItems({ includeHidden:Boolean(includeHidden) }).find((item) => item.id === id);
}

function storedItemById(id) {
  return state.itineraryItems.find((item) => item && item.id === id);
}

function itemsForDay(dateKey, includeHidden) {
  return effectiveItineraryItems({ includeHidden:Boolean(includeHidden) })
    .filter((item) => item.date === dateKey)
    .sort((a,b) => itineraryTimeValue(a) - itineraryTimeValue(b)
      || Number(a.sortOrder == null ? 999 : a.sortOrder) - Number(b.sortOrder == null ? 999 : b.sortOrder)
      || timestampValue(a.createdAt) - timestampValue(b.createdAt));
}

function dayMetaFor(dateKey) {
  return state.dayMeta.get(dateKey) || null;
}

// `title` 是第一版路線標題的欄位名稱，保留讀取相容性。
function daytimeForDay(dateKey) {
  const meta = dayMetaFor(dateKey);
  const custom = meta ? String(meta.daytime || meta.title || "").trim() : "";
  if (custom) return custom;
  const day = tripDay(dateKey);
  return day ? day.city : dateKey;
}

function overnightForDay(dateKey) {
  const meta = dayMetaFor(dateKey);
  const custom = meta ? String(meta.night || "").trim() : "";
  if (custom) return custom;
  const explicit = itemsForDay(dateKey).filter((item) => item.overnightCity).slice(-1)[0];
  return explicit ? explicit.overnightCity : DEFAULT_OVERNIGHT_CITIES[dateKey] || "住宿未定";
}

function dayHeadline(dateKey) {
  const meta = dayMetaFor(dateKey);
  const custom = meta ? String(meta.dayTitle || "").trim() : "";
  if (custom) return custom;
  const day = tripDay(dateKey);
  return day ? day.title : "當天行程";
}

function lodgingForDay(dateKey) {
  const candidates = itemsForDay(dateKey).filter((item) => /住宿|入住|旅館|飯店/.test((item.kind || "") + " " + (item.title || "")));
  return candidates.length ? candidates[candidates.length - 1] : null;
}

function dateLabel(dateKey) {
  const day = tripDay(dateKey);
  return day ? day.date + "（週" + day.day + "）" : dateKey;
}

function jstParts(now) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",hourCycle:"h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).filter((part) => part.type !== "literal").map((part) => [part.type,part.value]));
  return { date:parts.year + "-" + parts.month + "-" + parts.day, minutes:Number(parts.hour) * 60 + Number(parts.minute) };
}

function currentTripMoment() {
  const override = new URL(location.href).searchParams.get("now");
  const parsed = override ? new Date(override) : new Date();
  const now = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const parts = jstParts(now);
  if (parts.date < TRIP_START) return { phase:"pretrip",date:TRIP_START,minutes:parts.minutes,now };
  if (parts.date > TRIP_END) return { phase:"complete",date:TRIP_END,minutes:parts.minutes,now };
  return { phase:"active",date:parts.date,minutes:parts.minutes,now };
}

function nextItemForMoment(moment) {
  const plans = itemsForDay(moment.date);
  if (!plans.length) return null;
  if (moment.phase === "pretrip") return plans[0];
  if (moment.phase === "complete") return plans[plans.length - 1];
  const current = plans.find((item) => {
    const start = itineraryTimeValue(item);
    const end = item.endTime ? itineraryTimeValue({ startTime:item.endTime }) : start + 60;
    return start <= moment.minutes && end >= moment.minutes;
  });
  return current || plans.find((item) => itineraryTimeValue(item) >= moment.minutes) || null;
}

function updateUrl(options) {
  const url = new URL(location.href);
  url.searchParams.set("view",state.tab);
  if (state.selectedDayKey) url.searchParams.set("day",state.selectedDayKey); else url.searchParams.delete("day");
  if (state.highlightedItemId) url.searchParams.set("item",state.highlightedItemId); else url.searchParams.delete("item");
  if (options && options.replace === false) history.pushState({ view:state.tab,day:state.selectedDayKey }, "", url);
  else history.replaceState({ view:state.tab,day:state.selectedDayKey }, "", url);
}

function setTab(tab, options) {
  const valid = ["today","itinerary","library"];
  state.tab = valid.includes(tab) ? tab : "today";
  $$(".view").forEach((view) => {
    const active = view.id === state.tab + "View";
    view.hidden = !active;
    view.classList.toggle("active",active);
    view.setAttribute("aria-hidden",String(!active));
  });
  $$("[data-tab]").forEach((button) => {
    const active = button.dataset.tab === state.tab;
    button.classList.toggle("active",active);
    button.setAttribute("aria-selected",String(active));
    button.tabIndex = active ? 0 : -1;
  });
  updateEditAffordances();
  if (!(options && options.skipUrl)) updateUrl({ replace:!(options && options.push) });
  if (!(options && options.keepScroll)) window.scrollTo({ top:0,behavior:options && options.instant ? "auto" : "smooth" });
}

function renderToday() {
  const moment = currentTripMoment();
  const day = tripDay(moment.date) || tripDay(TRIP_START);
  const next = nextItemForMoment(moment);
  const todayPlans = itemsForDay(moment.date);
  const activeDayComplete = moment.phase === "active" && todayPlans.length > 0 && !next;
  const lodging = lodgingForDay(moment.date);
  const city = overnightForDay(moment.date);
  const phaseText = { pretrip:"出發前準備",active:"旅途中",complete:"旅程完成" }[moment.phase];
  $("#todayPhase").textContent = phaseText;
  $("#todayPhase").dataset.phase = moment.phase;
  $("#todayDate").textContent = day ? day.date : moment.date;
  $("#todayCity").textContent = day ? daytimeForDay(moment.date) : city;
  if (moment.phase === "pretrip") {
    $("#todayHeadline").textContent = "下一站，日本雪旅";
    $("#todaySummary").textContent = "離出發還有準備時間；先把待確認票券與住宿補齊。";
    $("#nextActionKicker").textContent = "旅程第一站";
  } else if (moment.phase === "complete") {
    $("#todayHeadline").textContent = "雪旅已完成";
    $("#todaySummary").textContent = "所有行程仍保留在資料庫，方便回顧與下次複製。";
    $("#nextActionKicker").textContent = "最後一段";
  } else {
    $("#todayHeadline").textContent = day ? dayHeadline(moment.date) : "今天的行程";
    $("#todaySummary").textContent = day ? day.detail : "打開今天的安排。";
    $("#nextActionKicker").textContent = next && itineraryTimeValue(next) <= moment.minutes ? "現在／接下來" : "下一個行程";
  }
  if (activeDayComplete) $("#nextActionKicker").textContent = "今天";
  $("#nextActionTime").textContent = next ? displayTime(next) : (activeDayComplete ? "已完成" : "尚未安排");
  $("#nextActionKind").textContent = next ? next.kind || "行程" : (activeDayComplete ? "行程完成" : "空白時段");
  $("#nextActionTitle").textContent = next ? next.title : (activeDayComplete ? "今天的行程已全部完成" : "新增今天的第一筆行程");
  $("#nextActionLocation").textContent = next && next.location ? next.location : "";
  $("#todayPrimary").textContent = moment.phase === "pretrip" ? "打開第一天行程" : "打開當天行程";
  $("#todayPrimary").dataset.day = moment.date;
  const nav = next ? safeHttpUrl(next.navigationUrl) || (next.location ? mapsRoute("",next.location) : "") : "";
  $("#todayNavigate").hidden = !nav;
  $("#todayNavigate").dataset.item = next ? next.id : "";
  $("#todayStay").textContent = lodging ? lodging.title : city;
  $("#todayStayCity").textContent = lodging && lodging.location ? lodging.location : "今晚落腳：" + city;
  $("#todayStayCopy").disabled = !lodging && !city;
  $("#todayStayCopy").dataset.value = lodging && lodging.location ? lodging.location : city;

  const pending = effectiveItineraryItems().filter((item) => item.status === "pending");
  const relevant = pending
    .sort((a,b) => a.date.localeCompare(b.date) || itineraryTimeValue(a) - itineraryTimeValue(b))
    .filter((item) => moment.phase !== "active" || item.date >= moment.date)
    .slice(0,5);
  $("#pendingCount").textContent = pending.length + " 項";
  $("#attentionList").innerHTML = relevant.length ? relevant.map((item) =>
    '<button type="button" class="attention-item" data-search-itinerary="' + escapeAttr(item.id) + '">' +
    '<span class="attention-date">' + escapeHtml(dateLabel(item.date)) + '</span><span><strong>' +
    escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.notes || item.location || "尚待確認") +
    '</small></span><b aria-hidden="true">›</b></button>'
  ).join("") : '<div class="attention-empty"><span>✓</span><p>目前沒有待確認事項。</p></div>';
  renderSyncSummary();
}

// Firestore 的 updatedAt 是 Timestamp，本機草稿是 ISO 字串，兩種都要能比。
function latestContentUpdate() {
  let newest = 0;
  const consider = (value) => {
    if (!value) return;
    const ms = typeof value.toMillis === "function" ? value.toMillis() : Date.parse(value);
    if (Number.isFinite(ms) && ms > newest) newest = ms;
  };
  effectiveItineraryItems().forEach((item) => consider(item.updatedAt));
  state.dayMeta.forEach((meta) => consider(meta.updatedAt));
  return newest;
}

function renderFreshness() {
  const newest = latestContentUpdate();
  $("#tripFreshness").textContent = newest
    ? "最後更新 · " + new Date(newest).toLocaleDateString("zh-TW",{ month:"numeric",day:"numeric" })
    : "行程持續更新中";
}

function renderRouteMap() {
  const editable = canModifyContent();
  const days = itineraryDays().map((day) => {
    const date = itineraryDateKey(day);
    return { date,label:day.date,weekday:day.day,daytime:daytimeForDay(date),night:overnightForDay(date) };
  });
  const routeMap = $("#routeMapTrack");
  routeMap.removeAttribute("role");
  routeMap.setAttribute("aria-label","12月19日至1月6日每天白天所在城市與晚上住宿城市");
  const figure = routeMap.closest(".snow-route-map");
  if (figure) {
    const caption = figure.querySelector("figcaption");
    const eyebrow = caption && caption.querySelector("small");
    const title = caption && caption.querySelector("strong");
    const note = caption && caption.querySelector("em");
    if (eyebrow) eyebrow.textContent = "白天去向＋晚上住宿";
    if (title) title.textContent = "每天在哪裡，一眼看清楚";
    if (note) note.textContent = "點選任一天可打開完整行程";
  }
  routeMap.innerHTML = days.map((day,index) => {
    const summary = day.label + " 週" + day.weekday + "，白天 " + day.daytime + "，晚上住宿 " + day.night;
    return '<article class="route-day-card" data-route-day="' + escapeAttr(day.date) +
      '" style="--route-color:' + ROUTE_COLORS[index % ROUTE_COLORS.length] + '">' +
      '<button type="button" class="route-day-open" data-day="' + escapeAttr(day.date) +
      '" aria-label="打開 ' + escapeAttr(summary) + ' 的完整行程">' +
      '<span class="route-card-date"><strong>' + escapeHtml(day.label) + '</strong><small>週' + escapeHtml(day.weekday) + '</small></span>' +
      '<span class="route-card-legs">' +
      '<span class="route-card-place route-card-day"><small>白天</small><strong>' + escapeHtml(day.daytime) + '</strong></span>' +
      '<span class="route-card-arrow" aria-hidden="true">↓</span>' +
      '<span class="route-card-place route-card-night"><small>晚上住宿</small><strong>' + escapeHtml(day.night) + '</strong></span>' +
      '</span></button>' +
      '<button type="button" class="icon-edit-button route-day-edit" data-route-edit="' + escapeAttr(day.date) +
      '" aria-label="編輯 ' + escapeAttr(day.label) + ' 的白天去向與住宿"' + (editable ? "" : " hidden") + '>' +
      PENCIL_ICON + '</button>' +
      '</article>';
  }).join("");
  renderFreshness();
  const plans = effectiveItineraryItems();
  $("#tripDayCount").textContent = String(days.length);
  $("#confirmedCount").textContent = String(plans.filter((item) => item.status === "confirmed").length);
  $("#cityCount").textContent = String(new Set(days.map((item) => item.night)).size);
  $("#pendingStatCount").textContent = String(plans.filter((item) => item.status === "pending").length);
}

function renderItinerary() {
  $("#dayGrid").innerHTML = itineraryDays().map((item) => {
    const dateKey = itineraryDateKey(item);
    const plans = itemsForDay(dateKey);
    const pending = plans.filter((plan) => plan.status === "pending").length;
    const city = daytimeForDay(dateKey);
    return '<button class="day-button tone-' + escapeAttr(item.tone) + '" type="button" data-day="' + dateKey +
      '" data-testid="day-' + dateKey + '" aria-label="查看 ' + escapeAttr(item.date + " " + city) +
      ' 的逐時行程" aria-haspopup="dialog" aria-controls="dayDialog" aria-expanded="' +
      String(state.selectedDayKey === dateKey && $("#dayDialog").open) + '">' +
      '<span class="day-button-top"><strong>' + escapeHtml(item.date) + '</strong><span class="weekday">週' +
      escapeHtml(item.day) + '</span></span><span class="city-label">' + escapeHtml(city) +
      '</span><span class="day-title">' + escapeHtml(dayHeadline(dateKey)) + '</span><span class="day-button-meta"><span>' +
      plans.length + ' 個時段' + (pending ? ' · ' + pending + ' 待確認' : '') +
      '</span><span>打開行程 <b aria-hidden="true">›</b></span></span></button>';
  }).join("");
  renderRouteMap();
}

function warningCards(plans) {
  const warnings = [];
  const timed = plans.filter((item) => item.startTime).sort((a,b) => itineraryTimeValue(a) - itineraryTimeValue(b));
  for (let index = 1; index < timed.length; index += 1) {
    const previous = timed[index - 1];
    const current = timed[index];
    const previousEnd = previous.endTime ? itineraryTimeValue({ startTime:previous.endTime }) : itineraryTimeValue(previous) + 60;
    const gap = itineraryTimeValue(current) - previousEnd;
    if (gap < 0) warnings.push("「" + previous.title + "」與「" + current.title + "」時間重疊 " + Math.abs(gap) + " 分鐘。");
    else if (gap < 30 && previous.location && current.location && previous.location !== current.location) {
      warnings.push("「" + previous.title + "」到「" + current.title + "」只留 " + gap + " 分鐘，請確認移動時間。");
    }
  }
  return warnings;
}

function renderDateStrip() {
  const days = itineraryDays();
  const index = days.findIndex((item) => itineraryDateKey(item) === state.selectedDayKey);
  $("#dayDateStrip").innerHTML = days.map((item) => {
    const key = itineraryDateKey(item);
    const destination = daytimeForDay(key).split(/[→⇄]/).slice(-1)[0].trim();
    return '<button type="button" data-strip-day="' + key + '" class="' + (key === state.selectedDayKey ? "active" : "") +
      '" aria-current="' + (key === state.selectedDayKey ? "date" : "false") + '" aria-label="查看 ' +
      escapeAttr(item.date + " 週" + item.day + " " + destination + " 的行程") + '"><small>' + escapeHtml(item.date) +
      ' · 週' + escapeHtml(item.day) + '</small><span>' + escapeHtml(destination) + '</span></button>';
  }).join("");
  $("#previousDayButton").disabled = index <= 0;
  $("#nextDayButton").disabled = index < 0 || index >= days.length - 1;
  requestAnimationFrame(() => $("#dayDateStrip .active") && $("#dayDateStrip .active").scrollIntoView({ behavior:"smooth",block:"nearest",inline:"center" }));
}

function renderDayDetails() {
  const day = tripDay(state.selectedDayKey);
  if (!day) return;
  const plans = itemsForDay(state.selectedDayKey);
  const labels = { confirmed:"已確認",current:"目前安排",pending:"待再確認" };
  $("#dayDialogDate").textContent = day.date + " · 週" + day.day + " · " + daytimeForDay(state.selectedDayKey);
  $("#dayDialogTitle").textContent = dayHeadline(state.selectedDayKey);
  $("#dayDialogTitleEdit").hidden = !canModifyContent();
  $("#dayDialogTitleEdit").dataset.routeEdit = state.selectedDayKey;
  $("#dayDialogCity").textContent = "住宿：" + overnightForDay(state.selectedDayKey) + " · " + day.stay;
  renderDateStrip();
  const warnings = warningCards(plans);
  const warningHtml = warnings.length ? '<aside class="schedule-warning" data-testid="schedule-warning"><strong>時間安排提醒</strong><ul>' +
    warnings.map((warning) => "<li>" + escapeHtml(warning) + "</li>").join("") + "</ul></aside>" : "";
  const noticeHtml = day.notice ? '<aside class="day-notice"><span aria-hidden="true">!</span><div><strong>出發前確認</strong><p>' +
    escapeHtml(day.notice) + "</p></div></aside>" : "";
  const cards = plans.map((plan) => {
    const officialUrl = safeHttpUrl(plan.officialUrl);
    const ticketUrl = safeHttpUrl(plan.ticketUrl);
    const navUrl = safeHttpUrl(plan.navigationUrl) || (plan.location ? mapsRoute("",plan.location) : "");
    const status = labels[plan.status] ? plan.status : "pending";
    const highlighted = plan.id === state.highlightedItemId ? " is-highlighted" : "";
    return '<article class="timeline-card status-' + status + highlighted + '" data-plan-id="' + escapeAttr(plan.id) +
      '" data-testid="itinerary-item"><div class="timeline-time"><strong>' + escapeHtml(displayTime(plan)) +
      '</strong><span>' + escapeHtml(plan.kind || "行程") + '</span></div><div class="timeline-body">' +
      '<div class="timeline-title-row"><h3>' + escapeHtml(plan.title) + '</h3><span class="verify-pill' + (plan.syncConflict ? ' conflict' : '') + '">' +
      (plan.syncConflict ? '版本衝突' : labels[status]) + '</span></div>' + (plan.location ? '<p class="timeline-place"><span aria-hidden="true">⌖</span> ' +
      escapeHtml(plan.location) + '</p>' : '') + (plan.notes ? '<p class="timeline-detail">' +
      escapeHtml(plan.notes) + '</p>' : '') + (plan.price ? '<p class="price-pill"><span aria-hidden="true">票</span> ' +
      escapeHtml(plan.price) + '</p>' : '') + '<div class="timeline-actions">' +
      (navUrl ? '<button class="nav-action" type="button" data-nav-item="' + escapeAttr(plan.id) + '"><span aria-hidden="true">⌖</span> 導航</button>' : '') +
      (officialUrl ? '<a href="' + escapeAttr(officialUrl) + '" target="_blank" rel="noreferrer">官網 <span aria-hidden="true">↗</span></a>' : '') +
      (ticketUrl ? '<a href="' + escapeAttr(ticketUrl) + '" target="_blank" rel="noreferrer">票價／預約 <span aria-hidden="true">↗</span></a>' : '') +
      '<button class="edit-action" type="button" data-itinerary-edit="' + escapeAttr(plan.id) +
      '"><span aria-hidden="true">✎</span> 編輯</button></div><details class="plan-more"><summary>更多工具</summary><div>' +
      (plan.location ? '<button type="button" data-copy-location="' + escapeAttr(plan.location) + '">複製地點</button>' : '') +
      '<button type="button" data-calendar-item="' + escapeAttr(plan.id) + '">加入行事曆</button>' +
      '<button type="button" data-share-item="' + escapeAttr(plan.id) + '">分享這筆</button></div></details></div></article>';
  }).join("");
  $("#dayPlanList").innerHTML = noticeHtml + warningHtml + (cards || '<div class="agenda-empty"><p>這天還沒有行程，按「新增一筆」開始安排。</p></div>');
  if (state.highlightedItemId) {
    requestAnimationFrame(() => {
      const target = $('[data-plan-id="' + CSS.escape(state.highlightedItemId) + '"]');
      if (target) target.scrollIntoView({ behavior:"smooth",block:"center" });
    });
  }
}

function closeOpenDialogs(except) {
  $$("dialog[open]").forEach((dialog) => {
    if (dialog === except) return;
    if (dialog.id === "dayDialog" && except) state.preserveDayOnClose = true;
    dialog.close();
  });
}

function openDayDialog(dateKey, itemId, options) {
  if (!tripDay(dateKey)) return;
  state.selectedDayKey = dateKey;
  state.highlightedItemId = itemId || null;
  closeOpenDialogs($("#dayDialog"));
  renderDayDetails();
  if (!$("#dayDialog").open) $("#dayDialog").showModal();
  $$("#dayGrid [data-day]").forEach((button) => {
    button.setAttribute("aria-expanded",String(button.dataset.day === dateKey));
  });
  updateUrl({ replace:!(options && options.push) });
}

function moveDay(direction) {
  const days = itineraryDays();
  const index = days.findIndex((item) => itineraryDateKey(item) === state.selectedDayKey);
  const next = days[index + direction];
  if (next) openDayDialog(itineraryDateKey(next),null,{ push:true });
}

function renderItineraryDateOptions() {
  $("#itineraryDate").innerHTML = itineraryDays().map((item) => {
    const key = itineraryDateKey(item);
    return '<option value="' + key + '">' + escapeHtml(item.date + "（週" + item.day + "） · " + daytimeForDay(key)) + "</option>";
  }).join("");
}

function sortedResources(resources) {
  return resources.slice().filter((item) => !item.hidden).sort((a,b) =>
    Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || timestampValue(b.updatedAt) - timestampValue(a.updatedAt));
}

function filteredResources() {
  const needle = state.query.trim().toLocaleLowerCase("zh-Hant");
  return sortedResources(state.resources).filter((resource) => {
    const category = categories.find((item) => item.id === resource.categoryId);
    const matchesCategory = state.category === "all" || resource.categoryId === state.category;
    const haystack = [resource.title,resource.note,resource.location,category && category.name].join(" ").toLocaleLowerCase("zh-Hant");
    return matchesCategory && (!needle || haystack.includes(needle));
  });
}

function resourceCard(resource) {
  const category = categories.find((item) => item.id === resource.categoryId) || categories[categories.length - 1];
  const statusLabel = { idea:"想去",shortlist:"候選",booked:"已預訂" }[resource.status] || "想去";
  return '<article class="resource-card" data-testid="resource-card"><div class="resource-card-top"><span class="resource-icon" style="color:' +
    category.color + ";background:" + category.color + '18">' + category.icon + '</span><div class="card-actions">' +
    (resource.pinned ? '<span class="pinned-badge">⌖ 置頂</span>' : '') +
    (canModifyContent() ? '<button type="button" data-edit="' + escapeAttr(resource.id) +
      '" aria-label="編輯 ' + escapeAttr(resource.title) + '">•••</button>' : '') + '</div></div>' +
    '<div class="resource-card-body"><div class="metadata-row"><span>' + escapeHtml(resource.location || "未指定地點") +
    '</span><span>·</span><span>' + category.name + '</span><span class="resource-status status-' +
    escapeAttr(resource.status) + '">' + statusLabel + '</span></div><h2>' + escapeHtml(resource.title) + '</h2>' +
    (resource.note ? '<p>' + escapeHtml(resource.note) + '</p>' : '') + '</div><footer><div><small>' +
    escapeHtml(safeHostname(resource.url)) + '</small><span>由 ' + escapeHtml(resource.updatedBy || "旅伴") +
    ' 更新</span></div><a class="open-link" href="' + escapeAttr(resource.url) +
    '" target="_blank" rel="noreferrer" aria-label="開啟 ' + escapeAttr(resource.title) + '">↗</a></footer></article>';
}

function renderCategories() {
  $("#categoryRow").innerHTML = ['<button class="category-pill ' + (state.category === "all" ? "active" : "") +
    '" type="button" data-category="all"><i style="background:linear-gradient(135deg,#007aff,#bf5af2)"></i>全部</button>']
    .concat(categories.map((category) => '<button class="category-pill ' + (state.category === category.id ? "active" : "") +
      '" type="button" data-category="' + category.id + '"><i style="background:' + category.color + '"></i>' +
      category.name + '</button>')).join("");
  $("#resourceCategory").innerHTML = categories.map((category) =>
    '<option value="' + category.id + '">' + category.name + "</option>").join("");
}

function renderResources() {
  const resources = filteredResources();
  $("#resourceGrid").innerHTML = resources.map(resourceCard).join("");
  const needle = state.query.trim().toLocaleLowerCase("zh-Hant");
  const itineraryMatches = needle ? effectiveItineraryItems().filter((item) => {
    const day = tripDay(item.date);
    const haystack = [item.title,item.location,item.notes,item.price,item.kind,item.overnightCity,day && day.city].join(" ").toLocaleLowerCase("zh-Hant");
    return haystack.includes(needle);
  }).slice(0,30) : [];
  $("#itinerarySearchSection").hidden = !needle;
  $("#resourceSearchHeading").hidden = !needle;
  $("#itinerarySearchCount").textContent = itineraryMatches.length + " 筆";
  $("#resourceSearchCount").textContent = resources.length + " 筆";
  $("#itinerarySearchResults").innerHTML = itineraryMatches.map((item) =>
    '<button type="button" class="itinerary-search-card" data-search-itinerary="' + escapeAttr(item.id) + '">' +
    '<span><small>' + escapeHtml(dateLabel(item.date) + " · " + displayTime(item)) + '</small><strong>' +
    escapeHtml(item.title) + '</strong><em>' + escapeHtml(item.location || item.kind || "行程") +
    '</em></span><b aria-hidden="true">›</b></button>').join("");
  $("#emptyState").hidden = resources.length > 0 || itineraryMatches.length > 0;
  const pending = loadOutbox().length;
  $("#resourceCount").textContent = state.resources.filter((item) => !item.hidden).length + " 筆共同收藏 · " +
    (state.backend === "cloud" ? "即時同步" : "本機保存") + (pending ? " · " + pending + " 筆待上傳" : "");
  $$("[data-edit]").forEach((button) => button.addEventListener("click", () => openEditor(button.dataset.edit)));
}

function openEditor(id) {
  if (!canOpenTripEditor()) return;
  state.editingId = id || null;
  const form = $("#resourceForm");
  form.reset();
  $("#resourceCategory").value = state.category === "all" ? "spot" : state.category;
  $("#editorTitle").textContent = id ? "編輯連結" : "加入旅行資訊";
  $("#deleteButton").hidden = !id;
  if (id) {
    const resource = state.resources.find((item) => item.id === id);
    if (!resource) return;
    form.elements.url.value = resource.url || "";
    form.elements.title.value = resource.title || "";
    form.elements.category.value = resource.categoryId || "other";
    form.elements.location.value = resource.location || "";
    form.elements.status.value = resource.status || "idea";
    form.elements.note.value = resource.note || "";
    form.elements.pinned.checked = Boolean(resource.pinned);
  }
  closeOpenDialogs($("#editorDialog"));
  $("#editorDialog").showModal();
  state.resourceEditorBaseline = formSnapshot(form);
}

function queueResourceOperation(operation) {
  const outbox = loadOutbox().filter((entry) => entry.id !== operation.id);
  outbox.push(Object.assign({ queuedAt:Date.now() },operation));
  saveOutbox(outbox);
}

async function flushResourceOutbox() {
  if (!state.firebase || !state.resourceAuthorized || !navigator.onLine) return;
  const outbox = loadOutbox();
  if (!outbox.length) return;
  const f = state.firebase.firestore;
  const remaining = [];
  for (const operation of outbox) {
    try {
      const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"resources",operation.id);
      if (operation.type === "delete") await withTimeout(f.deleteDoc(ref));
      else await withTimeout(f.setDoc(ref,Object.assign({},operation.payload,{ updatedAt:f.serverTimestamp() }),{ merge:true }));
    } catch { remaining.push(operation); }
  }
  saveOutbox(remaining);
  renderResources();
}

async function submitResource(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const url = safeHttpUrl(form.get("url"));
  if (!url) { showToast("連結格式不正確"); return; }
  const current = state.resources.find((item) => item.id === state.editingId);
  const id = current ? current.id : (crypto.randomUUID ? crypto.randomUUID() : "local-" + Date.now());
  const input = {
    id,title:String(form.get("title") || "").trim().slice(0,120),url,
    note:String(form.get("note") || "").trim().slice(0,1200),
    location:String(form.get("location") || "").trim().slice(0,80),
    categoryId:String(form.get("category") || "other"),status:String(form.get("status") || "idea"),
    pinned:form.get("pinned") === "on",hidden:false,updatedBy:currentUserName(),updatedAt:Date.now(),
    createdAt:current ? current.createdAt : Date.now()
  };
  setSyncStatus("saving");
  try {
    if (state.firebase && state.resourceAuthorized && await canReachNetwork()) {
      const f = state.firebase.firestore;
      await withTimeout(f.setDoc(f.doc(state.firebase.db,"boards",BOARD_ID,"resources",id),
        Object.assign({},input,{ updatedAt:f.serverTimestamp() }),{ merge:true }));
    } else {
      state.resources = current ? state.resources.map((item) => item.id === id ? Object.assign({},item,input) : item) : [input].concat(state.resources);
      saveLocalResources();
      if (firebaseConfigured()) queueResourceOperation({ id,type:"save",payload:input });
      renderResources();
      setSyncStatus(navigator.onLine ? "local" : "offline");
    }
    state.resourceEditorBaseline = "";
    $("#editorDialog").close();
    showToast(current ? "已儲存修改" : "連結已加入資料庫");
  } catch (error) {
    console.error(error);
    state.resources = current ? state.resources.map((item) => item.id === id ? Object.assign({},item,input) : item) : [input].concat(state.resources);
    saveLocalResources();
    queueResourceOperation({ id,type:"save",payload:input });
    renderResources();
    state.resourceEditorBaseline = "";
    $("#editorDialog").close();
    setSyncStatus("offline");
    showToast("已離線保存，連線後會自動同步");
  }
}

async function deleteCurrentResource() {
  const resource = state.resources.find((item) => item.id === state.editingId);
  if (!resource || !confirm("確定要刪除「" + resource.title + "」嗎？")) return;
  const previous = clone(resource);
  try {
    const wroteCloud = Boolean(state.firebase && state.resourceAuthorized && await canReachNetwork());
    if (wroteCloud) {
      await withTimeout(state.firebase.firestore.deleteDoc(state.firebase.firestore.doc(state.firebase.db,"boards",BOARD_ID,"resources",resource.id)));
    }
    state.resources = state.resources.filter((item) => item.id !== resource.id);
    saveLocalResources();
    if (!wroteCloud && firebaseConfigured()) queueResourceOperation({ id:resource.id,type:"delete" });
    renderResources();
    state.resourceEditorBaseline = "";
    $("#editorDialog").close();
    showToast("已刪除連結","復原",async () => {
      state.resources = [previous].concat(state.resources);
      saveLocalResources();
      saveOutbox(loadOutbox().filter((entry) => entry.id !== previous.id));
      if (state.firebase && state.resourceAuthorized && await canReachNetwork()) {
        await withTimeout(state.firebase.firestore.setDoc(state.firebase.firestore.doc(state.firebase.db,"boards",BOARD_ID,"resources",previous.id),previous));
      } else if (firebaseConfigured()) {
        queueResourceOperation({ id:previous.id,type:"save",payload:previous });
      }
      renderResources();
    });
  } catch (error) {
    console.error(error);
    showToast("暫時無法刪除");
  }
}

// UI 層的顯示判斷；真正的安全邊界是 Firestore Rules。
function canModifyContent() {
  return !firebaseConfigured() || state.firebaseError || canEditTrip();
}

function updateEditAffordances() {
  const allowed = canModifyContent();
  $$('[data-action="add"],[data-action="add-itinerary"],[data-route-edit]').forEach((button) => { button.hidden = !allowed; });
  $(".floating-add").hidden = state.tab !== "library" || !allowed;
}

function canOpenTripEditor() {
  if (!firebaseConfigured()) return true;
  if (state.firebaseError) {
    state.backend = "local";
    setSyncStatus(navigator.onLine ? "local" : "offline");
    showToast("雲端暫時不可用，已切換為本機編輯");
    return true;
  }
  // 離線時仍以快取的登入身分判斷；寫入會由 canReachNetwork() 自動改走本機保存。
  if (canEditTrip()) return true;
  if (state.user) {
    showToast("這個帳號沒有共同編輯權限");
    return false;
  }
  openShareDialog();
  showToast("請先登入再共同編輯");
  return false;
}

function formSnapshot(form) {
  return JSON.stringify(Array.from(new FormData(form).entries()));
}

function openDayMetaEditor(dateKey) {
  const day = tripDay(dateKey);
  if (!day || !canOpenTripEditor()) return;
  state.editingDayMetaKey = dateKey;
  const meta = dayMetaFor(dateKey) || {};
  const form = $("#dayMetaForm");
  form.reset();
  $("#dayMetaDate").textContent = day.date + "（週" + day.day + "）";
  form.elements.daytime.value = String(meta.daytime || meta.title || "");
  form.elements.night.value = String(meta.night || "");
  form.elements.dayTitle.value = String(meta.dayTitle || "");
  // placeholder 顯示留白後會回到的預設值，使用者才知道清空代表什麼。
  form.elements.daytime.placeholder = day.city || "";
  form.elements.night.placeholder = DEFAULT_OVERNIGHT_CITIES[dateKey] || "住宿未定";
  form.elements.dayTitle.placeholder = day.title || "";
  $("#dayMetaResetButton").hidden = !dayMetaFor(dateKey);
  // 從當天行程裡按鉛筆時，關閉這張 sheet 後要回到原本那天。
  state.dayMetaReturnKey = $("#dayDialog").open ? state.selectedDayKey : null;
  closeOpenDialogs($("#dayMetaDialog"));
  $("#dayMetaDialog").showModal();
  state.dayMetaBaseline = formSnapshot(form);
}

function closeDayMetaEditor(force) {
  const dirty = state.dayMetaBaseline && formSnapshot($("#dayMetaForm")) !== state.dayMetaBaseline;
  if (!force && dirty && !confirm("尚未儲存的變更會消失，確定關閉嗎？")) return false;
  state.dayMetaBaseline = "";
  $("#dayMetaDialog").close();
  return true;
}

// dayMeta 只存在雲端，因為它是兩個人共用的路線描述，沒有本機 fallback。
async function writeDayMeta(dateKey, fields) {
  if (!state.firebase || !canEditTrip()) {
    showToast("需要以已授權的帳號登入才能修改路線");
    return false;
  }
  const f = state.firebase.firestore;
  const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"dayMeta",dateKey);
  setSyncStatus("saving");
  try {
    if (fields) {
      const payload = Object.assign({ date:dateKey },fields,{
        updatedAt:f.serverTimestamp(),
        updatedByUid:state.user.uid
      });
      await withTimeout(f.setDoc(ref,payload,{ merge:true }));
    } else {
      await withTimeout(f.deleteDoc(ref));
    }
    return true;
  } catch (error) {
    console.error("Unable to save day meta",error);
    showToast("儲存失敗，請確認網路連線與編輯權限");
    return false;
  }
}

async function submitDayMeta(event) {
  event.preventDefault();
  const dateKey = state.editingDayMetaKey;
  if (!tripDay(dateKey)) return;
  const form = new FormData($("#dayMetaForm"));
  const daytime = String(form.get("daytime") || "").trim().slice(0,60);
  const saved = await writeDayMeta(dateKey,{
    daytime,
    // 同步寫回第一版的欄位名稱，避免尚未更新的分頁讀到過期標題。
    title:daytime,
    night:String(form.get("night") || "").trim().slice(0,40),
    dayTitle:String(form.get("dayTitle") || "").trim().slice(0,80)
  });
  if (!saved) return;
  state.dayMetaBaseline = "";
  $("#dayMetaDialog").close();
  showToast("這天的路線已更新");
}

async function resetDayMeta() {
  const dateKey = state.editingDayMetaKey;
  if (!tripDay(dateKey) || !confirm("確定要把這天的白天去向、住宿與標題都恢復成預設嗎？")) return;
  if (!(await writeDayMeta(dateKey,null))) return;
  state.dayMetaBaseline = "";
  $("#dayMetaDialog").close();
  showToast("已恢復成預設內容");
}

function isItineraryFormDirty() {
  return $("#itineraryEditorDialog").open && state.editorBaseline && formSnapshot($("#itineraryForm")) !== state.editorBaseline;
}

function fillItineraryForm(item, fallbackDate) {
  const form = $("#itineraryForm");
  form.elements.date.value = (item && item.date) || fallbackDate || TRIP_START;
  form.elements.startTime.value = (item && item.startTime) || "";
  form.elements.endTime.value = (item && item.endTime) || "";
  form.elements.timeLabel.value = (item && item.timeLabel) || "";
  form.elements.title.value = (item && item.title) || "";
  form.elements.kind.value = (item && item.kind) || "行程";
  form.elements.location.value = (item && item.location) || "";
  form.elements.status.value = (item && item.status) || "current";
  form.elements.overnightCity.value = (item && item.overnightCity) || "";
  form.elements.price.value = (item && item.price) || "";
  form.elements.officialUrl.value = (item && item.officialUrl) || "";
  form.elements.ticketUrl.value = (item && item.ticketUrl) || "";
  form.elements.notes.value = (item && item.notes) || "";
}

function renderHistory(item) {
  const revisions = item && Array.isArray(item.revisions) ? item.revisions : [];
  state.historyEntries = revisions;
  $("#itineraryHistory").hidden = !revisions.length;
  $("#itineraryHistoryList").innerHTML = revisions.map((entry,index) =>
    "<li><strong>" + escapeHtml(entry.by || "旅伴") + "</strong><span>" +
    escapeHtml(entry.at ? new Intl.DateTimeFormat("zh-TW",{ dateStyle:"medium",timeStyle:"short" }).format(new Date(entry.at)) : "時間未記錄") +
    "</span><p>" + escapeHtml(entry.summary || "更新行程") + "</p>" +
    (entry.snapshot ? '<button type="button" data-history-index="' + index + '">載入此版本</button>' : '') + "</li>").join("");
}

function openItineraryEditor(id, dateKey, source) {
  if (!canOpenTripEditor()) return;
  state.editingItineraryId = id || null;
  state.returnToDayAfterEditor = source === "day" || Boolean($("#dayDialog").open);
  state.conflictItem = id ? state.syncConflictRemotes.get(id) || null : null;
  state.keepMineAfterConflict = false;
  const item = id ? itineraryItemById(id,true) : null;
  if (id && !item) return;
  if ($("#dayDialog").open) $("#dayDialog").close();
  renderItineraryDateOptions();
  $("#itineraryForm").reset();
  fillItineraryForm(item,dateKey || state.selectedDayKey || TRIP_START);
  $("#itineraryEditorTitle").textContent = id ? "編輯行程" : "新增行程";
  $("#deleteItineraryButton").hidden = !id;
  $("#deleteItineraryButton").textContent = item && item.hidden ? "這筆已取消" : "取消這筆行程";
  $("#duplicateItineraryButton").hidden = !id;
  $("#restoreItineraryButton").hidden = !(item && item.baseId && storedItemById(item.id));
  $("#itinerarySyncNote").textContent = firebaseConfigured() ? "儲存後會即時同步給兩個人；離線時先保存在裝置。" : "目前會先儲存在這台裝置。";
  $("#conflictWarning").hidden = !state.conflictItem;
  const revisionSource = storedItemById(id) || item || {};
  state.editorRevision = Number(revisionSource.baseRevision != null ? revisionSource.baseRevision : revisionSource.revision || 0);
  renderHistory(storedItemById(id) || item);
  closeOpenDialogs($("#itineraryEditorDialog"));
  $("#itineraryEditorDialog").showModal();
  state.editorBaseline = formSnapshot($("#itineraryForm"));
}

function itineraryFormInput() {
  const form = new FormData($("#itineraryForm"));
  const officialInput = String(form.get("officialUrl") || "").trim();
  const ticketInput = String(form.get("ticketUrl") || "").trim();
  return {
    date:String(form.get("date") || ""),startTime:String(form.get("startTime") || ""),
    endTime:String(form.get("endTime") || ""),timeLabel:String(form.get("timeLabel") || "").trim().slice(0,40),
    title:String(form.get("title") || "").trim().slice(0,120),
    kind:String(form.get("kind") || "行程").trim().slice(0,40) || "行程",
    location:String(form.get("location") || "").trim().slice(0,120),
    status:["confirmed","current","pending"].includes(String(form.get("status"))) ? String(form.get("status")) : "current",
    overnightCity:String(form.get("overnightCity") || "").trim().slice(0,40),
    price:String(form.get("price") || "").trim().slice(0,80),
    officialUrl:safeHttpUrl(officialInput),ticketUrl:safeHttpUrl(ticketInput),
    officialInput,ticketInput,notes:String(form.get("notes") || "").trim().slice(0,2000)
  };
}

function revisionEntry(item) {
  const snapshot = item ? {
    date:item.date,startTime:item.startTime || "",endTime:item.endTime || "",timeLabel:item.timeLabel || "",
    title:item.title || "",kind:item.kind || "",location:item.location || "",status:item.status || "current",
    overnightCity:item.overnightCity || "",price:item.price || "",officialUrl:item.officialUrl || "",
    ticketUrl:item.ticketUrl || "",notes:item.notes || "",navigationUrl:item.navigationUrl || ""
  } : null;
  return {
    at:Date.now(),
    by:currentUserName(),
    summary:item ? "修改「" + item.title + "」" : "新增行程",
    snapshot
  };
}

function localUpsert(item) {
  const index = state.itineraryItems.findIndex((entry) => entry.id === item.id);
  if (index >= 0) state.itineraryItems[index] = item; else state.itineraryItems.push(item);
  saveLocalItineraryItems();
}

async function canReachNetwork() {
  if (!navigator.onLine) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),2500);
  try {
    const response = await fetch("./manifest.webmanifest?connect=" + Date.now(),{ cache:"no-store",signal:controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}


async function withTimeout(promise,timeoutMs = 8000) {
  let timer;
  const timeout = new Promise((resolve,reject) => {
    timer = setTimeout(() => { const error = new Error("cloud-timeout"); error.code = "cloud-timeout"; reject(error); },timeoutMs);
  });
  try { return await Promise.race([promise,timeout]); }
  finally { clearTimeout(timer); }
}
async function submitItineraryItem(event) {
  event.preventDefault();
  if (!canOpenTripEditor()) return;
  const input = itineraryFormInput();
  if (!tripDay(input.date)) { showToast("請選擇這趟旅行中的日期"); return; }
  if (!input.title) { showToast("請輸入行程名稱"); return; }
  if (input.startTime && input.endTime && input.endTime <= input.startTime) { showToast("結束時間需要晚於開始時間"); return; }
  if (input.officialInput && !input.officialUrl) { showToast("官網請輸入 http:// 或 https:// 網址"); return; }
  if (input.ticketInput && !input.ticketUrl) { showToast("票價／預約連結請輸入 http:// 或 https:// 網址"); return; }
  delete input.officialInput;
  delete input.ticketInput;
  const current = state.editingItineraryId ? itineraryItemById(state.editingItineraryId,true) : null;
  const stored = current ? storedItemById(current.id) : null;
  const id = current ? current.id : (crypto.randomUUID ? crypto.randomUUID() : "local-" + Date.now());
  const baseId = current && current.baseId ? current.baseId : "";
  const person = currentUserName();
  const previousRevisions = Array.isArray((stored || current || {}).revisions) ? (stored || current).revisions : [];
  const revisions = [revisionEntry(current)].concat(previousRevisions).slice(0,10);
  const payload = Object.assign({},input,{
    id,hidden:false,revision:Number((stored || current || {}).revision || 0) + 1,revisions,
    navigationUrl:current && current.location === input.location ? current.navigationUrl || "" : (input.location ? mapsRoute("",input.location) : ""),
    updatedAt:Date.now(),updatedByName:person,
    createdAt:(stored && stored.createdAt) || Date.now(),createdByName:(stored && stored.createdByName) || person
  },baseId ? { baseId } : {});
  setSyncStatus("saving");
  try {
    const cloudWritable = Boolean(state.firebase && state.itineraryAuthorized && await canReachNetwork());
    if (cloudWritable) {
      const f = state.firebase.firestore;
      const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",id);
      if (current && navigator.onLine) {
        await f.runTransaction(state.firebase.db,async (transaction) => {
          const snapshot = await transaction.get(ref);
          const remote = snapshot.exists() ? Object.assign({ id:snapshot.id },snapshot.data()) : null;
          const remoteRevision = Number((remote && remote.revision) || 0);
          if (!state.keepMineAfterConflict && remote && remoteRevision !== state.editorRevision) {
            const error = new Error("revision-conflict");
            error.code = "revision-conflict";
            error.remote = remote;
            throw error;
          }
          const transactionPayload = Object.assign({},payload);
          if (state.keepMineAfterConflict && remote) {
            const remoteEntry = {
              at:Date.now(),by:remote.updatedByName || "旅伴",summary:"保留衝突前的旅伴版本",
              snapshot:revisionEntry(remote).snapshot
            };
            transactionPayload.revisions = [remoteEntry].concat(payload.revisions || [],remote.revisions || []).slice(0,10);
          }
          transaction.set(ref,Object.assign({},transactionPayload,{
            revision:remoteRevision + 1,updatedAt:f.serverTimestamp(),updatedByUid:state.user.uid
          }),{ merge:true });
        });
      } else if (!current) {
        await f.setDoc(ref,Object.assign({},payload,{ updatedAt:f.serverTimestamp(),updatedByUid:state.user.uid }),{ merge:true });
      }
      const remainingDrafts = loadLocalItineraryItems().filter((item) => item && item.id !== id);
      if (remainingDrafts.length) saveArray(ITINERARY_STORAGE_KEY,remainingDrafts);
      else localStorage.removeItem(ITINERARY_STORAGE_KEY);
      state.syncConflictRemotes.delete(id);
    } else {
      payload.baseRevision = state.editorRevision;
      localUpsert(payload);
      setSyncStatus(navigator.onLine ? "local" : "offline");
    }
    state.selectedDayKey = input.date;
    state.highlightedItemId = id;
    state.keepMineAfterConflict = false;
    state.conflictItem = null;
    state.editorBaseline = "";
    $("#itineraryEditorDialog").close();
    renderAll();
    if (state.returnToDayAfterEditor) openDayDialog(input.date,id,{ push:true });
    showToast(current ? "行程已更新" : "行程已加入");
  } catch (error) {
    console.error(error);
    if (error && error.code === "revision-conflict") {
      state.conflictItem = error.remote;
      $("#conflictWarning").hidden = false;
      $("#conflictWarning").scrollIntoView({ behavior:"smooth",block:"center" });
      showToast("偵測到另一位旅伴的新版本");
    } else if (error && error.code === "permission-denied") {
      setSyncStatus("error");
      showToast("這個帳號沒有行程編輯權限");
    } else {
      payload.baseRevision = state.editorRevision;
      localUpsert(payload);
      state.selectedDayKey = input.date;
      state.highlightedItemId = id;
      state.editorBaseline = "";
      $("#itineraryEditorDialog").close();
      renderAll();
      if (state.returnToDayAfterEditor) openDayDialog(input.date,id,{ push:true });
      setSyncStatus("offline");
      showToast("已保存在本機，恢復連線後會檢查版本並同步");
    }
  }
}

async function persistHiddenItem(item, hidden) {
  const stored = storedItemById(item.id);
  const expectedRevision = Number((stored || item).revision || 0);
  const payload = Object.assign({},stored || {},{
    id:item.id,date:item.date,title:item.title,baseId:item.baseId || undefined,hidden,
    revision:expectedRevision + 1,baseRevision:expectedRevision,
    revisions:[revisionEntry(item)].concat((stored && stored.revisions) || []).slice(0,10),
    updatedAt:Date.now(),updatedByName:currentUserName()
  });
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
  const cloudWritable = Boolean(state.firebase && state.itineraryAuthorized && await canReachNetwork());
  let appliedRevision = payload.revision;
  if (cloudWritable) {
    const f = state.firebase.firestore;
    const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",item.id);
    await f.runTransaction(state.firebase.db,async (transaction) => {
      const snapshot = await transaction.get(ref);
      const remote = snapshot.exists() ? Object.assign({ id:snapshot.id },snapshot.data()) : null;
      const remoteRevision = Number((remote && remote.revision) || 0);
      if (remoteRevision !== expectedRevision) {
        const error = new Error("revision-conflict"); error.code = "revision-conflict"; error.remote = remote; throw error;
      }
      appliedRevision = remoteRevision + 1;
      transaction.set(ref,Object.assign({},payload,{
        revision:appliedRevision,updatedAt:f.serverTimestamp(),updatedByUid:state.user.uid
      }),{ merge:true });
    });
  } else localUpsert(payload);
  return { previous:stored ? clone(stored) : null,appliedRevision,offline:!cloudWritable };
}

async function restoreItinerarySnapshot(item,operation) {
  const previous = operation.previous;
  const cloudWritable = Boolean(state.firebase && state.itineraryAuthorized && await canReachNetwork());
  if (cloudWritable) {
    const f = state.firebase.firestore;
    const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",item.id);
    await f.runTransaction(state.firebase.db,async (transaction) => {
      const snapshot = await transaction.get(ref);
      const remote = snapshot.exists() ? Object.assign({ id:snapshot.id },snapshot.data()) : null;
      const remoteRevision = Number((remote && remote.revision) || 0);
      if (remoteRevision !== operation.appliedRevision) {
        const error = new Error("revision-conflict"); error.code = "revision-conflict"; error.remote = remote; throw error;
      }
      if (!previous) { transaction.delete(ref); return; }
      transaction.set(ref,Object.assign({},previous,{
        revision:remoteRevision + 1,baseRevision:remoteRevision,
        updatedAt:f.serverTimestamp(),updatedByUid:state.user.uid,updatedByName:currentUserName(),
        revisions:[{
          at:Date.now(),by:currentUserName(),summary:"復原取消操作",snapshot:revisionEntry(remote).snapshot
        }].concat(previous.revisions || []).slice(0,10)
      }),{ merge:false });
    });
  } else if (previous) {
    localUpsert(Object.assign({},previous,{ baseRevision:operation.appliedRevision,updatedAt:Date.now() }));
  } else if (!operation.offline && firebaseConfigured()) {
    localUpsert({
      id:item.id,baseId:item.baseId,date:item.date,_deleteOverride:true,
      baseRevision:operation.appliedRevision,updatedAt:Date.now(),updatedByName:currentUserName()
    });
  } else {
    state.itineraryItems = state.itineraryItems.filter((entry) => entry.id !== item.id);
    saveLocalItineraryItems();
  }
}

async function deleteCurrentItineraryItem() {
  const item = itineraryItemById(state.editingItineraryId,true);
  if (!item || !confirm("確定要取消「" + item.title + "」嗎？之後可立即復原。")) return;
  try {
    const operation = await persistHiddenItem(item,true);
    state.editorBaseline = "";
    $("#itineraryEditorDialog").close();
    renderAll();
    if (state.returnToDayAfterEditor) openDayDialog(item.date,null,{ push:true });
    showToast("已取消這筆行程","復原",async () => {
      try {
        await restoreItinerarySnapshot(item,operation);
        renderAll();
        if ($("#dayDialog").open) renderDayDetails();
      } catch (error) {
        console.error(error);
        showToast(error && error.code === "revision-conflict" ? "旅伴已更新這筆行程，未自動覆蓋她的版本" : "暫時無法復原");
      }
    });
  } catch (error) {
    console.error(error);
    showToast(error && error.code === "revision-conflict" ? "旅伴剛更新這筆行程，請先載入最新版本" : "暫時無法取消行程");
  }
}

async function restoreBaseItineraryItem() {
  const item = itineraryItemById(state.editingItineraryId,true);
  const stored = storedItemById(state.editingItineraryId);
  if (!item || !item.baseId || !stored) return;
  try {
    const expectedRevision = Number(stored.revision || 0);
    const cloudWritable = Boolean(state.firebase && state.itineraryAuthorized && await canReachNetwork());
    if (cloudWritable) {
      const f = state.firebase.firestore;
      const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",item.id);
      await f.runTransaction(state.firebase.db,async (transaction) => {
        const snapshot = await transaction.get(ref);
        const remoteRevision = Number(snapshot.exists() ? snapshot.data().revision || 0 : 0);
        if (!snapshot.exists() || remoteRevision !== expectedRevision) {
          const error = new Error("revision-conflict"); error.code = "revision-conflict"; throw error;
        }
        transaction.delete(ref);
      });
    } else {
      localUpsert({
        id:item.id,baseId:item.baseId,date:item.date,_deleteOverride:true,
        baseRevision:expectedRevision,updatedAt:Date.now(),updatedByName:currentUserName()
      });
    }
    state.editorBaseline = "";
    $("#itineraryEditorDialog").close();
    renderAll();
    if (state.returnToDayAfterEditor) openDayDialog(item.date,item.id,{ push:true });
    showToast("已還原原始安排","復原",async () => {
      try {
        if (cloudWritable && state.firebase && state.itineraryAuthorized && await canReachNetwork()) {
          const f = state.firebase.firestore;
          const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",stored.id);
          await f.runTransaction(state.firebase.db,async (transaction) => {
            const snapshot = await transaction.get(ref);
            if (snapshot.exists()) { const error = new Error("revision-conflict"); error.code = "revision-conflict"; throw error; }
            transaction.set(ref,Object.assign({},stored,{
              revision:expectedRevision + 1,updatedAt:f.serverTimestamp(),updatedByUid:state.user.uid,updatedByName:currentUserName()
            }));
          });
        } else localUpsert(Object.assign({},stored,{ baseRevision:0,updatedAt:Date.now() }));
        renderAll();
      } catch (error) {
        console.error(error);
        showToast(error && error.code === "revision-conflict" ? "旅伴已新增修改，未自動覆蓋她的版本" : "暫時無法復原");
      }
    });
  } catch (error) {
    console.error(error);
    showToast(error && error.code === "revision-conflict" ? "旅伴剛更新這筆行程，請先載入最新版本" : "暫時無法還原");
  }
}

function duplicateItineraryItem() {
  const item = itineraryItemById(state.editingItineraryId,true);
  if (!item) return;
  state.editorBaseline = formSnapshot($("#itineraryForm"));
  state.editingItineraryId = null;
  $("#itineraryEditorTitle").textContent = "複製行程";
  $("#deleteItineraryButton").hidden = true;
  $("#duplicateItineraryButton").hidden = true;
  $("#restoreItineraryButton").hidden = true;
  $("#itineraryTitle").value = item.title + "（複製）";
  $("#itineraryTitle").focus();
  $("#itineraryTitle").select();
}

function cloudSyncMode(snapshot) {
  if (snapshot.metadata.hasPendingWrites) return "saving";
  if (snapshot.metadata.fromCache && !navigator.onLine) return "offline";
  if (state.authorized) return "cloud";
  return canEditTrip() ? "connecting" : "viewer";
}

function setSyncStatus(mode) {
  const dot = $("#syncDot");
  dot.className = "sync-dot";
  const labels = {
    local:"本機草稿",saving:"正在儲存…",connecting:"同步連線中…",
    cloud:"已即時同步",error:"連線異常",offline:"離線保存",viewer:"最新資料（唯讀）"
  };
  if (["local","offline"].includes(mode)) dot.classList.add("local");
  if (["saving","connecting"].includes(mode)) dot.classList.add("saving");
  if (mode === "error") dot.classList.add("error");
  $("#syncLabel").textContent = labels[mode] || labels.local;
  $("#syncLabel").dataset.state = mode;
  if (mode === "cloud" || mode === "viewer") state.lastSyncAt = Date.now();
  renderSyncSummary();
}

function renderSyncSummary() {
  if (!$("#lastSyncText")) return;
  const pendingWrites = Number(state.resourcePending) + Number(state.itineraryPending);
  if (!navigator.onLine) $("#lastSyncText").textContent = "目前離線，變更會排隊同步";
  else if (pendingWrites) $("#lastSyncText").textContent = pendingWrites + " 組變更正在同步";
  else if (state.lastSyncAt) $("#lastSyncText").textContent = "上次同步 " + new Intl.DateTimeFormat("zh-TW",{ hour:"2-digit",minute:"2-digit" }).format(new Date(state.lastSyncAt));
  else $("#lastSyncText").textContent = state.backend === "cloud" ? "雲端同步已連線" : "尚未連接共同資料庫";
}

function updateNetworkBanner() {
  $("#networkBanner").hidden = navigator.onLine;
  document.documentElement.classList.toggle("is-offline",!navigator.onLine);
  if (navigator.onLine) flushResourceOutbox();
  renderSyncSummary();
}

function updateModeBanner() {
  const banner = $("#modeBanner");
  if (state.backend === "cloud" && state.authorized) {
    banner.className = "mode-banner cloud";
    banner.innerHTML = '<span class="banner-icon">✓</span><div><strong>Firebase 即時同步已連線</strong><p>你和女朋友會看到同一份資料。</p></div><button type="button" id="modeAction">帳號資訊</button>';
  } else if (firebaseConfigured() && state.user) {
    banner.className = "mode-banner local";
    banner.innerHTML = '<span class="banner-icon">!</span><div><strong>已登入，但沒有編輯權限</strong><p>看到的是最新資料，修改需要已授權的帳號。</p></div><button type="button" id="modeAction">查看 UID</button>';
  } else if (firebaseConfigured() && state.itineraryReadable) {
    banner.className = "mode-banner cloud";
    banner.innerHTML = '<span class="banner-icon">👁</span><div><strong>正在看最新行程（唯讀）</strong><p>登入已授權的帳號才能修改。</p></div><button type="button" id="modeAction">登入</button>';
  } else if (firebaseConfigured()) {
    banner.className = "mode-banner local";
    banner.innerHTML = '<span class="banner-icon">G</span><div><strong>雲端已設定，正在載入最新資料</strong><p>登入已授權帳號即可共同編輯。</p></div><button type="button" id="modeAction">登入</button>';
  } else {
    banner.className = "mode-banner local";
    banner.innerHTML = '<span class="banner-icon">i</span><div><strong>目前是本機草稿</strong><p>資料只存在這台裝置。</p></div><button type="button" id="modeAction">查看設定</button>';
  }
  $("#modeAction").addEventListener("click",() => firebaseConfigured() ? openShareDialog() : openSingleDialog($("#setupDialog")));
  updateEditAffordances();
}

function openSingleDialog(dialog) {
  closeOpenDialogs(dialog);
  if (!dialog.open) dialog.showModal();
}

function openShareDialog() {
  const configured = firebaseConfigured();
  $("#shareUrl").value = location.href;
  $("#googleSignIn").hidden = !configured || Boolean(state.user);
  $("#googleSignOut").hidden = !state.user;
  $("#uidCard").hidden = !state.user;
  if (state.user) {
    $("#userUid").textContent = state.user.uid;
    $("#currentAvatar").textContent = initials(state.user.displayName || state.user.email || "我");
  }
  if (!configured) {
    $("#shareHeading").textContent = "分享行程頁面";
    $("#shareDescription").textContent = "目前新增內容只存於這台裝置；設定 Firebase 後才是共同編輯。";
  } else if (!state.user) {
    $("#shareHeading").textContent = "登入共同資料庫";
    $("#shareDescription").textContent = "你和女朋友各自使用 Google 帳號登入。";
  } else if (state.authorized) {
    $("#shareHeading").textContent = "雲端同步已連線";
    $("#shareDescription").textContent = "把網址傳給另一位已授權的旅伴即可共同編輯。";
  } else {
    $("#shareHeading").textContent = "還差 Firestore 授權";
    $("#shareDescription").textContent = "目前登入的帳號尚未取得這趟旅程的共同編輯權限。";
  }
  openSingleDialog($("#shareDialog"));
}

function firebaseConfigured() {
  if (new URL(location.href).searchParams.get("backend") === "local") return false;
  const config = window.TRIP_FIREBASE_CONFIG;
  return Boolean(config && ["apiKey","authDomain","projectId","appId","messagingSenderId"].every((key) => typeof config[key] === "string" && config[key]));
}

async function connectFirebase() {
  if (!firebaseConfigured()) { updateModeBanner(); return; }
  try {
    const modules = await Promise.all([
      import("https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/firebase-firestore.js")
    ]);
    const app = modules[0].initializeApp(window.TRIP_FIREBASE_CONFIG);
    const auth = modules[1].getAuth(app);
    let db;
    try {
      db = modules[2].initializeFirestore(app,{
        localCache:modules[2].persistentLocalCache({ tabManager:modules[2].persistentMultipleTabManager() })
      });
    } catch (error) {
      console.warn("Persistent Firestore cache fallback",error);
      db = modules[2].getFirestore(app);
    }
    state.firebase = { auth,db,authModule:modules[1],firestore:modules[2] };
    modules[1].onAuthStateChanged(auth,(user) => {
      state.user = user;
      state.authorized = false;
      state.resourceAuthorized = false;
      state.itineraryAuthorized = false;
      state.resourceReadable = false;
      state.itineraryReadable = false;
      if (state.unsubscribeResources) state.unsubscribeResources();
      if (state.unsubscribeItinerary) state.unsubscribeItinerary();
      if (state.unsubscribeDayMeta) state.unsubscribeDayMeta();
      state.unsubscribeResources = null;
      state.unsubscribeItinerary = null;
      state.unsubscribeDayMeta = null;
      if (state.signingOut) return;
      if (user) $("#currentAvatar").textContent = initials(user.displayName || user.email || "我");
      // 未登入訪客也要訂閱，否則會停留在硬編碼的 seed 行程。寫入權限另由 canEditTrip() 判斷。
      setSyncStatus("connecting");
      listenToCloud();
      updateModeBanner();
    });
  } catch (error) {
    console.error(error);
    state.firebaseError = true;
    setSyncStatus("error");
    showToast("Firebase 連線失敗，已保留本機資料");
  }
}

function listenToCloud() {
  const f = state.firebase.firestore;
  const resourceRef = f.collection(state.firebase.db,"boards",BOARD_ID,"resources");
  const itineraryRef = f.collection(state.firebase.db,"boards",BOARD_ID,"itineraryItems");
  const dayMetaRef = f.collection(state.firebase.db,"boards",BOARD_ID,"dayMeta");
  state.unsubscribeDayMeta = f.onSnapshot(dayMetaRef,(snapshot) => {
    state.dayMeta = new Map(snapshot.docs.map((item) => [item.id,Object.assign({ id:item.id },item.data())]));
    setSyncStatus(cloudSyncMode(snapshot));
    renderAll();
    if ($("#dayDialog").open) renderDayDetails();
  },(error) => {
    console.warn("Day meta listener",error);
    state.dayMeta = new Map();
    renderAll();
  });
  state.unsubscribeResources = f.onSnapshot(resourceRef,{ includeMetadataChanges:true },async (snapshot) => {
    state.resourceReadable = true;
    state.resourceAuthorized = canEditTrip();
    state.authorized = state.resourceAuthorized && state.itineraryAuthorized;
    state.backend = "cloud";
    state.resourcePending = snapshot.metadata.hasPendingWrites;
    const cloud = snapshot.docs.map((item) => Object.assign({ id:item.id },item.data()));
    const merged = new Map(cloud.map((item) => [item.id,item]));
    if (canEditTrip()) {
      const pendingIds = new Set(loadOutbox().map((item) => item.id));
      loadLocalResources().filter((item) => pendingIds.has(item.id)).forEach((item) => merged.set(item.id,item));
    }
    state.resources = Array.from(merged.values());
    if (!snapshot.metadata.hasPendingWrites && !snapshot.metadata.fromCache) state.lastSyncAt = Date.now();
    setSyncStatus(cloudSyncMode(snapshot));
    updateModeBanner();
    renderResources();
    if (canEditTrip() && snapshot.empty && !snapshot.metadata.fromCache && !sessionStorage.getItem("trip-seeded")) {
      sessionStorage.setItem("trip-seeded","1");
      await Promise.all(loadLocalResources().map((resource) =>
        withTimeout(f.setDoc(f.doc(state.firebase.db,"boards",BOARD_ID,"resources",resource.id),Object.assign({},resource,{
          createdAt:f.serverTimestamp(),updatedAt:f.serverTimestamp()
        }),{ merge:true }))));
    }
    flushResourceOutbox();
  },(error) => {
    console.warn(error);
    state.resourceReadable = false;
    state.resourceAuthorized = false;
    state.authorized = false;
    state.backend = "local";
    state.resources = loadLocalResources();
    setSyncStatus(error.code === "permission-denied" ? "local" : "error");
    updateModeBanner();
    renderResources();
  });

  state.unsubscribeItinerary = f.onSnapshot(itineraryRef,{ includeMetadataChanges:true },async (snapshot) => {
    state.itineraryReadable = true;
    state.itineraryAuthorized = canEditTrip();
    state.authorized = state.resourceAuthorized && state.itineraryAuthorized;
    state.backend = "cloud";
    state.itineraryPending = snapshot.metadata.hasPendingWrites;
    const cloudItems = snapshot.docs.map((item) => Object.assign({ id:item.id },item.data()));
    const cloudById = new Map(cloudItems.map((item) => [item.id,item]));
    // 訪客沒有本機草稿的概念，留空可讓下方的衝突偵測與 migration 自然變成 no-op。
    const localDrafts = canEditTrip() ? loadLocalItineraryItems() : [];
    const syncConflicts = localDrafts.filter((item) => {
      const cloud = cloudById.get(item && item.id);
      return item && cloud && item.baseRevision != null && Number(cloud.revision || 0) !== Number(item.baseRevision);
    });
    state.syncConflictRemotes = new Map(syncConflicts.map((item) => [item.id,cloudById.get(item.id)]));
    const conflictIds = new Set(syncConflicts.map((item) => item.id));
    const draftsToMigrate = localDrafts.filter((item) => {
      const cloud = cloudById.get(item && item.id);
      return item && item.id && !conflictIds.has(item.id) && (!cloud || timestampValue(item.updatedAt) > timestampValue(cloud.updatedAt));
    });
    const display = new Map(cloudById);
    if (snapshot.metadata.fromCache || !navigator.onLine) draftsToMigrate.forEach((item) => display.set(item.id,item));
    syncConflicts.forEach((item) => display.set(item.id,Object.assign({},item,{ syncConflict:true })));
    state.itineraryItems = Array.from(display.values());
    if (syncConflicts.length && !sessionStorage.getItem("trip-sync-conflict")) {
      sessionStorage.setItem("trip-sync-conflict","1"); showToast("有本機行程與旅伴版本衝突，打開該筆即可選擇版本");
    }
    if (!snapshot.metadata.hasPendingWrites && !snapshot.metadata.fromCache) state.lastSyncAt = Date.now();
    setSyncStatus(cloudSyncMode(snapshot));
    updateModeBanner();
    renderAll();
    if ($("#dayDialog").open) renderDayDetails();
    if (canEditTrip() && localDrafts.length && !snapshot.metadata.fromCache && navigator.onLine && !state.migratingItinerary) {
      state.migratingItinerary = true;
      try {
        await Promise.all(draftsToMigrate.map((item) => {
          const ref = f.doc(state.firebase.db,"boards",BOARD_ID,"itineraryItems",item.id);
          return f.runTransaction(state.firebase.db,async (transaction) => {
            const remoteSnapshot = await transaction.get(ref);
            const remoteRevision = Number((remoteSnapshot.exists() && remoteSnapshot.data().revision) || 0);
            if (item.baseRevision != null && remoteRevision !== Number(item.baseRevision)) {
              const error = new Error("revision-conflict"); error.code = "revision-conflict"; throw error;
            }
            if (item._deleteOverride) { transaction.delete(ref); return; }
            const payload = Object.assign({},item,{
              revision:remoteRevision + 1,updatedAt:f.serverTimestamp(),updatedByUid:state.user.uid,
              updatedByName:item.updatedByName || currentUserName()
            });
            delete payload.baseRevision; delete payload.syncConflict; delete payload._deleteOverride;
            transaction.set(ref,payload,{ merge:true });
          });
        }));
        if (syncConflicts.length) saveArray(ITINERARY_STORAGE_KEY,syncConflicts); else localStorage.removeItem(ITINERARY_STORAGE_KEY);
      } catch (error) {
        console.warn("Local itinerary migration failed",error);
        showToast("本機行程尚未同步，稍後會再試");
      } finally { state.migratingItinerary = false; }
    }
  },(error) => {
    console.warn(error);
    state.itineraryReadable = false;
    state.itineraryAuthorized = false;
    state.authorized = false;
    state.itineraryItems = loadLocalItineraryItems();
    setSyncStatus(error.code === "permission-denied" ? "local" : "error");
    updateModeBanner();
    renderAll();
  });
}

async function googleSignIn() {
  if (!state.firebase) return;
  try {
    if (state.firebase.authModule.setPersistence && state.firebase.authModule.browserSessionPersistence) {
      await state.firebase.authModule.setPersistence(state.firebase.auth,state.firebase.authModule.browserSessionPersistence);
    }
    const provider = new state.firebase.authModule.GoogleAuthProvider();
    await state.firebase.authModule.signInWithPopup(state.firebase.auth,provider);
    $("#shareDialog").close();
  } catch (error) {
    console.error(error);
    showToast("Google 登入未完成");
  }
}

async function secureGoogleSignOut() {
  if (!state.firebase) return;
  const hasPending = loadOutbox().length > 0 || loadLocalItineraryItems().length > 0;
  if (hasPending && !confirm("這台裝置還有尚未同步的變更。現在登出會清除本機草稿，確定繼續嗎？")) return;
  const firebase = state.firebase;
  // 登出後 onAuthStateChanged 會再觸發一次；若讓它重新掛上訪客監聽，
  // terminate 與 clearIndexedDbPersistence 會失敗，裝置上的快取就清不掉。
  state.signingOut = true;
  if (state.unsubscribeResources) state.unsubscribeResources();
  if (state.unsubscribeItinerary) state.unsubscribeItinerary();
  if (state.unsubscribeDayMeta) state.unsubscribeDayMeta();
  state.unsubscribeResources = null; state.unsubscribeItinerary = null; state.unsubscribeDayMeta = null;
  try {
    await firebase.authModule.signOut(firebase.auth);
    if (firebase.firestore.terminate) await withTimeout(firebase.firestore.terminate(firebase.db),5000);
    if (firebase.firestore.clearIndexedDbPersistence) await withTimeout(firebase.firestore.clearIndexedDbPersistence(firebase.db),5000);
  } catch (error) {
    console.warn("Secure sign-out cleanup",error);
  } finally {
    [STORAGE_KEY,ITINERARY_STORAGE_KEY,RESOURCE_OUTBOX_KEY].forEach((key) => localStorage.removeItem(key));
    sessionStorage.removeItem("trip-sync-conflict");
    location.reload();
  }
}

function appleMapsUrl(locationText) {
  const url = new URL("https://maps.apple.com/");
  url.searchParams.set("daddr",locationText);
  url.searchParams.set("dirflg","r");
  return url.href;
}

function openNavigation(item) {
  if (!item || !item.location) return;
  let dialog = $("#mapChoiceDialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "mapChoiceDialog";
    dialog.className = "sheet compact-sheet map-choice";
    dialog.setAttribute("aria-labelledby","mapChoiceTitle"); dialog.innerHTML = '<div class="sheet-shell"><div class="sheet-grabber"></div><header class="sheet-header"><button type="button" data-map-close>取消</button><h2 id="mapChoiceTitle">選擇導航 App</h2><span></span></header><div class="map-choice-content"><strong id="mapChoicePlace"></strong><a id="appleMapLink" target="_blank" rel="noreferrer">Apple 地圖</a><a id="googleMapLink" target="_blank" rel="noreferrer">Google 地圖</a><button id="copyMapPlace" type="button">複製地點</button></div></div>';
    document.body.append(dialog);
    $("[data-map-close]",dialog).addEventListener("click",() => dialog.close());
    dialog.addEventListener("click",(event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close",() => {
      if (state.tab === "itinerary" && state.selectedDayKey && !$$('dialog[open]').length) {
        openDayDialog(state.selectedDayKey,state.highlightedItemId,{ push:false });
      }
    });
    $$("a",dialog).forEach((link) => link.addEventListener("click",() => setTimeout(() => dialog.close(),0)));
  }
  $("#mapChoicePlace").textContent = item.location;
  $("#appleMapLink").href = appleMapsUrl(item.location);
  $("#googleMapLink").href = safeHttpUrl(item.navigationUrl) || mapsRoute("",item.location);
  $("#copyMapPlace").onclick = () => copyText(item.location,"地點已複製");
  openSingleDialog(dialog);
}

function calendarText(item) {
  const date = item.date.replaceAll("-","");
  const clean = (value) => String(value || "").replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
  const lines = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Japan Snow Trip//ZH-TW","CALSCALE:GREGORIAN",
    "BEGIN:VEVENT","UID:" + item.id + "@tohoku-2026","DTSTAMP:" + new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,""),
  ];
  if (!item.startTime) {
    const next = new Date(item.date + "T00:00:00Z");
    next.setUTCDate(next.getUTCDate() + 1);
    const nextDate = next.toISOString().slice(0,10).replaceAll("-","");
    lines.push("DTSTART;VALUE=DATE:" + date,"DTEND;VALUE=DATE:" + nextDate);
  } else {
    const startMinutes = Number(item.startTime.slice(0,2)) * 60 + Number(item.startTime.slice(3));
    let endMinutes = item.endTime ? Number(item.endTime.slice(0,2)) * 60 + Number(item.endTime.slice(3)) : startMinutes + 60;
    let endDate = item.date;
    if (endMinutes <= startMinutes) endMinutes += 1440;
    if (endMinutes >= 1440) {
      const next = new Date(item.date + "T00:00:00Z");
      next.setUTCDate(next.getUTCDate() + 1);
      endDate = next.toISOString().slice(0,10);
      endMinutes -= 1440;
    }
    const endTime = String(Math.floor(endMinutes / 60)).padStart(2,"0") + String(endMinutes % 60).padStart(2,"0") + "00";
    lines.push("DTSTART;TZID=Asia/Tokyo:" + date + "T" + item.startTime.replace(":","") + "00");
    lines.push("DTEND;TZID=Asia/Tokyo:" + endDate.replaceAll("-","") + "T" + endTime);
  }
  const timeNote = item.timeLabel ? "時段：" + item.timeLabel + "\n" : "";
  lines.push("SUMMARY:" + clean(item.title),"LOCATION:" + clean(item.location),"DESCRIPTION:" + clean(timeNote + (item.notes || "")),"END:VEVENT","END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadCalendar(item) {
  const blob = new Blob([calendarText(item)],{ type:"text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = item.date + "-" + item.title.replace(/[\\/:*?"<>|]/g,"-") + ".ics";
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href),1000);
  showToast("行事曆檔案已建立");
}

async function shareItem(item) {
  const text = dateLabel(item.date) + " " + displayTime(item) + "\n" + item.title + (item.location ? "\n" + item.location : "");
  const shareUrl = new URL(location.href);
  shareUrl.searchParams.set("view","itinerary"); shareUrl.searchParams.set("day",item.date); shareUrl.searchParams.set("item",item.id);
  shareUrl.searchParams.delete("now"); shareUrl.searchParams.delete("backend");
  const url = shareUrl.href;
  if (navigator.share) {
    try { await navigator.share({ title:item.title,text,url }); return; } catch {}
  }
  copyText(text + "\n" + url,"行程文字與網址已複製");
}

function closeItineraryEditor(force) {
  if (!force && isItineraryFormDirty() && !confirm("尚未儲存的變更會消失，確定關閉嗎？")) return false;
  state.editorBaseline = "";
  $("#itineraryEditorDialog").close();
  if (state.returnToDayAfterEditor && state.selectedDayKey) openDayDialog(state.selectedDayKey,state.highlightedItemId,{ push:false });
  return true;
}

function closeResourceEditor(force) {
  const dirty = state.resourceEditorBaseline && formSnapshot($("#resourceForm")) !== state.resourceEditorBaseline;
  if (!force && dirty && !confirm("尚未儲存的連結變更會消失，確定關閉嗎？")) return false;
  state.resourceEditorBaseline = "";
  $("#editorDialog").close();
  return true;
}

function showToast(message,actionLabel,action) {
  clearTimeout(showToast.timer);
  state.toastAction = typeof action === "function" ? action : null;
  $("#toastText").textContent = message;
  $("#toastAction").hidden = !state.toastAction;
  $("#toastAction").textContent = actionLabel || "復原";
  const toast = $("#toast");
  const openDialog = $$('dialog[open]').slice(-1)[0];
  if (typeof toast.hidePopover === "function" && toast.matches(":popover-open")) toast.hidePopover();
  if (openDialog) {
    toast.removeAttribute("popover");
    if (toast.parentElement !== openDialog) openDialog.append(toast);
  } else {
    toast.setAttribute("popover","manual");
    if (toast.parentElement !== document.body) document.body.append(toast);
  }
  toast.hidden = false;
  if (!openDialog && typeof toast.showPopover === "function" && !toast.matches(":popover-open")) toast.showPopover();
  showToast.timer = setTimeout(() => {
    if (typeof toast.hidePopover === "function" && toast.matches(":popover-open")) toast.hidePopover();
    toast.hidden = true;
    state.toastAction = null;
  },state.toastAction ? 7000 : 3400);
}

async function copyText(value,message) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(message);
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast(message);
  }
}

function renderAll() {
  renderItinerary();
  renderResources();
  renderToday();
}

function initializeRoute() {
  const params = new URL(location.href).searchParams;
  const tab = ["today","itinerary","library"].includes(params.get("view")) ? params.get("view") : "today";
  const day = tripDay(params.get("day")) ? params.get("day") : null;
  const item = params.get("item");
  setTab(tab,{ skipUrl:true,instant:true });
  if (day) {
    state.selectedDayKey = day;
    state.highlightedItemId = item || null;
    if (tab === "itinerary") openDayDialog(day,item,{ push:false });
  }
  updateUrl({ replace:true });
}

function registerPwa() {
  window.addEventListener("beforeinstallprompt",(event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    $("#installButton").hidden = false;
  });
  $("#installButton").addEventListener("click",async () => {
    if (state.deferredInstallPrompt) {
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    showToast(ios ? "在 Safari 點分享，再選「加入主畫面」" : "請使用瀏覽器選單的「安裝應用程式」");
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.addEventListener("updatefound",() => {
        const worker = registration.installing;
        if (worker) worker.addEventListener("statechange",() => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            showToast("網站有新版本","重新整理",() => {
              if (!registration.waiting) { location.reload(); return; }
              navigator.serviceWorker.addEventListener("controllerchange",() => location.reload(),{ once:true });
              registration.waiting.postMessage({ type:"SKIP_WAITING" });
            });
          }
        });
      });
    }).catch((error) => console.warn("Service worker registration failed",error));
  }
}

function bindEvents() {
  $$("[data-tab]").forEach((button) => {
    button.addEventListener("click",() => setTab(button.dataset.tab,{ push:true }));
    button.addEventListener("keydown",(event) => {
      if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
      const tablist = button.closest('[role="tablist"]');
      const tabs = $$('[data-tab][role="tab"]',tablist);
      let index = tabs.findIndex((tab) => tab.dataset.tab === state.tab);
      if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") index = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = tabs.length - 1;
      event.preventDefault();
      setTab(tabs[index].dataset.tab,{ push:true });
      tabs[index].focus();
    });
  });
  $("#brandButton").addEventListener("click",() => setTab("today",{ push:true }));
  $("#dayGrid").addEventListener("click",(event) => {
    const button = event.target.closest("[data-day]");
    if (button) openDayDialog(button.dataset.day,null,{ push:true });
  });
  $("#routeMapTrack").addEventListener("click",(event) => {
    const button = event.target.closest("[data-day]");
    if (button) openDayDialog(button.dataset.day,null,{ push:true });
  });
  $("#previousDayButton").addEventListener("click",() => moveDay(-1));
  $("#nextDayButton").addEventListener("click",() => moveDay(1));
  $("#dayDateStrip").addEventListener("click",(event) => {
    const button = event.target.closest("[data-strip-day]");
    if (button) {
      openDayDialog(button.dataset.stripDay,null,{ push:true });
      requestAnimationFrame(() => $("#dayDateStrip .active")?.focus());
    }
  });
  $("#dayDialog").addEventListener("touchstart",(event) => {
    const touch = event.changedTouches[0];
    state.swipeStartX = touch.clientX; state.swipeStartY = touch.clientY;
    state.swipeBlocked = Boolean(event.target.closest(".day-date-strip,button,a,summary,details,input,select,textarea"));
  });
  $("#dayDialog").addEventListener("touchend",(event) => {
    const x = event.changedTouches[0].clientX - state.swipeStartX;
    const y = event.changedTouches[0].clientY - state.swipeStartY;
    if (!state.swipeBlocked && Math.abs(x) > 70 && Math.abs(x) > Math.abs(y) * 1.25) moveDay(x > 0 ? -1 : 1);
  },{ passive:true });
  $("#todayPrimary").addEventListener("click",() => {
    setTab("itinerary",{ push:true,keepScroll:true });
    openDayDialog($("#todayPrimary").dataset.day,null,{ push:true });
  });
  $("#todayNavigate").addEventListener("click",() => openNavigation(itineraryItemById($("#todayNavigate").dataset.item)));
  $("#todayStayCopy").addEventListener("click",() => copyText($("#todayStayCopy").dataset.value,"住宿地點已複製"));
  $("#todayShareButton").addEventListener("click",openShareDialog);

  document.addEventListener("click",(event) => {
    const historyButton = event.target.closest("[data-history-index]");
    if (historyButton) {
      const entry = state.historyEntries[Number(historyButton.dataset.historyIndex)];
      if (entry && entry.snapshot) { fillItineraryForm(entry.snapshot,entry.snapshot.date); showToast("已載入舊版本，按儲存才會套用"); }
      return;
    }
    const routeEdit = event.target.closest("[data-route-edit]");
    if (routeEdit) { openDayMetaEditor(routeEdit.dataset.routeEdit || state.selectedDayKey); return; }
    const addItinerary = event.target.closest('[data-action="add-itinerary"]');
    if (addItinerary) { openItineraryEditor(null,state.selectedDayKey,addItinerary.closest("#dayDialog") ? "day" : "page"); return; }
    const edit = event.target.closest("[data-itinerary-edit]");
    if (edit) { openItineraryEditor(edit.dataset.itineraryEdit,null,"day"); return; }
    const search = event.target.closest("[data-search-itinerary]");
    if (search) {
      const item = itineraryItemById(search.dataset.searchItinerary);
      if (item) { setTab("itinerary",{ push:true,keepScroll:true }); openDayDialog(item.date,item.id,{ push:true }); }
      return;
    }
    const nav = event.target.closest("[data-nav-item]");
    if (nav) { openNavigation(itineraryItemById(nav.dataset.navItem)); return; }
    const copyLocation = event.target.closest("[data-copy-location]");
    if (copyLocation) { copyText(copyLocation.dataset.copyLocation,"地點已複製"); return; }
    const calendar = event.target.closest("[data-calendar-item]");
    if (calendar) { const item = itineraryItemById(calendar.dataset.calendarItem); if (item) downloadCalendar(item); return; }
    const share = event.target.closest("[data-share-item]");
    if (share) { const item = itineraryItemById(share.dataset.shareItem); if (item) shareItem(item); }
  });
  $$('[data-action="add"]').forEach((button) => button.addEventListener("click",() => openEditor()));
  $("#categoryRow").addEventListener("click",(event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderResources();
  });
  $("#librarySearch").addEventListener("input",(event) => {
    state.query = event.target.value;
    event.target.nextElementSibling.hidden = !event.target.value;
    renderResources();
  });
  $(".clear-search").addEventListener("click",(event) => {
    const input = event.currentTarget.previousElementSibling;
    input.value = "";
    state.query = "";
    event.currentTarget.hidden = true;
    renderResources();
    input.focus();
  });
  $("#resourceForm").addEventListener("submit",submitResource);
  $("#deleteButton").addEventListener("click",deleteCurrentResource);
  $("#itineraryForm").addEventListener("submit",submitItineraryItem);
  $("#dayMetaForm").addEventListener("submit",submitDayMeta);
  $("#dayMetaResetButton").addEventListener("click",resetDayMeta);
  $("#dayMetaDialog").addEventListener("cancel",(event) => {
    event.preventDefault();
    closeDayMetaEditor(false);
  });
  $("#dayMetaDialog").addEventListener("close",() => {
    const returnKey = state.dayMetaReturnKey;
    state.dayMetaReturnKey = null;
    if (returnKey && tripDay(returnKey)) openDayDialog(returnKey,state.highlightedItemId,{ push:false });
  });
  $("#deleteItineraryButton").addEventListener("click",deleteCurrentItineraryItem);
  $("#restoreItineraryButton").addEventListener("click",restoreBaseItineraryItem);
  $("#duplicateItineraryButton").addEventListener("click",duplicateItineraryItem);
  $("#conflictReload").addEventListener("click",() => {
    if (!state.conflictItem) return;
    fillItineraryForm(state.conflictItem,state.conflictItem.date);
    state.editorRevision = Number(state.conflictItem.revision || 0);
    renderHistory(state.conflictItem);
    state.conflictItem = null;
    $("#conflictWarning").hidden = true;
    state.editorBaseline = formSnapshot($("#itineraryForm"));
    showToast("已載入最新版本");
  });
  $("#conflictKeepMine").addEventListener("click",() => {
    state.keepMineAfterConflict = true;
    state.editorRevision = Number((state.conflictItem && state.conflictItem.revision) || state.editorRevision);
    $("#conflictWarning").hidden = true;
    $("#itineraryForm").requestSubmit();
  });
  $("#resourceUrl").addEventListener("blur",() => {
    if ($("#resourceTitle").value || !$("#resourceUrl").value) return;
    try { $("#resourceTitle").value = new URL($("#resourceUrl").value).hostname.replace(/^www\./,""); } catch {}
  });
  $$("[data-close-dialog]").forEach((button) => button.addEventListener("click",() => {
    if (button.dataset.closeDialog === "itineraryEditorDialog") closeItineraryEditor(false);
    else if (button.dataset.closeDialog === "editorDialog") closeResourceEditor(false);
    else if (button.dataset.closeDialog === "dayMetaDialog") closeDayMetaEditor(false);
    else document.getElementById(button.dataset.closeDialog).close();
  }));
  $$("dialog").forEach((dialog) => dialog.addEventListener("click",(event) => {
    if (event.target !== dialog) return;
    if (dialog.id === "itineraryEditorDialog") closeItineraryEditor(false);
    else if (dialog.id === "editorDialog") closeResourceEditor(false);
    else if (dialog.id === "dayMetaDialog") closeDayMetaEditor(false); else dialog.close();
  }));
  $("#itineraryEditorDialog").addEventListener("cancel",(event) => {
    event.preventDefault();
    closeItineraryEditor(false);
  });
  $("#shareButton").addEventListener("click",openShareDialog);
  $("#copyShareUrl").addEventListener("click",() => copyText($("#shareUrl").value,"網站網址已複製"));
  $("#editorDialog").addEventListener("cancel",(event) => {
    event.preventDefault();
    closeResourceEditor(false);
  });
  $("#dayDialog").addEventListener("close",() => {
    if (state.preserveDayOnClose) { state.preserveDayOnClose = false; return; }
    const previousDay = state.selectedDayKey;
    state.selectedDayKey = null; state.highlightedItemId = null;
    updateUrl({ replace:true }); renderItinerary();
    requestAnimationFrame(() => $('[data-testid="day-' + previousDay + '"]')?.focus());
  });
  $("#shareDialog").addEventListener("close",() => {
    if (state.tab === "itinerary" && state.selectedDayKey && !$$('dialog[open]').length) {
      openDayDialog(state.selectedDayKey,state.highlightedItemId,{ push:false });
    }
  });
  $("#copyUid").addEventListener("click",() => copyText($("#userUid").textContent,"UID 已複製"));
  $("#googleSignIn").addEventListener("click",googleSignIn);
  $("#googleSignOut").addEventListener("click",secureGoogleSignOut);
  $("#toastAction").addEventListener("click",async () => {
    const action = state.toastAction;
    state.toastAction = null;
    if (action) await action();
    $("#toast").hidden = true;
    showToast("已復原");
  });
  window.addEventListener("online",updateNetworkBanner);
  window.addEventListener("offline",updateNetworkBanner);
  window.addEventListener("popstate",() => {
    if (isItineraryFormDirty() && !confirm("尚未儲存的行程變更會消失，確定返回嗎？")) { history.go(1); return; }
    const resourceDirty = $("#editorDialog").open && state.resourceEditorBaseline && formSnapshot($("#resourceForm")) !== state.resourceEditorBaseline;
    if (resourceDirty && !confirm("尚未儲存的連結變更會消失，確定返回嗎？")) { history.go(1); return; }
    state.editorBaseline = ""; state.resourceEditorBaseline = "";
    const params = new URL(location.href).searchParams;
    setTab(params.get("view") || "today",{ skipUrl:true,instant:true });
    if (tripDay(params.get("day")) && state.tab === "itinerary") openDayDialog(params.get("day"),params.get("item"),{ push:false });
    else if ($("#dayDialog").open) {
      state.preserveDayOnClose = true;
      $("#dayDialog").close();
      state.selectedDayKey = null; state.highlightedItemId = null;
    }
  });
}

state.resources = loadLocalResources();
state.itineraryItems = loadLocalItineraryItems();
renderItineraryDateOptions();
renderCategories();
renderAll();
bindEvents();
updateModeBanner();
updateNetworkBanner();
initializeRoute();
registerPwa();
connectFirebase();

