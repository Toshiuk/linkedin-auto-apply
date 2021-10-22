const prompt = require('prompt');

prompt.start();

function onErr(err) {
    console.log(err);
    return 1;
}

let searchTerm = null;
prompt.get(['searchTerm'], function (err, result) {
    if (err) { return onErr(err); }
    searchTerm = result.searchTerm;
});

module.exports = { searchTerm };