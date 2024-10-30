for (const child of document.head.children) {
  if (child.tagName == "LINK") {
    if (child.rel == "manifest") {
      document.head.removeChild(child);
      break;
    }
  }
}

const link = document.createElement("link");
link.rel = "manifest";
link.href = `data:application/json;base64,${btoa(JSON.stringify(manifest))}`;

document.head.appendChild(link);
