const sourceUrl = "https://www.jw.org/en/whats-new/";
const supabaseUrl = "https://fgikbmwjdentpumhdzeu.supabase.co";
const supabasePublishableKey = "sb_publishable_bX9yx0-MyUjNY0TgpgeTTw_p4E1CFkq";
const supabaseClient = typeof supabase === "undefined"
  ? null
  : supabase.createClient(supabaseUrl, supabasePublishableKey);
const items = [
  {
    id: "pub-jwb-138-1-video",
    date: "2026-06-01",
    category: "JW Broadcasting",
    title: "JW Broadcasting—June 2026: 159th Gilead Graduation",
    description: "1h 32m 23s",
    type: "video",
    url: "https://www.jw.org/en/library/videos/#en/mediaitems/StudioMonthlyPrograms/pub-jwb-138_1_VIDEO"
  },
  {
    id: "pub-jwbvod26-21-video",
    date: "2026-05-29",
    category: "Morning Worship",
    title: "David H. Splane: Faith Without Works Is Dead (Jas. 2:17)",
    description: "8m 45s",
    type: "video",
    url: "https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_21_VIDEO"
  },
  {
    id: "pub-jwbvod26-23-video",
    date: "2026-05-29",
    category: "Morning Worship",
    title: "Harold Corkern: Jehovah Provides True Wisdom (Ps. 19:7)",
    description: "10m 32s",
    type: "video",
    url: "https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_23_VIDEO"
  },
  {
    id: "pub-jwbvod26-19-video",
    date: "2026-05-22",
    category: "Morning Worship",
    title: "Joel Dellinger: Be a True Friend Like Jonathan (1 Sam. 18:1)",
    description: "10m 17s",
    type: "video",
    url: "https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_19_VIDEO"
  },
  {
    id: "pub-jwbvod26-20-video",
    date: "2026-05-22",
    category: "Morning Worship",
    title: "Izak Marais: Jehovah Gives Us the Desire and Power to Act (Phil. 2:13)",
    description: "10m 12s",
    type: "video",
    url: "https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_20_VIDEO"
  },
  {
    id: "pub-mwbv-202605-1-video",
    date: "2026-05-11",
    category: "Relief Work",
    title: "Disaster Preparedness—Expect the Unexpected",
    description: "4m 51s",
    type: "video",
    url: "https://www.jw.org/en/library/videos/#en/mediaitems/VODActivitiesReliefWork/pub-mwbv_202605_1_VIDEO"
  },
  {
    id: "2026-06-09-convinced-love-support",
    date: "2026-06-09",
    category: "News Releases",
    title: "UPDATE - BROTHER FINED | Convinced of Jehovah's Love and Support",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-06-09-pray-unbreakable",
    date: "2026-06-09",
    category: "News Releases",
    title: "BROTHER IMPRISONED | 'I Pray to Be Unbreakable'",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-06-08-seven-brothers-ukraine",
    date: "2026-06-08",
    category: "News Releases",
    title: "Seven More Brothers Imprisoned as Conscientious Objectors in Ukraine",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-06-04-after-each-trial",
    date: "2026-06-04",
    category: "News Releases",
    title: "After Each Trial, Blessings Have Come",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-06-03-bible-books-may",
    date: "2026-06-03",
    category: "News Releases",
    title: "Bible Books Released in Three Languages During May 2026",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-06-02-four-brothers-russia",
    date: "2026-06-02",
    category: "News Releases",
    title: "Four Brothers Released in Russia",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-06-01-world-peace",
    date: "2026-06-01",
    category: "The Watchtower",
    title: "Is World Peace Possible?",
    description: "World peace is assured, and the Bible's solution will surprise you!",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-27-oleg-postnikov",
    date: "2026-05-27",
    category: "News Releases",
    title: "UPDATE - CONVICTION OVERTURNED | Oleg Postnikov Convicted for a Second Time - Sentenced to Over Six Years in Prison",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-25-ebola-congo",
    date: "2026-05-25",
    category: "News Releases",
    title: "Ebola Outbreak Threatens Millions in the Democratic Republic of the Congo",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-22-he-will-answer",
    date: "2026-05-22",
    category: "News Releases",
    title: "BROTHERS IMPRISONED | He Will Answer",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-19-serving-gives-meaning",
    date: "2026-05-19",
    category: "News Releases",
    title: "BROTHER IMPRISONED | Serving Jehovah Gives Meaning to Life",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-19-stephane-landeroin",
    date: "2026-05-19",
    category: "The Watchtower - Study Edition",
    title: "Stephane Landeroin: My Grand Creator Noticed Me",
    description: "Find out what Stephane and his wife, Claudine, have learned through their life experiences.",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-19-city-gates",
    date: "2026-05-19",
    category: "The Watchtower - Study Edition",
    title: "City Gates in Bible Times",
    description: "What activities took place at city gates in Bible times?",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-19-almond-tree",
    date: "2026-05-19",
    category: "The Watchtower - Study Edition",
    title: "Bible Fact - The Tree That Wakes Up Early",
    description: "Consider some facts about the almond tree and its use in the Bible.",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-19-august-2026",
    date: "2026-05-19",
    category: "The Watchtower - Study Edition",
    title: "August 2026",
    description: "This issue contains the study articles for October 5-November 1, 2026.",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-15-temporary-resident",
    date: "2026-05-15",
    category: "News Releases",
    title: "BROTHER IMPRISONED | I Am a Temporary Resident in This World",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-14-oscar-cisano",
    date: "2026-05-14",
    category: "Life Stories",
    title: "Oscar Cisano: I Have Gazed Upon the Pleasantness of Jehovah",
    description: "Learn how Oscar experienced support while serving full-time despite having a visual impairment.",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-13-jehovahs-side",
    date: "2026-05-13",
    category: "News Releases",
    title: "I Will Stay on Jehovah's Side",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-13-kenya-tanzania",
    date: "2026-05-13",
    category: "News Releases",
    title: "Over 11,000 Bible Studies Requested During Preaching Campaign in Kenya and Tanzania",
    description: "",
    type: "article",
    url: sourceUrl
  },
  {
    id: "2026-05-11-convinced-loved",
    date: "2026-05-11",
    category: "News Releases",
    title: "I Am Convinced That Jehovah Loves Me Deeply",
    description: "",
    type: "article",
    url: sourceUrl
  }
];

