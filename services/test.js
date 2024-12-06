const { fetchStatus } = require('./services/apiServices');

(async () => {
  const result = await fetchStatus('60100025891', 'CELCOM');
  console.log(result);
})();
