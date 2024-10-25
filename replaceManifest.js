console.log("look for manifest.");
for (const child of document.head.children) {
  console.log(child.tagName);
  if (child.tagName == "LINK") {
    console.log("GOT LINK");
    if (child.rel == "manifest") {
      console.log("GOT IT");
      document.head.removeChild(child);
      break;
    }
  }
}

console.log("DONE");

const link = document.createElement("link");
link.rel = "manifest";
link.href = `data:application/json;base64,${btoa(JSON.stringify(manifest))}`;

document.head.appendChild(link);
