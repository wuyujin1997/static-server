const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const conf = require('./config/defaultConfig');

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root, req.url);

    fs.stat(filePath, (err, stats) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        if (err) {
            res.statusCode = 404;
            res.end(`${filePath} 不存在`);

            return ;
        }
        
        // 请求路径是文件
        if (stats.isFile()) {
            res.statusCode = 200;
            res.end(filePath);
        } 
        // 请求目录
        else if (stats.isDirectory()) {
            // 读取目录
            fs.readdir(filePath, (err, files) => {
                res.statusCode = 200;
                res.end(files.join(', '));
            });
        }
        
    });
    
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});