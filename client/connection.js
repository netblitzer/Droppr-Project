const parse = (xhr, content) => {
  /*const res = JSON.parse(xhr.response);

  if (res['message']) {
    content.innerHTML += `<p>Message: ${res.message} </p>`;
  } else if (res['users']) {
    content.innerHTML += `<p>${JSON.stringify(res.users)} </p>`;
  }*/
};

const handleResponse = (xhr, parseResponse) => {

  switch(xhr.status) {
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

const sendGet = () => {
  const getAction = userForm.querySelector('#urlField').value;
  const getMethod = userForm.querySelector('#methodSelect').value;

  const xhr = new XMLHttpRequest();
  xhr.open(getMethod, getAction);
  xhr.setRequestHeader('Accept', 'application/json');

  if (getMethod === 'head') {
    xhr.onload = () => handleResponse(xhr, false);
  } else {
    xhr.onload = () => handleResponse(xhr, true);
  }

  xhr.send();

  e.preventDefault();
  return false;
};

const sendPost = (e, postObject) => {
  
  const postObj = JSON.stringify(postObject);
  
  console.dir(postObj);
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/newPost');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr, true);
  
  xhr.send(postObj);
  
  e.preventDefault();
  return false;
};
