chrome.runtime.sendMessage({ action: "getRecentFiles" }, function(response) {
  if (response.error) {
    document.getElementById("fileList").innerHTML = "<li>" + response.error + "</li>";
    return;
  }

  const fileList = document.getElementById("fileList");
  response.files.forEach(file => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = file.webViewLink;
    a.textContent = file.name;
    a.target = "_blank";
    li.appendChild(a);
    fileList.appendChild(li);
  });
});