/**
 * Socket Configuration
 *
 * These configuration options provide transparent access to Sails' encapsulated
 * pubsub/socket server for complete customizability.
 *
 * For more information on using Sails with Sockets, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.sockets = {

  // This custom onDisconnect function will be run each time a socket disconnects
  afterDisconnect: function(session, socket, cb) {
    console.log("DISCONNECT SESSION", session);
      try {
        if (!session.users) return cb();

        // Look up the user ID using the connected socket
        var userId = session.users[sails.sockets.getId(socket)].id;

        // Get the user instance
        User.findOne(userId).populate('rooms').exec(function(err, user) {

          if (err) {return cb();}
          // Destroy the user instance
          User.destroy({id:user.id}).exec(function(err){

            if (err) {return cb();}
            // Publish the destroy event to every socket subscribed to this user instance
            User.publishDestroy(user.id, null, {previous: user});

            // clean up users list in session
            delete session.users[sails.sockets.getId(socket)];

            return cb();
            
          });

        });
      } catch (e) {
        console.log("Error in onDisconnect: ", e);
        return cb();
      }

  }

};
