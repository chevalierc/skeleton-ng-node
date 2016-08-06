var path = require('path');
var config = require('../config/config');

// API ROUTES ------------------------
module.exports = function (app, express, pool) {

    publicRoutes = config.publicRoutes
    privateRoutes = config.privateRoutes

    for(var i = 0; i < publicRoutes.length; i++){
        var routeLocation = "../" + publicRoutes[i]
        var curRoute = require(routeLocation)(app, express, pool);
        app.use('/api', curRoute);
    }

    var curRoute = require('../routes/route.auth')(app, express, pool);
    app.use('/api', curRoute);

    for(var i = 0; i < privateRoutes.length; i++){
        var routeLocation = "../" + privateRoutes[i]
        var curRoute = require(routeLocation)(app, express, pool);
        app.use('/api', curRoute);
    }

    // MAIN CATCHALL ROUTE ---------------
    // has to be registered after API ROUTES
    app.get('*', function(req, res) {
    	res.sendFile(path.join(__dirname + '/../../public/app/index.html'));
    });

}
