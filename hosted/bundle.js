'use strict';

var init = function init() {
  UIinit();
  cardsInit();

  sendGet(null, 'HEAD');
};

window.onload = init;
'use strict';

// Basic response handler
var handleResponse = function handleResponse(xhr, method) {
  // function to be overriden for the switch case
  var func = void 0;
  switch (xhr.status) {
    case 200:
      // check if this was a HEAD request or GET
      if (method === 'HEAD') {
        // if it was a head, it means data changed and we need to reload it
        sendGet(null, 'GET');
      } else {
        // parse the cards data
        parseCards(xhr.response);
      }
      break;
    case 201:
      func = function func() {
        // display that the creation was a success
        var submitSTART = inputterWindow.querySelector('#submitSTART');
        var submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
        var submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');

        submitPROGRESS.dataset.active = 'false';
        submitSUCCESS.dataset.active = 'true';

        setTimeout(function () {
          submitSTART.dataset.active = 'true';
          submitSUCCESS.dataset.active = 'false';

          inputterWindowOpener();
        }, 2000);
      };
      func();
      break;
    case 204:
      func = function func() {
        // display that updating was a success
        var submitSTART = inputterWindow.querySelector('#submitSTART');
        var submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
        var submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');

        submitPROGRESS.dataset.active = 'false';
        submitSUCCESS.dataset.active = 'true';

        setTimeout(function () {
          submitSTART.dataset.active = 'true';
          submitSUCCESS.dataset.active = 'false';

          inputterWindowOpener();
        }, 2000);
      };
      func();
      break;
    case 304:
      //content.innerHTML = `<b>Success (HEAD)</b>`;
      // hide the refreshing box
      var refreshBox = document.querySelector('.loadBox');

      refreshBox.dataset.active = 'false';
      break;
    case 400:
      func = function func() {
        // display that the submission or update failed
        var submitSTART = inputterWindow.querySelector('#submitSTART');
        var submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
        var submitFAILED = inputterWindow.querySelector('#submitFAILED');

        submitPROGRESS.dataset.active = 'false';
        submitFAILED.dataset.active = 'true';

        setTimeout(function () {
          submitSTART.dataset.active = 'true';
          submitFAILED.dataset.active = 'false';
        }, 2000);
      };
      func();
      break;
    case 404:
      //content.innerHTML = `<b>Resource Not Found</b>`;
      break;
    case 500:
      //content.innerHTML = `<b>Internal Error</b>`;
      break;
    default:
      //content.innerHTML = `<b>Error Code not implemented by client`;
      break;
  }
};

// AJAX function for HEAD and GET methods
var sendGet = function sendGet(e, method) {
  // show that we're refreshing
  var refreshBox = document.querySelector('.loadBox');

  refreshBox.dataset.active = 'true';

  var xhr = new XMLHttpRequest();
  xhr.open(method, '/getPosts');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, method);
  };

  xhr.send();

  return false;
};

// AJAX function for POST method
var sendPost = function sendPost(e, postObject, action) {
  // stringify the object
  var postObj = JSON.stringify(postObject);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', action);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  xhr.send(postObj);

  return false;
};
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// the column objects
var columns = {
  c1: {
    count: 0,
    height: 0,
    obj: null
  },
  c2: {
    count: 0,
    height: 0,
    obj: null
  },
  c3: {
    count: 0,
    height: 0,
    obj: null
  },
  c4: {
    count: 0,
    height: 0,
    obj: null
  }
};

// basic class to hold data

var Card = function Card(_obj) {
  _classCallCheck(this, Card);

  this.object = _obj || null;
  this.top = 0;
  this.height = 0;
  this.imageSrc = null;
  this.ref = '';
};

// find the document columns


var cardsInit = function cardsInit() {
  columns.c1.obj = document.querySelector('#c1');
  columns.c2.obj = document.querySelector('#c2');
  columns.c3.obj = document.querySelector('#c3');
  columns.c4.obj = document.querySelector('#c4');
};

