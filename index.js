let FindFreePortSync = require('./find-free-port-sync');

module.exports = options => {
    return new FindFreePortSync(options).getPort();
};
