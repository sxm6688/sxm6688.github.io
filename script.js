const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const progressBar = document.querySelector(".scroll-progress span");
const cursorGlow = document.querySelector(".cursor-glow");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const projectModal = document.querySelector("[data-project-modal]");
const modalClose = document.querySelector(".modal-close");
const copyEmailButton = document.querySelector("[data-copy-email]");
const copyWechatButton = document.querySelector("[data-copy-wechat]");
const capabilityDialog = document.querySelector("[data-capability-dialog]");
const capabilityForm = document.querySelector("[data-capability-form]");
const capabilityItemDialog = document.querySelector("[data-capability-item-dialog]");
const capabilityItemForm = document.querySelector("[data-capability-item-form]");
const capabilityDeleteDialog = document.querySelector("[data-capability-delete-dialog]");
const toast = document.querySelector(".toast");
const toastText = document.querySelector("[data-toast-text]");
const bookmarkGrid = document.querySelector("[data-bookmark-grid]");
const bookmarkSearch = document.querySelector("[data-bookmark-search]");
const bookmarkEmpty = document.querySelector("[data-bookmark-empty]");
const bookmarkCount = document.querySelector("[data-bookmark-count]");
const bookmarkDialog = document.querySelector("[data-bookmark-dialog]");
const bookmarkForm = document.querySelector("[data-bookmark-form]");
const bookmarkFilters = [...document.querySelectorAll("[data-bookmark-filter]")];
const archiveChapters = document.querySelector("[data-archive-chapters]");
const archiveCount = document.querySelector("[data-archive-count]");
const archiveDialog = document.querySelector("[data-archive-dialog]");
const archiveImage = document.querySelector("[data-archive-image]");
const archiveVideo = document.querySelector("[data-archive-video]");
const archiveDialogCategory = document.querySelector("[data-archive-category]");
const archiveDialogTitle = document.querySelector("[data-archive-title]");
const archiveDialogDescription = document.querySelector("[data-archive-description]");
const archiveDialogPosition = document.querySelector("[data-archive-position]");
const archiveThumbs = document.querySelector("[data-archive-thumbs]");
const archiveSubfilters = document.querySelector("[data-archive-subfilters]");
const archiveManageToggle = document.querySelector("[data-archive-manage-toggle]");
const archiveAdd = document.querySelector("[data-archive-add]");
const archiveUpload = document.querySelector("[data-archive-upload]");
const archiveManageNote = document.querySelector("[data-archive-manage-note]");
const archiveItemActions = document.querySelector("[data-archive-item-actions]");
const archiveEditItemButton = document.querySelector("[data-archive-edit-item]");
const archiveReplaceItemButton = document.querySelector("[data-archive-replace-item]");
const archiveDeleteItemButton = document.querySelector("[data-archive-delete-item]");
const archiveItemDialog = document.querySelector("[data-archive-item-dialog]");
const archiveItemForm = document.querySelector("[data-archive-item-form]");
const archiveDeleteDialog = document.querySelector("[data-archive-delete-dialog]");
const editAccessButtons = [...document.querySelectorAll("[data-edit-access]")];
const editGateDialog = document.querySelector("[data-edit-gate]");
const editGateForm = document.querySelector("[data-edit-gate-form]");
const editGateError = document.querySelector("[data-edit-gate-error]");
const editPasswordInput = editGateForm.querySelector('input[name="password"]');
const editPasswordToggle = document.querySelector("[data-edit-password-toggle]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function isEditingEnabled() {
  return root.dataset.access === "edit";
}

function updateEditAccessUi() {
  const enabled = isEditingEnabled();
  editAccessButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", enabled ? "退出编辑模式" : "进入编辑模式");
    const label = button.querySelector("[data-edit-access-label]");
    if (!label) return;
    label.textContent = enabled
      ? "退出编辑"
      : button.classList.contains("mobile-edit-entry")
        ? "编辑模式"
        : "编辑";
  });
}

function setEditAccess(enabled, { notify = true } = {}) {
  root.dataset.access = enabled ? "edit" : "view";
  try {
    sessionStorage.setItem("sxm-edit-access", String(enabled));
  } catch (error) {}

  if (!enabled) {
    [capabilityDialog, capabilityItemDialog, capabilityDeleteDialog, bookmarkDialog,
      archiveItemDialog, archiveDeleteDialog].forEach((dialog) => {
      if (dialog?.open) dialog.close();
    });
    archiveManageMode = false;
    if (archiveDialog?.open) renderArchiveDialog();
  }

  updateEditAccessUi();
  if (notify) showToast(enabled ? "已进入编辑模式" : "已返回展示版");
}

function openEditGate() {
  if (isEditingEnabled()) return;
  editGateForm.reset();
  editPasswordInput.type = "password";
  editPasswordToggle.textContent = "显示";
  editPasswordToggle.setAttribute("aria-label", "显示密码");
  editGateError.hidden = true;
  body.classList.add("modal-open");
  editGateDialog.showModal();
  window.setTimeout(() => editPasswordInput.focus(), 60);
}

function guardEditing() {
  if (isEditingEnabled()) return true;
  openEditGate();
  return false;
}

editAccessButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeMenu();
    if (isEditingEnabled()) {
      setEditAccess(false);
      return;
    }
    openEditGate();
  });
});

document.querySelectorAll("[data-edit-gate-close]").forEach((button) => {
  button.addEventListener("click", () => editGateDialog.close());
});

editGateDialog.addEventListener("click", (event) => {
  if (event.target === editGateDialog) editGateDialog.close();
});

editGateDialog.addEventListener("close", () => {
  body.classList.remove("modal-open");
  editGateError.hidden = true;
});

editPasswordToggle.addEventListener("click", () => {
  const reveal = editPasswordInput.type === "password";
  editPasswordInput.type = reveal ? "text" : "password";
  editPasswordToggle.textContent = reveal ? "隐藏" : "显示";
  editPasswordToggle.setAttribute("aria-label", reveal ? "隐藏密码" : "显示密码");
  editPasswordInput.focus();
});

editGateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredPassword = editPasswordInput.value;
  if (enteredPassword !== atob("c3htNjY2")) {
    editGateError.hidden = false;
    editPasswordInput.select();
    return;
  }
  editGateDialog.close();
  setEditAccess(true, { notify: false });
  showToast("编辑模式已解锁");
});

updateEditAccessUi();

const capabilityDefaults = {
  art: { title: "绘画与书法", description: "从色彩、肌理到笔墨节奏，在传统媒介中寻找真诚而独特的表达。" },
  design: { title: "视觉设计与叙事", description: "用图形、字体、版式与镜头组织信息，让视觉表达清晰、有层次、有记忆点。" },
  motion: { title: "建模动画与分镜", description: "从空间、材质到动态节奏，用三维与镜头语言让故事真正动起来。" }
};
let editingCapability = "";
let editingCapabilityItem = "";
let pendingCapabilityDelete = null;
const capabilityObjectUrls = new Map();
const capabilityMemoryMedia = [];
const capabilityMemoryCopy = {};

function getCapabilityLocalStorage() {
  try { return window.localStorage || null; } catch { return null; }
}

