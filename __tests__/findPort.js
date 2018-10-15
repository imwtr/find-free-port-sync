let expect = require('expect'),
    findFreePort = require('../');
    net = require('net');

/**
 * Listen port
 * @param {*} address
 * @param {*} success
 * @param {*} error
 */
function listenPorts(
    address = [],
    success = function() {},
    error = function () {}
) {
    let promises = [];
    let servers = [];

    address.forEach(item => {
        promises.push(new Promise((resolve, reject) => {
            let server = net.createServer().listen(item.port, item.ip || '127.0.0.1');

            servers.push(server);

            server.on("listening", () => {
                resolve(server);
            });

            server.on("error", () => {
                reject(servers);
            });
        }));
    });

    Promise.all(promises)
        .then((servers) => {
            success(servers);
        })
        .catch((servers) => {
            error(servers);
        });
}

/**
 * single port
 * @param {*} servers
 * @param {*} port
 */
function singlePort(servers, port) {
    let server = net.createServer().listen(port, '127.0.0.1');

    server.on('error', () => {
        servers.forEach(item => item.close());
        expect(true).toBe(false);
    });

    server.on("listening", () => {
        servers.forEach(item => item.close());
        server.close();
    });
}

/**
 * multiple ports
 * @param {*} servers
 * @param {*} ports
 */
function multiplePorts(servers, ports) {
    ports = ports.map(item => {
        return {
            port: item
        }
    });

    listenPorts(ports, (_servers) => {
        servers.forEach(item => item.close());
        _servers.forEach(item => item.close());
    }, (_servers) => {
        servers.forEach(item => item.close());
        _servers.forEach(item => item.close());

        expect(true).toBe(false);
    });
}

describe('Find free port', () => {
    describe('Random', () => {
        it('findFreePort() should return a random number port', () => {
            listenPorts([{
                port: 1200
            }], (servers) => {
                singlePort(servers, findFreePort());
            });
        });
    });

    describe('Range', () => {
        it(`
        findFreePort({
            start: 10000,
            end: 30000
        }) should return a random number port between 10000 and 30000`, () => {
            listenPorts([{
                port: 12000
            }], (servers) => {
                singlePort(servers, findFreePort({
                    start: 10000,
                    end: 30000
                }));
            });
        });
    });

    describe('Multiple random ports', () => {
        it('findFreePort({num: 10}) should return 10 random number ports', () => {
            listenPorts([{
                port: 10002
            }, {
                port: 10003
            }], (servers) => {
                let ports = findFreePort({num: 10});

                multiplePorts(servers, ports);
            });
        });
    });

    describe('Multiple random ports restriction', () => {
        it(`
        findFreePort({
            start: 1000,
            end: 1005,
            num: 10,
        }) should return only a random number port`, () => {
            listenPorts([{
                port: 10002
            }, {
                port: 10003
            }], (servers) => {
                multiplePorts(servers, findFreePort({
                    start: 10000,
                    end: 10005,
                    num: 10
                }));
            });
        });
    });
});
