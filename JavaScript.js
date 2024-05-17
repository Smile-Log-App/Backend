giconst http = require('http'); // hey

http.createServer((req, res) => {
    res.writeHead(200, {
        'Set-Cookie': 'id=1',
        'Content-Type': 'text/html; charset=utf-8',
    });

    console.log(req.headers.cookie); // id=1
    res.end(`<h1>User ID is ${req.headers.cookie.split('=')[1]}</h1>`);

}).listen(3000);

/*const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello World! ¾È³ç!</h1>');
    res.end();
}).listen(3000);*/

/*const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>¾È³ç, ¼¼°è!</h1>');
    res.end();
}).listen(3000);*/