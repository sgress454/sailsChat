module.exports = {


	// Create a new public Room object.
	create: function(req, res) {
		Room.create(req.body).exec(function(err, room) {
			// Subscribe the socket that made the request to the new Room,
			// so that they'll get notifications about people joining,
			// leaving, posting messages, etc.
			Room.subscribe(req, room);
			// Tell every OTHER connected socket that a new room was created,
			// so that they can add it to their room list.
			sails.sockets.blast('createRoom', room.toJSON(), req.socket);
			// Send a response to the client that made the request,
			// with the new room's ID.  This way they can wait for the response
			// and join the new room as soon as it's created.
			res.json(room.toJSON());
		});
	}


};