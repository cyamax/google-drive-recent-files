document.getElementById('getFilesButton_all').addEventListener('click', function () { getRecentFiles(0) });
document.getElementById('getFilesButton_folder').addEventListener('click', function () { getRecentFiles(1) });
document.getElementById('getFilesButton_docs').addEventListener('click', function () { getRecentFiles(2) });
document.getElementById('getFilesButton_sheets').addEventListener('click', function () { getRecentFiles(3) });
document.getElementById('getFilesButton_slides').addEventListener('click', function () { getRecentFiles(4) });


function getRecentFiles(fileType) {
  chrome.runtime.sendMessage({ action: "getRecentFiles", fileType: fileType }, function (response) {
    // 初期化
    document.getElementById("fileList").innerHTML = "";
    if (response.error) {
      document.getElementById("fileList").innerHTML = response.error;
      return;
    }

    const threshBold = findLargest(response.files);
    const fileList = document.getElementById("fileList");
    response.files.forEach(file => {

      const timeStamp = new Date(file.lastVisitTime);
      const textContent = removeTrailingStrings(file.name);
      const boldFlag = file.visitCount > threshBold ? "↗" : "";

      // アイコンを追加する
      let iconId = ""
      if (/document/.test(file.webViewLink)) {
        iconId = "icon-doc";
      } else if (/spreadsheets/.test(file.webViewLink)) {
        iconId = "icon-sheet";
      } else if (/presentation/.test(file.webViewLink)) {
        iconId = "icon-slide";
      } else if (/forms/.test(file.webViewLink)) {
        iconId = "icon-form";
      } else if (/drive/.test(file.webViewLink)) {
        iconId = "icon-folder";
      } else {
        iconId = "icon-folder"; // それ以外のファイルのアイコンのパス
      }

      const historyItemHTML = `<a href="${file.webViewLink}" target="_blank">
          <div class="history-item">
            <span class="highlight" title="many times">${boldFlag}</span>
            <svg class="file-icon ${iconId}"><use xlink:href="sprite.svg#${iconId}" ></use></svg>
            <span class="file-name">${textContent}</span>
            <span class="access-time">${timeStamp.toLocaleDateString()}</span>
          </div>
        </a>`;
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

// 4番目に大きい数字を返す
function findLargest(arr) {
  if (arr.length < 4) {
    return 1000;
  }
  // valueプロパティの値でソート
  const sortedArr = [...arr].sort((a, b) => b.visitCount - a.visitCount);
  return sortedArr[3].visitCount;
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
