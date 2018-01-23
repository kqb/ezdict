'use strict';
const EXTENSION_NAME = "EZ_DICT";


chrome.runtime.onMessage.addListener(function (message, sender){
  if (message.type === "UPDATE_ENTRIES_IN_CONTEXT_MENU"){ init(); }
});

init();




function init(){
  chrome.storage.local.get(null, function(r) {
    let results = (r && JSON.parse(r[EXTENSION_NAME])) || [];

    // remove all context menus created by this extension
    // then create them all again
    chrome.contextMenus.removeAll(function(){
      // just as an example
      // createDictOption({ name: "Naver Korean", url: "http://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=%s"});
      // createDictOption({ name: "Jisho Japanese", url: "http://jisho.org/search/%s" });
      // createDictOption({ name: "HK Yahoo Chinese", url: "https://hk.dictionary.yahoo.com/dictionary?p=%s" });


      results.forEach(function(entry){
        createDictOption(entry);
      });
    });
  });

  addHotkeysSupport();
}

function createDictOption(entry){
  let name = entry.name;
  let url = entry.url;

  chrome.contextMenus.create({
    "title": "Translate word using " + name,
    "contexts": ["selection"],
    "onclick": function(info, tab){
      console.log("info", info);
      console.log("tab", tab);

      let selection = info.selectionText;
      let tab_index = (info.tab && info.tab.index) || tab.index; //tab.index is for firefox nightly

      chrome.tabs.create({
        url: getURLQueried(url, selection),
        index: tab_index + 1 //creates the new tab just after the current one
      }, function (tab){
        // set the new tab to be active
        chrome.tabs.update(tab.id, { active: true });
      });
      console.log("Selection ", info.selectionText);
    }
  });
}



/*
* Given an url with an "%s" and the selected text
* returns the url with the %s replaced by the text
*/
function getURLQueried(url, text){
  // TODO
  // escape html, as text could contain whitespaces etc
  return url.replace("%s", text);
}


/**
* For now only one hotkey is working (CTRL + SHIFT + E), which opens the first dictionary
*/
function addHotkeysSupport(){
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);

    if (command === "open_search_1"){
      const OPEN_NTH_DICTIONARY = 0;

      chrome.tabs.query({ currentWindow: true, active: true}, function (tabArray){
        let tab_index = tabArray[0].id;
        chrome.tabs.sendMessage(tab_index, { type: "getSelection" }, function (selection){

          chrome.storage.local.get(null, function(r) {
            let results = (r && JSON.parse(r[EXTENSION_NAME])) || [];

            if (results.length < 0) // if we don't have any dictionaries, do nothing
                return ;

            // Open the first dictionary
            let name = results[OPEN_NTH_DICTIONARY].name;
            let url = results[OPEN_NTH_DICTIONARY].url;

            chrome.tabs.create({
              url: getURLQueried(url, selection),
              index: tab_index + 1 //creates the new tab just after the current one
            }, function (tab){
              // set the new tab to be active
              chrome.tabs.update(tab.id, { active: true });
            });
          });
        });
      });

    }

  });
}
