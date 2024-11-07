for (const child of document.head.children) {
  if (child.tagName == "LINK") {
    if (child.rel == "manifest") {
      document.head.removeChild(child);
      break;
    }
  }
}

const promises = [];
for (icon of manifest.icons) {
  if (icon.src.startsWith("chrome-extension://")) {
    promises.push(
      fetch(icon.src)
        .then((response) => response.blob())
        .then((blob) => {
          return new Promise(function (resolve, reject) {
            const reader = new FileReader();

            reader.onloadend = function () {
              resolve(reader.result);
            };

            reader.readAsDataURL(blob);
          });
        })
        .then((dataUrl) => {
          icon.src = dataUrl;
        })
    );
  }
}

Promise.all(promises).then(() => {
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = `data:application/json;base64,${btoa(JSON.stringify(manifest))}`;

  document.head.appendChild(link);
});
