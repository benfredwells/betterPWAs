const ENABLED_ICON = "./images/icon48.png";
const NEEDS_CSP_DISABLED_ICON = "./images/iconBlue48.png";
const NEEDS_RELOAD_ICON = "./images/iconRed48.png";
const CSP_DISABLED_ICON = "./images/iconRed48.png";
const DISABLED_ICON = "./images/iconDisabled48.png";

const ENABLED_TEXT = "Better PWA: Manifest updated";
const NEEDS_CSP_DISABLED_TEXT =
  "Better PWA: Replacement manifest available; click to disable CSP";
const NEEDS_RELOAD_TEXT =
  "Better PWA: CSP Disabled: reload page to replace manifest";
const CSP_DISABLED_TEXT = "Better PWA: CSP Disabled; manifest replaced";
const DISABLED_TEXT = "Better PWA: No betterment available";

const NEXT_ID_KEY = "nextNetRequestId";
const RULE_KEY_PREFIX = "netRequestRule";
const REPLACED_TABS_PREFIX = "replacedTabs";

const handledSites = [
  {
    url: "https://www.smh.com.au",
  },
  {
    url: "https://app.slack.com",
  },
  {
    url: "https://github.com",
    needsCSPDisabled: true,
    js: ["manifests/github.com.js", "replaceManifest.js"],
    matches: ["https://github.com/*"],
  },
];

async function getHasTabBeenReplaced(url, tabId) {
  const tabsKey = `${REPLACED_TABS_PREFIX}${url}`;
  const values = await chrome.storage.session.get(tabsKey);
  if (values && values[tabsKey] !== undefined) {
    const tabs = values[tabsKey];
    return tabs.includes(tabId);
  }

  return false;
}

async function setTabBasBeenReplaced(url, tabId) {
  const tabsKey = `${REPLACED_TABS_PREFIX}${url}`;
  const values = await chrome.storage.session.get(tabsKey);
  let tabs;
  if (values && values[tabsKey] !== undefined) {
    tabs = values[tabsKey];
  } else {
    tabs = [];
  }
  tabs.push(tabId);
  values[tabsKey] = tabs;
  chrome.storage.session.set(values);
}

async function clearReplacedTabs(url) {
  const tabsKey = `${REPLACED_TABS_PREFIX}${url}`;
  const values = await chrome.storage.session.get(tabsKey);
  const tabs = [];
  values[tabsKey] = tabs;
  chrome.storage.session.set(values);
}

async function getRuleIdIfExists(url) {
  const ruleIdKey = `${RULE_KEY_PREFIX}${url}`;
  const value = await chrome.storage.session.get(ruleIdKey);
  if (value && value[ruleIdKey] !== undefined) {
    return value[ruleIdKey];
  }

  return null;
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

async function getNextId() {
  const value = await chrome.storage.session.get(NEXT_ID_KEY);
  let id = 1;
  if (value && value.nextNetRequestId) {
    id = Number(value.nextNetRequestId);
  }
  await chrome.storage.session.set({
    nextNetRequestId: id + 1,
  });
  return id;
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

function enableContentScript(url, matches, js) {
  chrome.scripting.registerContentScripts([
    {
      id: url,
      js,
      persistAcrossSessions: false,
      matches,
      runAt: "document_end",
    },
  ]);
}

function disableCSPBlock(id) {
  const numberId = Number(id);
  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [numberId],
  });
}

function disableContentScript(url) {
  chrome.scripting.unregisterContentScripts({
    ids: [url],
  });
}

function siteForTab(tab) {
  return handledSites.find((site) => tab.url.startsWith(site.url));
}

chrome.action.onClicked.addListener((tab) => {
  const site = siteForTab(tab);
  if (site && site.needsCSPDisabled) {
    getRuleIdIfExists(site.url).then((id) => {
      if (id !== null) {
        disableCSPBlock(id);
        disableContentScript(site.url);
        clearRuleId(site.url);
        clearReplacedTabs(site.url);
        updateForTab(tab, "NEEDS_CSP_DISABLED");
      } else {
        getNextId().then((id) => {
          console.log(`storing ${id}`);
          setRuleId(site.url, id);
          enableCSPBlock(site.url, id);
          enableContentScript(site.url, site.matches, site.js);
          updateForTab(tab, "NEEDS_RELOAD");
        });
      }
    });
  }
});

function setBadgeIconAndTitle(iconPath, title, tabId) {
  chrome.action.setIcon({ path: { 48: iconPath }, tabId });
  chrome.action.setTitle({ title, tabId });
}

function updateForTab(tab, updateTo) {
  const site = siteForTab(tab);
  if (site) {
    if (site.needsCSPDisabled) {
      if (updateTo !== undefined) {
        switch (updateTo) {
          case "NEEDS_CSP_DISABLED":
            setBadgeIconAndTitle(
              NEEDS_CSP_DISABLED_ICON,
              NEEDS_CSP_DISABLED_TEXT,
              tab.id
            );
            return;
          case "NEEDS_RELOAD":
            setBadgeIconAndTitle(NEEDS_RELOAD_ICON, NEEDS_RELOAD_TEXT, tab.id);
            return;
          case "CSP_DISABLED":
            setBadgeIconAndTitle(CSP_DISABLED_ICON, CSP_DISABLED_TEXT, tab.id);
            return;
        }
      }
      getRuleIdIfExists(site.url).then((id) => {
        if (id) {
          getHasTabBeenReplaced(site.url, tab.id).then((replaced) => {
            if (!replaced) {
              setBadgeIconAndTitle(
                NEEDS_RELOAD_ICON,
                NEEDS_RELOAD_TEXT,
                tab.id
              );
              return;
            }
            setBadgeIconAndTitle(CSP_DISABLED_ICON, CSP_DISABLED_TEXT, tab.id);
          });
          return;
        }
        setBadgeIconAndTitle(
          NEEDS_CSP_DISABLED_ICON,
          NEEDS_CSP_DISABLED_TEXT,
          tab.id
        );
      });
      return;
    }
    setBadgeIconAndTitle(ENABLED_ICON, ENABLED_TEXT, tab.id);
    return;
  }

  setBadgeIconAndTitle(DISABLED_ICON, DISABLED_TEXT, tab.id);
}

chrome.tabs.onUpdated.addListener((tabId, changedebug, tab) => {
  updateForTab(tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => updateForTab(tab));
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === "manifestInjected") {
    const site = siteForTab(sender.tab);
    setTabBasBeenReplaced(site.url, sender.tab.id);
    updateForTab(sender.tab, "CSP_DISABLED");
  }
});
