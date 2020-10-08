function requestPage() {
  //Request and process article content.
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      const { id: tabId } = tabs[0].url;
      let code = `var result = document.querySelectorAll(
        'div[class*="StoryBodyCompanionColumn"], div[data-testid="photoviewer-children"]'
      );var resulthtml = [];for (var i = 0; i < result.length; i++) {resulthtml.push(result[i].outerHTML);};resulthtml;`;
      chrome.tabs.executeScript(tabId, { code }, function (result) {
        filterPage(result[0]);
      });
    }
  );
}

//var arr = [];for (var i = result.length; i--; arr.unshift(result[i]));
function filterPage(result) {
  // result has the return value from `code`
  if (result) {
    //Break article text into pieces.
    var articlePieces = result;
    //Create paragraphs from content.
    var content = "";
    for (var i = 0; i < articlePieces.length; i++) {
      //Filter dead expand buttons.
      if (articlePieces[i].indexOf("<svg") !== -1) {
        articlePieces[i] = articlePieces[i].replace(/((<svg)(.*?)>)/g, " ");
      }
      //Filter empty image space.
      if (articlePieces[i].indexOf('<div style="visibility: hidden;' !== -1)) {
        articlePieces[i] = articlePieces[i].replace(
          /((<div style="visibility: hidden;)(.*?))/g,
          '<div style="visibility: hidden; height:0px;'
        );
      }
      //Filter duplicate images.
      if (
        articlePieces[i].indexOf(
          '<div data-testid="photoviewer-overlay"' !== -1
        )
      ) {
        articlePieces[i] = articlePieces[i].replace(
          /((<div data-testid="photoviewer-overlay")(.*?)>)/g,
          ""
        );
      }
      //Filter videos.
      if (articlePieces[i].indexOf("<video" !== -1)) {
        articlePieces[i] = articlePieces[i].replace(
          /((<video)(.*?)>)/g,
          "<p><br/>Videos cannot be displayed yet on this extension.<br/></p>"
        );
      }
      var insert = "<p>" + articlePieces[i] + "</p>";
      var content = content + insert;
    }

    //Send results
    displayPage(result);
  } else {
    var alternate =
      "<p>Try again when you're being paywalled on a New York Times article!</p>";
    displaypage(alternate);
  }
}

//Send article content to popup.html
function displayPage(results) {
  articleBody = results;
  document.querySelector("#root").innerHTML = results;
}

requestPage();
