// Add a new room to the list
function newRoom() {

  // Prompt the user for the name of the new room
  var roomName = prompt('Please enter a name for the new room');

  // As long as a name is entered, create the new room.
  if (roomName) {
    io.socket.post('/room', {name: roomName}, function(data) {

      // Add the new room to the rooms list
      addRoom(data);

      // Select it in the list
      $('#rooms-list').val(data.id);

      // Create the room HTML
      createPublicRoom({id:data.id, name:data.name});

      // Join the room
      io.socket.post('/room/'+data.id+'/users', {id: window.me.id});

      // Set the room user count to 1
      increaseRoomCount(data.id);

    });
  }

}

// Add a room to the list of available rooms to join--this can happen
// via newRoom (if the user created the room themself) or after a notification
// from the server that another user added a room.
function addRoom(room) {

  // Get a handle to the room list <select> element
  var select = $('#rooms-list');

  // Create a new <option> for the <select> with the new room's information
  var users = room.users || [];
  var numUsers = users.length;
  var option = $('<option id="'+"room-"+room.id+'" data-name="'+room.name+'" data-users="'+numUsers+'" value="'+room.id+'">'+room.name+' ('+numUsers+')</option>');

  // Add the new <option> element
  select.append(option);
}

function increaseRoomCount(roomId) {
  var room = $('#room-'+roomId);
  var numUsers = parseInt(room.attr('data-users'), 10);
  numUsers++;
  room.attr('data-users', numUsers);
  room.html(room.attr('data-name')+' ('+numUsers+')');
}

function decreaseRoomCount(roomId) {
  var room = $('#room-'+roomId);
  var numUsers = parseInt(room.attr('data-users'), 10);
  numUsers--;
  room.attr('data-users', numUsers);
  room.html(room.attr('data-name')+' ('+numUsers+')');
}

// Remove a user from the list of available rooms to join, by sending
// either a room object or a room ID.
function removeRoom(room) {

  // Get the room's ID
  var id = room.id || room;
  $('#room-'+id).remove();
}

// Add multiple rooms to the rooms list.
function updateRoomList(rooms) {
  rooms.forEach(function(room) {
    addRoom(room);
  });
}
