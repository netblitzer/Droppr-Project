// Basic response handler
const handleResponse = (xhr, method) => {
  // function to be overriden for the switch case
  let func;
  switch(xhr.status) {
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
      func = () => {
        // display that the creation was a success
        const submitSTART = inputterWindow.querySelector('#submitSTART');
        const submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
        const submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');
        
        submitPROGRESS.dataset.active = 'false';
        submitSUCCESS.dataset.active = 'true';
        
        setTimeout(() => {
          submitSTART.dataset.active = 'true';
          submitSUCCESS.dataset.active = 'false';
          
          inputterWindowOpener();
        }, 2000);
      };
      func();
      break;
    case 204:
      func = () => {
        // display that updating was a success
        const submitSTART = inputterWindow.querySelector('#submitSTART');
        const submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
        const submitSUCCESS = inputterWindow.querySelector('#submitSUCCESS');
        
        submitPROGRESS.dataset.active = 'false';
        submitSUCCESS.dataset.active = 'true';
        
        setTimeout(() => {
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
      const refreshBox = document.querySelector('.loadBox');

      refreshBox.dataset.active = 'false';
      break;
    case 400:
      func = () => {
        // display that the submission or update failed
        const submitSTART = inputterWindow.querySelector('#submitSTART');
        const submitPROGRESS = inputterWindow.querySelector('#submitPROGRESS');
        const submitFAILED = inputterWindow.querySelector('#submitFAILED');
        
        submitPROGRESS.dataset.active = 'false';
        submitFAILED.dataset.active = 'true';
        
        setTimeout(() => {
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
const sendGet = (e, method) => {
  // show that we're refreshing
  const refreshBox = document.querySelector('.loadBox');

  refreshBox.dataset.active = 'true';

  const xhr = new XMLHttpRequest();
  xhr.open(method, '/getPosts');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr, method);

  xhr.send();
  
  return false;
};

// AJAX function for POST method
const sendPost = (e, postObject, action) => {
  // stringify the object
  const postObj = JSON.stringify(postObject);
    
  const xhr = new XMLHttpRequest();
  xhr.open('POST', action);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr);
  
  xhr.send(postObj);
  
  return false;
};
