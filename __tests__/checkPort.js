let expect = require('expect'),
    net = require('net'),
    findFreePort = require('../');

describe('Check port', () => {
    it('Port limit: findFreePort({port: 1000000})', () => {
        let port = findFreePort({
            port: 1000000
        });

        expect(port).toBe(false);
    });

    it('Port usage: findFreePort({port: 1234})', () => {
        let port = findFreePort({
            port: 1234
        });

        if (!port) {
            return;
        }

        let server = net.createServer().listen(1234, '127.0.0.1');

        server.on('error', () => {
            expect(true).toBe(false);
        });

        server.on("listening", () => {
            server.close();
        });
    });
});
