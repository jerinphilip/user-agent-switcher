// options.js (Manifest V2)

const SEED = {
  intercepts : {
    "web.whatsapp.com" : "ff/135",
    "www.supermonitoring.com" : "ff-android/135",
    "www.whatismybrowser.com" : "ff-android/135"
  },

  deref : {
    "ff/135" :
        "Mozilla/5.0 (X11; Linux i686; rv:135.0) Gecko/20100101 Firefox/135.0",
    "ff-android/135" :
        "Mozilla/5.0 (Android 15; Mobile; rv:135.0) Gecko/135.0 Firefox/135.0"
  }
};

const CONFIG_KEY = 'ua_switcher_config';

function Config(intercepts, deref) {
  const config = {};
  config[CONFIG_KEY] = {
    "intercepts" : intercepts, //
    "deref" : deref            //
  };
  console.log(config);
  return config;
}

const debug = {
  success : function(item) { console.log("display:", item); },
  error : function(error) { console.log("error:", error); }
};

function restoreDefaults() {
  const config = Config(SEED.intercepts, SEED.deref);
  browser.storage.sync.set(config).then(debug.success, debug.error);
}

// On first run, ensure the values are added.
// No need if instantiated.
function firstRun(item) {
  debug.success("firstRun item:", item);
  if (item.intercepts != null) {
    restoreDefaults();
  }
};

browser.storage.sync.get(CONFIG_KEY).then(firstRun, debug.error);

function render(site, config) {
  console.log(config);
  const intercepts = config.intercepts;
  const deref = config.deref;

  const userAgentRef = intercepts[site];
  const userAgent = deref[userAgentRef];

  const lhs = document.createElement("div");
  lhs.classList.add("col-5");

  const rhs = document.createElement("div");
  rhs.classList.add("col-5");

  const label = document.createElement("a");
  label.setAttribute("href", 'http://' + site);
  label.innerHTML = site;

  const tag = document.createElement("span");
  tag.classList.add("badge");
  tag.classList.add("badge-light");
  tag.innerHTML = ' ' + userAgentRef;

  const pre = document.createElement("pre");
  pre.innerHTML = userAgent;
  pre.style.display = 'none';

  const ref = document.createElement("button");
  ref.classList.add("button-primary");
  ref.textContent = "Expand";
  ref.addEventListener('click', () => {
    const before = pre.style.display;
    const after = (before == 'none') ? 'block' : 'none';
    pre.style.display = after;
    console.log(`toggling ${before} -> ${after}`);
  });

  // Attach a delete button
  const remove = document.createElement('button');
  remove.classList.add('button-error');
  remove.textContent = 'Delete';
  remove.addEventListener('click', () => {
    delete intercepts[site];
    const payload = Config(intercepts, deref);
    browser.storage.sync.set(payload, loadUserAgents);
  });

  lhs.appendChild(label);
  lhs.append(tag);
  lhs.appendChild(pre);

  rhs.appendChild(ref);
  rhs.appendChild(remove);

  const item = document.createElement('div');
  item.classList.add("row");
  item.appendChild(lhs);
  item.appendChild(rhs);

  return item;
}

function loadUserAgents() {
  browser.storage.sync.get(CONFIG_KEY, (result) => {
    console.log(result);
    const config = result[CONFIG_KEY];
    const intercepts = config.intercepts;
    const defer = config.defer;

    const userAgentsList = document.getElementById('userAgentsList');
    userAgentsList.innerHTML = '';
    const housing = document.createElement("div");
    housing.classList.add("col-12");
    for (const site in intercepts) {
      const item = render(site, config);
      housing.appendChild(item);
    }
    userAgentsList.appendChild(housing);
  });
}

loadUserAgents();

// Form user-agent
const userAgentInput = document.getElementById('userAgentInput');
const userAgentLabelAdd = document.getElementById('userAgentLabelAdd');
const userAgentAdd = document.getElementById('userAgentAdd');

userAgentAdd.addEventListener('click', () => {
  const userAgent = userAgentInput.value.trim();
  const label = userAgentLabelAdd.value.trim();
  if (label && userAgent) {
    browser.storage.sync.get(CONFIG, (result) => {
      const deref = result[CONFIG_KEY].deref;
      const intercepts = result[CONFIG_KEY].intercepts;

      deref[label] = userAgent;
      const payload = Config(intercepts, defer);

      browser.storage.sync.set(payload, loadUserAgents);
      userAgentLabelAdd.value = '';
      userAgentInputAdd.value = '';
    });
  }
});

const userAgentLabelRule = document.getElementById('userAgentLabelRule');
const siteInput = document.getElementById('siteInput');
const ruleAdd = document.getElementById('ruleAdd');
ruleAdd.addEventListener('click', () => {
  const site = siteInput.value.trim();
  const label = userAgentLabelRule.value.trim();
  if (site && label) {
    browser.storage.sync.get(CONFIG_KEY, (result) => {
      const intercepts = result[CONFIG_KEY].intercepts;
      const deref = result[CONFIG_KEY].deref;
      intercepts[site] = label;
      const payload = Config(intercepts, deref);

      browser.storage.sync.set(payload, loadUserAgents);
      siteInput.value = '';
      userAgentLabelRule.value = '';
    });
  }
});

const restoreDefaultsButton = document.getElementById("restoreDefaults");
restoreDefaultsButton.addEventListener('click', function() {
  restoreDefaults();
  loadUserAgents();
});
