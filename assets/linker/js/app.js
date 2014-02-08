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

    $('#disconnect').hide();
    $('#main').show();

    // Once we have a connected socket, start listening for other events.

    // Listen for the "hello" event from the server, which will provide us
    // with information about our user (data.me), a list of other users (data.users)
    // and a list of available public chat rooms (data.rooms).  Open the /config/sockets.js
    // file to see where the "hello" event is emitted.
    socket.on('hello', function(data) {
      window.me = data;
      updateMyName(data);
    });

    // Get the current list of users online.  This will also subscribe us to
    // update and destroy events for the individual users.
    socket.get('/user', updateUserList);

    // Get the current list of chat rooms. This will also subscribe us to
    // update and destroy events for the individual rooms.
    socket.get('/room', updateRoomList);

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

        // Handle a public message in a room
        case 'messaged':
          receiveRoomMessage(message.data);

        default:
          break;

      }

    });

    socket.on('user', function messageReceived(message) {

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
      
        // Handle private messages
        case 'messaged':
          receivePrivateMessage(message.data);
          break;

        default:
          break;
      }

    });

    console.log('Socket is now connected!');

    // When the socket disconnects, remove all listeners and start listening for a reconnect.
    socket.on('disconnect', function() {
      $('#main').hide();
      $('#disconnect').show();
    });

});
