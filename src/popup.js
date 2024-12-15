'use strict';

import './input.css';
import './popup.css';

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
        iconId = "docs.svg";
      } else if (/spreadsheets/.test(file.webViewLink)) {
        iconId = "sheets.svg";
      } else if (/presentation/.test(file.webViewLink)) {
        iconId = "slides.svg";
      } else if (/forms/.test(file.webViewLink)) {
        iconId = "forms.svg";
      } else if (/drive/.test(file.webViewLink)) {
        iconId = "folder.svg";
      } else {
        iconId = "folder.svg"; // それ以外のファイルのアイコンのパス
      }

      const historyItemHTML = `<a href="${file.webViewLink}" target="_blank">
          <div class="history-item">
            <span class="highlight" title="many times">${boldFlag}</span>
            <img class="file-icon" src="icons/${iconId}">
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
  tab.addEventListener('mouseenter', () => {
    // アクティブなタブのスタイルを削除
    document.querySelector('.tab.active').classList.remove('active');
    // マウスオーバーされたタブをアクティブに
    tab.classList.add('active');
    
    // タブのIDに基づいてファイル一覧を更新
    switch(tab.id) {
      case 'getFilesButton_all':
        getRecentFiles(0);
        break;
      case 'getFilesButton_folder':
        getRecentFiles(1);
        break;
      case 'getFilesButton_docs':
        getRecentFiles(2);
        break;
      case 'getFilesButton_sheets':
        getRecentFiles(3);
        break;
      case 'getFilesButton_slides':
        getRecentFiles(4);
        break;
    }
  });
});

// 初回起動時
getRecentFiles(0)
