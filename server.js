var http = require("http");
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(req, res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
	console.log('connection:' + ip );
	var path = url.parse(req.url).pathname;
	
	switch(path)
	{
		case '/':
		fs.readFile(__dirname + '/index.html',function(err,data)
		{
			if(err)
			{
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			
			res.writeHead(200);
			res.end(data);
		});
		break;
		
		default:
		res.writeHead(404);
        	res.write("opps this doesn't exist - 404");
		break;
	}
	 res.end();
});

server.listen(8001);
var io = require('socket.io')(server);
io.on('connection', function(socket){

	console.log('a user connected');
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
    });

	socket.on('draw', function(msg){
		io.sockets.emit('draw message', msg);
    });

});

