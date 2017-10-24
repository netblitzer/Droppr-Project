const http = require('http');
const url = require('url');
// const query = require('querystring'); never used
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// switch case for handling the GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/media/main.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/bundle.js') {
    htmlHandler.getJS(request, response);
  } else if (parsedUrl.pathname === '/getPosts') {
    jsonHandler.getPosts(request, response, parsedUrl);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// method of handling POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/newPost' || parsedUrl.pathname === '/updatePost') {
    const res = response;

    // get the sent data from the request
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // when it's sent, parse it
    request.on('end', () => {
      const sentObj = JSON.parse(Buffer.concat(body).toString());

      if (parsedUrl.pathname === '/newPost') {
        jsonHandler.newPost(request, res, sentObj);
      } else {
        jsonHandler.updatePost(request, res, sentObj);
      }
    });
  } else {
    jsonHandler.notFound(request, response);
  }
};

// method for handling HEAD requests
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getPosts') {
    jsonHandler.getPostsMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};


// method for handling what we do when we get a request
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
