/**
 * app.js
 *
 * Front-end code and event handling for sailsChat
 *
 */


// Attach a listener which fires when a connection is established:
io.socket.on('connect', function socketConnected() {

    // Show the main UI
    $('#disconnect').hide();
    $('#main').show();

    // Once we have a connected socket, start listening for other events.

    // Listen for the "hello" event from the server, which will provide us
    // with information about our user (data.me). Open the /config/sockets.js
    // file to see where the "hello" event is emitted.
    io.socket.on('hello', function(data) {
      window.me = data;
      updateMyName(data);
    });

    // Listen for the "room" event, which will be broadcast when something
    // happens to a room we're subscribed to.  See the "autosubscribe" attribute
    // of the Room model to see which messages will be broadcast by default
    // to subscribed sockets.
    io.socket.on('room', function messageReceived(message) {

      switch (message.verb) {

        // Handle room creation
        case 'created':
          addRoom(message.data);
          break;

        // Handle a user joining a room
        case 'addedTo':
          // Post a message in the room
          postStatusMessage('room-messages-'+message.id, $('#user-'+message.addedId).text()+' has joined');
          // Update the room user count
          increaseRoomCount(message.id);
          break;

        // Handle a user leaving a room
        case 'removedFrom':
          // Post a message in the room
          postStatusMessage('room-messages-'+message.id, $('#user-'+message.removedId).text()+' has left');
          // Update the room user count
          decreaseRoomCount(message.id);
          break;

        // Handle a room being destroyed
        case 'destroyed':
          removeRoom(message.id);
          break;

        // Handle a public message in a room.  Only sockets subscribed to the "message" context of a
        // Room instance will get this message--see the "join" and "leave" methods of RoomController.js
        // to see where a socket gets subscribed to a Room instance's "message" context.
        case 'messaged':
          receiveRoomMessage(message.data);

        default:
          break;

      }

    });

    // Listen for the "room" event, which will be broadcast when something
    // happens to a user we're subscribed to.  See the "autosubscribe" attribute
    // of the User model to see which messages will be broadcast by default
    // to subscribed sockets.
    io.socket.on('user', function messageReceived(message) {

      switch (message.verb) {

        // Handle user creation
        case 'created':
          addUser(message.data);
          break;

        // Handle a user changing their name
        case 'updated':

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

          break;

        // Handle user destruction
        case 'destroyed':
          removeUser(message.id);
          break;

        // Handle private messages.  Only sockets subscribed to the "message" context of a
        // User instance will get this message--see the onConnect logic in config/sockets.js
        // to see where a new user gets subscribed to their own "message" context
        case 'messaged':
          receivePrivateMessage(message.data);
          break;

        default:
          break;
      }

    });

    // Get the current list of users online.  This will also subscribe us to
    // update and destroy events for the individual users.
    io.socket.get('/user', updateUserList);

    // Get the current list of chat rooms. This will also subscribe us to
    // update and destroy events for the individual rooms.
    io.socket.get('/room', updateRoomList);

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

    console.log('Socket is now connected!');

    // When the socket disconnects, hide the UI until we reconnect.
    io.socket.on('disconnect', function() {
      // Hide the main UI
      $('#main').hide();
      $('#disconnect').show();
    });

});
