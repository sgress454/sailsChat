/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  // Subscribers only get to hear about update and destroy events.
  // This lets us keep our "users online" list accurate, while avoiding
  // sending private messages to anyone but the intended recipient.
  // To get chat messages for a user, you subscribe to the `message`
  // context explicitly.
  autosubscribe: ['destroy', 'update'],
  attributes: {

    name: 'string',
    rooms: {
      collection: 'room',
      via: 'users',
      dominant: true
    }

  },

  // Hook that gets called after the default publishUpdate is run.
  // We'll use this to tell all public chat rooms about the user update.
  afterPublishUpdate: function(id, changes, req, options) {

    // Get the full user model, including what rooms they're subscribed to
    User.findOne(id).populate('rooms').exec(function(err, user) {
      // Publish a message to each room they're in.  Any socket that is 
      // subscribed to the room will get the message. Saying it's "from" id:0
      // will indicate to the front-end code that this is a systen message
      // (as opposed to a message from a user)
      sails.util.each(user.rooms, function(room) {
        var previousName = options.previous.name == 'unknown' ? 'User #' + id : options.previous.name;
        Room.message(room.id, {
          room: {
            id: room.id
          },
          from: {
            id: 0
          },
          msg: previousName + " changed their name to " + changes.name
        }, req);
      });

    });

  }

};