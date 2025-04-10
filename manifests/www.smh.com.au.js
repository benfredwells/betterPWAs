const manifest = {
  name: "Sydney Morning Herald",
  id: "better-pwa/www.smh.com.au",
  short_name: "SMH",
  display: "minimal-ui",
  theme_color: "#0A1633",
  background_color: "#ffffff",
  icons: [
    {
      src: "https://www.smh.com.au/apple-touch-icons/smh.png",
      sizes: "180x180",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
  start_url: window.location.href,
};
