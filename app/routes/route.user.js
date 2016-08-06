var bcrypt = require( 'bcrypt-nodejs' );
var sqlHelper = require( '../helpers/sqlHelper' )
var moment = require( 'moment' )

module.exports = function( app, express, pool ) {
    var apiRouter = express.Router();

    apiRouter.route( '/user' )
        .post( function( req, res ) {
            sqlHelper.get( pool, "users", req.decoded.id, function( err, rows, cols ) {
                if ( err ) {
                    return res.json( {
                        success: false,
                        error: err
                    } )
                } else {
                    var user = rows[ 0 ]
                    for ( var property in req.body ) {
                        if ( req.body[ property ] ) {
                            user[ property ] = req.body[ property ]
                        }
                    }
                    sqlHelper.update( pool, 'users', user, function( err, rows, cols ) {
                        if ( err ) {
                            return res.json( {
                                success: false,
                                error: err
                            } )
                        } else {
                            return res.json( {
                                success: true
                            } )
                        }
                    } )
                }
            } );
        } )


    apiRouter.route( '/user' )
        .get( function( req, res ) {
            sqlHelper.get( pool, "users", req.decoded.id, function( err, rows, cols ) {
                if ( err ) {
                    return res.json( {
                        success: false,
                        error: err
                    } )
                } else {
                    return res.json( rows[ 0 ] );
                }
            } );
        } )

    apiRouter.route( '/user/update-password' )
        .post( function( req, res ) {
            sqlHelper.get( pool, 'users', req.decoded.id, function( err, rows, cols ) {
                if ( rows.length == 0 ) {
                    res.json( {
                        success: false,
                        error: 'User not found.'
                    } );
                } else {
                    var user = rows[ 0 ]
                    var validPassword = bcrypt.compareSync( req.body.oldPassword, user.password );
                    if ( !validPassword ) {
                        return res.send( {
                            success: false,
                            error: "Current password incorrect"
                        } )
                    } else {
                        var newPassword = bcrypt.hashSync( req.body.newPassword, null )
                        var sql = "update users set password = '" + newPassword + "' where id = " + user.id
                        sqlHelper.query( pool, sql, function( err, rows, cols ) {
                            if ( err ) {
                                return res.send( {
                                    success: false,
                                    error: err
                                } )
                            } else {
                                return res.send( {
                                    success: true
                                } )
                            }
                        } )
                    }
                }
            } )
        } )

    return apiRouter;
};
