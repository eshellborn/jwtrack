const sourceUrl = "https://www.jw.org/en/whats-new/";
const supabaseUrl = "https://fgikbmwjdentpumhdzeu.supabase.co";
const supabasePublishableKey = "sb_publishable_bX9yx0-MyUjNY0TgpgeTTw_p4E1CFkq";
const supabaseClient = typeof supabase === "undefined"
  ? null
  : supabase.createClient(supabaseUrl, supabasePublishableKey);
const isLocalAuthPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  && new URLSearchParams(window.location.search).get("preview") === "signed-in";
const storageKey = "jw-whats-new-tracker-v8";
const contentStorageKey = "jw-whats-new-content-v1";
const items = loadCachedItems();
const defaultProgress = {};
const state = {
  filter: "unread",
  progress: loadProgress(),
  contentStatus: items.length ? "ready" : "loading",
  contentError: "",
  swipeStart: null,
  user: null,
  emailNotifications: false,
  isAuthPreview: isLocalAuthPreview,
  isSigningOut: false
};

const listEl = document.querySelector("#itemList");
const segmentsEl = document.querySelector(".segments");
const markAllUnreadButton = document.querySelector("#markAllUnread");
const accountEl = document.querySelector(".account");
const profileButton = document.querySelector("#profileButton");
const accountMenu = document.querySelector("#accountMenu");
const pageDimmer = document.querySelector("#pageDimmer");
const sheetCloseButton = document.querySelector("#sheetCloseButton");
const signInForm = document.querySelector("#signInForm");
const accountSession = document.querySelector("#accountSession");
const accountEmail = document.querySelector("#accountEmail");
const accountStatus = document.querySelector("#accountStatus");
const signOutButton = document.querySelector("#signOutButton");
const emailNotifications = document.querySelector("#emailNotifications");

