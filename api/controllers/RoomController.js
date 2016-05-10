module.exports = {

  // Join a chat room -- this is bound to 'post /room/:roomId/users'
  'join': function(req, res, next) {
    // Get the ID of the room to join
    var roomId = req.param('roomId');
    // Subscribe the requesting socket to the "message" context, 
    // so it'll get notified whenever Room.message() is called
    // for this room.
    Room.subscribe(req, roomId, ['message']);
    // Continue processing the route, allowing the blueprint
    // to handle adding the user instance to the room's `users`
    // collection.
    return next();
  },

  // Leave a chat room -- this is bound to 'delete /room/:roomId/users'
  'leave': function(req, res, next) {
    // Get the ID of the room to join
    var roomId = req.param('roomId');
    // Unsubscribe the requesting socket from the "message" context
    Room.unsubscribe(req, roomId, ['message']);
    // Continue processing the route, allowing the blueprint
    // to handle removing the user instance from the room's 
    // `users` collection.
    return next();
  }

};