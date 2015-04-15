var express = require('express'),
  	path = require('path'),
  	routes = require('./routes'),
    socket = require('socket.io'),
	  app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.chat);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port') );

var io = socket.listen(server);

/**
 *
 * The connection event handler will be triggered, passing along the socket
 * that was just established.
 *
 * The socket is an event emitter that can trigger different events
 * based on the messages it gets, and we will use this socket also to
 * communicate with the client for which it was created.
 *
 */
io.sockets.on('connection', function (socket) {

  console.log('client connected');

  /**
   * The message handler is triggered when a message sent with socket.send
   * is received.
   */
  socket.on('message', function (data) {

    var message = JSON.parse(data);
    /**
     * Now, we have to send out this message to all the connected users.
     * When we send the message using the broadcast object, it will be
     * sent to all the clients that are connected, except to the one for
     * which this socket was created.
     */
    socket.broadcast.send(JSON.stringify(message));


    /**
     * The socket.send method will send the message on the socket,
     * which will be triggering the message event on the client.
     *
     * We want to send back the same content to the client that sent this
     * message because broadcast will exclude the original broadcaster.
     */
    socket.send(JSON.stringify(message));

  });

});

module.exports = app;
