const manifest = {
  name: "Canva",
  id: "better-pwa/www.canva.com",
  short_name: "Canva",
  start_url: "https://www.canva.com/",
  scope: "https://www.canva.com/",
  display: "standalone",
  display_override: ["tabbed"],
  tab_strip: {
    home_tab: {
      scope_patterns: [{ pathname: "/" }],
    },
  },
  theme_color: "#00C4CC",
  background_color: "#ffffff",
  icons: [
    {
      sizes: "192x192",
      src: "https://static.canva.com/domain-assets/canva/static/images/android-192x192-2.png",
      type: "image/png",
      purpose: "any",
    },
    {
      sizes: "180x180",
      src: "https://static.canva.com/domain-assets/canva/static/images/apple-touch-180x180-1.png",
      type: "image/png",
      purpose: "any",
    },
  ],
};