function makeCapabilityId() {
  return window.crypto?.randomUUID?.() || `cap-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readCapabilityFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function openCapabilityDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sxm-capability-library", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("media", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function capabilityMedia(action, value) {
  if (!window.indexedDB) {
    const storageKey = "sxm-capability-media-fallback";
    const storage = getCapabilityLocalStorage();
    if (!storage) {
      if (action === "getAll") return [...capabilityMemoryMedia];
      if (action === "delete") {
        const index = capabilityMemoryMedia.findIndex((item) => item.id === value);
        if (index >= 0) capabilityMemoryMedia.splice(index, 1);
        return;
      }
      if (action === "put") {
        const dataUrl = value.dataUrl || (value.file && await readCapabilityFile(value.file));
        if (!dataUrl) throw new Error("无法读取图片，请重新选择后再试。");
        const saved = { ...value, file: undefined, dataUrl };
        const index = capabilityMemoryMedia.findIndex((item) => item.id === saved.id);
        if (index >= 0) capabilityMemoryMedia[index] = saved;
        else capabilityMemoryMedia.push(saved);
        return;
      }
    }
    let records = [];
    try { records = JSON.parse(storage.getItem(storageKey) || "[]"); } catch { records = []; }
    if (action === "getAll") {
      return records;
    }
    if (action === "delete") {
      storage.setItem(storageKey, JSON.stringify(records.filter((item) => item.id !== value)));
      return;
    }
    if (action === "put") {
      if (value.file?.size > 3 * 1024 * 1024) throw new Error("当前浏览器存储空间有限，请改用较小的图片，或在支持本地数据库的浏览器中操作。");
      const dataUrl = value.dataUrl || (value.file && await new Promise((resolve, reject) => {
        readCapabilityFile(value.file).then(resolve, reject);
      }));
      if (!dataUrl) throw new Error("无法读取图片，请重新选择后再试。");
      try {
        const saved = { ...value, file: undefined, dataUrl };
        const existingIndex = records.findIndex((item) => item.id === value.id);
        if (existingIndex >= 0) records[existingIndex] = saved;
        else records.push(saved);
        storage.setItem(storageKey, JSON.stringify(records));
      } catch {
        throw new Error("浏览器可用存储空间不足，请先移除部分上传内容。");
      }
      return;
    }
  }
  const db = await openCapabilityDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("media", action === "getAll" ? "readonly" : "readwrite");
    const store = transaction.objectStore("media");
    const request = action === "getAll" ? store.getAll() : store[action](value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

function loadCapabilityCopy(key) {
  try {
    const saved = JSON.parse(getCapabilityLocalStorage()?.getItem("sxm-capability-copy") || "{}");
    return { ...capabilityDefaults[key], ...(saved[key] || {}) };
  } catch {
    return { ...capabilityDefaults[key], ...(capabilityMemoryCopy[key] || {}) };
  }
}

function saveCapabilityCopy(key, value) {
  capabilityMemoryCopy[key] = value;
  const storage = getCapabilityLocalStorage();
  if (!storage) return;
  const saved = JSON.parse(storage.getItem("sxm-capability-copy") || "{}");
  saved[key] = value;
  storage.setItem("sxm-capability-copy", JSON.stringify(saved));
}

function applyCapabilityCopy(key) {
  const row = document.querySelector(`[data-capability="${key}"]`);
  const copy = loadCapabilityCopy(key);
  row.querySelector("h3").textContent = copy.title;
  row.querySelector("p").textContent = copy.description;
}

async function renderCapabilityGallery(key) {
  const gallery = document.querySelector(`[data-capability-gallery="${key}"]`);
  const media = (await capabilityMedia("getAll")).filter((item) => item.capability === key);
  (capabilityObjectUrls.get(key) || []).forEach((url) => URL.revokeObjectURL?.(url));
  capabilityObjectUrls.set(key, []);
  gallery.replaceChildren();
  gallery.hidden = media.length === 0;
  media.forEach((item) => {
    const card = document.createElement("figure");
    card.className = "capability-media-card";
    const url = item.dataUrl || (URL.createObjectURL ? URL.createObjectURL(item.file) : "");
    if (!item.dataUrl && url) capabilityObjectUrls.get(key).push(url);
    const preview = item.type.startsWith("video/") ? document.createElement("video") : document.createElement("img");
    preview.src = url;
    if (preview.tagName === "VIDEO") { preview.controls = true; preview.playsInline = true; }
    else { preview.alt = item.title || item.name; preview.loading = "lazy"; }
    const caption = document.createElement("figcaption");
    caption.className = "capability-media-title";
    caption.textContent = item.title || item.name.replace(/\.[^.]+$/, "");
    const description = document.createElement("p");
    description.className = "capability-media-description";
    description.textContent = item.description || "";
    description.hidden = !item.description;
    const actions = document.createElement("div");
    actions.className = "capability-media-actions";
    actions.setAttribute("data-edit-only", "");
    const editText = document.createElement("button");
    editText.type = "button";
    editText.className = "capability-media-action";
    editText.textContent = "编辑文字";
    editText.addEventListener("click", () => openCapabilityItemEditor(item));
    const replace = document.createElement("button");
    replace.type = "button";
    replace.className = "capability-media-action";
    replace.textContent = "替换图片";
    const replaceInput = document.createElement("input");
    replaceInput.type = "file";
    replaceInput.accept = "image/*";
    replaceInput.hidden = true;
    replaceInput.addEventListener("change", async () => {
      if (!guardEditing()) return;
      const file = replaceInput.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) { showToast("请选择图片文件"); return; }
      try {
        await capabilityMedia("put", { ...item, name: file.name, type: file.type, dataUrl: undefined, file });
        await renderCapabilityGallery(key);
        showToast("图片已替换，原有文字已保留");
      } catch (error) { showToast(error.message || "替换失败，请稍后重试"); }
    });
    replace.addEventListener("click", () => replaceInput.click());
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "capability-media-action capability-media-remove";
    remove.textContent = "删除";
    remove.setAttribute("aria-label", `删除图片 ${item.title || item.name}`);
    remove.addEventListener("click", () => {
      if (!guardEditing()) return;
      pendingCapabilityDelete = item;
      capabilityDeleteDialog.querySelector("[data-capability-delete-copy]").textContent =
        `“${item.title || item.name}”将从「${loadCapabilityCopy(key).title}」模块中移除。`;
      capabilityDeleteDialog.showModal();
    });
    actions.append(editText, replace, remove);
    card.append(preview, caption, description, actions, replaceInput);
    gallery.append(card);
  });
}

function openCapabilityItemEditor(item) {
  if (!guardEditing()) return;
  editingCapabilityItem = item.id;
  capabilityItemForm.elements.title.value = item.title || item.name.replace(/\.[^.]+$/, "");
  capabilityItemForm.elements.description.value = item.description || "";
  capabilityItemDialog.showModal();
}

document.querySelectorAll("[data-edit-capability]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!guardEditing()) return;
    editingCapability = button.dataset.editCapability;
    const copy = loadCapabilityCopy(editingCapability);
    capabilityForm.elements.title.value = copy.title;
    capabilityForm.elements.description.value = copy.description;
    capabilityForm.elements.media.value = "";
    capabilityDialog.querySelector("h2").textContent = `编辑「${copy.title}」`;
    const storageNote = capabilityForm.querySelector("[data-capability-storage-note]");
    storageNote.textContent = !window.indexedDB && !getCapabilityLocalStorage()
      ? "当前预览环境不支持长期本地存储：图片在此页面打开期间可编辑，关闭或刷新后不会保留。"
      : "可一次添加多张图片。每张图都可以单独替换、删除，并编辑标题与说明；内容保存在当前设备的浏览器中。";
    capabilityDialog.showModal();
  });
});

document.querySelectorAll("[data-capability-close]").forEach((button) => button.addEventListener("click", () => capabilityDialog.close()));
capabilityDialog.addEventListener("click", (event) => { if (event.target === capabilityDialog) capabilityDialog.close(); });
capabilityForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!guardEditing()) return;
  const key = editingCapability;
  const title = capabilityForm.elements.title.value.trim();
  const description = capabilityForm.elements.description.value.trim();
  try {
    for (const file of capabilityForm.elements.media.files) {
      if (!file.type.startsWith("image/")) throw new Error("请选择图片文件。");
      const cleanTitle = file.name.replace(/\.[^.]+$/, "");
      await capabilityMedia("put", {
        id: makeCapabilityId(), capability: key, name: file.name,
        title: cleanTitle, description: "", type: file.type, file, createdAt: Date.now()
      });
    }
    saveCapabilityCopy(key, { title, description });
    await renderCapabilityGallery(key);
  } catch (error) {
    showToast(error.message || "保存失败，请稍后重试");
    return;
  }
  applyCapabilityCopy(key);
  capabilityDialog.close();
  showToast("能力模块已保存");
});

document.querySelectorAll("[data-capability-item-close]").forEach((button) => {
  button.addEventListener("click", () => capabilityItemDialog.close());
});
capabilityItemDialog.addEventListener("click", (event) => {
  if (event.target === capabilityItemDialog) capabilityItemDialog.close();
});
capabilityItemForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!guardEditing()) return;
  try {
    const item = (await capabilityMedia("getAll")).find((entry) => entry.id === editingCapabilityItem);
    if (!item) throw new Error("图片记录不存在，请重新打开编辑窗口。");
    item.title = capabilityItemForm.elements.title.value.trim();
    item.description = capabilityItemForm.elements.description.value.trim();
    await capabilityMedia("put", item);
    await renderCapabilityGallery(item.capability);
    capabilityItemDialog.close();
    showToast("图片文字已更新");
  } catch (error) { showToast(error.message || "保存失败，请稍后重试"); }
});

document.querySelector("[data-capability-delete-cancel]").addEventListener("click", () => {
  pendingCapabilityDelete = null;
  capabilityDeleteDialog.close();
});
document.querySelector("[data-capability-delete-confirm]").addEventListener("click", async () => {
  if (!guardEditing()) return;
  if (!pendingCapabilityDelete) return;
  const item = pendingCapabilityDelete;
  try {
    await capabilityMedia("delete", item.id);
    await renderCapabilityGallery(item.capability);
    pendingCapabilityDelete = null;
    capabilityDeleteDialog.close();
    showToast("图片已删除");
  } catch (error) { showToast(error.message || "删除失败，请稍后重试"); }
});
capabilityDeleteDialog.addEventListener("click", (event) => {
  if (event.target === capabilityDeleteDialog) {
    pendingCapabilityDelete = null;
    capabilityDeleteDialog.close();
  }
});
capabilityDeleteDialog.addEventListener("close", () => { pendingCapabilityDelete = null; });

Object.keys(capabilityDefaults).forEach((key) => {
  applyCapabilityCopy(key);
  renderCapabilityGallery(key).catch((error) => showToast(error.message || "无法读取能力作品"));
});

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function scrollToHash({ behavior = "auto" } = {}) {
  const hash = window.location.hash.slice(1);
  const rootStyle = document.documentElement.style;
  const previousScrollBehavior = rootStyle.scrollBehavior;

  if (behavior === "auto") {
    rootStyle.scrollBehavior = "auto";
  }

  if (!hash) {
    window.scrollTo({ top: 0, behavior });
    if (behavior === "auto") rootStyle.scrollBehavior = previousScrollBehavior;
    return;
  }

  const target = document.getElementById(decodeURIComponent(hash));
  if (!target) {
    if (behavior === "auto") rootStyle.scrollBehavior = previousScrollBehavior;
    return;
  }

  const scrollPaddingTop =
    Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - scrollPaddingTop;
  window.scrollTo({ top: Math.max(0, top), behavior });

  if (behavior === "auto") rootStyle.scrollBehavior = previousScrollBehavior;
}

function handleHashNavigation() {
  closeMenu();
  window.requestAnimationFrame(() => {
    scrollToHash({ behavior: reducedMotion ? "auto" : "smooth" });
  });
}

window.addEventListener("hashchange", handleHashNavigation);

const emailAddress = "qingyiiiiii@qq.com";
let toastTimer;
let activeProject = "painting";

const projectData = {
  painting: {
    title: "绘画",
    kicker: "100+ PAINTINGS · CHARACTER · COLOR",
    summary:
      "19岁画了100多张画，也被自己的高产震惊到。从角色、光影到画面里的情绪，绘画一直在帮我记录想象和感受；还有一些作品因单主买断无法公开。",
    challenge:
      "在角色表达与个人审美之间找到平衡，让每一张画不仅好看，也能传递出人物关系和情绪。",
    approach:
      "从角色气质和画面主题出发，尝试不同的光影、构图和色彩关系；大量练习让笔触、结构和判断一起成长。",
    tags: ["100+ 张绘画", "角色插画", "色彩与光影", "个人表达"],
    visual:
      '<div class="project-visual media-cover painting-cover"><img src="./assets/year19/painting/red-moon.jpg" alt="红色背景的春节主题插画"></div>',
    gallery: [
      "./assets/year19/painting/red-moon.jpg",
      "./assets/year19/painting/flame.jpg",
      "./assets/year19/painting/blue-blade.jpg",
      "./assets/year19/painting/orange-embrace.jpg",
      "./assets/year19/painting/recline.jpg",
      "./assets/year19/painting/green-light.jpg",
      "./assets/year19/painting/teal-figure.jpg",
      "./assets/year19/painting/dark-blue.jpg",
      "./assets/year19/painting/seaside.jpg",
      "./assets/year19/painting/white-hair.jpg",
      "./assets/year19/painting/green-portrait.jpg",
      "./assets/year19/painting/ink-figure.jpg"
    ]
  },
  calligraphy: {
    title: "书法",
    kicker: "5 SCROLLS · INK · PATIENCE",
    summary:
      "抄完了《洛神赋》《道德经》《心经》《恨赋》《草堂十志》。书法对我来说不只是写字，也是关于节奏、呼吸和耐心的练习。",
    challenge:
      "长帖最难的是一以贯之：字形、行气、墨色和心态都要在很长时间里保持稳定。",
    approach:
      "从经典法帖中理解结构与用笔，再通过一遍遍临写，把速度、力度和呼吸慢慢变成自己的手感。",
    tags: ["洛神赋", "道德经", "心经", "恨赋", "草堂十志"],
    visual:
      '<div class="project-visual media-cover calligraphy-cover"><img src="./assets/year19/calligraphy/handscroll-03.jpg" alt="小楷书法长卷局部"></div>',
    gallery: [
      "./assets/year19/calligraphy/handscroll-03.jpg",
      "./assets/year19/calligraphy/handscroll-01.jpg",
      "./assets/year19/calligraphy/handscroll-02.jpg",
      "./assets/year19/calligraphy/handscroll-04.jpg",
      "./assets/year19/calligraphy/long-scroll.jpg",
      "./assets/year19/calligraphy/practice.jpg"
    ]
  },
  design: {
    title: "设计",
    kicker: "YEARBOOK · EDITORIAL · LAYOUT",
    summary:
      "把19岁的旅行、朋友、爱好和作品整理成可观看的年度视觉档案。设计在这里更像一种整理记忆的方法。",
    challenge:
      "照片数量很多、信息密度也高，需要让不同主题各自成立，同时保持统一的节奏和气质。",
    approach:
      "用拼贴、留白和层级组织照片，让旅行、朋友和作品在同一个视觉系统里自然呼吸。",
    tags: ["年度排版", "照片编辑", "字体与版式", "视觉系统"],
    visual:
      '<div class="project-visual media-cover design-cover"><img src="./assets/year19/design/travel-layout.jpg" alt="旅行照片拼贴设计"></div>',
    gallery: [
      "./assets/year19/design/travel-layout.jpg",
      "./assets/year19/design/painting-layout.jpg",
      "./assets/year19/design/hobby-layout.jpg",
      "./assets/year19/design/friends-layout.jpg",
      "./assets/year19/design/all-layout.jpg"
    ]
  },
  animation: {
    title: "建模动画",
    kicker: "3D MODELING · MATERIAL · MOTION",
    summary:
      "19岁完成了《小狐狸》《枯木生花》《海》《雨》《晨光熹微》《临海小镇》等建模动画作品。从形体、材质到动态节奏，在数字空间里搭建有光线也有情绪的世界。",
    challenge:
      "让三维画面不止于技术展示，而是真正服务于氛围和叙事；用形体、材质、光线和运动节奏传递感受。",
    approach:
      "从场景气氛出发建立形体与镜头，再逐步完善材质、灯光和动态节奏，让每一帧都经得起停留。",
    tags: ["3D 建模", "材质与灯光", "动画", "视觉叙事"],
    visual:
      '<div class="project-visual media-cover animation-cover"><img src="./assets/year19/modeling/fox-forest.jpg" alt="夜晚森林中的两只小狐狸三维动画画面"></div>',
    gallery: [
      "./assets/year19/modeling/fox-forest.jpg",
      "./assets/year19/modeling/rose.jpg",
      "./assets/year19/modeling/water.jpg",
      "./assets/year19/modeling/forest-light.jpg",
      "./assets/year19/modeling/mountain.jpg",
      "./assets/year19/modeling/blender-city.jpg",
      "./assets/year19/modeling/leaves.jpg",
      "./assets/year19/modeling/retro-tv.jpg"
    ]
  },
  storyboard: {
    title: "分镜制作",
    kicker: "STORYBOARD · AI FILM · NARRATIVE",
    summary:
      "一直在玩各种AI，也做了好多AI短剧。分镜和影像练习让我把文字、想象与情绪，转化成可以被看见的画面序列。",
    challenge:
      "在有限画面中交代空间、动作和情绪，让镜头之间的连接自然流畅，并为后续制作提供清晰依据。",
    approach:
      "先确定叙事节奏和情绪曲线，再选择景别、视角和运动方式，用AI影像快速验证氛围，再细化关键画面。",
    tags: ["AI 短剧", "分镜设计", "镜头语言", "叙事节奏"],
    visual:
      '<div class="project-visual media-cover storyboard-cover"><img src="./assets/year19/ai/corridor.jpg" alt="水面、门与光束组成的AI影像场景"></div>',
    gallery: [
      "./assets/year19/ai/corridor.jpg",
      "./assets/year19/ai/red-fire.jpg"
    ]
  }
};

const defaultBookmarks = [
  {
    id: "figma",
    name: "Figma",
    url: "https://www.figma.com",
    category: "tools",
    description: "界面设计、原型与协作"
  },
  {
    id: "behance",
    name: "Behance",
    url: "https://www.behance.net",
    category: "inspiration",
    description: "全球设计作品与创作者"
  },
  {
    id: "artstation",
    name: "ArtStation",
    url: "https://www.artstation.com",
    category: "art",
    description: "概念艺术、3D 与视觉开发"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    url: "https://www.pinterest.com",
    category: "inspiration",
    description: "视觉灵感与情绪板"
  },
  {
    id: "bilibili",
    name: "哔哩哔哩",
    url: "https://www.bilibili.com",
    category: "learning",
    description: "教程、创作分享与灵感"
  },
  {
    id: "xiaohongshu",
    name: "小红书",
    url: "https://www.xiaohongshu.com",
    category: "inspiration",
    description: "生活观察与视觉灵感"
  },
  {
    id: "zcool",
    name: "站酷",
    url: "https://www.zcool.com.cn",
    category: "design",
    description: "国内设计社区与作品"
  },
  {
    id: "blender",
    name: "Blender",
    url: "https://www.blender.org",
    category: "animation",
    description: "三维建模、材质与动画"
  },
  {
    id: "notion",
    name: "Notion",
    url: "https://www.notion.so",
    category: "tools",
    description: "记录、整理与项目管理"
  },
  {
    id: "googlearts",
    name: "Google Arts",
    url: "https://artsandculture.google.com",
    category: "art",
    description: "艺术史、展览与馆藏"
  },
  {
    id: "mooc",
    name: "中国大学MOOC",
    url: "https://www.icourse163.org",
    category: "learning",
    description: "中文在线课程与公开课"
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com",
    category: "learning",
    description: "创作教程与幕后记录"
  },
  {
    id: "qqmail",
    name: "QQ邮箱",
    url: "https://mail.qq.com",
    category: "daily",
    description: "邮件与联络入口"
  }
];

const archiveCategoryLabels = {
  travel: "旅行",
  painting: "绘画",
  calligraphy: "书法",
  design: "设计",
  modeling: "建模动画",
  theater: "舞台活动",
  friends: "朋友",
  gaming: "游戏与收藏",
  life: "生活碎片",
  ai: "AI影像"
};

const modelingGroupLabels = {
  all: "全部",
  scene: "场景渲染",
  model: "模型与角色",
  material: "材质细节",
  expression: "表情绑定",
  motion: "动画片段"
};

const archiveChapterMeta = {
  travel: {
    number: "01",
    title: "旅行",
    english: "TRAVEL / THE WORLD IS OPEN",
    description:
      "从摩尔曼斯克到仙本那，从雪原到海底。19岁的旅行把地图变成了真实的风、光、温度，也变成了很多个值得记住的瞬间。",
    tone: "dark",
    cover: "./assets/year19/travel/aurora.jpg"
  },
  painting: {
    number: "02",
    title: "绘画",
    english: "PAINTING / 100+ WORKS",
    description:
      "一年画了100多张画。角色、色彩、光影和情绪在纸面与屏幕之间不断生长，也记录着每一次审美的变化。",
    tone: "paper",
    cover: "./assets/year19/painting/red-moon.jpg"
  },
  calligraphy: {
    number: "03",
    title: "书法",
    english: "CALLIGRAPHY / INK & TIME",
    description:
      "抄完了《洛神赋》《道德经》《心经》《恨赋》《草堂十志》。长卷里留下的不只是字，还有一段时间里的呼吸和耐心。",
    tone: "rice",
    cover: "./assets/year19/calligraphy/handscroll-03.jpg"
  },
  design: {
    number: "04",
    title: "设计",
    english: "DESIGN / MEMORY IN LAYOUT",
    description:
      "把旅行、绘画、朋友和爱好整理成年度视觉档案。照片不只是被摆放，而是在版式里重新获得节奏和关系。",
    tone: "acid",
    cover: "./assets/year19/design/travel-layout.jpg"
  },
  modeling: {
    number: "05",
    title: "建模动画",
    english: "3D / SELECTED PRACTICE",
    description:
      "从城市街景、竹林到小狐狸与水墨猴子：建模练习、材质、打光和动画片段，都被重新整理在这里。",
    tone: "dark",
    cover: "./assets/modeling/fox-scene.jpg"
  },
  theater: {
    number: "06",
    title: "舞台活动",
    english: "STAGE / PEOPLE & MOMENTS",
    description:
      "做制作人、做主演、做幕后，也参加20余场活动。舞台、灯光、会议和人群，组成了19岁另一部分很亮的记忆。",
    tone: "rose",
    cover: "./assets/year19/theater/peng-kaiping.jpg"
  },
  friends: {
    number: "07",
    title: "交友",
    english: "FRIENDS / PEOPLE WHO STAY",
    description:
      "19岁遇到了许多留下浓墨重彩的人，过去重要的人也依旧在身边。一起吃饭、庆祝、旅行，也一起长大。",
    tone: "peach",
    cover: "./assets/year19/friends/friends-01.jpg"
  },
  gaming: {
    number: "08",
    title: "游戏与收藏",
    english: "GAMES / PLAY & COLLECT",
    description:
      "游戏也是生活的一部分：喜欢的角色、通关的瞬间、屏幕前的投入，以及慢慢收集起来的周边和记忆。",
    tone: "night",
    cover: "./assets/year19/design/hobby-layout.jpg"
  },
  life: {
    number: "09",
    title: "生活碎片",
    english: "LIFE / SMALL OBSERVATIONS",
    description:
      "阅读、记录和一些没有被归进作品集的片刻。它们不喧闹，却让这一年的轮廓变得完整。",
    tone: "paper",
    cover: "./assets/year19/design/all-layout.jpg"
  },
  ai: {
    number: "10",
    title: "AI影像",
    english: "AI FILM / NEW WAYS TO TELL",
    description:
      "一直在玩各种AI，也做了好多AI短剧。新的工具像新的镜头，让想象可以更快地变成画面。",
    tone: "night",
    cover: "./assets/year19/ai/corridor.jpg"
  }
};

const archiveCoverArt = {
  travel: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cover-travel-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#031a21"/>
          <stop offset="1" stop-color="#092c34"/>
        </linearGradient>
        <linearGradient id="cover-travel-aurora" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stop-color="#e2fffc"/>
          <stop offset="0.5" stop-color="#55e0d8"/>
          <stop offset="1" stop-color="#08798a"/>
        </linearGradient>
        <filter id="cover-travel-blur"><feGaussianBlur stdDeviation="24"/></filter>
      </defs>
      <rect width="800" height="600" fill="url(#cover-travel-bg)"/>
      <g fill="none" stroke="#55e0d8" stroke-width="1" opacity="0.18">
        <path d="M-100 500C80 390 180 470 290 410S530 250 900 340"/>
        <path d="M-80 545C110 425 210 520 340 450S590 270 900 380"/>
        <path d="M-100 445C110 335 230 410 360 360S640 220 900 305"/>
      </g>
      <path d="M440-80C505 70 350 190 425 352S365 540 450 700" fill="none" stroke="#55e0d8" stroke-width="110" opacity="0.2" filter="url(#cover-travel-blur)"/>
      <path d="M440-80C505 70 350 190 425 352S365 540 450 700" fill="none" stroke="url(#cover-travel-aurora)" stroke-width="15" stroke-linecap="round" opacity="0.9"/>
      <g fill="#dffffc">
        <circle cx="612" cy="98" r="3"/>
        <circle cx="680" cy="150" r="1.8" opacity="0.7"/>
        <circle cx="550" cy="145" r="1.5" opacity="0.55"/>
        <circle cx="720" cy="235" r="2.4" opacity="0.65"/>
      </g>
    </svg>`,
  painting: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cover-paint-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f4eadc"/>
          <stop offset="1" stop-color="#e8ddce"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#cover-paint-bg)"/>
      <path d="M-80 470C120 350 250 510 410 405S660 315 860 255" fill="none" stroke="#ed6f48" stroke-width="148" stroke-linecap="round" opacity="0.9"/>
      <path d="M80-40C190 100 150 250 280 330" fill="none" stroke="#11110f" stroke-width="46" stroke-linecap="round" opacity="0.12"/>
      <g class="cover-float">
        <circle cx="610" cy="215" r="132" fill="#55e0d8"/>
        <circle cx="610" cy="215" r="50" fill="#11110f"/>
      </g>
      <g fill="#11110f" opacity="0.75">
        <circle cx="160" cy="155" r="5"/>
        <circle cx="192" cy="132" r="2.6"/>
        <circle cx="218" cy="168" r="3.5"/>
      </g>
    </svg>`,
  calligraphy: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="600" fill="#ece5d7"/>
      <g stroke="#c04a38" stroke-width="1" opacity="0.3">
        <path d="M150 0V600M310 0V600M470 0V600M630 0V600"/>
      </g>
      <path d="M95 495C200 390 310 500 410 420S540 360 720 295" fill="none" stroke="#11110f" stroke-width="58" stroke-linecap="round" opacity="0.84"/>
      <text x="78" y="470" fill="#11110f" font-family="KaiTi, STKaiti, serif" font-size="330" font-weight="600" transform="rotate(-7 300 300)">墨</text>
      <rect x="642" y="420" width="62" height="82" rx="3" fill="#c44f3d"/>
      <text x="657" y="454" fill="#f6e6dc" font-family="KaiTi, STKaiti, serif" font-size="22">印</text>
      <text x="658" y="482" fill="#f6e6dc" font-family="monospace" font-size="7" letter-spacing="1">SXM</text>
    </svg>`,
  design: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="cover-design-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="#11110f" stroke-width="1" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="#dff3ee"/>
      <rect width="800" height="600" fill="url(#cover-design-grid)"/>
      <circle cx="595" cy="235" r="145" fill="#f0734c"/>
      <circle cx="595" cy="235" r="55" fill="#11110f"/>
      <g fill="#11110f">
        <text x="48" y="220" font-family="Arial, sans-serif" font-size="94" font-weight="800" letter-spacing="-6">FORM</text>
        <text x="64" y="310" font-family="Georgia, serif" font-size="88" font-style="italic" fill="#08737a">FOLLOWS</text>
        <text x="48" y="400" font-family="Arial, sans-serif" font-size="94" font-weight="800" letter-spacing="-6">FEELING</text>
      </g>
      <path d="M52 105H182" stroke="#11110f" stroke-width="2"/>
    </svg>`,
  modeling: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cover-model-glow">
          <stop offset="0" stop-color="#55e0d8" stop-opacity="0.32"/>
          <stop offset="1" stop-color="#55e0d8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="#06181d"/>
      <circle cx="410" cy="285" r="280" fill="url(#cover-model-glow)"/>
      <g class="cover-orbit" fill="none" stroke="#55e0d8" opacity="0.8">
        <ellipse cx="410" cy="285" rx="245" ry="88" transform="rotate(-18 410 285)"/>
        <ellipse cx="410" cy="285" rx="205" ry="70" transform="rotate(54 410 285)" opacity="0.6"/>
        <ellipse cx="410" cy="285" rx="168" ry="168" opacity="0.32"/>
      </g>
      <g fill="none" stroke="#8ef8ef" stroke-width="1.4" opacity="0.9" transform="translate(610 135)">
        <path d="M0 58L92 18 174 58 82 108Z"/>
        <path d="M0 58V165L82 214V108"/>
        <path d="M174 58V165L82 214"/>
        <path d="M0 58L82 108 174 58" opacity="0.5"/>
      </g>
      <g fill="#55e0d8">
        <circle cx="258" cy="180" r="4"/>
        <circle cx="620" cy="390" r="3"/>
        <circle cx="520" cy="125" r="2.2"/>
      </g>
    </svg>`,
  theater: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cover-stage-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e8fffb" stop-opacity="0.36"/>
          <stop offset="1" stop-color="#55e0d8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="cover-stage-curtain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#5b1731"/>
          <stop offset="0.5" stop-color="#2a0d18"/>
          <stop offset="1" stop-color="#661b35"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="#190c12"/>
      <path d="M300 0H500L670 490H130Z" fill="url(#cover-stage-light)"/>
      <path d="M0 0H190C160 140 210 330 70 600H0Z" fill="url(#cover-stage-curtain)" opacity="0.85"/>
      <path d="M800 0H610C640 140 590 330 730 600H800Z" fill="url(#cover-stage-curtain)" opacity="0.85"/>
      <ellipse cx="400" cy="492" rx="255" ry="34" fill="none" stroke="#f0d7c9" stroke-width="1" opacity="0.32"/>
      <circle class="cover-pulse" cx="400" cy="285" r="9" fill="#55e0d8"/>
      <g fill="#f0d7c9" opacity="0.55">
        <circle cx="282" cy="150" r="2"/>
        <circle cx="525" cy="192" r="1.5"/>
        <circle cx="460" cy="115" r="2.3"/>
      </g>
    </svg>`,
  friends: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="600" fill="#f1e2d6"/>
      <g fill="none" stroke-width="2">
        <circle cx="330" cy="290" r="148" stroke="#11110f" opacity="0.78"/>
        <circle cx="470" cy="290" r="148" stroke="#0c8f90" opacity="0.82"/>
      </g>
      <path d="M110 455C240 390 330 500 455 430S620 335 735 385" fill="none" stroke="#11110f" stroke-width="1.5" opacity="0.2"/>
      <circle cx="400" cy="220" r="7" fill="#11110f"/>
      <circle cx="400" cy="220" r="27" fill="none" stroke="#11110f" opacity="0.18"/>
      <text x="520" y="460" fill="#947a69" font-family="Georgia, serif" font-size="24" font-style="italic">together</text>
    </svg>`,
  ai: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cover-ai-glow">
          <stop offset="0" stop-color="#55e0d8" stop-opacity="0.36"/>
          <stop offset="1" stop-color="#55e0d8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="#07101c"/>
      <g stroke="#55e0d8" stroke-width="1" opacity="0.12">
        <path d="M0 410L400 505 800 410"/>
        <path d="M0 450L400 545 800 450"/>
        <path d="M0 490L400 585 800 490"/>
        <path d="M400 505L110 600M400 505L690 600M400 505L400 600"/>
        <path d="M400 505L-40 380M400 505L840 380"/>
      </g>
      <circle cx="400" cy="260" r="250" fill="url(#cover-ai-glow)"/>
      <g class="cover-float" fill="none" stroke="#8ef8ef">
        <rect x="306" y="105" width="188" height="300" rx="94" opacity="0.72"/>
        <rect x="345" y="148" width="110" height="214" rx="55" opacity="0.32"/>
        <path d="M400 105V405" opacity="0.22"/>
      </g>
      <g fill="#55e0d8" opacity="0.82">
        <circle cx="276" cy="230" r="3"/>
        <circle cx="528" cy="190" r="2"/>
        <circle cx="544" cy="335" r="3.4"/>
      </g>
    </svg>`,
  gaming: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="600" fill="#07151e"/>
      <path d="M100 120H700V480H100Z" fill="none" stroke="#55e0d8" stroke-width="2" opacity="0.3"/>
      <path d="M142 166H658V434H142Z" fill="#101f2a" stroke="#8ef8ef" stroke-width="8" opacity="0.95"/>
      <circle cx="400" cy="300" r="88" fill="none" stroke="#55e0d8" stroke-width="3" opacity="0.85"/>
      <path d="M360 260V340M320 300H400M440 278H470M455 263V293M455 307V337" stroke="#8ef8ef" stroke-width="8" stroke-linecap="round"/>
      <g fill="#55e0d8"><circle cx="210" cy="210" r="4"/><circle cx="605" cy="390" r="3"/><circle cx="620" cy="190" r="2"/></g>
      <text x="176" y="540" fill="#8ef8ef" font-family="monospace" font-size="20" letter-spacing="6">PLAY / COLLECT</text>
    </svg>`,
  life: `
    <svg class="cover-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="600" fill="#ede6d8"/>
      <path d="M130 0C180 170 110 300 175 600M670 0C620 170 690 300 625 600" fill="none" stroke="#11110f" stroke-width="2" opacity="0.16"/>
      <rect x="178" y="110" width="444" height="340" fill="#f7f3ea" stroke="#11110f" stroke-width="2" transform="rotate(-6 400 280)"/>
      <path d="M240 210H530M240 250H560M240 290H510M240 330H545" stroke="#08737a" stroke-width="3" opacity="0.56"/>
      <circle cx="540" cy="390" r="48" fill="#55e0d8" opacity="0.9"/>
      <path d="M520 390L536 406L565 370" fill="none" stroke="#11110f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="230" y="395" fill="#11110f" font-family="Georgia, serif" font-size="34" font-style="italic">small things</text>
    </svg>`
};

