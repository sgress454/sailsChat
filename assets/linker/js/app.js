/**
 * example.js
 *
 * This file contains some example browser-side JavaScript for connecting
 * to your Sails backend using Socket.io.
 *
 * It is designed to get you up and running fast, but it's just an example.
 * Feel free to change none, some, or ALL of this file to fit your needs!
 *
 * For an annotated version of this example, see:
 *   *-> https://gist.github.com/mikermcneil/8465536
 */


// Immediately start connecting
socket = io.connect();

typeof console !== 'undefined' &&
console.log('Connecting Socket.io to Sails.js...');

// Attach a listener which fires when a connection is established:
socket.on('connect', function socketConnected() {

    // Once we have a connected socket, start listening for other events.

    // Listen for the "hello" event from the server, which will provide us
    // with information about our user (data.me), a list of other users (data.users)
    // and a list of available public chat rooms (data.rooms).  Open the /config/sockets.js
    // file to see where the "hello" event is emitted.
    socket.on('hello', function(data) {
      window.me = data.me;
      updateMyName(data.me);
      updateUserList(data.users);
      updateRoomList(data.rooms);
    });

    // Listen for the "privateMessage" event, emitted in the ChatController's "private" action.
    // receivePrivateMessage() is defined in private_message.js
    socket.on('privateMessage', receivePrivateMessage);

    // Listen for the "publicMessage" event, emitted in the ChatController's "public" action.
    // receivePublicMessage() is defined in public_message.js
    socket.on('publicMessage', receiveRoomMessage);

    // Handle a notification that a new room was created
    // addRoom is defined room.js
    socket.on('createRoom', addRoom);

    // Handle a notification that a new user was created
    // addUser is defined in user.js
    socket.on('createUser', addUser); 

    // Add a click handler for the "Update name" button, allowing the user to update their name.
    // updateName() is defined in user.js.
    $('#update-name').click(updateName);

    // Add a click handler for the "Send private message" button
    // startPrivateConversation() is defined in private_message.js.
    $('#private-msg-button').click(startPrivateConversation);

    // Add a click handler for the "Join room" button
    // joinRoom() is defined in public_message.js.
    $('#join-room').click(joinRoom);

    // Add a click handler for the "New room" button
    // newRoom() is defined in room.js.
    $('#new-room').click(newRoom);

    socket.on('room', function messageReceived(message) {

      // Post a message when someone joins a room we're in
      if (message.verb == 'addedTo' && message.attribute == 'users') {
        postStatusMessage('room-messages-'+message.id, $('#user-'+message.addedId).text()+' has joined');
      }

      // Post a message when someone leaves a room we're in
      else if (message.verb == 'removedFrom' && message.attribute == 'users') {
        postStatusMessage('room-messages-'+message.id, $('#user-'+message.removedId).text()+' has left');
      }

      // Remove a room from the list if it's destroyed
      else if (message.verb == 'destroyed') {
        removeRoom(message.id)
      }

    });

    socket.on('user', function messageReceived(message) {

      // Handle a user changing their name
      if (message.verb == "updated") {

        // Get the user's old name by finding the <option> in the list with their ID
        // and getting its text.
        var oldName = $('#user-'+message.id).text();

        // Update the name in the user select list
        $('#user-'+message.id).text(message.data.name);

        // If we have a private convo with them, update the name there and post a status message in the chat.
        if ($('#private-username-'+message.id).length) {
          $('#private-username-'+message.id).html(message.data.name);
          postStatusMessage('private-messages-'+message.id,oldName+' has changed their name to '+message.data.name);
        }

      }

      // Remove a user from the list if they're destroyed
      else if (message.verb == "destroyed") {
        removeUser(message.id);
      }

    });

    console.log('Socket is now connected!');

    socket.on('disconnect', function() {
      socket.removeAllListeners();
      $('body').html('Server down...');
      socket.on('connect', function() {
        $('body').html('<a href="javascript:window.location.reload();">Click here to reload.</a>');
      });
    });

});
