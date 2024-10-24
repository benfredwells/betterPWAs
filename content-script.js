var link = document.createElement('link');
link.href="/manifest.json"
document.getElementsByTagName('head')[0].appendChild(link);

console.log("Added manifest link");
