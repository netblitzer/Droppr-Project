// Attaches all the event handlers to the buttons on the screen
const UIinit = () => {
  // find all the objects
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
  
  // call back for the refresh button to send parameters
  refreshButton.onclick = (e) => {    
    sendGet(e, 'HEAD');
  };
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

// opens the submission window as an updater window
const updateWindow = (e, selection) => {
  inputterWindowOpener();
  
  // find the objects
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
    const inputterPreview = inputterWindow.querySelector('#imagePreview');
    const newTopbar = inputterWindow.querySelector('#newLinkBar');
    const updateTopbar = inputterWindow.querySelector('#updateLinkBar');
  
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
}

// function for resetting the inputter window when open/closed
const inputterWindowReset = () => {
  // find the objects
  const inputterWindow = document.querySelector('#inputterWindow');
    const newTopbar = inputterWindow.querySelector('#newLinkBar');
    const updateTopbar = inputterWindow.querySelector('#updateLinkBar');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
    const inputterPreview = inputterWindow.querySelector('#imagePreview');
    const failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');
  
    const submitSTART = inputterWindow.querySelector('#submitSTART');
    const submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
    const submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');
    const submitFAILED = inputterWindow.querySelector('#submitFAILED');
  
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
const inputterTitleHideErrors = () => {
  // hide the title errors
  const inputterWindow = document.querySelector('#inputterWindow');
    const titleMissing = inputterWindow.querySelector('#errorTitle');
  
  titleMissing.dataset.active = 'false';
};
// function to hide link errors
const inputterLinkHideErrors = () => {
  // find all the link objects
  const inputterWindow = document.querySelector('#inputterWindow');
    const link = inputterWindow.querySelector('#link');
    const linkMissing = inputterWindow.querySelector('#errorLinkMissing');
    const linkBroken = inputterWindow.querySelector('#errorLinkBroken');
  
    const linkFindSTART = inputterWindow.querySelector('#linkFindSTART');
    const linkFindPROGRESS = inputterWindow.querySelector('#linkFindPROGRESS');
    const linkFindSUCCESS = inputterWindow.querySelector('#linkFindSUCCESS');
    const linkFindFAILED = inputterWindow.querySelector('#linkFindFAILED');
  // reset them all
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';
  
  linkFindSTART.dataset.active = 'true';
  linkFindPROGRESS.dataset.active = 'false';
  linkFindSUCCESS.dataset.active = 'false';
  linkFindFAILED.dataset.active = 'false';
};
// function to see if the link entered is a valid image
const inputterLinkParse = (complete) => {
  // if comp=true, we will send a submit
  const comp = complete;
  // find all the link objects
  const inputterWindow = document.querySelector('#inputterWindow');
    const link = inputterWindow.querySelector('#link');
  
    const linkFindSTART = inputterWindow.querySelector('#linkFindSTART');
    const linkFindPROGRESS = inputterWindow.querySelector('#linkFindPROGRESS');
    const linkFindSUCCESS = inputterWindow.querySelector('#linkFindSUCCESS');
    const linkFindFAILED = inputterWindow.querySelector('#linkFindFAILED');
  
    const linkMissing = inputterWindow.querySelector('#errorLinkMissing');
    const linkBroken = inputterWindow.querySelector('#errorLinkBroken');
  
    const imagePreview = inputterWindow.querySelector('#imagePreview');
  // reset them
  linkMissing.dataset.active = 'false';
  linkBroken.dataset.active = 'false';
  
  linkFindSTART.dataset.active = 'false';
  linkFindPROGRESS.dataset.active = 'true';
  linkFindSUCCESS.dataset.active = 'false';
  linkFindFAILED.dataset.active = 'false';
  
  // create an image and set its source
  const image = new Image();

  image.src = link.value;
  
  // if the image loads, it was a success and we can send the submission
  image.onload = (e) => {
    imagePreview.src = image.src;
    
    linkFindSUCCESS.dataset.active = 'true';
    linkFindPROGRESS.dataset.active = 'false';
    
    // UI timeout to give a sense of what's going on
    setTimeout(() => {
      linkFindSTART.dataset.active = 'true';
      linkFindSUCCESS.dataset.active = 'false';
    }, 2000);
    
    if (comp === true) {
      inputterSubmit(e);
    }
  };
  
  // if the image failed to load, cancel the submission
  image.onerror = (e) => {
    linkBroken.dataset.active = 'true';
    
    linkFindFAILED.dataset.active = 'true';
    linkFindPROGRESS.dataset.active = 'false';
    
    // UI timeout to give a sense of what's going on
    setTimeout(() => {
      linkFindSTART.dataset.active = 'true';
      linkFindFAILED.dataset.active = 'false';
    }, 2000);
    
    if (comp === true) {
      inputterFailed();
    }
  };
};

// function to check if there is a link and to show an error if there isn't
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
// function to check if there is a title and to show an error if there isn't
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

// function to check if the total input is valid
const inputterParse = () => {
  // find objects
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
    const inputterPreview = inputterWindow.querySelector('#imagePreview');
    const failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');
  
    const submitSTART = inputterWindow.querySelector('#submitSTART');
    const submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
    const submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');
    const submitFAILED = inputterWindow.querySelector('#submitFAILED');
  
  let passed = true;
  
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
    setTimeout(() => {
      submitSTART.dataset.active = 'true';
      submitFAILED.dataset.active = 'false';
    }, 2000);
  }
};

// function to show that submission failed
const inputterFailed = () => {
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const failedSubmission = inputterWindow.querySelector('#errorFailedSubmission');
  
  failedSubmission.dataset.active = 'true';
  
};

// submission function
// packages all the inputs into a single object and then sends it
// to the server to be posted
const inputterSubmit = (e) => {
  
  let action = '/newPost';
  
  const inputterWindow = document.querySelector('#inputterWindow');
    const inputterLink = inputterWindow.querySelector('#link');
    const inputterTitle = inputterWindow.querySelector('#linkTitle');
    const inputterDesc = inputterWindow.querySelector('#linkDescription');
    const inputterName = inputterWindow.querySelector('#linkUserName');
    const updateTopbar = inputterWindow.querySelector('#updateLinkBar');
  
  const time = new Date().getTime();
  
  // put together the object to send the data to the server
  const sendObj = {
    link: inputterLink.value,
    title: inputterTitle.value,
    time,
  };
  
  // fill out data if it's missing
  if (inputterDesc.value !== '') {
    sendObj.description = inputterDesc.value;
  }
  
  sendObj.username = inputterName.value || 'Anonymous';
  
  // see if we're updating or not
  if (updateTopbar.dataset.active === 'true') {
    action = '/updatePost'
    sendObj.ref = updateTopbar.dataset.reference;
  }
  
  //console.dir(sendObj);
  
  // send the post request
  sendPost(e, sendObj, action);
};