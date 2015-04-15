function SocketClient (config) {

    /**
     * construct class initalizer
     * @return {[type]} [description]
     */
    var self = this,
        defaults = _.extend({}, config);

    var construct = function () {

      var inputBox;

      /**
       * Caching the dom references in order to be used throughout the
       * application, without re-refrencing again.
       */
      self.messageBox = document.querySelector(defaults.showMessageBox);
      self.form = document.querySelector(defaults.inputMessageForm);
      self.inputBox = self.form.querySelector('input[type=text]');


      self.form.addEventListener('submit', sendChatMessage, true);

      /**
       * This will send a connection request to the server from which the page was loaded.
       * Socket.io internally triggers 'connection' event.
       */
      self.socket = io.connect('http://localhost:3000');

      self.socket.on('message', displayMessage);

    };


    /**
     * displayMessage - Server emit's new messages that send data
     * to the client side. This method recieves that data and writes
     * it to the browser’s DOM element.
     */
    var displayMessage = function (data) {

      var div = document.createElement('div');
          div.innerHTML = JSON.parse(data).msg;

      self.messageBox.appendChild(div);

    };


    var sendChatMessage = function (event) {
      event.preventDefault();
      /**
       * socket.send method to send this data to the server
       */
      self.socket.send(

        JSON.stringify({ msg: self.inputBox.value})

      );

      // Empty the text.
      self.inputBox.value = "";

    };


    return construct();
}
