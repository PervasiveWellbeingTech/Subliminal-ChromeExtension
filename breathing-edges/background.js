var user;

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  // Wait for message from web
  console.log(request.messageFromBTWebHost);
  let hr = request.messageFromBTWebHost[0];
  let br = request.messageFromBTWebHost[1];
  // Update enabled var
  chrome.storage.sync.get(['enabled', 'adaptive'], function(result) {
      if(result.adaptive == true){
        if(result.enabled == false && hr > 75) {
          chrome.storage.sync.set({
              enabled: true
          });
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
          });
        } else if (result.enabled == true && hr <= 75){
          chrome.storage.sync.set({
              enabled: false
          });
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
          });
        }
      }
  });
});
