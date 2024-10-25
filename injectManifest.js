const link = document.createElement("link");
link.rel = "manifest";
link.href = `data:application/json;base64,${btoa(JSON.stringify(manifest))}`;

document.head.appendChild(link);
