export const getTime = (data) =>
  data?.includes('T') && data?.substr(data?.lastIndexOf('T') + 1).split('T')[0];

export const getDate = (data) =>
  new Date(data.substring(0, data.indexOf('T'))).toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    formatMatcher: 'basic',
    numberingSystem: 'latn'
  });
