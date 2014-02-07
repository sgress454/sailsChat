module.exports = {

	'join': function(req, res, next) {
		var roomId = req.param('roomId');
		Room.subscribe(req, roomId, ['message']);
		return next();
	},

	'leave': function(req, res, next) {
		var roomId = req.param('roomId');
		Room.unsubscribe(req, roomId, ['message']);
		return next();
	}

};