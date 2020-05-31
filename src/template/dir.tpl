<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body {
            margin: 30px;
        }
        a {
            display: block;
            font-size: 30px;
        }
    </style>
</head>
<body>
    
    {{#each files}}
        <a href="{{../dir}}/{{this.file}}">类型：{{this.icon}} 文件路径：{{this.file}}</a> <br />
    {{/each}}
    
</body>
</html>