document.getElementById('getFilesButton_all').addEventListener('click', function() {getRecentFiles(0)});
document.getElementById('getFilesButton_folder').addEventListener('click', function() {getRecentFiles(1)});
document.getElementById('getFilesButton_docs').addEventListener('click', function() {getRecentFiles(2)});
document.getElementById('getFilesButton_sheets').addEventListener('click', function() {getRecentFiles(3)});
document.getElementById('getFilesButton_slides').addEventListener('click', function() {getRecentFiles(4)});


function getRecentFiles(fileType) {
  chrome.runtime.sendMessage({ action: "getRecentFiles", fileType: fileType }, function(response) {
    // 初期化
    document.getElementById("fileList").innerHTML = "<li></li>";
    if (response.error) {
      document.getElementById("fileList").innerHTML = "<li>" + response.error + "</li>";
      return;
    }

    const fileList = document.getElementById("fileList");
    response.files.forEach(file => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      const timeStamp = new Date(file.lastVisitTime);
      a.href = file.webViewLink;
      a.textContent = "[" + file.visitCount + "] " +timeStamp.toLocaleDateString() + " " +removeTrailingStrings(file.name);
      a.target = "_blank";

      // アイコンを追加する
      const icon = document.createElement("img");
        if (/document/.test(file.webViewLink)) {
          icon.src = "images/docs_192px.svg";
        } else if (/spreadsheets/.test(file.webViewLink)) {
          icon.src = "images/sheets_192px.svg"; 
        } else if (/presentation/.test(file.webViewLink)) {
          icon.src = "images/slides_192px.svg"; 
        } else if (/forms/.test(file.webViewLink)) {
          icon.src = "images/forms_192px.svg";
        } else if (/drive/.test(file.webViewLink)) {
          icon.src = "images/folder_192px.svg";
        } else {
          icon.src = "images/folder_192px.svg"; // それ以外のファイルのアイコンのパス
        }

      // アイコンのサイズを設定
      icon.width = 16;  // 例：幅を16pxに設定
      icon.height = 16; // 例：高さを16pxに設定

      icon.alt = file.mimeType; // アイコンの説明
      li.appendChild(icon); // アイコンをli要素に追加


      li.appendChild(a);
      fileList.appendChild(li);
    });
  });
}

function removeTrailingStrings(str) {
  const patterns = [
    " - Google ドキュメント",
    " - Google スプレッドシート",
    " - Google フォーム",
    " - Google スライド",
    " - Google ドライブ"
  ];

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    if (str.endsWith(pattern)) {
      return str.slice(0, -pattern.length);
    }
  }

  return str; // パターンに一致しない場合は元の文字列を返す
}


// 初回起動時
getRecentFiles(0)