const storageKey = "jw-whats-new-tracker-v5";
const state = {
  filter: "all",
  progress: loadProgress(),
  swipeStart: null,
  user: null
};

const listEl = document.querySelector("#itemList");
const segmentsEl = document.querySelector(".segments");
const markAllUnreadButton = document.querySelector("#markAllUnread");
const signInForm = document.querySelector("#signInForm");
const accountSession = document.querySelector("#accountSession");
const accountEmail = document.querySelector("#accountEmail");
const accountStatus = document.querySelector("#accountStatus");
const signOutButton = document.querySelector("#signOutButton");

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
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
  accountStatus.textContent = message;
  accountStatus.classList.toggle("error", isError);
}

function updateAccountUI() {
  const signedIn = Boolean(state.user);
  signInForm.hidden = signedIn;
  accountSession.hidden = !signedIn;
  accountEmail.textContent = state.user?.email || "Signed in";
}

async function syncProgressChange(itemId, done) {
  if (!supabaseClient || !state.user) return;

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
  setAccountStatus("Progress synced.");
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

  setAccountStatus("Progress synced across devices.");
}

async function applySession(session) {
  state.user = session?.user || null;
  updateAccountUI();
  if (state.user) {
    await loadCloudProgress();
  } else {
    setAccountStatus("Sign in to sync progress across devices.");
  }
}

async function initializeAuth() {
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
  return itemB.date.localeCompare(itemA.date);
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
  if (!visible.length) {
    listEl.innerHTML = `<div class="empty">No items match this filter.</div>`;
    return;
  }

  listEl.innerHTML = visible
    .map((item) => {
      const done = isDone(item.id);
      return `
        <article class="item ${done ? "done" : ""}" data-id="${item.id}">
          <div class="item-row">
            <div class="item-main">
              <div class="meta">
                <span class="pill ${item.type}">${item.type}</span>
                <span class="category">${item.category}</span>
              </div>
              <h3><a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a></h3>
              <span class="date">${formatDate(item.date)}</span>
              ${item.description && item.type !== "video" ? `<p class="desc">${item.description}</p>` : ""}
            </div>
            <button class="complete-button" data-id="${item.id}" type="button" aria-label="${done ? "Mark open" : "Mark complete"}"></button>
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
    const item = listEl.querySelector(`[data-id="${id}"]`);
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

  const item = listEl.querySelector(`[data-id="${id}"]`);
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

markAllUnreadButton.addEventListener("click", async () => {
  state.progress = {};
  saveProgress();
  render();

  if (supabaseClient && state.user) {
    setAccountStatus("Syncing...");
    const { error } = await supabaseClient
      .from("user_progress")
      .delete()
      .eq("user_id", state.user.id);
    setAccountStatus(
      error ? `Cleared on this device, but sync failed: ${error.message}` : "Progress synced.",
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
  if (!supabaseClient) return;
  setAccountStatus("Signing out...");
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setAccountStatus(error.message, true);
    return;
  }
  state.progress = {};
  saveProgress();
  render();
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
  const item = listEl.querySelector(`[data-id="${state.swipeStart.id}"]`);
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
