var jwt = require( 'jsonwebtoken' );
var config = require( '../config/config' );
var bcrypt = require( 'bcrypt-nodejs' );
var sqlHelper = require( '../helpers/sqlHelper' )

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function( app, express, pool ) {

    var apiRouter = express.Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post( '/authenticate', function( req, res ) {

        sqlHelper.findOne( pool, 'users', {
            email: req.body.email
        }, function( err, user ) {
            if ( !user ) {
                res.json( {
                    success: false,
                    message: 'Authentication failed. User not found.'
                } );
            } else {
                var validPassword = bcrypt.compareSync( req.body.password, user.password );
                if ( !validPassword ) {
                    res.json( {
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    } );
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign( {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        email: user.email
                    }, superSecret, {
                        expiresInMinutes: 24 * 60
                    } );

                    // return the information including token as JSON
                    res.json( {
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    } );
                }
            }
        } );
    } );

    // route middleware to verify a token
    apiRouter.use( function( req, res, next ) {
        // do logging
        console.log( 'Somebody just came to our app!' );

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers[ 'x-access-token' ];

        // decode token
        if ( token ) {

            // verifies secret and checks exp
            jwt.verify( token, superSecret, function( err, decoded ) {

                if ( err ) {
                    res.status( 403 ).send( {
                        success: false,
                        message: 'Failed to authenticate token.'
                    } );
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            } );

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status( 403 ).send( {
                success: false,
                message: 'No token provided.'
            } );
        }
    } );

    // api endpoint to get user information
    apiRouter.get( '/me', function( req, res ) {
        res.send( req.decoded );
    } );

    return apiRouter;
};
