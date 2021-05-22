/**
 * Call an API.
 * @param {String} apiEndpoint Endpoint to be called
 * @param {Object} query Query pairs (ex.: { queryName: queryValue }) (can be null)
 * @param {String} method Call method to be used (ex.: 'GET', 'POST', etc.) (can be null)
 * @param {Object} body Content to be sent in the request's body (can be null)
 * @param {*} accessToken Access token to be used for authentication (can be null)
 * @returns Call response
 */
export const callApiWithToken = async (apiEndpoint, method = null, body = null) => {
  const headers = new Headers();

  if (body) {
    headers.append('Content-Type', 'application/json');
  }

  const options = {
    method: method || 'GET',
    headers: headers,
    body: body ? JSON.stringify(body) : null
  };

  console.log('callAPI');
  console.log(body);

  let endpoint = apiEndpoint;

  return fetch(endpoint, options);
};