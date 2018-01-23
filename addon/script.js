browser.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if (request.type === "getSelection"){
    let selection = window.getSelection();

    if (selection){ //if the user has selected something, we send it back to background.js
      selection = selection.toString();
      sendResponse(selection);
    }
  }
});
