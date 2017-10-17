// Attaches all the event handlers to the buttons on the screen
const UIinit = () => {
  const dropButton = document.querySelector('#dropLinkButton');
  const refreshButton = document.querySelector('#refreshButton');
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterCancel = inputterWindow.querySelector('#cancelSubmitLink');
    const inputterSubmit = inputterWindow.querySelector('#submitLink');
    const inputterClose = inputterWindow.querySelector('.closeButton');
    const inputterFind = inputterWindow.querySelector('#linkFind');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
  
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
const inputterWindowOpener = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
  const blackOut = document.querySelector('#blackOutDiv');
  
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
const inputterWindowReset = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
    const inputterPreview = inputterWindow.querySelector('#imagePreview');
  
  inputterLink.value = '';
  inputterTitle.value = '';
  inputterDesc.value = '';
  inputterName.value = '';
  inputterPreview.backgroundImage = '';
  
  inputterTitleHideErrors();
  inputterLinkHideErrors();
};

const inputterTitleHideErrors = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const titleMissing = inputterWindow.querySelector('#errorTitle');
  
  titleMissing.dataset.active = 'false';
};

const inputterLinkHideErrors = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const link = inputterWindow.querySelector('#link');
    const linkMissing = inputterWindow.querySelector('#errorLinkMissing');
    const linkBroken = inputterWindow.querySelector('#errorLinkBroken');
  
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';
};

const inputterLinkParse = (complete) => {
  
  const comp = complete;
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const link = inputterWindow.querySelector('#link');
    const linkMissing = inputterWindow.querySelector('#errorLinkMissing');
    const linkBroken = inputterWindow.querySelector('#errorLinkBroken');
    const imagePreview = inputterWindow.querySelector('#imagePreview');
  
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';
  
  const image = new Image();

  image.src = link.value;
  
  image.onload = (e) => {
    imagePreview.src = image.src;
    
    if (comp === true) {
      inputterSubmit(e);
    }
  }
  
  image.onerror = (e) => {
    linkBroken.dataset.active = 'true';
    
    if (comp === true) {
      inputterFailed();
    }
  }
};

const inputterLinkCheck = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const link = inputterWindow.querySelector('#link');
    const linkMissing = inputterWindow.querySelector('#errorLinkMissing');
    const linkBroken = inputterWindow.querySelector('#errorLinkBroken');
  
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';
  
  if (link.value === '') {
    linkMissing.dataset.active = 'true';
    
    return false;
  }
  
  return true;
};

const inputterTitleCheck = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const title = inputterWindow.querySelector('#linkTitle');
    const titleMissing = inputterWindow.querySelector('#errorTitle');
  
  titleMissing.dataset.active = 'false';
  
  if (linkTitle.value === '') {
    titleMissing.dataset.active = 'true';
    
    return false;
  }
  
  return true;
};

const inputterParse = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
    const inputterPreview = inputterWindow.querySelector('#imagePreview');
    const failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');
  
  let passed = true;
  
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

const inputterFailed = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');
  
  failedSubmission.dataset.active = 'true';
  
};

const inputterSubmit = (e) => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
  
  const time = new Date().getTime();
  
  // put together the object to send the data to the server
  const sendObj = {
    link: inputterLink.value,
    title: inputterTitle.value,
    time
  };
  
  if (inputterDesc.value !== '') {
    sendObj.description = inputterDesc.value;
  }
  
  if (inputterName.value !== '') {
    sendObj.username = inputterName.value;
  }
  
  sendPost(e, sendObj);
  
};