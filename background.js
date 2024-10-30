const handledSites = [
  {
    url: "https://www.smh.com.au",
    title: "Better PWA: Manifest injected",
  },
  {
    url: "https://github.com",
    title: "Better PWA: Click to disable CSP",
    needsCSPDisabled: true,
  },
];

const ENABLED_ICON = "./images/icon48.png";
const NEEDS_CSP_DISABLED_ICON = "./images/iconBlue48.png";
const CSP_DISABLED_ICON = "./images/iconRed48.png";
const DIABLED_ICON = "./images/iconDisabled48.png";

const NEXT_ID_KEY = "nextNetRequestId";
const RULE_KEY_PREFIX = "netRequestRule";

function getRuleIdIfExists(url, callback) {
  const ruleIdKey = `${RULE_KEY_PREFIX}${url}`;
  chrome.storage.session.get(ruleIdKey).then((value) => {
    if (value && value[ruleIdKey] !== undefined) {
      callback(value[ruleIdKey]);
    } else {
      callback(null);
    }
  });
}

function setRuleId(url, id) {
  const ruleIdKey = `${RULE_KEY_PREFIX}${url}`;
  const value = {
    [ruleIdKey]: id,
  };
  chrome.storage.session.set(value);
}

function clearRuleId(url) {
  const ruleIdKey = `${RULE_KEY_PREFIX}${url}`;
  chrome.storage.session.remove(ruleIdKey);
}

function getNextId(callback) {
  chrome.storage.session.get(NEXT_ID_KEY).then((value) => {
    let id = 2;
    if (value && value.nextNetRequestId) {
      id = Number(value.nextNetRequestId);
    }
    chrome.storage.session
      .set({
        nextNetRequestId: id + 1,
      })
      .then(callback(id));
  });
}

function enableCSPBlock(url, id) {
  console.log(`Enabling ${id} for ${url}`);
  chrome.declarativeNetRequest.updateSessionRules({
    addRules: [
      {
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "content-security-policy", operation: "remove" },
          ],
        },
        condition: {
          urlFilter: "||github.com/",
          resourceTypes: ["main_frame"],
        },
        id,
      },
    ],
  });
}

function disableCSPBlock(id) {
  const numberId = Number(id);
  console.log(`removing ${numberId}`);
  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [numberId],
  });
}

function siteForTab(tab) {
  return handledSites.find((site) => tab.url.startsWith(site.url));
}

chrome.action.onClicked.addListener((tab) => {
  const site = siteForTab(tab);
  if (site && site.needsCSPDisabled) {
    getRuleIdIfExists(site.url, (id) => {
      if (id !== null) {
        console.log("filter exists, disabling");
        disableCSPBlock(id);
        clearRuleId(site.url);
        updateForTab(tab, false);
      } else {
        console.log("not exists, enabling");
        getNextId((id) => {
          console.log(`storing ${id}`);
          setRuleId(site.url, id);
          enableCSPBlock(site.url, id);
          updateForTab(tab, true);
        });
      }
    });
  }
});

function updateForTab(tab, cspDisabled) {
  const site = siteForTab(tab);
  if (site) {
    if (site.needsCSPDisabled) {
      if (cspDisabled !== undefined) {
        chrome.action.setIcon({
          path: {
            48: cspDisabled ? CSP_DISABLED_ICON : NEEDS_CSP_DISABLED_ICON,
          },
        });
      }
      getRuleIdIfExists(site.url, (id) => {
        if (id) {
          chrome.action.setIcon({ path: { 48: CSP_DISABLED_ICON } });
          return;
        }
        chrome.action.setIcon({ path: { 48: NEEDS_CSP_DISABLED_ICON } });
      });
      return;
    }
    chrome.action.setIcon({ path: { 48: site.icon } });
    chrome.action.setTitle({ title: site.title });
    return;
  }

  chrome.action.setIcon({ path: { 48: "./images/iconDisabled48.png" } });
  chrome.action.setTitle({ title: "Better PWA: No betterment available" });
}

chrome.tabs.onUpdated.addListener((tabId, changedebug, tab) => {
  updateForTab(tab);
});

chrome.tabs.onActivated.addListener((activedebug) => {
  chrome.tabs.get(activedebug.tabId).then((tab) => updateForTab(tab));
});
