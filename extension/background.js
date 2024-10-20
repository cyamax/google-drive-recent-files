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
        let lastUrl = ""; // 直前に追加した URL を保存する変数
        // console.table(historyItems)
        historyItems.forEach(item => {
            // if (urlPattern.test(item.url)) {
            if (item.url.includes(word)) {
              // URL から引数を削除
              const urlWithoutParams = new URL(item.url).origin + new URL(item.url).pathname;
              if (urlWithoutParams !== lastUrl) {
                files.push({
                  name: item.title,
                  webViewLink: item.url,
                  lastVisitTime: item.lastVisitTime,
                  visitCount: item.visitCount
                });
                lastUrl = urlWithoutParams;
              }
            } else {
              // console.table(item)
            }
        });
  
        sendResponse({ files: files });
      });
  
      return true; 
    }
  });
