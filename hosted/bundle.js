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
  inputterTitle.onblur = inputterTitleCheck;

  inputterLink.onfocus = inputterLinkHideErrors;
  inputterLink.onblur = inputterLinkCheck;

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

var inputterLinkParse = function inputterLinkParse(complete) {

  var comp = complete;

  var inputterWindow = document.querySelector('#inputterWindow');
  var link = inputterWindow.querySelector('#link');
  var linkMissing = inputterWindow.querySelector('#errorLinkMissing');
  var linkBroken = inputterWindow.querySelector('#errorLinkBroken');
  var imagePreview = inputterWindow.querySelector('#imagePreview');

  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';

  var image = new Image();

  image.src = link.value;

  image.onload = function (e) {
    imagePreview.src = image.src;

    if (comp === true) {
      inputterSubmit(e);
    }
  };

  image.onerror = function (e) {
    linkBroken.dataset.active = 'true';

    if (comp === true) {
      inputterFailed();
    }
  };
};

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

var inputterParse = function inputterParse() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');
  var inputterPreview = inputterWindow.querySelector('#imagePreview');
  var failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');

  var passed = true;

  failedSubmission.dataset.active = 'false';

  // check to see if there's required information missing
  passed = inputterLinkCheck();
  passed = inputterTitleCheck();

  // if everything is there, check to see if the link is valid
  // if it is, we'll then go and submit, otherwise the submission will fail
  if (passed) {
    inputterLinkParse(true);
  } else {
    failedSubmission.dataset.active = 'true';
  }
};

var inputterFailed = function inputterFailed() {

  var inputterWindow = document.querySelector('#inputterWindow');
  var failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');

  failedSubmission.dataset.active = 'true';
};

var inputterSubmit = function inputterSubmit(e) {

  var inputterWindow = document.querySelector('#inputterWindow');
  var inputterLink = inputterWindow.querySelector('#link');
  var inputterTitle = inputterWindow.querySelector('#linkTitle');
  var inputterDesc = inputterWindow.querySelector('#linkDescription');
  var inputterName = inputterWindow.querySelector('#linkUserName');

  var time = new Date().getTime();

  // put together the object to send the data to the server
  var sendObj = {
    link: inputterLink.value,
    title: inputterTitle.value,
    time: time
  };

  if (inputterDesc.value !== '') {
    sendObj.description = inputterDesc.value;
  }

  if (inputterName.value !== '') {
    sendObj.username = inputterName.value;
  }

  sendPost(e, sendObj);
};
'use strict';

var parse = function parse(xhr, content) {
  /*const res = JSON.parse(xhr.response);
    if (res['message']) {
    content.innerHTML += `<p>Message: ${res.message} </p>`;
  } else if (res['users']) {
    content.innerHTML += `<p>${JSON.stringify(res.users)} </p>`;
  }*/
};

var handleResponse = function handleResponse(xhr, parseResponse) {

  switch (xhr.status) {
    case 200:
      //content.innerHTML = `<b>Success</b>`;
      break;
    case 201:
      //content.innerHTML = `<b>Create</b>`;
      break;
    case 204:
      //content.innerHTML = `<b>Updated</b>`;
      break;
    case 304:
      //content.innerHTML = `<b>Success (HEAD)</b>`;
      break;
    case 400:
      //content.innerHTML = `<b>Bad Request</b>`;
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

  if (parseResponse) {
    parse(xhr, content);
  }
};

var sendGet = function sendGet() {
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

var sendPost = function sendPost(e, postObject) {

  var postObj = JSON.stringify(postObject);

  console.dir(postObj);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/newPost');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  xhr.send(postObj);

  e.preventDefault();
  return false;
};
