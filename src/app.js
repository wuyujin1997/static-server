const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const route = require('./common/route');

const server = http.createServer((req, res) => {
    // 拼接硬盘中的文件路径
    const filePath = path.join(conf.root, req.url);

    route(req, res, filePath);
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});