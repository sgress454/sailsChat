/**
 * Room
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  // Subscribers only get to hear about update and destroy events,
  // and about users joining or leaving the room.
  // This lets us keep our count of users in the room accurate, without
  // sending chat message for a room to anyone but people who actually
  // want to get them.  To get chat messages for a room, you subscribe
  // to the 'message' context explicitly.
  autosubscribe: ['destroy', 'update', 'add:users', 'remove:users'],
  attributes: {

		name: 'string',
		users: {
			collection: 'user',
			via: 'rooms'
		}
    
  },


	// Add an "afterPublishRemove" to continue processing after
	// a user is removed from a room.  Doing it this way ensures
	// this code will be run whether the "publishRemove" call was
	// triggered by a user being destroyed, or by them just
	// leaving a room.
  afterPublishRemove: function(id, alias, idRemoved, req) {

  	// Get the room and all its users
  	Room.findOne(id).populate('users').exec(function(err, room) {
  		// If this was the last user, close the room.  
  		if (room.users.length === 0) {
  			room.destroy(function(err) {
          // Alert all sockets subscribed to the room that it's been destroyed.
  				Room.publishDestroy(room.id);
  			});
  		}
  	});

  }

};
