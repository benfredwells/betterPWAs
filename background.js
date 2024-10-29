const handledSites = [
  {
    url: "https://www.smh.com.au",
    icon: "./images/icon48.png",
    title: "Better PWA: Manifest injected",
  },
  {
    url: "https://github.com",
    icon: "./images/iconBlue48.png",
    title: "Better PWA: Click to disable CSP",
  },
];

function updateForTab(tab) {
  let done = false;
  handledSites.forEach((site) => {
    if (tab.url.startsWith(site.url)) {
      chrome.action.setIcon({ path: { 48: site.icon } });
      chrome.action.setTitle({ title: site.title });
      done = true;
    }
  });
  if (!done) {
    chrome.action.setIcon({ path: { 48: "./images/iconDisabled48.png" } });
    chrome.action.setTitle({ title: "Better PWA: No betterment available" });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changedebug, tab) => {
  updateForTab(tab);
});

chrome.tabs.onActivated.addListener((activedebug) => {
  chrome.tabs.get(activedebug.tabId).then((tab) => updateForTab(tab));
});
