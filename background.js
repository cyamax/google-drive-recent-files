chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getRecentFiles") {
      // Google Docs、スライド、スプレッドシートの URL を含む正規表現でフィルタリング
      const urlPattern = /https:\/\/docs.google.com\//; 
      chrome.history.search({
        'text': '', // 空文字列を指定してすべての履歴を取得
        'startTime': 0, 
        'maxResults': 20 
      }, function(historyItems) {
        const files = [];
        let lastUrl = ""; // 直前に追加した URL を保存する変数
  
        historyItems.forEach(item => {
            if (urlPattern.test(item.url)) {
              // URL から引数を削除
              const urlWithoutParams = new URL(item.url).origin + new URL(item.url).pathname;
      
              if (urlWithoutParams !== lastUrl) {
                files.push({
                  name: item.title,
                  webViewLink: item.url
                });
                lastUrl = urlWithoutParams;
              }
            }
        });
  
        sendResponse({ files: files });
      });
  
      return true; 
    }
  });