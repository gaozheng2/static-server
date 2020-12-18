var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号\n例如：node server.js 8888')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  console.log('收到请求！路径为：' + pathWithQuery)

  response.statusCode = 200
  // 获取文件类型
  let filePath = path === '/' ? '/index.html' : path // 设置默认路径
  const index = filePath.lastIndexOf('.')
  const suffix = filePath.substring(index)
  const fileTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'text/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  }
  response.setHeader(
    'Content-Type',
    `${fileTypes[suffix] || 'text/html'};charset=utf-8`
  )
  // 获取文件内容
  let content
  try {
    content = fs.readFileSync(`./public/${filePath}`)
  } catch {
    response.statusCode = 404
    content = '您输入的路径不存在对应的内容'
  }
  response.write(content)
  response.end()
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用浏览器打开 http://localhost:' + port)
