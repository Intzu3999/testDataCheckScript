const { fetchApiStatus } = require('./services/apiServices');

(async () => {
  const result = await fetchApiStatus('60100025891', 'CELCOM');
  console.log(result);
})();
