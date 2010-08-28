var http = require('http'), 
		url = require('url'),
		fs = require('fs'),
		io = require('./socketLib'),
		sys = require('sys'),
		
send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
},
		
server = http.createServer(function(req, res){
	// your normal server code
	var path = url.parse(req.url).pathname;
	switch (path){
		case '/':
				res.writeHead(200, {'Content-Type': 'text/html'});
				fs.readFile(__dirname + '/index.html', 'utf8', function(err, data){
				if (!err) res.write(data, 'utf8');
						res.end();
				});

			break;
			
		default:
			if (/\.(js|html|swf|css)$/.test(path)){
				try {
                    var contentType='',
                        encoding='';
                    switch (path.substr(path.lastIndexOf('.')-path.length)) {
                        case '.swf': //here comes da FlashFileeeeee
                            contentType = 'application/x-shockwave-flash'; 
                            encoding='binary';
                        break;
                        case '.js':
                            contentType = 'text/javascript';
                            encoding='utf8';
                        break;
                        case '.html':
                            contentType = 'text/html';
                            encoding='utf8';
                        break;
                        case '.css':
                            contentType = 'text/css';
                            encoding='utf8';
                        break;
                    }

					res.writeHead(200, {'Content-Type': contentType});
					fs.readFile(__dirname + path, encoding, function(err, data){
						if (!err) res.write(data, encoding);
						res.end();
					});
				} catch(e){ 
					send404(res); 
				}
				break;
			}
		
			send404(res);
			break;
	}
});

server.listen(80);
		
// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server);
        
io.on('connection', function(client){
	//client.broadcast({ announcement: client.sessionId + ' connected' });

	client.on('message', function(message){
        var comm=''
        if (message==38 || message==119) {
            comm='UP';
        } else if (message==37 || message==97) {
            comm='LEFT';
        } else if (message==39 || message==100) {
            comm='RIGHT';
        } else if (message==40 || message==115) {
            comm='DOWN';
        }
		var message = { message: [client.sessionId, comm] };
		
        if (comm!='') {
            console.log(message);     
            client.send(message);
            client.broadcast(message);
        }
		
	});

	client.on('disconnect', function(){
		client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
});