// function that parses a list of cards into new html cards
var parseCards = function parseCards(cardList) {
  var cards = JSON.parse(cardList).posts;
  var keys = Object.keys(cards);

  console.dir(cards);
  //console.dir(keys);

  // reset the columns
  columns.c1.obj.innerHTML = '';
  columns.c2.obj.innerHTML = '';
  columns.c3.obj.innerHTML = '';
  columns.c4.obj.innerHTML = '';

  columns.c1.height = 0;
  columns.c2.height = 0;
  columns.c3.height = 0;
  columns.c4.height = 0;

  columns.c1.count = 0;
  columns.c2.count = 0;
  columns.c3.count = 0;
  columns.c4.count = 0;

  var num = 0;

  // create a new card for each image and attach callbacks to append them

  var _loop = function _loop(i) {

    var c = new Card(cards[keys[i]]);
    c.image = new Image();
    c.ref = keys[i];

    c.image.src = c.object.link;
    c.image.onload = function (e) {
      // check to see if all the images have loaded yet or not
      num++;
      if (num === keys.length) {
        var refreshBox = document.querySelector('.loadBox');

        refreshBox.dataset.active = 'false';
      }

      // add the new card to the display
      c.imageSrc = c.image.src;
      var ratio = c.image.height / c.image.width;
      c.height = 288 * ratio;
      addCard(c);
    };
  };

  for (var i = 0; i < keys.length; i++) {
    _loop(i);
  }
};

// function to create the html needed for a new card
var htmlCard = function htmlCard(height, top, obj) {

  var outerCard = document.createElement('div');
  outerCard.className = 'card';
  outerCard.style.top = top + 'px';

  // set up the innards of the card
  var innerCard = document.createElement('div');
  innerCard.className = 'card-interior';
  innerCard.dataset.reference = obj.ref;
  outerCard.appendChild(innerCard);
  var cardImageContainer = document.createElement('div');
  cardImageContainer.className = 'card-image-container';
  var cardImage = document.createElement('img');
  cardImage.className = 'card-image';
  cardImage.src = obj.imageSrc;
  var cardInfo = document.createElement('div');
  cardInfo.className = 'card-info';
  innerCard.appendChild(cardImageContainer);
  innerCard.appendChild(cardInfo);
  cardImageContainer.appendChild(cardImage);

  cardImage.style.height = height;
  innerCard.style.height = height + 120;

  var cardTitle = document.createElement('div');
  cardTitle.className = 'card-title';
  var title = document.createElement('h4');
  title.innerHTML = obj.object.title;
  cardTitle.appendChild(title);

  var cardUser = document.createElement('div');
  cardUser.className = 'card-user';
  var user = document.createElement('p');
  user.innerHTML = obj.object.username;
  cardUser.appendChild(user);

  var cardDesc = document.createElement('div');
  cardDesc.className = 'card-desc';
  var desc = document.createElement('p');
  desc.innerHTML = obj.object.description;
  cardDesc.appendChild(desc);

  var cardDate = document.createElement('div');
  cardDate.className = 'card-date';
  var d = new Date(obj.object.time);
  var date = document.createElement('p');
  date.innerHTML = d.toDateString();
  cardDate.appendChild(date);

  // append everything
  cardInfo.appendChild(cardTitle);
  cardInfo.appendChild(cardUser);
  cardInfo.appendChild(cardDesc);
  cardInfo.appendChild(cardDate);

  innerCard.onclick = function (e) {
    updateWindow(e, obj.object);
  };

  return outerCard;
};

