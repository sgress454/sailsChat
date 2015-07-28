// Note -- we need a UserController so that blueprints will be activated for User,
// but we don't need any custom User controller code for this app!

module.exports = {

	announce: function (req, res) {

		var socketId = sails.sockets.id(req);
		var session = req.session;

        // Create the session.users hash if it doesn't exist already
        session.users = session.users || {};

        User.create({name: 'unknown', socketId: socketId}).exec(function(err, user) {
        	if (err) {return res.serverError(err);}

	        // Save this user in the session, indexed by their socket ID.
	        // This way we can look the user up by socket ID later.
	        session.users[socketId] = user;

	        // Subscribe the connected socket to custom messages regarding the user.
	        // While any socket subscribed to the user will receive messages about the
	        // user changing their name or being destroyed, ONLY this particular socket
	        // will receive "message" events.  This allows us to send private messages
	        // between users.
	        User.subscribe(req, user, 'message');

	        // Get updates about users being created
	        User.watch(req);

	        // Get updates about rooms being created
	        Room.watch(req);

	        // Publish this user creation event to every socket watching the User model via User.watch()
	        User.publishCreate(user, req);

	        res.json(user);
        	
        });


	}

};