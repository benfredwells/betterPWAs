const manifest = {
  name: "Slack",
  id: "better-pwa/app.slack.com",
  short_name: "Slack",
  start_url: "https://app.slack.com/client",
  scope: "https://app.slack.com/",
  display: "standalone",
  icons: [
    {
      sizes: "512x512",
      src: chrome.runtime.getURL("manifests/icons/slack-512.png"),
      type: "image/png",
      purpose: "any",
    },
    {
      sizes: "144x144",
      src: chrome.runtime.getURL("manifests/icons/slack-144.png"),
      type: "image/png",
      purpose: "any",
    },
    {
      sizes: "512x512",
      src: chrome.runtime.getURL("manifests/icons/slack-512-maskable.png"),
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
