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
      

/////////////////////////
// GAME LOGIC

var speed=500,
    schema = [],
    blockClass = 'style1',
    activeBlock = [],
    board=[],
    xBoard = 40, //width
    yBoard = 20, //height
    blocks = []; 
//blocks shapes
    blocks.push([[1, 1, 1, 1], [0,0,0,0], [0,0,0,0], [0,0,0,0]]); // I-block
    blocks.push([[1, 1, 1], [0, 1, 0], [0,0,0] ]); // T-block
    blocks.push([[1, 1],[1, 1]]); //O-block
    blocks.push([[1, 1, 1],[1, 0, 0], [0,0,0]]); //L-block
    blocks.push([[1, 1, 1],[0, 0, 1], [0,0,0]]); //J-block
    blocks.push([[0, 1, 1],[1, 1, 0], [0,0,0]]); //S-block
    blocks.push([[1, 1, 0],[0, 1, 1], [0,0,0]]); //Z-block
    
//clearing the board
for( var y = 0; y < yBoard; y++ ) {
    
    board[y] = [];
    
    for( var x = 0; x < xBoard; x++ ) {
        board[y][x]='';
    }
}

var showBlock = function(blockNumber) {
//funkcja pokazujaca klocek o danym numerze
    var block = blocks[blockNumber],
        wspX = board[0].indexOf(''), 
        wspY = 0, i, z;
    
    if (wspX === -1) {
        //stanGry=0;
        //clearInterval(petlaGry);
         
        //GameOver
     } else {
        for ( i = 0; i < block.length; i++ ) {
            for ( z=0; z<block[i].length; z++) {
                if (block[i][z] == 1) {
                    board[wspY+i][wspX+z] = blockClass;
                    activeBlock.push([wspY+i, wspX+z]);
                    
                }
                
            }
        }
        schema = block;
    }
};

io.on('connection', function(client){
	//client.broadcast({ announcement: client.sessionId + ' connected' });
    var message = { board: board };
    showBlock(~~(Math.random()*blocks.length));
	client.on('message', function(message){
        var comm=''
        if (message==38 || message==119) {//up
            board[~~(Math.random()*yBoard)][~~(Math.random()*xBoard)] = 'style2';
        } else if (message==37 || message==97) { //left
            board[~~(Math.random()*yBoard)][~~(Math.random()*xBoard)] = 'style2';
        } else if (message==39 || message==100) { //right
            board[~~(Math.random()*yBoard)][~~(Math.random()*xBoard)] = 'style2';
        } else if (message==40 || message==115) { //down
            board[~~(Math.random()*yBoard)][~~(Math.random()*xBoard)] = 'style2';
        }
        
		var message = { board: board };
		
            client.send(message);
            client.broadcast(message);
        
		
	});
    
    /*(function(){
    //Main game loop
        
        client.send(message);
        client.broadcast(message);
        setTimeout(arguments.callee, 1000);
    })();*/
	client.on('disconnect', function(){
		//client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
});