var addCard = function addCard(c) {
  var newCard = c;
  var h = newCard.height;

  // find out which column is currently the shortest
  if (columns.c1.height <= columns.c2.height) {
    if (columns.c1.height <= columns.c3.height) {
      if (columns.c1.height <= columns.c4.height) {
        // add to the first column
        var html = htmlCard(h, columns.c1.height, newCard);

        columns.c1.obj.appendChild(html);
        columns.c1.height += h + 152;
        columns.c1.count++;
      } else {
        // add to the fourth column
        var _html = htmlCard(h, columns.c4.height, newCard);

        columns.c4.obj.appendChild(_html);
        columns.c4.height += h + 152;
        columns.c4.count++;
      }
    } else if (columns.c3.height <= columns.c4.height) {
      // add to the third column
      var _html2 = htmlCard(h, columns.c3.height, newCard);

      columns.c3.obj.appendChild(_html2);
      columns.c3.height += h + 152;
      columns.c3.count++;
    } else {
      // add to the fourth column
      var _html3 = htmlCard(h, columns.c4.height, newCard);

      columns.c4.obj.appendChild(_html3);
      columns.c4.height += h + 152;
      columns.c4.count++;
    }
  } else if (columns.c2.height <= columns.c3.height) {
    if (columns.c2.height <= columns.c4.height) {
      // add to the second column
      var _html4 = htmlCard(h, columns.c2.height, newCard);

      columns.c2.obj.appendChild(_html4);
      columns.c2.height += h + 152;
      columns.c2.count++;
    } else {
      // add to the fourth column
      var _html5 = htmlCard(h, columns.c4.height, newCard);

      columns.c4.obj.appendChild(_html5);
      columns.c4.height += h + 152;
      columns.c4.count++;
    }
  } else {
    if (columns.c3.height <= columns.c4.height) {
      // add to the third column
      var _html6 = htmlCard(h, columns.c3.height, newCard);

      columns.c3.obj.appendChild(_html6);
      columns.c3.height += h + 152;
      columns.c3.count++;
    } else {
      // add to the fourth column
      var _html7 = htmlCard(h, columns.c4.height, newCard);

      columns.c4.obj.appendChild(_html7);
      columns.c4.height += h + 152;
      columns.c4.count++;
    }
  }
};
'use strict';

// Attaches all the event handlers to the buttons on the screen
var UIinit = function UIinit() {
  // find all the objects
  var dropButton = document.querySelector('#dropLinkButton');
  var refreshButton = document.querySelector('#refreshButton');

  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterCancel = inputterWindow.querySelector('#cancelSubmitLink');
  var inputterSubmit = inputterWindow.querySelector('#submitLink');
  var inputterClose = inputterWindow.querySelector('.closeButton');
  var inputterFind = inputterWindow.querySelector('#linkFind');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');

  // attach handlers
  dropButton.onclick = inputterWindowOpener;
  inputterCancel.onclick = inputterWindowOpener;
  inputterClose.onclick = inputterWindowOpener;

  inputterTitle.onfocus = inputterTitleHideErrors;
  inputterTitle.onblur = inputterTitleCheck;

  inputterLink.onfocus = inputterLinkHideErrors;
  inputterLink.onblur = inputterLinkCheck;

  inputterFind.onclick = inputterLinkParse;

  inputterSubmit.onclick = inputterParse;

  // call back for the refresh button to send parameters
  refreshButton.onclick = function (e) {
    sendGet(e, 'HEAD');
  };
};

// function for opening and closing the inputter window
var inputterWindowOpener = function inputterWindowOpener() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var blackOut = document.querySelector('#blackOutDiv');

  // open the window
  if (blackOut.dataset.active === 'false') {
    inputterWindow.dataset.active = 'true';
    blackOut.dataset.active = 'true';

    inputterWindowReset();
  } else {
    // close the window
    inputterWindow.dataset.active = 'false';
    blackOut.dataset.active = 'false';
  }
};

// opens the submission window as an updater window
var updateWindow = function updateWindow(e, selection) {
  inputterWindowOpener();

  // find the objects
  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');
  var inputterPreview = inputterWindow.querySelector('#imagePreview');
  var newTopbar = inputterWindow.querySelector('#newLinkBar');
  var updateTopbar = inputterWindow.querySelector('#updateLinkBar');

  // set the top bar
  newTopbar.dataset.active = 'false';
  updateTopbar.dataset.active = 'true';

  // set all the values to what they are on the object
  inputterLink.value = selection.link;
  inputterTitle.value = selection.title;
  inputterDesc.value = selection.desc;
  inputterPreview.src = selection.link;

  if (inputterName.value === 'Anonymous') {
    inputterName.value = '';
  } else {
    inputterName.value = selection.username;
  }

  // attach the reference so we know what object was clicked
  updateTopbar.dataset.reference = e.target.dataset.reference;
};

