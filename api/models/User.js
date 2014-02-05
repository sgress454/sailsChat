/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	
	name: 'string',
	rooms: {
		collection: 'room',
		via: 'users',
	}
	
  },

  	// Override the default publishUpdate method for this model.
	publishUpdate: function (id, changes, req) {
 		// Instead of just notifying subscribers to the user, notify EVERYONE about
 		// the changes to the model.
		sails.sockets.blast('user', {verb: "updated", id: id, data: changes}, req);
		// Get the full user model, including what rooms they're subscribed to
		User.findOne(id).populate('rooms').exec(function(err, user) {
			// Publish a message to each room they're in.  Any socket that is 
			// subscribed to the room will get the message. Saying it's "from" id:0
			// will indicate to the front-end code that this is a systen message
			// (as opposed to a message from a user)
			sails.util.each(user.rooms, function(room) {
				Room.publish(rooms, {method: 'publicMessage', room:{id:room.id}, from: {id:0}, msg: message}, req);		
			});
			
		});
		
	},

	// Override the default publishDestroy method for this model.
	publishDestroy: function (id, req, user) {
 		// Instead of just notifying subscribers to the user, notify EVERYONE about
 		// the user being destroyed.
		sails.sockets.blast('user', {verb: "destroyed", id: id});
		if (user) {
			sails.util.each(user.rooms, function(room) {
				Room.publishRemove(room.id, 'users', user.id);
			});
		}
	}

};
