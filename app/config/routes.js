var path = require('path');
var config = require('../config/config');

// API ROUTES ------------------------
module.exports = function (app, express, pool) {

    publicRoutes = config.routes

    for(var i = 0; i < publicRoutes.length; i++){
        var routeLocation = "../" + publicRoutes[i]
        var curRoute = require(routeLocation)(app, express, pool);
        app.use('/api', curRoute);
    }

    // MAIN CATCHALL ROUTE ---------------
    // has to be registered after API ROUTES
    app.get('*', function(req, res) {
    	res.sendFile(path.join(__dirname + '/../../public/app/index.html'));
    });

}
