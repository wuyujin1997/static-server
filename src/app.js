const http = require('http');
const conf = require('./config/defaultConfig');
const chalk = require('chalk');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    // text/html    html格式的文本
    // text/plain   简单的文本
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<h1>你好啊 李银河</h1> <br>');
    res.end('hello 世界');
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});