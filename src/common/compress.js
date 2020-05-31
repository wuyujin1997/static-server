const {
    createGzip,
    createDeflate
} = require('zlib');

function myCompress(rs, req, res) {
    const acceptEncoding = req.headers['accept-encoding'];

    // 如果客户端可接受的编码不是 gzip或deflate，就跳过编码。直接返回响应。
    if (! acceptEncoding || ! acceptEncoding.match(/\n(gzip|deflate)/)) {
        return rs;
    }
    // 对响应内容执行编码
    else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        return rs.pipe(createGzip);
    }
    else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate);
    }
    
}

module.exports = myCompress;    // 导出函数