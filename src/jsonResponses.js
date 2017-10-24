// Node's built-in cryptography module.
const crypto = require('crypto');

// Note this object is purely in memory
// starts with some default objects
const posts = {
  default_1508812178207: {
    title: 'It\'s a hat!',
    link: 'https://www.villagehatshop.com/photos/product/standard/4511390S406444/all/eyeball-leather-top-hat.jpg',
    time: 1508812178207,
    description: 'Look at the hat',
    username: 'Anonymous',
  },
  default_1508812293070: {
    title: 'Frog',
    link: 'https://images2.onionstatic.com/clickhole/3456/8/original/600.jpg',
    time: 1508812293070,
    description: 'Frog',
    username: 'Frog',
  },
};

// sha1 is a bit of a quicker hash algorithm for insecure things
let etag = crypto.createHash('sha1').update(JSON.stringify(posts));
// grab the hash as a hex string
let digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  // set the headers
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  // respond with the json
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  // set the headers
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  // respond with the meta
  response.writeHead(status, headers);
  response.end();
};

// Function to add in a new post
const newPost = (request, response, sentObj) => {
  // initial response object
  const responseJson = {
    message: 'New post succeeded!',
  };
  let statusCode = 201;

  // check to see if the required parameters are on the object
  // if there's not, then this object fails to be valid
  if (!sentObj.time) {
    statusCode = 400;
    responseJson.message = 'Error: no time specified';
    responseJson.id = 'badRequest';
    return respondJSON(request, response, statusCode, responseJson);
  } else if (!sentObj.title) {
    statusCode = 400;
    responseJson.message = 'Error: no title specified';
    responseJson.id = 'badRequest';
    return respondJSON(request, response, statusCode, responseJson);
  } else if (!sentObj.link) {
    statusCode = 400;
    responseJson.message = 'Error: no link specified';
    responseJson.id = 'badRequest';
    return respondJSON(request, response, statusCode, responseJson);
  }

  // set up stored object with "unique" hash
  // (hash isn't truly unique, could be overwritten, but the scale isn't that large)
  const objRef = `${sentObj.title}_${sentObj.time}`;
  const obj = sentObj;

  // fill in any blank sections
  if (!obj.description) {
    obj.description = '';
  }
  if (!obj.username) {
    obj.username = '';
  }

  // save the object
  posts[objRef] = obj;

  // get a new etag
  etag = crypto.createHash('sha1').update(JSON.stringify(posts));
  digest = etag.digest('hex');

  //  return respondJSON(request, response, statusCode, responseJson);
  // } else if (users[bodyParams.name]) {
  //  responseJson.message = 'Updated successfully';
  //  statusCode = 204;
  // }

  // respond to the request
  return respondJSON(request, response, statusCode, responseJson);
};

// Function to update a post that's already made
const updatePost = (request, response, updatedObj) => {
  const updated = updatedObj;

  // initial response
  const responseJson = {
    message: 'Post updated successfully!',
  };
  const statusCode = 204;

  // check to see if the object doesn't exist or there's no reference
  // sent to find the post
  if (!updated.ref) {
    responseJson.message = 'Error: no object reference sent';
    responseJson.id = 400;
    return respondJSON(request, response, statusCode, responseJson);
  } else if (!posts[updated.ref]) {
    responseJson.message = `Error: no post with reference ${updated.ref}`;
    responseJson.id = 400;
    return respondJSON(request, response, statusCode, responseJson);
  }

  // update the object at that reference
  const obj = {
    title: updated.title,
    link: updated.link,
    time: posts[updated.ref].time,
    desc: updated.description || '',
    username: updated.username || '',
  };

  posts[updated.ref] = obj;

  etag = crypto.createHash('sha1').update(JSON.stringify(posts));
  digest = etag.digest('hex');

  return respondJSON(request, response, statusCode, responseJson);
};

// Fucntion to return with all the current posts, or send back a 304
// if the user already has all of the posts
const getPosts = (request, response) => {
  const responseJSON = {
    posts,
  };

  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// Function to check if the user currently has the correct information right now
const getPostsMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSONMeta(request, response, 200);
};
// Basic method for returning a 404
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
  updatePost,
  getPosts,
  getPostsMeta,
  notFound,
  notFoundMeta,
};
