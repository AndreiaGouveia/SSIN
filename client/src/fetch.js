/**
 * Call an API.
 * @param {String} apiEndpoint Endpoint to be called
 * @param {Object} query Query pairs (ex.: { queryName: queryValue }) (can be null)
 * @param {String} method Call method to be used (ex.: 'GET', 'POST', etc.) (can be null)
 * @param {Object} body Content to be sent in the request's body (can be null)
 * @param {*} accessToken Access token to be used for authentication (can be null)
 * @returns Call response
 */
export const callApiWithToken = async (apiEndpoint, query = null, method = null, body = null, accessToken = null) => {
    const headers = new Headers();
  
    if (accessToken) {
      const bearer = `Bearer ${accessToken}`;
  
      headers.append('Authorization', bearer);
    }
  
    if (body) {
      headers.append('Content-Type', 'application/json');
    }
  
    const options = {
      method: method || 'GET',
      headers: headers,
      body: body ? JSON.stringify(body) : null
    };
  
    let endpoint = apiEndpoint;
  
    if (query) {
      endpoint = `${endpoint}?`;
  
      const queryKeys = Object.keys(query);
      const queryValues = Object.values(query);
  
      for (let i = 0; i < queryKeys.length; i++) {
        if (i > 0) {
          endpoint = `${endpoint}&`;
        }
  
        endpoint = `${endpoint}${queryKeys[i]}=${queryValues[i]}`;
      }
    }
  
    return fetch(endpoint, options);
  };