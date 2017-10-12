'use strict';

var parse = function parse(xhr, content) {
  var res = JSON.parse(xhr.response);

  if (res['message']) {
    content.innerHTML += '<p>Message: ' + res.message + ' </p>';
  } else if (res['users']) {
    content.innerHTML += '<p>' + JSON.stringify(res.users) + ' </p>';
  }
};

var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#content');

  switch (xhr.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      content.innerHTML = '<b>Create</b>';
      break;
    case 204:
      content.innerHTML = '<b>Updated</b>';
      break;
    case 304:
      content.innerHTML = '<b>Success</b>';
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 401:
      content.innerHTML = '<b>Unauthorized</b>';
      break;
    case 403:
      content.innerHTML = '<b>Forbidden</b>';
      break;
    case 404:
      content.innerHTML = '<b>Resource Not Found</b>';
      break;
    case 500:
      content.innerHTML = '<b>Internal Error</b>';
      break;
    case 501:
      content.innerHTML = '<b>Not Implemented</b>';
      break;
    default:
      content.innerHTML = '<b>Error Code not implemented by client';
      break;
  }

  if (parseResponse) {
    parse(xhr, content);
  }
};

var sendGet = function sendGet(e, top) {
  var getAction = userForm.querySelector('#urlField').value;
  var getMethod = userForm.querySelector('#methodSelect').value;

  var xhr = new XMLHttpRequest();
  xhr.open(getMethod, getAction);
  xhr.setRequestHeader('Accept', 'application/json');

  if (getMethod === 'head') {
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  } else {
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  }

  xhr.send();

  e.preventDefault();
  return false;
};

var sendPost = function sendPost(e, nameForm) {
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');
  var nameField = nameForm.querySelector('#nameField');
  var ageField = nameForm.querySelector('#ageField');

  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  var formData = 'name=' + nameField.value + '&age=' + ageField.value;

  xhr.send(formData);

  e.preventDefault();
  return false;
};
'use strict';

// Attaches all the event handlers to the buttons on the screen
var UIinit = function UIinit() {
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
  inputterTitle.onblur = inputterTitleParse;

  inputterLink.onfocus = inputterLinkHideErrors;
  inputterLink.onblur = inputterLinkParse;

  inputterFind.onclick = inputterLinkParse;

  inputterSubmit.onclick = inputterParse;
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

// function for resetting the inputter window when open/closed
var inputterWindowReset = function inputterWindowReset() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');
  var inputterPreview = inputterWindow.querySelector('#imagePreview');

  inputterLink.value = '';
  inputterTitle.value = '';
  inputterDesc.value = '';
  inputterName.value = '';
  inputterPreview.backgroundImage = '';

  inputterTitleHideErrors();
  inputterLinkHideErrors();
};

var inputterTitleHideErrors = function inputterTitleHideErrors() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var titleMissing = inputterWindow.querySelector('#errorTitle');

  titleMissing.dataset.active = 'false';
};

var inputterLinkHideErrors = function inputterLinkHideErrors() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var link = inputterWindow.querySelector('#link');
  var linkMissing = inputterWindow.querySelector('#errorLinkMissing');
  var linkBroken = inputterWindow.querySelector('#errorLinkBroken');

  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';
};

var inputterLinkParse = function inputterLinkParse() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var link = inputterWindow.querySelector('#link');
  var linkMissing = inputterWindow.querySelector('#errorLinkMissing');
  var linkBroken = inputterWindow.querySelector('#errorLinkBroken');

  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';

  if (link.value === '') {
    linkMissing.dataset.active = 'true';
  } else {
    var image = new Image();

    image.src = link.value;
    image.onload = function () {
      return inputterLinkCheck(linkBroken, image);
    };

    //console.dir(image);
  }
};

var inputterLinkCheck = function inputterLinkCheck(linkBroken, image) {
  console.dir(image);
};

var inputterTitleParse = function inputterTitleParse() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var title = inputterWindow.querySelector('#linkTitle');
  var titleMissing = inputterWindow.querySelector('#errorTitle');

  titleMissing.dataset.active = 'false';

  if (linkTitle.value === '') {
    titleMissing.dataset.active = 'true';
  }
};

var inputterParse = function inputterParse() {};
"use strict";

var init = function init() {
  UIinit();

  //const nameForm = document.querySelector('#nameForm');
  //const userForm = document.querySelector('#userForm');
  //
  //const addUser = (e) => sendPost(e, nameForm);
  //const getUsers = (e) => sendGet(e, userForm);
  //
  //userForm.addEventListener('submit', getUsers);;
  //nameForm.addEventListener('submit', addUser);;
};

window.onload = init;
