function requestPage() {
  chrome.tabs.query(
    { active: !0, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (e) {
      const { id: t } = e[0].url;
      chrome.tabs.executeScript(
        t,
        {
          code:
            'var result = document.querySelectorAll(\n        \'div[class*="StoryBodyCompanionColumn"], div[data-testid="photoviewer-children"]\'\n      );var resulthtml = [];for (var i = 0; i < result.length; i++) {resulthtml.push(result[i].outerHTML);};resulthtml;',
        },
        function (e) {
          filterPage(e[0]);
        }
      );
    }
  );
}
function filterPage(e) {
  if (e.length > 0) {
    for (var t = e, i = "", n = 0; n < t.length; n++) {
      -1 !== t[n].indexOf("<svg") &&
        (t[n] = t[n].replace(/((<svg)(.*?)>)/g, " ")),
        t[n].indexOf(!0) &&
          (t[n] = t[n].replace(
            /((<div style="visibility: hidden;)(.*?))/g,
            '<div style="visibility: hidden; height:0px;'
          )),
        t[n].indexOf(!0) &&
          (t[n] = t[n].replace(
            /((<div data-testid="photoviewer-overlay")(.*?)>)/g,
            ""
          )),
        t[n].indexOf(!0) &&
          (t[n] = t[n].replace(
            /((<video)(.*?)>)/g,
            "<p><br/>Videos cannot be displayed yet on this extension.<br/></p>"
          )),
        t[n].indexOf(!0) &&
          (t[n] = t[n].replace(
            /((<div)(.*?)(data-testid="inline-message")(.*?)>)/g,
            ""
          ));
      i = i + ("<p>" + t[n] + "</p>");
    }
    let s = document.querySelector("html");
    (s.style.minHeight = "100vh"),
      (s.style.minWidth = "100vh"),
      displayPage(
        '<p style="padding: 5px; color: #111; font-family: \'Open Sans\', sans-serif; font-size: 30px; font-weight: 300; line-height: 32px; margin: 0 0 10px; text-align: center;">Note that this extension does not work well on stories with interactive graphs and "Live" stories.</p>' +
          i
      );
  } else {
    let e = document.querySelector("html");
    (e.style.maxHeight = "35px"), (e.style.minWidth = "450px");
    displayPage(
      "<p style=\"padding: 5px; color: #111; font-family: 'Open Sans', sans-serif; font-size: 30px; font-weight: 300; line-height: 32px; margin: 0 0 72px; text-align: center;\">This extension must be used on a New York Times article!</p>"
    );
  }
}
function displayPage(e) {
  (articleBody = e), (document.querySelector("#root").innerHTML = e);
}
requestPage();
