/* eslint-disable no-undef */
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_BASE_URL_DEVELOPMENT;
  } else if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_BASE_URL_PRODUCTION;
  } else {
    // Default to a sensible fallback in case NODE_ENV is not set
    return ''; // or throw an error, depending on your preference
  }
};
export default getBaseUrl;
