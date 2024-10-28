const manifest = {
  name: "GitHub",
  short_name: "GitHub",
  start_url: "https://github.com",
  display: "minimal-ui",
  display_override: ["tabbed"],
  tabstrip: {
    home_tab: {
      scope_patterns:
        // This should be configurable
        [{ pathname: "pulls" }],
    },
  },
  icons: [
    {
      sizes: "114x114",
      src: "https://github.githubassets.com/assets/apple-touch-icon-114x114-09ce42d3ca4b.png",
      purpose: "any",
    },
    {
      sizes: "120x120",
      src: "https://github.githubassets.com/assets/apple-touch-icon-120x120-92bd46d04241.png",
      purpose: "any",
    },
    {
      sizes: "144x144",
      src: "https://github.githubassets.com/assets/apple-touch-icon-144x144-b882e354c005.png",
      purpose: "any",
    },
    {
      sizes: "152x152",
      src: "https://github.githubassets.com/assets/apple-touch-icon-152x152-5f777cdc30ae.png",
      purpose: "any",
    },
    {
      sizes: "180x180",
      src: "https://github.githubassets.com/assets/apple-touch-icon-180x180-a80b8e11abe2.png",
      purpose: "any",
    },
    {
      sizes: "57x57",
      src: "https://github.githubassets.com/assets/apple-touch-icon-57x57-22f09f5b3a64.png",
      purpose: "any",
    },
    {
      sizes: "60x60",
      src: "https://github.githubassets.com/assets/apple-touch-icon-60x60-19037ac897bf.png",
      purpose: "any",
    },
    {
      sizes: "72x72",
      src: "https://github.githubassets.com/assets/apple-touch-icon-72x72-e090c8a282d0.png",
      purpose: "any",
    },
    {
      sizes: "76x76",
      src: "https://github.githubassets.com/assets/apple-touch-icon-76x76-a4523d80afb4.png",
      purpose: "any",
    },
    {
      src: "https://github.githubassets.com/assets/app-icon-192-bcc967ab9829.png",
      type: "image/png",
      sizes: "192x192",
      purpose: "any maskable",
    },
    {
      src: "https://github.githubassets.com/assets/app-icon-512-7f9c4ff2e960.png",
      type: "image/png",
      sizes: "512x512",
      purpose: "any maskable",
    },
  ],
};
