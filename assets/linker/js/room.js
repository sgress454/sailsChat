// Add a new room to the list
function newRoom() {

  // Prompt the user for the name of the new room
  var roomName = prompt('Please enter a name for the new room');

  // As long as a name is entered, create the new room.
  if (roomName) {
    socket.post('/room', {name: roomName}, function(data) {

      // Add the new room to the rooms list
      addRoom(data);
      
      // Select it in the list
      $('#rooms-list').val(data.id);

      // Join the selected room--this will also create the room HTML
      joinRoom();
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
  var option = $('<option id="'+"room-"+room.id+'" value="'+room.id+'">'+room.name+'</option>');

  // Add the new <option> element
  select.append(option);
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
