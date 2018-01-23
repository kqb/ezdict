'use strict';
const EXTENSION_NAME = "EZ_DICT";

// chrome.storage.local.clear();

// just as an example
// saveDict("Naver Korean", "http://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=%s");
// saveDict("Jisho Japanese", "http://jisho.org/search/%s");
// saveDict("HK Yahoo Chinese", "https://hk.dictionary.yahoo.com/dictionary?p=%s");
load();

document.getElementById("add-dictionary").addEventListener("submit", function(e){
  e.preventDefault();

  save();
});


/*
* Save a new entry
*/
function save() {
  var name = document.getElementById('name').value;
  var url = document.getElementById('url').value;
  document.getElementById('save').disabled = true;

  saveDict(name, url, function(){
    document.getElementById('add-dictionary').reset();
    document.getElementById('save').disabled = false;

    console.log("Finished creating");
  });
}

/*
* Save a dictionary entry
* Given name, url and a callback function, which is called after the entry is saved
*/
function saveDict(name, url, callback){
  chrome.storage.local.get(null, function(r){
    // We get previous saved entries, if they exist
    let results = (r && r[EXTENSION_NAME])? JSON.parse(r[EXTENSION_NAME]) : [];

    // We will save what's inside the store object
    let store = {};

    store[EXTENSION_NAME] = results;
    store[EXTENSION_NAME].push({ "name": name, "url": url }); // Add a new entry
    store[EXTENSION_NAME] = JSON.stringify(store[EXTENSION_NAME]); // Let's make it a string, as the garbage collector sometimes randomly erases our arrays

    // save the stringified array
    chrome.storage.local.set(store, function() {
      // after it's saved, let's load all entries again
      load();
      // tell background.js that we have to update contextMenu entries
      chrome.runtime.sendMessage({ type: "UPDATE_ENTRIES_IN_CONTEXT_MENU" });

      callback();
    });

  });
}


/*
* Load all dictionary entries from chrome.storage.local and show them on the
* appropriate place
*
* The format for the stored dictionaries is like:
* {
*   "EZ_DICT": '[{ name: "website_1", url: "http://example.com",{ name: "website_2", url:"http://www.google.com"}]';
* }
* Important! "EZ_DICT" is an array of objects STRINGFIED
*/
function load() {
  chrome.storage.local.get(null, function(r) {
    console.log("r when loading NULL");
    console.log(r);

    // For the first time we use the extension, r is null, so we initialize to []
    // Otherwise, we parse
    let results = (r && r[EXTENSION_NAME])? JSON.parse(r[EXTENSION_NAME]) : [];
    displayAllDictEntries(results);
  });
}


/*
* Given an array of dictionary entries, display all of them
*/
function displayAllDictEntries(entries){
  // clear previous entries
  document.getElementById("dictionaries").innerHTML = '';

  entries.forEach(function (entry){
    displaySingleDictEntry(entry);
  });
}

/*
* Given a dictionary entry, display it on the appropriate place
*/
function displaySingleDictEntry(entry) {
  let name = entry.name;
  let url = entry.url;
  let normalizedName = "dict_" + name.replace(" ", "_");

  var node = document.createElement("li");
  node.innerHTML = 'Name: ' + name + '<br/> URL: ' + url + " <span style='color:red' id="+ normalizedName + ">&#10006;</span>";
  document.getElementById("dictionaries").appendChild(node);

  //REMOVE
  document.getElementById(normalizedName).addEventListener("click", function(){
    chrome.storage.local.get(null, function(r){
      // We get previous saved entries, if they exist
      let results = (r && r[EXTENSION_NAME])? JSON.parse(r[EXTENSION_NAME]) : [];

      // We will save what's inside the store object
      let store = {};

      store[EXTENSION_NAME] = results.filter(function(dict){
        // Remove the clicked one
        if (dict.url === url){ return false; }
        else return true;
      });

      store[EXTENSION_NAME] = JSON.stringify(store[EXTENSION_NAME]); // Let's make it a string, as the garbage collector sometimes randomly erases our arrays

      // save the stringified array
      chrome.storage.local.set(store, function() {
        // after it's saved, let's load all entries again
        load();
        // tell background.js that we have to update contextMenu entries
        chrome.runtime.sendMessage({ type: "UPDATE_ENTRIES_IN_CONTEXT_MENU" });

        if (callback) callback();
      });

    });
  });

}
