/**
 * Room
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

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
  				Room.publishDestroy(room.id);
  			});
  		}
  	});

  },

	// Override the default publishDestroy method for this model.
  publishDestroy: function(id) {
 		// Instead of just notifying subscribers to the room, notify EVERYONE about
 		// the user being destroyed.  	
  	sails.sockets.blast('room', {verb: "destroyed", id: id});
  }


};
