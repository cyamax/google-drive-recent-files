document.getElementById('getFilesButton_all').addEventListener('click', function() {getRecentFiles(0)});
document.getElementById('getFilesButton_folder').addEventListener('click', function() {getRecentFiles(1)});
document.getElementById('getFilesButton_docs').addEventListener('click', function() {getRecentFiles(2)});
document.getElementById('getFilesButton_sheets').addEventListener('click', function() {getRecentFiles(3)});
document.getElementById('getFilesButton_slides').addEventListener('click', function() {getRecentFiles(4)});


function getRecentFiles(fileType) {
  chrome.runtime.sendMessage({ action: "getRecentFiles", fileType: fileType }, function(response) {
    // 初期化
    document.getElementById("fileList").innerHTML = "";
    if (response.error) {
      document.getElementById("fileList").innerHTML = response.error;
      return;
    }

    const fileList = document.getElementById("fileList");
    response.files.forEach(file => {

      const timeStamp = new Date(file.lastVisitTime);
      const textContent = removeTrailingStrings(file.name);

      // アイコンを追加する
      let icon = ""
        if (/document/.test(file.webViewLink)) {
          icon = "images/docs_192px.svg";
        } else if (/spreadsheets/.test(file.webViewLink)) {
          icon = "images/sheets_192px.svg"; 
        } else if (/presentation/.test(file.webViewLink)) {
          icon = "images/slides_192px.svg"; 
        } else if (/forms/.test(file.webViewLink)) {
          icon = "images/forms_192px.svg";
        } else if (/drive/.test(file.webViewLink)) {
          icon = "images/folder_192px.svg";
        } else {
          icon = "images/folder_192px.svg"; // それ以外のファイルのアイコンのパス
        }

        const historyItemHTML = `<a href="${file.webViewLink}" target="_blank"><div class="history-item">
            <img class="file-icon doc" src="${icon}" width="20" height="20">
          <div class="file-info">
            <p class="file-name">${textContent}</p>
            
          </div>
        </div></a>`;
      fileList.insertAdjacentHTML('beforeend', historyItemHTML);
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


// タブ切り替えの実装
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // アクティブなタブのスタイルを削除
        document.querySelector('.tab.active').classList.remove('active');
        // クリックされたタブをアクティブに
        tab.classList.add('active');
        
        // ここにフィルタリングのロジックを追加
        const fileType = tab.textContent.trim();
        // console.log('Selected file type:', fileType);
        // 実際のフィルタリング処理をここに実装
    });
    });

// 初回起動時
getRecentFiles(0)
