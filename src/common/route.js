const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress')

// 启动服务时，读取一次模板文件(之后会从缓存中读取)
const tplPath = path.join(__dirname, "../template/dir.tpl");
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());


module.exports = async function(req, res, filePath) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    console.warn(filePath);

    try {
        const stats = await stat(filePath);
        res.statusCode = 200;
        
        // 请求路径是文件
        if (stats.isFile()) {
            const contentType = mime(filePath);
            res
            res.setHeader('Content-Type', contentType); // 根据文件扩展名，设置响应头Content-Type的值。
            // 使用管道流读取文件内容
            let rs = fs.createReadStream(filePath);
            // 对指定格式的响应数据调用压缩
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } 
        // 请求目录
        else if (stats.isDirectory()) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');

            /**
             * 读取目录
             *      readdir(filePath) 返回 Promise 对象
             *await readdir(filePath) 返回 Array 对象
             */
            const files = await readdir(filePath);
            console.warn(Object.prototype.toString.call(files), files);
            
            const dir = path.relative(config.root, filePath);
            // 渲染所需的数据
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file => {
                    return {
                        file, 
                        icon: mime(file),   // 文件类型对应的图片。暂时用类型的字符串显示即可。
                    }
                })
            }
            res.end(template(data));

            // res.end(files.join(', '));
        }
    } catch (ex) {
        console.warn(ex);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.statusCode = 404;
        res.end(`${filePath} 不存在`);
    }
}