// function for resetting the inputter window when open/closed
var inputterWindowReset = function inputterWindowReset() {
  // find the objects
  var inputterWindow = document.querySelector('#inputterWindow');
  var newTopbar = inputterWindow.querySelector('#newLinkBar');
  var updateTopbar = inputterWindow.querySelector('#updateLinkBar');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');
  var inputterPreview = inputterWindow.querySelector('#imagePreview');
  var failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');

  var submitSTART = inputterWindow.querySelector('#submitSTART');
  var submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
  var submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');
  var submitFAILED = inputterWindow.querySelector('#submitFAILED');

  // reset all the inputs
  inputterLink.value = '';
  inputterTitle.value = '';
  inputterDesc.value = '';
  inputterName.value = '';
  inputterPreview.src = '';

  newTopbar.dataset.active = 'true';
  updateTopbar.dataset.active = 'false';

  // hide all the error warnings
  failedSubmission.dataset.active = 'false';

  submitSTART.dataset.active = 'true';
  submitPROGRESS.dataset.active = 'false';
  submitSUCCESS.dataset.active = 'false';
  submitFAILED.dataset.active = 'false';

  inputterTitleHideErrors();
  inputterLinkHideErrors();
};
// function to hide title error
var inputterTitleHideErrors = function inputterTitleHideErrors() {
  // hide the title errors
  var inputterWindow = document.querySelector('#inputterWindow');
  var titleMissing = inputterWindow.querySelector('#errorTitle');

  titleMissing.dataset.active = 'false';
};
// function to hide link errors
var inputterLinkHideErrors = function inputterLinkHideErrors() {
  // find all the link objects
  var inputterWindow = document.querySelector('#inputterWindow');
  var link = inputterWindow.querySelector('#link');
  var linkMissing = inputterWindow.querySelector('#errorLinkMissing');
  var linkBroken = inputterWindow.querySelector('#errorLinkBroken');

  var linkFindSTART = inputterWindow.querySelector('#linkFindSTART');
  var linkFindPROGRESS = inputterWindow.querySelector('#linkFindPROGRESS');
  var linkFindSUCCESS = inputterWindow.querySelector('#linkFindSUCCESS');
  var linkFindFAILED = inputterWindow.querySelector('#linkFindFAILED');
  // reset them all
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';

  linkFindSTART.dataset.active = 'true';
  linkFindPROGRESS.dataset.active = 'false';
  linkFindSUCCESS.dataset.active = 'false';
  linkFindFAILED.dataset.active = 'false';
};
// function to see if the link entered is a valid image
var inputterLinkParse = function inputterLinkParse(complete) {
  // if comp=true, we will send a submit
  var comp = complete;
  // find all the link objects
  var inputterWindow = document.querySelector('#inputterWindow');
  var link = inputterWindow.querySelector('#link');

  var linkFindSTART = inputterWindow.querySelector('#linkFindSTART');
  var linkFindPROGRESS = inputterWindow.querySelector('#linkFindPROGRESS');
  var linkFindSUCCESS = inputterWindow.querySelector('#linkFindSUCCESS');
  var linkFindFAILED = inputterWindow.querySelector('#linkFindFAILED');

  var linkMissing = inputterWindow.querySelector('#errorLinkMissing');
  var linkBroken = inputterWindow.querySelector('#errorLinkBroken');

  var imagePreview = inputterWindow.querySelector('#imagePreview');
  // reset them
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';

  linkFindSTART.dataset.active = 'false';
  linkFindPROGRESS.dataset.active = 'true';
  linkFindSUCCESS.dataset.active = 'false';
  linkFindFAILED.dataset.active = 'false';

  // create an image and set its source
  var image = new Image();

  image.src = link.value;

  // if the image loads, it was a success and we can send the submission
  image.onload = function (e) {
    imagePreview.src = image.src;

    linkFindSUCCESS.dataset.active = 'true';
    linkFindPROGRESS.dataset.active = 'false';

    // UI timeout to give a sense of what's going on
    setTimeout(function () {
      linkFindSTART.dataset.active = 'true';
      linkFindSUCCESS.dataset.active = 'false';
    }, 2000);

    if (comp === true) {
      inputterSubmit(e);
    }
  };

  // if the image failed to load, cancel the submission
  image.onerror = function (e) {
    linkBroken.dataset.active = 'true';

    linkFindFAILED.dataset.active = 'true';
    linkFindPROGRESS.dataset.active = 'false';

    // UI timeout to give a sense of what's going on
    setTimeout(function () {
      linkFindSTART.dataset.active = 'true';
      linkFindFAILED.dataset.active = 'false';
    }, 2000);

    if (comp === true) {
      inputterFailed();
    }
  };
};

