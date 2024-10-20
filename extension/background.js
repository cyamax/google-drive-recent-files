chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getRecentFiles") {
    const searchWords = ['https://docs.google.com','https://drive.google.com','https://docs.google.com/document','https://docs.google.com/spreadsheets','https://docs.google.com/presentation']
    const word = searchWords[request.fileType]
    console.log(word)
    chrome.history.search({
      'text': word,
      'startTime': 0, 
      'maxResults': 100 
    }, function(historyItems) {
      const files = [];
      const seenUrls = new Set(); // 既に追加した URL を保存する Set

      historyItems.forEach(item => {
        if (item.url.includes(word)) {
          // URL から引数を削除
          const urlWithoutParams = new URL(item.url).origin + new URL(item.url).pathname;

          // seenUrls に URL が含まれていない場合のみ処理
          if (!seenUrls.has(urlWithoutParams)) {
            files.push({
              name: item.title,
              webViewLink: item.url,
              lastVisitTime: item.lastVisitTime,
              visitCount: item.visitCount
            });
            seenUrls.add(urlWithoutParams); // seenUrls に URL を追加
          }
        }
      });

      sendResponse({ files: files });
    });

    return true; 
  }
});