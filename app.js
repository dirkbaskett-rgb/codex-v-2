const RESORTS = [
  {
    id: "alta",
    name: "Alta",
    country: "USA",
    state: "Utah",
    region: "Wasatch",
    location: "Alta, Utah",
    nearby: "Salt Lake City",
    blurb: "Legendary powder laps and a strong storm-day reputation in Little Cottonwood Canyon."
  },
  {
    id: "aspen-snowmass",
    name: "Aspen Snowmass",
    country: "USA",
    state: "Colorado",
    region: "Central Rockies",
    location: "Aspen Snowmass, Colorado",
    nearby: "Aspen",
    blurb: "Four mountains, polished logistics, and one of the deepest all-around destination experiences on the pass."
  },
  {
    id: "banff-sunshine",
    name: "Banff Sunshine",
    country: "Canada",
    state: "Alberta",
    region: "Canadian Rockies",
    location: "Banff, Alberta",
    nearby: "Banff",
    blurb: "Big alpine terrain above treeline with a national-park setting that makes every photo look expensive."
  },
  {
    id: "big-sky",
    name: "Big Sky",
    country: "USA",
    state: "Montana",
    region: "Northern Rockies",
    location: "Big Sky, Montana",
    nearby: "Bozeman",
    blurb: "Sprawling terrain and a classic big-mountain feel with room to spread out even on popular weekends."
  },
  {
    id: "grand-targhee",
    name: "Grand Targhee",
    country: "USA",
    state: "Wyoming",
    region: "Tetons",
    location: "Alta, Wyoming",
    nearby: "Driggs",
    blurb: "A favorite for powder consistency, tree skiing, and a lower-key base area across the Tetons from Jackson."
  },
  {
    id: "jackson-hole",
    name: "Jackson Hole",
    country: "USA",
    state: "Wyoming",
    region: "Tetons",
    location: "Teton Village, Wyoming",
    nearby: "Jackson",
    blurb: "A bucket-list stop for steeps, tram laps, and the kind of terrain that makes you ski with intention."
  },
  {
    id: "lake-louise",
    name: "Lake Louise",
    country: "Canada",
    state: "Alberta",
    region: "Canadian Rockies",
    location: "Lake Louise, Alberta",
    nearby: "Banff",
    blurb: "Huge views, long frontside cruisers, and easy pairing with Banff Sunshine on the same trip."
  },
  {
    id: "marmot-basin",
    name: "Marmot Basin",
    country: "Canada",
    state: "Alberta",
    region: "Canadian Rockies",
    location: "Jasper, Alberta",
    nearby: "Jasper",
    blurb: "A quieter Jasper basecamp option with a relaxed feel and strong road-trip potential."
  },
  {
    id: "panorama",
    name: "Panorama",
    country: "Canada",
    state: "British Columbia",
    region: "Interior BC",
    location: "Panorama, British Columbia",
    nearby: "Invermere",
    blurb: "A ski-in, ski-out village with fast laps and a strong destination-resort setup in the Purcells."
  },
  {
    id: "revelstoke",
    name: "Revelstoke",
    country: "Canada",
    state: "British Columbia",
    region: "Interior BC",
    location: "Revelstoke, British Columbia",
    nearby: "Revelstoke",
    blurb: "Massive vertical, serious powder appeal, and one of the most compelling storm-chasing bases in the west."
  },
  {
    id: "snowbasin",
    name: "Snowbasin",
    country: "USA",
    state: "Utah",
    region: "Wasatch",
    location: "Huntsville, Utah",
    nearby: "Ogden",
    blurb: "Easy access, polished lodges, and terrain variety that makes it an easy group-trip sell."
  },
  {
    id: "snowbird",
    name: "Snowbird",
    country: "USA",
    state: "Utah",
    region: "Wasatch",
    location: "Snowbird, Utah",
    nearby: "Salt Lake City",
    blurb: "Steep, snowy, and unapologetically focused on advanced terrain in Little Cottonwood Canyon."
  },
  {
    id: "sugar-bowl",
    name: "Sugar Bowl",
    country: "USA",
    state: "California",
    region: "Sierra Nevada",
    location: "Norden, California",
    nearby: "Truckee",
    blurb: "A compact Sierra classic with strong local energy and a great fit for Tahoe-based weekends."
  },
  {
    id: "sun-peaks",
    name: "Sun Peaks",
    country: "Canada",
    state: "British Columbia",
    region: "Interior BC",
    location: "Sun Peaks, British Columbia",
    nearby: "Kamloops",
    blurb: "A friendly village setup with broad intermediate terrain and a dependable base for mixed-ability groups."
  },
  {
    id: "sun-valley",
    name: "Sun Valley",
    country: "USA",
    state: "Idaho",
    region: "Intermountain West",
    location: "Ketchum, Idaho",
    nearby: "Hailey",
    blurb: "Groomer heaven with a polished town scene and a classic destination feel."
  },
  {
    id: "taos",
    name: "Taos Ski Valley",
    country: "USA",
    state: "New Mexico",
    region: "Southern Rockies",
    location: "Taos Ski Valley, New Mexico",
    nearby: "Taos",
    blurb: "A distinctive high-desert ski trip with expert terrain, hike-to options, and a style all its own."
  }
];

const STORAGE_KEY = "powder-passport-state-v1";