const archiveData = [
  {
    src: "./assets/year19/travel/aurora.jpg",
    category: "travel",
    title: "极光下的19岁",
    description: "摩尔曼斯克，雪原与绿色极光。第一次独自追光。"
  },
  {
    src: "./assets/year19/travel/siberia.jpg",
    category: "travel",
    title: "雪地摩托",
    description: "西伯利亚的冷风，和一次很痛快的出发。"
  },
  {
    src: "./assets/year19/travel/arctic.jpg",
    category: "travel",
    title: "北冰洋边喝北冰洋",
    description: "19岁清单里很可爱的一项。"
  },
  {
    src: "./assets/year19/travel/semporna.jpg",
    category: "travel",
    title: "潜入蓝色",
    description: "仙本那，水下是另一个世界。"
  },
  {
    src: "./assets/year19/travel/sanya-surf.jpg",
    category: "travel",
    title: "第一次冲浪",
    description: "一次次站起来，也一次次掉进海里。"
  },
  {
    src: "./assets/year19/travel/rainforest.jpg",
    category: "travel",
    title: "雨林越野",
    description: "印尼的泥路、引擎声和满身的风。"
  },
  {
    src: "./assets/year19/travel/beach.jpg",
    category: "travel",
    title: "岛屿的慢时间",
    description: "在三亚，把时间交给海风。"
  },
  {
    src: "./assets/year19/travel/tent.jpg",
    category: "travel",
    title: "极光营地",
    description: "雪地帐篷旁，等待天光亮起来。"
  },
  {
    src: "./assets/year19/travel/jeep.jpg",
    category: "travel",
    title: "向远处开",
    description: "站在越野车顶，看山海和日落。"
  },
  {
    src: "./assets/year19/travel/parasail.jpg",
    category: "travel",
    title: "被风带起来",
    description: "Kutuh 的海上，短暂飞了一会儿。"
  },
  {
    src: "./assets/year19/travel/suzhou.jpg",
    category: "travel",
    title: "苏州散步",
    description: "园林、树影和慢下来的脚步。"
  },
  {
    src: "./assets/year19/travel/hangzhou.jpg",
    category: "travel",
    title: "又见杭州",
    description: "第三次来到这座城市。"
  },
  {
    src: "./assets/year19/painting/red-moon.jpg",
    category: "painting",
    title: "马到福来",
    description: "红色、火焰与新年角色插画。"
  },
  {
    src: "./assets/year19/painting/flame.jpg",
    category: "painting",
    title: "粉蓝火焰",
    description: "角色与色彩实验。"
  },
  {
    src: "./assets/year19/painting/blue-blade.jpg",
    category: "painting",
    title: "蓝色刃光",
    description: "高饱和光影里的角色练习。"
  },
  {
    src: "./assets/year19/painting/orange-embrace.jpg",
    category: "painting",
    title: "相拥",
    description: "暖色、亲密与叙事感。"
  },
  {
    src: "./assets/year19/painting/recline.jpg",
    category: "painting",
    title: "静止一刻",
    description: "人物姿态与留白。"
  },
  {
    src: "./assets/year19/painting/green-light.jpg",
    category: "painting",
    title: "林间微光",
    description: "把光放进绿色里。"
  },
  {
    src: "./assets/year19/painting/teal-figure.jpg",
    category: "painting",
    title: "青绿人物",
    description: "线条、衣褶和风的方向。"
  },
  {
    src: "./assets/year19/painting/dark-blue.jpg",
    category: "painting",
    title: "夜行",
    description: "深色画面里的动势。"
  },
  {
    src: "./assets/year19/painting/seaside.jpg",
    category: "painting",
    title: "海边蓝发",
    description: "角色与夏日色彩。"
  },
  {
    src: "./assets/year19/painting/white-hair.jpg",
    category: "painting",
    title: "风里的白发",
    description: "动态与氛围练习。"
  },
  {
    src: "./assets/year19/painting/green-portrait.jpg",
    category: "painting",
    title: "春日光影",
    description: "柔和色调与人物情绪。"
  },
  {
    src: "./assets/year19/painting/ink-figure.jpg",
    category: "painting",
    title: "黑白瞬间",
    description: "用最少的颜色留下动作。"
  },
  {
    src: "./assets/year19/calligraphy/handscroll-03.jpg",
    category: "calligraphy",
    title: "道德经 · 局部",
    description: "一笔一画，把很长的时间写到纸上。"
  },
  {
    src: "./assets/year19/calligraphy/handscroll-01.jpg",
    category: "calligraphy",
    title: "长帖练习 · 01",
    description: "小楷与章法练习。"
  },
  {
    src: "./assets/year19/calligraphy/handscroll-02.jpg",
    category: "calligraphy",
    title: "长帖练习 · 02",
    description: "在重复里寻找稳定和呼吸。"
  },
  {
    src: "./assets/year19/calligraphy/handscroll-04.jpg",
    category: "calligraphy",
    title: "长帖练习 · 03",
    description: "行气、字距与速度的记录。"
  },
  {
    src: "./assets/year19/calligraphy/long-scroll.jpg",
    category: "calligraphy",
    title: "手卷与留白",
    description: "把作品铺开，也把时间铺开。"
  },
  {
    src: "./assets/year19/calligraphy/practice.jpg",
    category: "calligraphy",
    title: "单页练习",
    description: "每天写一点，慢慢累积成厚度。"
  },
  {
    src: "./assets/year19/design/travel-layout.jpg",
    category: "design",
    title: "旅行年度拼贴",
    description: "把19岁的足迹整理成一页。"
  },
  {
    src: "./assets/year19/design/painting-layout.jpg",
    category: "design",
    title: "绘画精选排版",
    description: "把一年里的角色和画面排在一起。"
  },
  {
    src: "./assets/year19/design/hobby-layout.jpg",
    category: "design",
    title: "爱好档案",
    description: "收藏、创作和喜欢的事物。"
  },
  {
    src: "./assets/year19/design/friends-layout.jpg",
    category: "design",
    title: "朋友与活动",
    description: "人与人之间的片段被重新编辑。"
  },
  {
    src: "./assets/year19/design/all-layout.jpg",
    category: "design",
    title: "19岁总览",
    description: "一张更大的年度视觉地图。"
  },
  {
    src: "./assets/modeling/city-street.jpg",
    category: "modeling",
    group: "scene",
    title: "城市街景",
    description: "建筑、车辆、灯光与材质的综合场景练习。"
  },
  {
    src: "./assets/modeling/bamboo-path.jpg",
    category: "modeling",
    group: "scene",
    title: "竹林",
    description: "叶片、雾气与自然光线的空间练习。"
  },
  {
    src: "./assets/modeling/fox-scene.jpg",
    category: "modeling",
    group: "scene",
    title: "小狐狸场景",
    description: "夜晚森林里，小狐狸与蘑菇的灯光氛围。"
  },
  {
    src: "./assets/modeling/fox-scene-alt.jpg",
    category: "modeling",
    group: "scene",
    title: "小狐狸 · 另一幕",
    description: "同一个场景里的另一种构图与光线。"
  },
  {
    src: "./assets/modeling/ink-monkey.jpg",
    category: "modeling",
    group: "scene",
    title: "水墨猴子",
    description: "水墨、投影和三维形体结合的场景实验。"
  },
  {
    src: "./assets/modeling/ink-monkey-close.jpg",
    category: "modeling",
    group: "scene",
    title: "水墨特写",
    description: "动画帧里的材质与笔触细节。"
  },
  {
    src: "./assets/modeling/full/scene-bamboo-night.jpg",
    category: "modeling",
    group: "scene",
    title: "竹林夜色",
    description: "深夜雾气、路径与植被构成的空间气氛练习。"
  },
  {
    src: "./assets/modeling/character-sketch.jpg",
    category: "modeling",
    group: "model",
    title: "角色草图",
    description: "建模前的人物比例与造型草图。"
  },
  {
    src: "./assets/modeling/full/model-character.jpg",
    category: "modeling",
    group: "model",
    title: "角色渲染",
    description: "蓝色头巾、珍珠耳环与柔和材质的角色模型。"
  },
  {
    src: "./assets/modeling/full/model-character-reference.jpg",
    category: "modeling",
    group: "model",
    title: "角色正侧参考",
    description: "用于建模的脸部结构与比例参考。"
  },
  {
    src: "./assets/modeling/fox-wireframe.jpg",
    category: "modeling",
    group: "model",
    title: "小狐狸拓扑",
    description: "小狐狸模型的正侧网格与布线检查。"
  },
  {
    src: "./assets/modeling/full/material-leaf.jpg",
    category: "modeling",
    group: "material",
    title: "叶片材质",
    description: "叶脉、颜色与表面光泽的材质观察。"
  },
  {
    src: "./assets/modeling/full/material-shadow.jpg",
    category: "modeling",
    group: "material",
    title: "树影与遮挡",
    description: "树枝、叶片和投影之间的层次练习。"
  },
  {
    src: "./assets/modeling/full/material-petal-01.jpg",
    category: "modeling",
    group: "material",
    title: "花瓣材质 01",
    description: "粉色花瓣的透明度与纹理练习。"
  },
  {
    src: "./assets/modeling/full/material-petal-02.jpg",
    category: "modeling",
    group: "material",
    title: "花瓣材质 02",
    description: "花形变化与柔光质感。"
  },
  {
    src: "./assets/modeling/full/material-petal-03.jpg",
    category: "modeling",
    group: "material",
    title: "花瓣材质 03",
    description: "花瓣边缘的细腻纹理与透明感。"
  },
  {
    src: "./assets/modeling/leaf-study.jpg",
    category: "modeling",
    group: "material",
    title: "叶片结构",
    description: "叶面起伏和光影变化的近景练习。"
  },
  ...Array.from({ length: 11 }, (_, index) => ({
    src: `./assets/modeling/full/expression-${String(index + 1).padStart(2, "0")}.jpg`,
    category: "modeling",
    group: "expression",
    title: `表情绑定 ${String(index + 1).padStart(2, "0")}`,
    description: "番茄角色的面部表情与绑定练习。"
  })),
  {
    src: "./assets/modeling/full/expression-overview.jpg",
    category: "modeling",
    group: "expression",
    title: "表情总览",
    description: "一组表情控制系统与角色情绪的对照。"
  },
  {
    src: "./assets/modeling/fox-scene.jpg",
    video: "./assets/modeling/little-fox.mp4",
    category: "modeling",
    group: "motion",
    title: "小狐狸动画",
    description: "小狐狸在森林里的动画练习，点击播放。"
  },
  {
    src: "./assets/year19/modeling/retro-tv.jpg",
    video: "./assets/modeling/little-tv.mp4",
    category: "modeling",
    group: "motion",
    title: "小电视动画",
    description: "小电视建模与动画练习，点击播放。"
  },
  {
    src: "./assets/modeling/ink-monkey.jpg",
    video: "./assets/modeling/ink-monkey.mp4",
    category: "modeling",
    group: "motion",
    title: "水墨猴子动画",
    description: "水墨风格的动画片段，点击播放。"
  },
  {
    src: "./assets/modeling/city-street.jpg",
    video: "./assets/modeling/city-animation.mp4",
    category: "modeling",
    group: "motion",
    title: "城市街景动画",
    description: "建筑与车流的场景动画练习，点击播放。"
  },
  {
    src: "./assets/modeling/fox-scene-alt.jpg",
    video: "./assets/modeling/fox-rig.mp4",
    category: "modeling",
    group: "motion",
    title: "小狐狸 · 骨骼动画",
    description: "从骨骼绑定到动作的基础练习，点击播放。"
  },
  {
    src: "./assets/year19/theater/peng-kaiping.jpg",
    category: "theater",
    title: "见到彭凯平先生",
    description: "第三届心理学应用大会。"
  },
  {
    src: "./assets/year19/theater/speech.jpg",
    category: "theater",
    title: "作为部门代表发言",
    description: "在校学生会总会上的发言。"
  },
  {
    src: "./assets/year19/theater/stage-group.jpg",
    category: "theater",
    title: "演出之后",
    description: "一群人共同完成的一场戏。"
  },
  {
    src: "./assets/year19/theater/stage-blue.jpg",
    category: "theater",
    title: "幕后与灯光",
    description: "舞台背后的蓝色时刻。"
  },
  {
    src: "./assets/year19/theater/performance.jpg",
    category: "theater",
    title: "校园演出",
    description: "红衣服、灯光和掌声。"
  },
  {
    src: "./assets/year19/theater/conference.jpg",
    category: "theater",
    title: "心理学应用大会",
    description: "在人群中记录下的一次相遇。"
  },
  {
    src: "./assets/year19/theater/poster.jpg",
    category: "theater",
    title: "个人活动海报",
    description: "单小蔓与心理小组。"
  },
  {
    src: "./assets/year19/theater/stage-cast.jpg",
    category: "theater",
    title: "话剧演出",
    description: "台前与幕后，都是故事的一部分。"
  },
  {
    src: "./assets/year19/friends/friends-01.jpg",
    category: "friends",
    title: "在彼此身边",
    description: "19岁遇到的重要的人。"
  },
  {
    src: "./assets/year19/friends/friends-02.jpg",
    category: "friends",
    title: "一起长大",
    description: "镜头里留下的日常。"
  },
  {
    src: "./assets/year19/friends/friends-03.jpg",
    category: "friends",
    title: "吃饭这件小事",
    description: "热闹的桌子，和身边的人。"
  },
  {
    src: "./assets/year19/friends/friends-04.jpg",
    category: "friends",
    title: "约定",
    description: "一些不用说完也懂的默契。"
  },
  {
    src: "./assets/year19/ai/corridor.jpg",
    category: "ai",
    title: "虚无回廊",
    description: "AI短剧影像场景。"
  },
  {
    src: "./assets/year19/ai/red-fire.jpg",
    category: "ai",
    title: "红裙与火",
    description: "AI影像实验。"
  }
];

