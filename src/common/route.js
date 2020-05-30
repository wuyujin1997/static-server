const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async function(req, res, filePath) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    console.warn(filePath);

    try {
        const stats = await stat(filePath);
        console.warn(stats, stats.isFile(), stats.isDirectory());
        res.statusCode = 200;
        
        // 请求路径是文件
        if (stats.isFile()) {
            // 使用管道流读取文件内容
            fs.createReadStream(filePath).pipe(res);
        } 
        // 请求目录
        else if (stats.isDirectory()) {
            // 读取目录
            const files = await readdir(filePath);
            res.end(files.join(', '));
        }
    } catch (ex) {
        console.warn(ex);
        res.statusCode = 404;
        res.end(`${filePath} 不存在`);
    }
}