function normalizeContentItem(row) {
  const type = row?.type === "video" ? "video" : row?.type === "article" ? "article" : null;
  const date = String(row?.publication_date || row?.date || "");
  if (!row?.id || !type || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  let url = sourceUrl;
  try {
    const parsedUrl = new URL(String(row.url || sourceUrl));
    if (parsedUrl.protocol === "https:") url = parsedUrl.href;
  } catch {
    url = sourceUrl;
  }

  return {
    id: String(row.id),
    date,
    category: String(row.category || "Other"),
    title: String(row.title || "Untitled"),
    description: String(row.description || ""),
    type,
    url,
    sortOrder: Number(row.sort_order || row.sortOrder || 0)
  };
}

function loadCachedItems() {
  try {
    const cached = JSON.parse(localStorage.getItem(contentStorageKey) || "[]");
    return Array.isArray(cached) ? cached.map(normalizeContentItem).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveCachedItems() {
  localStorage.setItem(contentStorageKey, JSON.stringify(items));
}

async function loadContentItems() {
  if (!supabaseClient) {
    state.contentStatus = items.length ? "ready" : "error";
    state.contentError = "Content could not be loaded.";
    render();
    return;
  }

  const { data, error } = await supabaseClient
    .from("content_items")
    .select("id, publication_date, category, title, description, type, url, sort_order")
    .eq("published", true)
    .order("publication_date", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    state.contentStatus = items.length ? "ready" : "error";
    state.contentError = "Content could not be loaded. Please try again later.";
    render();
    return;
  }

  const loadedItems = (data || []).map(normalizeContentItem).filter(Boolean);
  items.splice(0, items.length, ...loadedItems);
  saveCachedItems();
  state.contentStatus = "ready";
  state.contentError = "";
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function loadProgress() {
  try {
    const savedProgress = localStorage.getItem(storageKey);
    return savedProgress === null ? { ...defaultProgress } : JSON.parse(savedProgress) || {};
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(state.progress));
}

function isDone(id) {
  return Boolean(state.progress[id]);
}

function setDone(id, done) {
  if (done) {
    state.progress[id] = true;
  } else {
    delete state.progress[id];
  }
  saveProgress();
  syncProgressChange(id, done);
}

function setAccountStatus(message, isError = false) {
  const normalizedMessage = message ? message.charAt(0).toUpperCase() + message.slice(1) : "";
  accountStatus.textContent = normalizedMessage;
  accountStatus.classList.toggle("error", isError);
  accountMenu.classList.toggle("has-status", Boolean(normalizedMessage));
}

function updateAccountUI() {
  const signedIn = Boolean(state.user);
  accountEl.classList.toggle("signed-in", signedIn);
  signInForm.hidden = signedIn;
  accountSession.hidden = !signedIn;
  accountEmail.textContent = state.user?.email || "Signed in";
  emailNotifications.checked = state.emailNotifications;
}

async function loadNotificationPreference() {
  if (!supabaseClient || !state.user || state.isAuthPreview) return;

  const { data, error } = await supabaseClient
    .from("notification_preferences")
    .select("enabled")
    .eq("user_id", state.user.id)
    .maybeSingle();

  if (error) {
    setAccountStatus(`Could not load email preference: ${error.message}`, true);
    return;
  }

  state.emailNotifications = Boolean(data?.enabled);
  updateAccountUI();
}

async function saveNotificationPreference(enabled) {
  if (!supabaseClient || !state.user || state.isAuthPreview) return;

  emailNotifications.disabled = true;
  setAccountStatus("Saving email preference...");
  const { error } = await supabaseClient.from("notification_preferences").upsert({
    user_id: state.user.id,
    enabled
  });
  emailNotifications.disabled = false;

  if (error) {
    state.emailNotifications = !enabled;
    updateAccountUI();
    setAccountStatus(`Could not save email preference: ${error.message}`, true);
    return;
  }

  setAccountStatus(enabled ? "Email notifications enabled." : "Email notifications disabled.");
}

function setAccountMenuOpen(open) {
  accountMenu.classList.toggle("open", open);
  pageDimmer.classList.toggle("open", open);
  accountMenu.setAttribute("aria-hidden", String(!open));
  profileButton.setAttribute("aria-expanded", String(open));
  profileButton.setAttribute("aria-label", open ? "Close account menu" : "Open account menu");
}

function closeAccountMenuAfterAnimation() {
  if (!accountMenu.classList.contains("open")) {
    setAccountMenuOpen(false);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      accountMenu.removeEventListener("transitionend", handleTransitionEnd);
      window.clearTimeout(fallbackTimer);
      resolve();
    };
    const handleTransitionEnd = (event) => {
      if (event.target === accountMenu && event.propertyName === "transform") finish();
    };
    const fallbackTimer = window.setTimeout(finish, 500);

    accountMenu.addEventListener("transitionend", handleTransitionEnd);
    setAccountMenuOpen(false);
  });
}

async function syncProgressChange(itemId, done) {
  if (!supabaseClient || !state.user || state.isAuthPreview) return;

  setAccountStatus("Syncing...");
  const request = done
    ? supabaseClient.from("user_progress").upsert({ user_id: state.user.id, item_id: itemId })
    : supabaseClient
        .from("user_progress")
        .delete()
        .eq("user_id", state.user.id)
        .eq("item_id", itemId);
  const { error } = await request;

  if (error) {
    setAccountStatus(`Saved on this device, but sync failed: ${error.message}`, true);
    return;
  }
  setAccountStatus("");
}

async function loadCloudProgress() {
  if (!supabaseClient || !state.user) return;

  setAccountStatus("Syncing progress...");
  const localIds = Object.keys(state.progress).filter((id) => state.progress[id]);
  const { data, error } = await supabaseClient
    .from("user_progress")
    .select("item_id")
    .eq("user_id", state.user.id);

  if (error) {
    setAccountStatus(`Signed in, but progress sync failed: ${error.message}`, true);
    return;
  }

  const cloudIds = (data || []).map((row) => row.item_id);
  const mergedIds = [...new Set([...cloudIds, ...localIds])];
  state.progress = Object.fromEntries(mergedIds.map((id) => [id, true]));
  saveProgress();
  render();

  const missingCloudIds = localIds.filter((id) => !cloudIds.includes(id));
  if (missingCloudIds.length) {
    const rows = missingCloudIds.map((itemId) => ({ user_id: state.user.id, item_id: itemId }));
    const { error: migrationError } = await supabaseClient.from("user_progress").upsert(rows);
    if (migrationError) {
      setAccountStatus(`Signed in, but local progress could not be uploaded: ${migrationError.message}`, true);
      return;
    }
  }

  setAccountStatus("");
}

async function applySession(session) {
  if (!session && state.isSigningOut) return;

  state.user = session?.user || null;
  updateAccountUI();
  if (state.user) {
    await Promise.all([loadCloudProgress(), loadNotificationPreference()]);
  } else {
    state.emailNotifications = false;
    updateAccountUI();
    setAccountStatus("");
  }
}

async function initializeAuth() {
  if (state.isAuthPreview) {
    state.user = { id: "local-preview-user", email: "preview@example.com" };
    updateAccountUI();
    setAccountStatus("");
    return;
  }

  if (!supabaseClient) {
    setAccountStatus("Cloud sync could not load. Local progress is still available.", true);
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    setAccountStatus(`Could not restore sign-in: ${error.message}`, true);
  } else {
    await applySession(data.session);
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") return;
    window.setTimeout(() => applySession(session), 0);
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

function sortByNewestFirst(itemA, itemB) {
  return itemB.date.localeCompare(itemA.date) || itemA.sortOrder - itemB.sortOrder;
}

function filteredItems() {
  return items
    .filter((item) => {
      const done = isDone(item.id);
      if (state.filter === "unread") return !done;
      if (state.filter === "videos") return item.type === "video";
      if (state.filter === "articles") return item.type === "article";
      return true;
    })
    .sort(sortByNewestFirst);
}

function render() {
  const visible = filteredItems();
  renderStats();
  renderList(visible);
  updateFilterIndicator();
  markAllUnreadButton.disabled = !items.some((item) => isDone(item.id));
}

function renderStats() {
  const stats = items.reduce(
    (acc, item) => {
      const done = isDone(item.id);
      if (item.type === "video") {
        if (!done) acc.videosToWatch += 1;
      } else {
        if (!done) acc.articlesToRead += 1;
      }
      return acc;
    },
    {
      articlesToRead: 0,
      videosToWatch: 0
    }
  );

  animateStatNumber(document.querySelector("#articlesToRead"), stats.articlesToRead);
  animateStatNumber(document.querySelector("#videosToWatch"), stats.videosToWatch);
}

function animateStatNumber(element, nextValue) {
  const currentValue = Number(element.dataset.value ?? element.textContent);
  if (currentValue === nextValue) return;

  element.dataset.value = nextValue;
  element.setAttribute("aria-label", String(nextValue));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = nextValue;
    return;
  }

  const increasing = nextValue > currentValue;
  const track = document.createElement("span");
  const oldNumber = document.createElement("span");
  const newNumber = document.createElement("span");
  track.className = "stat-number-track";
  oldNumber.textContent = currentValue;
  newNumber.textContent = nextValue;
  oldNumber.setAttribute("aria-hidden", "true");
  newNumber.setAttribute("aria-hidden", "true");
  track.append(...(increasing ? [newNumber, oldNumber] : [oldNumber, newNumber]));
  element.replaceChildren(track);

  const animation = track.animate(
    increasing
      ? [{ transform: "translateY(-50%)" }, { transform: "translateY(0)" }]
      : [{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }],
    {
      duration: 380,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );

  animation.addEventListener("finish", () => {
    if (Number(element.dataset.value) === nextValue) {
      element.textContent = nextValue;
    }
  });
}

function renderList(visible) {
  if (state.contentStatus === "loading" && !items.length) {
    listEl.innerHTML = '<div class="empty">Loading articles and videos...</div>';
    return;
  }

  if (state.contentStatus === "error" && !items.length) {
    listEl.innerHTML = `<div class="empty">${escapeHtml(state.contentError)}</div>`;
    return;
  }

  if (!visible.length) {
    const allCaughtUp = state.filter === "unread";
    listEl.innerHTML = `<div class="empty ${allCaughtUp ? "all-caught-up" : ""}">${
      allCaughtUp ? "All caught up!" : "No items match this filter."
    }</div>`;
    return;
  }

  listEl.innerHTML = visible
    .map((item) => {
      const done = isDone(item.id);
      const safeId = escapeHtml(item.id);
      return `
        <article class="item item-${item.type} ${done ? "done" : ""}" data-id="${safeId}">
          <div class="item-row">
            <div class="item-main">
              <div class="meta">
                <span class="pill ${item.type}">${item.type}</span>
                <span class="category">${escapeHtml(item.category)}</span>
              </div>
              <h3><a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></h3>
              <span class="date">${formatDate(item.date)}</span>
              ${item.description && item.type !== "video" ? `<p class="desc">${escapeHtml(item.description)}</p>` : ""}
            </div>
            <button class="complete-button" data-id="${safeId}" type="button" aria-label="${done ? "Mark open" : "Mark complete"}"></button>
          </div>
        </article>
      `;
    })
    .join("");
  wrapTitleLines();
}

function wrapTitleLines() {
  listEl.querySelectorAll("h3 a").forEach((link) => {
    const title = link.textContent.trim();
    link.dataset.title = title;
    link.textContent = "";

    const words = title.split(/\s+/);
    const wordSpans = words.map((word, index) => {
      const span = document.createElement("span");
      span.textContent = `${word}${index < words.length - 1 ? " " : ""}`;
      link.append(span);
      return span;
    });

    const lines = [];
    wordSpans.forEach((span) => {
      const top = Math.round(span.offsetTop);
      const currentLine = lines.at(-1);
      if (!currentLine || Math.abs(currentLine.top - top) > 2) {
        lines.push({ top, text: span.textContent });
      } else {
        currentLine.text += span.textContent;
      }
    });

    link.textContent = "";
    const lastLineIndex = Math.max(lines.length - 1, 0);
    lines.forEach((line, index) => {
      const span = document.createElement("span");
      span.className = "title-line";
      span.textContent = line.text;
      span.style.setProperty("--line-index", index);
      span.style.setProperty("--reverse-line-index", lastLineIndex - index);
      link.append(span);
    });
  });
}

function easeCompletion(value) {
  const inverse = 1 - value;
  return 1 - inverse * inverse * inverse;
}

function setStrikeProgress(lines, progress) {
  const lineWidths = lines.map((line) => line.getBoundingClientRect().width);
  const totalWidth = lineWidths.reduce((sum, width) => sum + width, 0);
  let completedWidth = progress * totalWidth;

  lines.forEach((line, index) => {
    const lineWidth = lineWidths[index] || 1;
    const fill = Math.max(0, Math.min(1, completedWidth / lineWidth));
    line.style.backgroundSize = `${fill * 100}% 2px`;
    completedWidth -= lineWidth;
  });
}

function findRenderedItem(id) {
  return Array.from(listEl.querySelectorAll(".item")).find((item) => item.dataset.id === id) || null;
}

function animateTitleStrike(item, done) {
  const lines = Array.from(item?.querySelectorAll(".title-line") || []);
  if (!lines.length) return;

  const duration = 260;
  const startedAt = performance.now();
  setStrikeProgress(lines, done ? 0 : 1);

  function step(now) {
    const elapsed = Math.min((now - startedAt) / duration, 1);
    const eased = easeCompletion(elapsed);
    setStrikeProgress(lines, done ? eased : 1 - eased);
    if (elapsed < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function completionDelayFor(item) {
  return 260;
}

function animateUnreadRemoval(item, id) {
  const previousRects = new Map(
    Array.from(listEl.querySelectorAll(".item")).map((node) => [
      node.dataset.id,
      node.getBoundingClientRect()
    ])
  );

  item.classList.remove("marking-done");
  item.classList.add("done", "removing");

  const finishRemoval = (event) => {
    if (event.target !== item || event.animationName !== "itemExit") return;
    item.removeEventListener("animationend", finishRemoval);
    setDone(id, true);
    render();

    listEl.querySelectorAll(".item").forEach((node) => {
      const previousRect = previousRects.get(node.dataset.id);
      if (!previousRect) return;
      const currentRect = node.getBoundingClientRect();
      const deltaX = previousRect.left - currentRect.left;
      const deltaY = previousRect.top - currentRect.top;
      if (!deltaX && !deltaY) return;

      node.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" }
        ],
        {
          duration: 320,
          easing: "cubic-bezier(0, 0, 0.28, 1)"
        }
      );
    });
  };

  item.addEventListener("animationend", finishRemoval);
}

function toggleItem(id) {
  const nextDone = !isDone(id);

  if (nextDone) {
    const item = findRenderedItem(id);
    item?.classList.add("marking-done");
    animateTitleStrike(item, true);
    window.setTimeout(() => {
      if (state.filter === "unread" && item) {
        animateUnreadRemoval(item, id);
        return;
      }
      setDone(id, true);
      render();
    }, completionDelayFor(item));
    return;
  }

  const item = findRenderedItem(id);
  item?.classList.add("marking-open");
  animateTitleStrike(item, false);
  window.setTimeout(() => {
    setDone(id, false);
    render();
  }, completionDelayFor(item));
}

function updateFilterIndicator() {
  const activeButton = segmentsEl.querySelector("button.active");
  if (!activeButton) return;
  segmentsEl.style.setProperty("--indicator-left", `${activeButton.offsetLeft}px`);
  segmentsEl.style.setProperty("--indicator-width", `${activeButton.offsetWidth}px`);
}

document.querySelector(".segments").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  document.querySelectorAll(".segments button").forEach((node) => node.classList.remove("active"));
  button.classList.add("active");
  state.filter = button.dataset.filter;
  render();
  updateFilterIndicator();
});

profileButton.addEventListener("click", () => {
  setAccountMenuOpen(profileButton.getAttribute("aria-expanded") !== "true");
});

sheetCloseButton.addEventListener("click", () => {
  setAccountMenuOpen(false);
  profileButton.focus();
});

document.addEventListener("click", (event) => {
  if (!accountEl.contains(event.target)) {
    setAccountMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || profileButton.getAttribute("aria-expanded") !== "true") return;
  setAccountMenuOpen(false);
  profileButton.focus();
});

markAllUnreadButton.addEventListener("click", async () => {
  state.progress = {};
  saveProgress();
  render();

  if (supabaseClient && state.user && !state.isAuthPreview) {
    setAccountStatus("Syncing...");
    const { error } = await supabaseClient
      .from("user_progress")
      .delete()
      .eq("user_id", state.user.id);
    setAccountStatus(
      error ? `Cleared on this device, but sync failed: ${error.message}` : "",
      Boolean(error)
    );
  }
});

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;

  const submitButton = signInForm.querySelector("button[type='submit']");
  const email = new FormData(signInForm).get("email").trim();
  submitButton.disabled = true;
  setAccountStatus("Sending sign-in link...");

  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}${window.location.pathname}`
    }
  });

  submitButton.disabled = false;
  setAccountStatus(
    error ? error.message : "Check your email for the sign-in link.",
    Boolean(error)
  );
});

signOutButton.addEventListener("click", async () => {
  state.isSigningOut = true;

  if (state.isAuthPreview) {
    await closeAccountMenuAfterAnimation();
    state.user = null;
    updateAccountUI();
    setAccountStatus("");
    state.isSigningOut = false;
    profileButton.focus();
    return;
  }

  if (!supabaseClient) {
    state.isSigningOut = false;
    return;
  }
  setAccountStatus("Signing out...");
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    state.isSigningOut = false;
    setAccountStatus(error.message, true);
    return;
  }
  await closeAccountMenuAfterAnimation();
  state.user = null;
  updateAccountUI();
  setAccountStatus("");
  state.progress = {};
  saveProgress();
  render();
  state.isSigningOut = false;
  profileButton.focus();
});

emailNotifications.addEventListener("change", () => {
  state.emailNotifications = emailNotifications.checked;
  saveNotificationPreference(state.emailNotifications);
});

window.addEventListener("resize", () => {
  window.clearTimeout(wrapTitleLines.resizeTimer);
  wrapTitleLines.resizeTimer = window.setTimeout(() => {
    wrapTitleLines();
    updateFilterIndicator();
  }, 120);
});

listEl.addEventListener("click", (event) => {
  const button = event.target.closest(".complete-button");
  if (!button) return;
  toggleItem(button.dataset.id);
});

listEl.addEventListener("pointerdown", (event) => {
  const item = event.target.closest(".item");
  if (!item || event.target.closest("a, button")) return;
  state.swipeStart = {
    id: item.dataset.id,
    x: event.clientX,
    y: event.clientY
  };
});

listEl.addEventListener("pointermove", (event) => {
  if (!state.swipeStart) return;
  const dx = event.clientX - state.swipeStart.x;
  const dy = event.clientY - state.swipeStart.y;
  const item = findRenderedItem(state.swipeStart.id);
  if (item && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    item.classList.add("swiping");
  }
});

listEl.addEventListener("pointerup", (event) => {
  if (!state.swipeStart) return;
  const dx = event.clientX - state.swipeStart.x;
  const dy = event.clientY - state.swipeStart.y;
  const id = state.swipeStart.id;
  state.swipeStart = null;
  document.querySelectorAll(".item.swiping").forEach((item) => item.classList.remove("swiping"));
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    toggleItem(id);
  }
});

listEl.addEventListener("pointercancel", () => {
  state.swipeStart = null;
  document.querySelectorAll(".item.swiping").forEach((item) => item.classList.remove("swiping"));
});

render();
initializeAuth();
loadContentItems();