// The annual folder is imported as a deduplicated, auditable gallery payload.
// Curated entries above keep their editorial captions; imported records fill in every other distinct image.
if (Array.isArray(window.year19Gallery)) {
  const curatedSources = new Set(archiveData.map((item) => item.src));
  archiveData.push(
    ...window.year19Gallery.filter(
      (item) => !item.aliases?.some((source) => curatedSources.has(source))
    )
  );
}

// Keep the modeling chapter focused on scenes and moving-image work.
// The old practice-only groups are intentionally removed from the public presentation.
const hiddenModelingGroups = new Set(["model", "material", "expression"]);
archiveData.splice(
  0,
  archiveData.length,
  ...archiveData.filter(
    (item) => !(item.category === "modeling" && hiddenModelingGroups.has(item.group))
  )
);

if (Array.isArray(window.modelingVideoGallery)) {
  const existingVideos = new Set(
    archiveData.filter((item) => item.video).map((item) => item.video)
  );
  archiveData.push(
    ...window.modelingVideoGallery.filter((item) => !existingVideos.has(item.video))
  );
}

if (Array.isArray(window.aiVideoGallery)) {
  const existingVideos = new Set(
    archiveData.filter((item) => item.video).map((item) => item.video)
  );
  archiveData.push(
    ...window.aiVideoGallery.filter((item) => !existingVideos.has(item.video))
  );
}