// function to check if there is a link and to show an error if there isn't
var inputterLinkCheck = function inputterLinkCheck() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var link = inputterWindow.querySelector('#link');
  var linkMissing = inputterWindow.querySelector('#errorLinkMissing');
  var linkBroken = inputterWindow.querySelector('#errorLinkBroken');

  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';

  if (link.value === '') {
    linkMissing.dataset.active = 'true';

    return false;
  }
  return true;
};
// function to check if there is a title and to show an error if there isn't
var inputterTitleCheck = function inputterTitleCheck() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var title = inputterWindow.querySelector('#linkTitle');
  var titleMissing = inputterWindow.querySelector('#errorTitle');

  titleMissing.dataset.active = 'false';

  if (linkTitle.value === '') {
    titleMissing.dataset.active = 'true';

    return false;
  }

  return true;
};

// function to check if the total input is valid
var inputterParse = function inputterParse() {
  // find objects
  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');
  var inputterPreview = inputterWindow.querySelector('#imagePreview');
  var failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');

  var submitSTART = inputterWindow.querySelector('#submitSTART');
  var submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
  var submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');
  var submitFAILED = inputterWindow.querySelector('#submitFAILED');

  var passed = true;

  failedSubmission.dataset.active = 'false';

  submitSTART.dataset.active = 'false';
  submitPROGRESS.dataset.active = 'true';
  submitSUCCESS.dataset.active = 'false';
  submitFAILED.dataset.active = 'false';

  // check to see if there's required information missing
  passed = inputterLinkCheck();
  passed = inputterTitleCheck();

  // if everything is there, check to see if the link is valid
  // if it is, we'll then go and submit, otherwise the submission will fail
  if (passed) {
    inputterLinkParse(true);
  } else {
    failedSubmission.dataset.active = 'true';

    submitPROGRESS.dataset.active = 'false';
    submitFAILED.dataset.active = 'true';

    // UI timeout to give a sense of what's going on
    setTimeout(function () {
      submitSTART.dataset.active = 'true';
      submitFAILED.dataset.active = 'false';
    }, 2000);
  }
};

// function to show that submission failed
var inputterFailed = function inputterFailed() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');

  failedSubmission.dataset.active = 'true';
};

// submission function
// packages all the inputs into a single object and then sends it
// to the server to be posted
var inputterSubmit = function inputterSubmit(e) {

  var action = '/newPost';

  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');
  var updateTopbar = inputterWindow.querySelector('#updateLinkBar');

  var time = new Date().getTime();

  // put together the object to send the data to the server
  var sendObj = {
    link: inputterLink.value,
    title: inputterTitle.value,
    time: time
  };

  // fill out data if it's missing
  if (inputterDesc.value !== '') {
    sendObj.description = inputterDesc.value;
  }

  sendObj.username = inputterName.value || 'Anonymous';

  // see if we're updating or not
  if (updateTopbar.dataset.active === 'true') {
    action = '/updatePost';
    sendObj.ref = updateTopbar.dataset.reference;
  }

  //console.dir(sendObj);

  // send the post request
  sendPost(e, sendObj, action);
};