const elements = {
  resortGrid: document.querySelector("#resortGrid"),
  resortTemplate: document.querySelector("#resortCardTemplate"),
  searchInput: document.querySelector("#searchInput"),
  regionFilter: document.querySelector("#regionFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  sortFilter: document.querySelector("#sortFilter"),
  resultsLabel: document.querySelector("#resultsLabel"),
  totalResorts: document.querySelector("#totalResorts"),
  visitedResorts: document.querySelector("#visitedResorts"),
  wishlistResorts: document.querySelector("#wishlistResorts"),
  plannedResorts: document.querySelector("#plannedResorts"),
  installButton: document.querySelector("#installButton"),
  resetButton: document.querySelector("#resetButton")
};

const defaultState = RESORTS.reduce((state, resort) => {
  state[resort.id] = { status: "untracked", favorite: false, notes: "" };
  return state;
}, {});

let trackerState = loadState();
let installPrompt = null;

populateRegionFilter();
bindControls();
render();
registerServiceWorker();

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return structuredClone(defaultState);
    }

    const parsed = JSON.parse(stored);

    return Object.fromEntries(
      RESORTS.map((resort) => [
        resort.id,
        {
          ...defaultState[resort.id],
          ...(parsed[resort.id] ?? {})
        }
      ])
    );
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
}

function populateRegionFilter() {
  const regions = [...new Set(RESORTS.map((resort) => resort.region))].sort();
  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    elements.regionFilter.append(option);
  });
}

function bindControls() {
  const rerenderEvents = ["input", "change"];

  rerenderEvents.forEach((eventName) => {
    elements.searchInput.addEventListener(eventName, render);
    elements.regionFilter.addEventListener(eventName, render);
    elements.statusFilter.addEventListener(eventName, render);
    elements.sortFilter.addEventListener(eventName, render);
  });

  elements.resetButton.addEventListener("click", () => {
    trackerState = structuredClone(defaultState);
    saveState();
    render();
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    elements.installButton.hidden = false;
  });

  elements.installButton.addEventListener("click", async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    installPrompt = null;
    elements.installButton.hidden = true;
  });
}

function render() {
  const resorts = getFilteredResorts();
  const nodes = resorts.length
    ? resorts.map(createResortCard)
    : [createEmptyState()];

  elements.resortGrid.replaceChildren(...nodes);
  renderSummary(resorts.length);
}

function getFilteredResorts() {
  const searchValue = elements.searchInput.value.trim().toLowerCase();
  const regionValue = elements.regionFilter.value;
  const statusValue = elements.statusFilter.value;
  const sortValue = elements.sortFilter.value;

  const filtered = RESORTS.filter((resort) => {
    const tracker = trackerState[resort.id];
    const haystack = [
      resort.name,
      resort.country,
      resort.state,
      resort.region,
      resort.location,
      tracker.notes
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchValue || haystack.includes(searchValue);
    const matchesRegion = regionValue === "all" || resort.region === regionValue;
    const matchesStatus =
      statusValue === "all" || tracker.status === statusValue;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const sorters = {
    name: (a, b) => a.name.localeCompare(b.name),
    region: (a, b) =>
      a.region.localeCompare(b.region) || a.name.localeCompare(b.name),
    state: (a, b) =>
      a.state.localeCompare(b.state) || a.name.localeCompare(b.name),
    status: (a, b) =>
      trackerState[a.id].status.localeCompare(trackerState[b.id].status) ||
      Number(trackerState[b.id].favorite) - Number(trackerState[a.id].favorite) ||
      a.name.localeCompare(b.name)
  };

  return filtered.sort(sorters[sortValue]);
}

function renderSummary(filteredCount) {
  const statuses = Object.values(trackerState);
  elements.totalResorts.textContent = String(RESORTS.length);
  elements.visitedResorts.textContent = String(
    statuses.filter((item) => item.status === "visited").length
  );
  elements.wishlistResorts.textContent = String(
    statuses.filter((item) => item.status === "wishlist").length
  );
  elements.plannedResorts.textContent = String(
    statuses.filter((item) => item.status === "planned").length
  );
  elements.resultsLabel.textContent = `${filteredCount} resort${filteredCount === 1 ? "" : "s"} showing`;
}

function createEmptyState() {
  const message = document.createElement("article");
  message.className = "resort-card";
  message.innerHTML = `
    <div>
      <p class="resort-card__country">No matches</p>
      <h3 class="resort-card__name">Try widening the filters.</h3>
    </div>
    <p class="resort-card__blurb">Search by state, nearby town, or region, or clear the status filter to bring the full pass list back.</p>
  `;
  return message;
}

function createResortCard(resort) {
  const tracker = trackerState[resort.id];
  const node = elements.resortTemplate.content.firstElementChild.cloneNode(true);

  node.querySelector(".resort-card__country").textContent = resort.country;
  node.querySelector(".resort-card__name").textContent = resort.name;
  node.querySelector(".resort-card__location").textContent = `${resort.location} · ${resort.state}`;
  node.querySelector(".resort-card__blurb").textContent = resort.blurb;
  node.querySelector(".resort-card__region").textContent = resort.region;
  node.querySelector(".resort-card__nearby").textContent = resort.nearby;

  const favoriteButton = node.querySelector(".favorite-toggle");
  favoriteButton.classList.toggle("is-active", tracker.favorite);
  favoriteButton.textContent = tracker.favorite ? "★" : "☆";
  favoriteButton.addEventListener("click", () => {
    trackerState[resort.id].favorite = !trackerState[resort.id].favorite;
    saveState();
    render();
  });

  const statusSelect = node.querySelector(".status-select");
  statusSelect.value = tracker.status;
  statusSelect.addEventListener("change", (event) => {
    trackerState[resort.id].status = event.target.value;
    saveState();
    render();
  });

  const notesInput = node.querySelector(".notes-input");
  notesInput.value = tracker.notes;
  notesInput.addEventListener("change", (event) => {
    trackerState[resort.id].notes = event.target.value.trim();
    saveState();
    render();
  });

  return node;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Silent fallback keeps the tracker usable even if SW registration fails.
    });
  });
}