const archiveEditStorageKey = "sxm-archive-edits";
const archiveMediaStorageKey = "sxm-archive-media-fallback";
let archiveEditState = { overrides: {}, hidden: [], custom: [] };
let archiveMemoryMedia = [];
let archiveMediaDatabase;
let archiveEditingItem = null;
let archivePendingDelete = null;
let archiveManageMode = false;
let archiveActiveCategory = "";
let archiveThumbObserver = null;
let archiveMainLoadToken = 0;

function archiveItemKey(item) {
  return item.archiveId || `${item.category}:${item.video || item.src}`;
}

function loadArchiveEditState() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(archiveEditStorageKey) || "{}");
    archiveEditState = {
      overrides: stored.overrides || {},
      hidden: Array.isArray(stored.hidden) ? stored.hidden : [],
      custom: Array.isArray(stored.custom) ? stored.custom : []
    };
  } catch {
    archiveEditState = { overrides: {}, hidden: [], custom: [] };
  }
}

function saveArchiveEditState(nextState = archiveEditState) {
  try {
    window.localStorage.setItem(archiveEditStorageKey, JSON.stringify(nextState));
    archiveEditState = nextState;
  } catch {
    throw new Error("浏览器可用空间不足，作品文字和图集修改未能保存。");
  }
}

