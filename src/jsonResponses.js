// Node's built-in cryptography module.
const crypto = require('crypto');

// Note this object is purely in memory
const users = {};

// sha1 is a bit of a quicker hash algorithm for insecure things
let etag = crypto.createHash('sha1').update(JSON.stringify(users));
// grab the hash as a hex string
let digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};

const newPost = (request, response, sentObj) => {
  const responseJson = {
    message: 'Created successfully',
  };
  let statusCode = 201;
  
  const obj = { };
  
  // check to see if there's a time parameter on the object
  // if there's not, then this object fails to be valid
  if (!sentObj.time) {
    
  }
  
  //if (!bodyParams.name || !bodyParams.age) {
  //  responseJson.message = 'Name and age are both required';
  //  responseJson.id = 'missingParams';
  //  statusCode = 400;
//
  //  return respondJSON(request, response, statusCode, responseJson);
  //} else if (users[bodyParams.name]) {
  //  responseJson.message = 'Updated successfully';
  //  statusCode = 204;
  //}
//
  //users[bodyParams.name] = bodyParams;
//
  //etag = crypto.createHash('sha1').update(JSON.stringify(users));
  //digest = etag.digest('hex');

  return respondJSON(request, response, statusCode, responseJson);
};

const getPosts = (request, response, parsedUrl) => {
  const responseJSON = {
    users,
  };

  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getPostsMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSONMeta(request, response, 200);
};

const notFound = (request, response) => {
  const responseJson = {
    id: 'notFound',
    message: 'The page you are looking for was not found',
  };

  return respondJSON(request, response, 404, responseJson);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  newPost,
  getPosts,
  getPostsMeta,
  notFound,
  notFoundMeta,
};