function openArchiveMediaDatabase() {
  if (archiveMediaDatabase) return archiveMediaDatabase;
  archiveMediaDatabase = new Promise((resolve, reject) => {
    const request = window.indexedDB.open("sxm-archive-library", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("media", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return archiveMediaDatabase;
}

async function archiveMedia(action, value) {
  if (window.indexedDB) {
    const db = await openArchiveMediaDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("media", action === "getAll" ? "readonly" : "readwrite");
      const store = transaction.objectStore("media");
      const request = action === "getAll" ? store.getAll() : store[action](value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  let records = archiveMemoryMedia;
  try {
    records = JSON.parse(window.localStorage.getItem(archiveMediaStorageKey) || "[]");
  } catch {
    archiveMemoryMedia = records;
  }
  if (action === "getAll") return records;
  if (action === "delete") {
    records = records.filter((record) => record.id !== value);
  } else if (action === "put") {
    if (value.file?.size > 2 * 1024 * 1024) {
      throw new Error("当前浏览器存储空间有限，请改用 2 MB 以内的图片。");
    }
    const dataUrl = value.dataUrl || (value.file && await readCapabilityFile(value.file));
    if (!dataUrl) throw new Error("无法读取图片，请重新选择后再试。");
    const saved = { id: value.id, kind: value.kind, dataUrl };
    const index = records.findIndex((record) => record.id === saved.id);
    if (index >= 0) records[index] = saved;
    else records.push(saved);
  }
  archiveMemoryMedia = records;
  try {
    window.localStorage.setItem(archiveMediaStorageKey, JSON.stringify(records));
  } catch {
    throw new Error("浏览器可用存储空间不足，图片未能保存。");
  }
}

function archiveMediaUrl(record) {
  if (record.file && window.URL?.createObjectURL) return URL.createObjectURL(record.file);
  return record.dataUrl || "";
}

async function loadArchiveEdits() {
  loadArchiveEditState();
  archiveData.forEach((item) => {
    item.archiveId = archiveItemKey(item);
    Object.assign(item, archiveEditState.overrides[item.archiveId] || {});
  });
  const mediaRecords = await archiveMedia("getAll");
  const mediaById = new Map(mediaRecords.map((record) => [record.id, record]));
  archiveData.forEach((item) => {
    if (item.video) return;
    const replacement = mediaById.get(`replacement:${item.archiveId}`);
    if (replacement) item.src = archiveMediaUrl(replacement);
  });
  archiveEditState.custom.forEach((saved) => {
    const record = mediaById.get(`custom:${saved.id}`);
    const archiveId = `custom:${saved.id}`;
    const replacement = mediaById.get(`replacement:${archiveId}`);
    const src = replacement ? archiveMediaUrl(replacement) : record && archiveMediaUrl(record);
    if (src) archiveData.push({ ...saved, src, archiveId, isCustom: true });
  });
}

let visibleArchiveItems = [...archiveData];
let activeArchiveIndex = 0;
let archiveBaseCollection = [...archiveData];
let activeModelingGroup = "all";

const bookmarkCategoryLabels = {
  inspiration: "灵感",
  art: "艺术",
  design: "设计",
  animation: "动画",
  learning: "学习",
  tools: "工具",
  daily: "常用"
};

let customBookmarks = loadCustomBookmarks();
let activeBookmarkFilter = "all";

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "切换到浅色主题" : "切换到深色主题"
  );
  document.querySelector('meta[name="theme-color"]').setAttribute(
    "content",
    isDark ? "#10100e" : "#f3f0e8"
  );
  try {
    localStorage.setItem("sxm-theme", theme);
  } catch (error) {}
}

applyTheme(root.dataset.theme || "light");

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  body.classList.remove("menu-open");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开菜单");
}

menuToggle.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  body.classList.toggle("menu-open", willOpen);
  mobileMenu.classList.toggle("is-open", willOpen);
  mobileMenu.setAttribute("aria-hidden", String(!willOpen));
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "关闭菜单" : "打开菜单");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  header.classList.toggle("is-scrolled", scrollTop > 16);
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13, rootMargin: "0px 0px -40px" }
);

revealItems.forEach((item, index) => {
  if (!reducedMotion) {
    item.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
  }
  revealObserver.observe(item);
});

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;
    const currentId = visible[0].target.id;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });
  },
  { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.2, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));

if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  const tiltVisual = document.querySelector("[data-tilt]");
  const visualStage = tiltVisual?.querySelector(".visual-stage");

  if (tiltVisual && visualStage) {
    tiltVisual.addEventListener("pointermove", (event) => {
      const rect = tiltVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visualStage.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    tiltVisual.addEventListener("pointerleave", () => {
      visualStage.style.transform = "";
    });
  }

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll(".project-card")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function renderProject(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;

  activeProject = projectKey;
  projectModal.querySelector("[data-modal-visual]").innerHTML = project.visual;
  projectModal.querySelector("[data-modal-kicker]").textContent = project.kicker;
  projectModal.querySelector("[data-modal-title]").textContent = project.title;
  projectModal.querySelector("[data-modal-summary]").textContent = project.summary;
  projectModal.querySelector("[data-modal-challenge]").textContent = project.challenge;
  projectModal.querySelector("[data-modal-approach]").textContent = project.approach;
  projectModal.querySelector("[data-modal-tags]").innerHTML = project.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  const gallery = projectModal.querySelector("[data-modal-gallery]");
  gallery.replaceChildren(
    ...project.gallery.map((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${project.title}作品 ${index + 1}`;
      image.loading = "lazy";
      return image;
    })
  );
}

function openProject(projectKey) {
  renderProject(projectKey);
  body.classList.add("modal-open");
  projectModal.showModal();
  modalClose.focus();
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.project));
});

modalClose.addEventListener("click", () => projectModal.close());

projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) projectModal.close();
});

projectModal.addEventListener("close", () => {
  body.classList.remove("modal-open");
});

document.querySelector("[data-modal-next]").addEventListener("click", () => {
  const keys = Object.keys(projectData);
  const nextIndex = (keys.indexOf(activeProject) + 1) % keys.length;
  renderProject(keys[nextIndex]);
  projectModal.querySelector(".modal-content").animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: reducedMotion ? 1 : 300, easing: "cubic-bezier(.22,1,.36,1)" }
  );
});

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailAddress);
    showToast("邮箱已复制");
  } catch (error) {
    const range = document.createRange();
    range.selectNodeContents(copyEmailButton.querySelector("span"));
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    showToast(`请复制：${emailAddress}`);
  }
});

copyWechatButton?.addEventListener("click", async () => {
  const wechat = "Kallenkallenkallen";
  try {
    await navigator.clipboard.writeText(wechat);
    showToast("微信号已复制");
  } catch (error) {
    showToast(`请复制：${wechat}`);
  }
});

function loadCustomBookmarks() {
  try {
    const saved = JSON.parse(localStorage.getItem("sxm-custom-bookmarks") || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (bookmark) =>
        bookmark &&
        typeof bookmark.name === "string" &&
        typeof bookmark.url === "string" &&
        typeof bookmark.category === "string"
    );
  } catch (error) {
    return [];
  }
}

function saveCustomBookmarks() {
  try {
    localStorage.setItem("sxm-custom-bookmarks", JSON.stringify(customBookmarks));
  } catch (error) {}
}

function allBookmarks() {
  return [...customBookmarks, ...defaultBookmarks];
}

function getBookmarkDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}

function getBookmarkIcon(name) {
  const latinParts = name.match(/[A-Za-z0-9]+/g);
  if (latinParts?.length) {
    return latinParts.join("").slice(0, 2).toUpperCase();
  }
  return name.replace(/\s+/g, "").slice(0, 1);
}

function createBookmarkCard(bookmark) {
  const card = document.createElement("article");
  card.className = "bookmark-card";
  card.dataset.category = bookmark.category;

  const link = document.createElement("a");
  link.className = "bookmark-link";
  link.href = bookmark.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `打开 ${bookmark.name}`);

  const top = document.createElement("div");
  top.className = "bookmark-top";

  const icon = document.createElement("span");
  icon.className = "bookmark-icon";
  icon.textContent = getBookmarkIcon(bookmark.name);

  const arrow = document.createElement("span");
  arrow.className = "bookmark-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  top.append(icon, arrow);

  const title = document.createElement("h3");
  title.textContent = bookmark.name;

  const description = document.createElement("p");
  description.textContent = bookmark.description || "自定义学习入口";

  const foot = document.createElement("div");
  foot.className = "bookmark-card-foot";

  const category = document.createElement("span");
  category.className = "bookmark-category";
  category.textContent = bookmarkCategoryLabels[bookmark.category] || "常用";

  const domain = document.createElement("span");
  domain.className = "bookmark-domain";
  domain.textContent = getBookmarkDomain(bookmark.url);
  foot.append(category, domain);

  link.append(top, title, description, foot);
  card.append(link);

  if (bookmark.custom) {
    const remove = document.createElement("button");
    remove.className = "bookmark-delete";
    remove.type = "button";
    remove.dataset.deleteBookmark = bookmark.id;
    remove.setAttribute("data-edit-only", "");
    remove.setAttribute("aria-label", `删除 ${bookmark.name}`);
    remove.textContent = "×";
    card.append(remove);
  }

  return card;
}

function renderBookmarks() {
  if (!bookmarkGrid || !bookmarkSearch) return;
  const query = bookmarkSearch.value.trim().toLowerCase();
  const filtered = allBookmarks().filter((bookmark) => {
    const matchesCategory =
      activeBookmarkFilter === "all" || bookmark.category === activeBookmarkFilter;
    const searchable = [
      bookmark.name,
      bookmark.description,
      bookmarkCategoryLabels[bookmark.category],
      getBookmarkDomain(bookmark.url)
    ]
      .join(" ")
      .toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  bookmarkGrid.replaceChildren(...filtered.map(createBookmarkCard));
  bookmarkGrid.hidden = filtered.length === 0;
  bookmarkEmpty.hidden = filtered.length !== 0;
  bookmarkCount.textContent = String(allBookmarks().length);
}

function setBookmarkFilter(filter) {
  activeBookmarkFilter = filter;
  bookmarkFilters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.bookmarkFilter === filter);
  });
  renderBookmarks();
}

function openBookmarkDialog() {
  if (!guardEditing()) return;
  body.classList.add("modal-open");
  bookmarkDialog.showModal();
  window.setTimeout(() => bookmarkForm.elements.name.focus(), 60);
}

bookmarkFilters.forEach((button) => {
  button.addEventListener("click", () => setBookmarkFilter(button.dataset.bookmarkFilter));
});

bookmarkSearch?.addEventListener("input", renderBookmarks);

document.querySelectorAll("[data-add-bookmark]").forEach((button) => {
  button.addEventListener("click", openBookmarkDialog);
});

document.querySelectorAll("[data-bookmark-close]").forEach((button) => {
  button.addEventListener("click", () => bookmarkDialog.close());
});

bookmarkDialog.addEventListener("click", (event) => {
  if (event.target === bookmarkDialog) bookmarkDialog.close();
});

bookmarkDialog.addEventListener("close", () => {
  body.classList.remove("modal-open");
});

bookmarkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!guardEditing()) return;
  const formData = new FormData(bookmarkForm);
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "inspiration");
  let url = String(formData.get("url") || "").trim();

  if (!name || !url) return;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error("Invalid protocol");
  } catch (error) {
    showToast("请输入有效的网站地址");
    return;
  }

  customBookmarks.unshift({
    id: `custom-${Date.now()}`,
    name,
    url: parsedUrl.href,
    category,
    description: description || "自定义学习入口",
    custom: true
  });
  saveCustomBookmarks();
  bookmarkForm.reset();
  bookmarkSearch.value = "";
  setBookmarkFilter("all");
  bookmarkDialog.close();
  showToast("学习入口已添加");
});

bookmarkGrid?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-bookmark]");
  if (!deleteButton) return;
  if (!guardEditing()) return;
  event.preventDefault();
  event.stopPropagation();

  customBookmarks = customBookmarks.filter(
    (bookmark) => bookmark.id !== deleteButton.dataset.deleteBookmark
  );
  saveCustomBookmarks();
  renderBookmarks();
  showToast("入口已删除");
});

function createArchiveItem(item) {
  const button = document.createElement("button");
  button.className = "chapter-media";
  button.type = "button";
  button.dataset.category = item.category;
  button.setAttribute("aria-label", `查看 ${item.title}`);

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = `${item.title} · ${item.description}`;
  image.loading = "lazy";
  image.decoding = "async";

  const overlay = document.createElement("span");
  overlay.className = "chapter-media-overlay";

  const title = document.createElement("strong");
  title.textContent = item.title;

  const category = document.createElement("span");
  category.textContent = item.video ? "播放动画 ▶" : "点击查看大图 ↗";
  if (item.video) button.dataset.video = "true";
  overlay.append(title, category);
  button.append(image, overlay);
  button.addEventListener("click", () => openArchiveDialog(item));
  return button;
}

function archiveAssetUrl(source, retryAttempt = 0) {
  if (!source || /^(data:|blob:)/i.test(source)) return source;
  try {
    const url = new URL(source, window.location.href);
    url.searchParams.set("v", "20261030-2");
    if (retryAttempt) url.searchParams.set("retry", String(retryAttempt));
    return url.href;
  } catch {
    return source;
  }
}

function loadArchiveThumbImage(image) {
  if (!image || image.dataset.requested === "true") return;
  const source = image.dataset.src;
  if (!source) return;

  image.dataset.requested = "true";
  image.fetchPriority = "low";
  image.addEventListener("load", () => {
    image.closest(".archive-thumb")?.classList.add("is-loaded");
  });
  image.addEventListener("error", () => {
    const attempt = Number(image.dataset.retryAttempt || 0);
    if (attempt >= 1 || /^(data:|blob:)/i.test(source)) {
      image.closest(".archive-thumb")?.classList.add("is-error");
      return;
    }
    image.dataset.retryAttempt = "1";
    window.setTimeout(() => loadArchiveThumbSource(image, source, 1), 360);
  });
  loadArchiveThumbSource(image, source);
}

function loadArchiveThumbSource(image, source, retryAttempt = 0) {
  image.closest(".archive-thumb")?.classList.remove("is-error");
  image.src = archiveAssetUrl(source, retryAttempt);
}

function getArchiveThumbObserver() {
  if (archiveThumbObserver || !("IntersectionObserver" in window)) {
    return archiveThumbObserver;
  }
  archiveThumbObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadArchiveThumbImage(entry.target);
        archiveThumbObserver?.unobserve(entry.target);
      });
    },
    {
      root: archiveThumbs,
      rootMargin: "220px 0px",
      threshold: 0.01
    }
  );
  return archiveThumbObserver;
}

function queueArchiveThumbWindow(centerIndex = activeArchiveIndex, radius = 4) {
  const start = Math.max(0, centerIndex - radius);
  const end = Math.min(archiveThumbs.children.length - 1, centerIndex + radius);
  for (let index = start; index <= end; index += 1) {
    loadArchiveThumbImage(archiveThumbs.children[index]?.querySelector("img"));
  }
}

function scrollActiveArchiveThumbIntoView() {
  window.requestAnimationFrame(() => {
    const thumb = archiveThumbs.children[activeArchiveIndex];
    if (!thumb || !archiveDialog.open) return;
    const thumbTop = thumb.offsetTop;
    const thumbBottom = thumbTop + thumb.offsetHeight;
    const viewTop = archiveThumbs.scrollTop;
    const viewBottom = viewTop + archiveThumbs.clientHeight;
    if (thumbTop >= viewTop && thumbBottom <= viewBottom) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    archiveThumbs.scrollTo({
      top: Math.max(0, thumbTop - archiveThumbs.clientHeight / 2 + thumb.offsetHeight / 2),
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}

function loadArchiveMainImage(source) {
  const token = ++archiveMainLoadToken;
  archiveImage.dataset.loadToken = String(token);
  archiveImage.dataset.retryAttempt = "0";
  archiveImage.classList.remove("is-loaded", "is-error");
  archiveImage.fetchPriority = "high";
  archiveImage.src = archiveAssetUrl(source);
}

archiveImage.addEventListener("load", () => {
  archiveImage.classList.remove("is-error");
  archiveImage.classList.add("is-loaded");
});

archiveImage.addEventListener("error", () => {
  const item = visibleArchiveItems[activeArchiveIndex];
  const token = Number(archiveImage.dataset.loadToken || 0);
  if (!item || item.video || token !== archiveMainLoadToken) return;
  const attempt = Number(archiveImage.dataset.retryAttempt || 0);
  if (attempt >= 1 || /^(data:|blob:)/i.test(item.src)) {
    archiveImage.classList.add("is-error");
    return;
  }
  archiveImage.dataset.retryAttempt = "1";
  window.setTimeout(() => {
    if (token !== archiveMainLoadToken) return;
    archiveImage.src = archiveAssetUrl(item.src, 1);
  }, 420);
});

function createArchiveModule(category, items) {
  const meta = archiveChapterMeta[category];
  const module = document.createElement("button");
  module.className = "archive-module";
  module.type = "button";
  module.dataset.tone = meta.tone;
  module.setAttribute("aria-label", `打开${meta.title}图集，共${items.length}件`);

  const art = document.createElement("span");
  art.className = "archive-module-art";
  art.setAttribute("aria-hidden", "true");
  art.innerHTML = archiveCoverArt[category] || "";

  const shade = document.createElement("span");
  shade.className = "archive-module-shade";
  shade.setAttribute("aria-hidden", "true");

  const top = document.createElement("span");
  top.className = "archive-module-top";
  const number = document.createElement("span");
  number.textContent = `${meta.number} / ${String(Object.keys(archiveChapterMeta).length).padStart(2, "0")}`;
  const english = document.createElement("span");
  english.textContent = meta.english;
  top.append(number, english);

  const body = document.createElement("span");
  body.className = "archive-module-body";
  const title = document.createElement("strong");
  title.textContent = meta.title;
  const videoCount = items.filter((item) => item.video).length;
  const caption = document.createElement("span");
  caption.textContent = videoCount
    ? `${items.length} 件作品 · ${videoCount} 段动画 · 点击展开`
    : `${items.length} 件作品 · 点击展开`;
  body.append(title, caption);

  const arrow = document.createElement("span");
  arrow.className = "archive-module-arrow";
  arrow.innerHTML = '<span class="archive-arrow-icon">↗</span><span class="archive-arrow-label">前往</span>';
  arrow.setAttribute("aria-hidden", "true");

  module.append(art, shade, top, body, arrow);
  module.addEventListener("click", () => openArchiveDialog(items[0], items, category));
  return module;
}

function isArchiveItemVisible(item) {
  return !archiveEditState.hidden.includes(archiveItemKey(item));
}

function visibleArchiveData() {
  return archiveData.filter(isArchiveItemVisible);
}

function renderArchive() {
  visibleArchiveItems = visibleArchiveData();
  const modules = Object.keys(archiveChapterMeta).map((category) => {
    const items = visibleArchiveItems.filter((item) => item.category === category);
    return createArchiveModule(category, items);
  });
  archiveChapters.replaceChildren(...modules);
  archiveCount.textContent = String(visibleArchiveItems.length);
}

function renderArchiveDialog() {
  const item = visibleArchiveItems[activeArchiveIndex];
  archiveManageToggle.setAttribute("aria-pressed", String(archiveManageMode));
  archiveManageToggle.firstChild.textContent = archiveManageMode ? "完成管理 " : "管理作品 ";
  archiveManageToggle.querySelector("span").textContent = archiveManageMode ? "✓" : "＋";
  archiveAdd.hidden = !archiveManageMode;
  archiveManageNote.hidden = !archiveManageMode;
  archiveItemActions.hidden = !archiveManageMode || !item;
  archiveReplaceItemButton.hidden = !item || Boolean(item.video);
  archiveDialog.querySelector("[data-archive-prev]").disabled = visibleArchiveItems.length < 2;
  archiveDialog.querySelector("[data-archive-next]").disabled = visibleArchiveItems.length < 2;

  if (!item) {
    archiveVideo.pause();
    archiveVideo.hidden = true;
    archiveVideo.removeAttribute("src");
    archiveImage.hidden = true;
    archiveImage.removeAttribute("src");
    archiveImage.classList.remove("is-loaded", "is-error");
    archiveDialogTitle.textContent = "这份图集还没有作品";
    archiveDialogDescription.textContent = archiveManageMode
      ? "可以从这里添加第一张图片作品。"
      : "打开「管理作品」，即可上传图片并开始整理这份图集。";
    archiveDialogCategory.textContent = archiveCategoryLabels[archiveActiveCategory] || "19 YEAR ARCHIVE";
    archiveDialog.dataset.category = archiveActiveCategory;
    archiveDialogPosition.textContent = "00 / 00";
    archiveThumbs.replaceChildren();
    return;
  }

  if (item.video) {
    archiveImage.hidden = true;
    archiveVideo.hidden = false;
    archiveVideo.poster = item.src;
    archiveVideo.src = item.video;
    archiveVideo.currentTime = 0;
    archiveVideo.muted = true;
    archiveVideo.loop = true;
    archiveVideo.load();
    archiveVideo.play().catch(() => {});
  } else {
    archiveVideo.pause();
    archiveVideo.hidden = true;
    archiveVideo.removeAttribute("src");
    archiveVideo.removeAttribute("poster");
    archiveVideo.load();
    archiveImage.hidden = false;
    archiveImage.alt = `${item.title} · ${item.description}`;
    loadArchiveMainImage(item.src);
  }

  archiveDialogCategory.textContent =
    archiveCategoryLabels[item.category] || "19 YEAR ARCHIVE";
  archiveDialog.dataset.category = item.category;
  archiveDialogTitle.textContent = item.title;
  archiveDialogDescription.textContent = item.description;
  archiveDialogPosition.textContent = `${String(activeArchiveIndex + 1).padStart(2, "0")} / ${String(
    visibleArchiveItems.length
  ).padStart(2, "0")}`;
  updateArchiveThumbState();
}

function updateArchiveThumbState() {
  [...archiveThumbs.children].forEach((thumb, index) => {
    thumb.classList.toggle("is-active", index === activeArchiveIndex);
  });
  queueArchiveThumbWindow();
  scrollActiveArchiveThumbIntoView();
}

function renderArchiveThumbs() {
  archiveThumbObserver?.disconnect();
  archiveThumbs.replaceChildren(
    ...visibleArchiveItems.map((item, index) => {
      const thumb = document.createElement("button");
      thumb.className = "archive-thumb";
      thumb.type = "button";
      thumb.setAttribute("aria-label", `查看 ${item.title}`);

      const image = document.createElement("img");
      image.dataset.src = item.thumb || item.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      thumb.append(image);

      if (item.video) {
        const play = document.createElement("span");
        play.textContent = "▶";
        thumb.append(play);
      }

      thumb.addEventListener("click", () => {
        activeArchiveIndex = index;
        renderArchiveDialog();
      });
      return thumb;
    })
  );
  const observer = getArchiveThumbObserver();
  if (observer) {
    [...archiveThumbs.querySelectorAll("img")].forEach((image) => observer.observe(image));
  } else {
    queueArchiveThumbWindow(activeArchiveIndex, 8);
  }
}

function refreshActiveArchiveCollection(preferredItemId = "") {
  archiveBaseCollection = visibleArchiveData().filter((item) => item.category === archiveActiveCategory);
  visibleArchiveItems = [...archiveBaseCollection];
  const preferredIndex = archiveBaseCollection.findIndex((item) => archiveItemKey(item) === preferredItemId);
  activeArchiveIndex = preferredIndex >= 0
    ? preferredIndex
    : Math.min(activeArchiveIndex, Math.max(archiveBaseCollection.length - 1, 0));
  renderArchiveThumbs();
  renderArchiveDialog();
}

function renderArchiveSubfilters() {
  archiveSubfilters.hidden = true;
  archiveSubfilters.replaceChildren();
}

function setModelingGroup(group) {
  activeModelingGroup = group;
  visibleArchiveItems =
    group === "all"
      ? [...archiveBaseCollection]
      : archiveBaseCollection.filter((item) => item.group === group);
  activeArchiveIndex = 0;
  renderArchiveSubfilters();
  renderArchiveThumbs();
  renderArchiveDialog();
}

function openArchiveDialog(item, collection = archiveData, category = "") {
  archiveActiveCategory = category || item?.category || collection[0]?.category || "";
  archiveManageMode = false;
  archiveBaseCollection = collection.filter(isArchiveItemVisible);
  activeModelingGroup =
    "all";
  visibleArchiveItems =
    activeModelingGroup === "all"
      ? [...archiveBaseCollection]
      : archiveBaseCollection.filter((entry) => entry.group === activeModelingGroup);
  const index = visibleArchiveItems.indexOf(item);
  activeArchiveIndex = index >= 0 ? index : 0;
  renderArchiveSubfilters();
  renderArchiveThumbs();
  renderArchiveDialog();
  body.classList.add("modal-open");
  archiveDialog.showModal();
}

archiveManageToggle.addEventListener("click", () => {
  if (!guardEditing()) return;
  archiveManageMode = !archiveManageMode;
  renderArchiveDialog();
});

archiveUpload.addEventListener("change", async () => {
  if (!guardEditing()) return;
  const files = [...(archiveUpload.files || [])];
  archiveUpload.value = "";
  if (!files.length) return;
  const addedItems = [];
  const storedIds = [];
  try {
    for (const file of files) {
      if (!file.type.startsWith("image/")) throw new Error("目前请上传图片文件。");
      const id = makeCapabilityId();
      const dataUrl = await readCapabilityFile(file);
      await archiveMedia("put", { id: `custom:${id}`, kind: "custom", dataUrl });
      storedIds.push(`custom:${id}`);
      addedItems.push({
        id,
        category: archiveActiveCategory,
        title: file.name.replace(/\.[^.]+$/, ""),
        description: "",
        src: dataUrl,
        archiveId: `custom:${id}`,
        isCustom: true
      });
    }
    const nextState = {
      ...archiveEditState,
      custom: [...archiveEditState.custom, ...addedItems.map(({ src, archiveId, isCustom, ...item }) => item)]
    };
    saveArchiveEditState(nextState);
    archiveData.push(...addedItems);
    renderArchive();
    refreshActiveArchiveCollection(addedItems[0]?.archiveId);
    showToast(`已添加 ${addedItems.length} 件作品`);
  } catch (error) {
    for (const id of storedIds) await archiveMedia("delete", id).catch(() => {});
    showToast(error.message || "上传失败，请稍后重试");
  }
});

archiveEditItemButton.addEventListener("click", () => {
  if (!guardEditing()) return;
  const item = visibleArchiveItems[activeArchiveIndex];
  if (!item) return;
  archiveEditingItem = item;
  archiveItemForm.elements.title.value = item.title || "";
  archiveItemForm.elements.description.value = item.description || "";
  archiveItemDialog.showModal();
});

archiveItemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!guardEditing()) return;
  if (!archiveEditingItem) return;
  const item = archiveEditingItem;
  const key = archiveItemKey(item);
  const updated = {
    title: archiveItemForm.elements.title.value.trim(),
    description: archiveItemForm.elements.description.value.trim()
  };
  try {
    const nextState = {
      ...archiveEditState,
      overrides: { ...archiveEditState.overrides, [key]: updated },
      custom: archiveEditState.custom.map((entry) =>
        item.isCustom && entry.id === item.id ? { ...entry, ...updated } : entry
      )
    };
    if (item.isCustom) {
      const saved = nextState.custom.find((entry) => entry.id === item.id);
      if (saved) Object.assign(saved, updated);
    }
    saveArchiveEditState(nextState);
    Object.assign(item, updated);
    renderArchive();
    refreshActiveArchiveCollection(key);
    archiveItemDialog.close();
    showToast("作品文字已更新");
  } catch (error) {
    showToast(error.message || "保存失败，请稍后重试");
  }
});

document.querySelectorAll("[data-archive-item-close]").forEach((button) => {
  button.addEventListener("click", () => archiveItemDialog.close());
});
archiveItemDialog.addEventListener("click", (event) => {
  if (event.target === archiveItemDialog) archiveItemDialog.close();
});

archiveReplaceItemButton.addEventListener("click", () => {
  if (!guardEditing()) return;
  const item = visibleArchiveItems[activeArchiveIndex];
  if (!item || item.video) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("请选择图片文件");
      return;
    }
    const key = archiveItemKey(item);
    try {
      const dataUrl = await readCapabilityFile(file);
      await archiveMedia("put", { id: `replacement:${key}`, kind: "replacement", dataUrl });
      item.src = dataUrl;
      renderArchive();
      refreshActiveArchiveCollection(key);
      showToast("图片已替换，作品文字已保留");
    } catch (error) {
      showToast(error.message || "替换失败，请稍后重试");
    }
  }, { once: true });
  input.click();
});

archiveDeleteItemButton.addEventListener("click", () => {
  if (!guardEditing()) return;
  const item = visibleArchiveItems[activeArchiveIndex];
  if (!item) return;
  archivePendingDelete = item;
  archiveDeleteDialog.querySelector("[data-archive-delete-copy]").textContent =
    `「${item.title}」将从「${archiveCategoryLabels[item.category] || "作品"}」图集中隐藏。电脑中的原始素材不会被删除。`;
  archiveDeleteDialog.showModal();
});

document.querySelector("[data-archive-delete-cancel]").addEventListener("click", () => {
  archivePendingDelete = null;
  archiveDeleteDialog.close();
});
document.querySelector("[data-archive-delete-confirm]").addEventListener("click", async () => {
  if (!guardEditing()) return;
  if (!archivePendingDelete) return;
  const item = archivePendingDelete;
  const key = archiveItemKey(item);
  try {
    const nextState = {
      ...archiveEditState,
      custom: item.isCustom
        ? archiveEditState.custom.filter((entry) => entry.id !== item.id)
        : archiveEditState.custom,
      hidden: item.isCustom
        ? archiveEditState.hidden.filter((entry) => entry !== key)
        : archiveEditState.hidden.includes(key)
          ? archiveEditState.hidden
          : [...archiveEditState.hidden, key]
    };
    if (item.isCustom) {
      const records = await archiveMedia("getAll");
      const removedRecords = records.filter((entry) =>
        entry.id === `custom:${item.id}` || entry.id === `replacement:${key}`
      );
      await archiveMedia("delete", `custom:${item.id}`);
      await archiveMedia("delete", `replacement:${key}`);
      try {
        saveArchiveEditState(nextState);
      } catch (error) {
        for (const record of removedRecords) await archiveMedia("put", record).catch(() => {});
        throw error;
      }
      archiveData.splice(archiveData.indexOf(item), 1);
    } else {
      saveArchiveEditState(nextState);
    }
    archivePendingDelete = null;
    archiveDeleteDialog.close();
    renderArchive();
    refreshActiveArchiveCollection();
    showToast("作品已从图集中移出");
  } catch (error) {
    showToast(error.message || "移出失败，请稍后重试");
  }
});
archiveDeleteDialog.addEventListener("click", (event) => {
  if (event.target === archiveDeleteDialog) {
    archivePendingDelete = null;
    archiveDeleteDialog.close();
  }
});

document.querySelector("[data-archive-close]").addEventListener("click", () => {
  archiveDialog.close();
});

document.querySelector("[data-archive-prev]").addEventListener("click", () => {
  activeArchiveIndex =
    (activeArchiveIndex - 1 + visibleArchiveItems.length) % visibleArchiveItems.length;
  renderArchiveDialog();
});

document.querySelector("[data-archive-next]").addEventListener("click", () => {
  activeArchiveIndex = (activeArchiveIndex + 1) % visibleArchiveItems.length;
  renderArchiveDialog();
});

archiveDialog.addEventListener("click", (event) => {
  if (event.target === archiveDialog) archiveDialog.close();
});

archiveDialog.addEventListener("close", () => {
  archiveVideo.pause();
  body.classList.remove("modal-open");
});

document.addEventListener("keydown", (event) => {
  if (archiveDialog.open && event.key === "ArrowLeft") {
    event.preventDefault();
    document.querySelector("[data-archive-prev]").click();
  }

  if (archiveDialog.open && event.key === "ArrowRight") {
    event.preventDefault();
    document.querySelector("[data-archive-next]").click();
  }
});

function updateLifeDate() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  });
  document.querySelectorAll("[data-life-date]").forEach((element) => {
    element.textContent = formatter.format(new Date());
  });
}

renderBookmarks();
loadArchiveEdits()
  .catch((error) => showToast(error.message || "部分本地作品无法读取"))
  .finally(renderArchive);
updateLifeDate();

const pageParams = new URLSearchParams(window.location.search);
if (pageParams.get("mode") === "edit" && !isEditingEnabled()) {
  window.setTimeout(openEditGate, 180);
}

function restoreInitialScroll() {
  window.requestAnimationFrame(() => {
    scrollToHash({ behavior: "auto" });
    window.setTimeout(() => scrollToHash({ behavior: "auto" }), 120);
  });
}

window.addEventListener("load", restoreInitialScroll, { once: true });
window.addEventListener("pageshow", (event) => {
  if (event.persisted) restoreInitialScroll();
});

function updateLocalTime() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  document.querySelectorAll("[data-local-time]").forEach((element) => {
    element.textContent = `${formatter.format(new Date())} CST`;
  });
}

updateLocalTime();
setInterval(updateLocalTime, 30000);

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
