var mysql = require( 'mysql' );
var DBfields = require( "../config/config" ).dbColumns
var date_columns = require( "../config/config" ).db_date_columns
var logSQL = require( "../config/config" ).logSQL
var moment = require( 'moment' );

//constructorzzz
// Pivot  (data, pivot_column )
// join   (parent, children, foreignKey)
// create (dbPool, tableName, object, callback)
// update (dbPool, tableName, object, callback)
// remove (dbPool, tableName, id, cb)
// get    (dbPool, tableName, id(or null), callback)
// find   (dbPool, tableName, conditions as object {field: val, ... } , callback) field = val
// find   (dbPool, tableName, conditions as object {field: {op: val}}, ... } , callback) field {{op}} val
// query  (sql, callback) --wrapper to hide error handling and logging

var cleanDates = function( object ) {
    for ( field in object ) {
        if ( date_columns.indexOf( field ) != -1 ) {
            var value = object[ field ]
            if ( value && value != "" ) {
                object[ field ] = moment( value ).format( 'YYYY-MM-DD' )
            } else {
                object[ field ] = null
            }
        }
    }
    return object
}

var error = function( err, sql ) {
    console.log( "ERROR: " )
    console.log( err )
    console.log( "SQL:  " )
    console.log( sql )
}

var pivot = function( data, pivot_column ) {
    var response = {}
    for ( var i = 0; i < data.length; i++ ) {
        var pivot_value = data[ i ][ pivot_column ]
        var row_data = data[ i ]
        if ( response[ pivot_value ] ) {
            response[ pivot_value ].push( row_data )
        } else {
            response[ pivot_value ] = [ row_data ]
        }
    }
    return response
}

var join = function( parent, children, foreignKey ) {
    var response = parent;
    if ( foreignKey && response && children ) {
        response[ foreignKey ] = [];
        response[ foreignKey ] = children
    }
    return response
}

var get = function( pool, table, id, cb ) {
    if ( id == undefined ) {
        id = 0;
    }
    var sql = "select * from " + table + " Where id = " + id + " Limit 1;";
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } );
}

var all = function( pool, table, cb ) {
    var sql = "select * from " + table;
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } );
}

var find = function( pool, table, conditions, cb ) {
    var sql = "select * from " + table + " where "
    for ( field in conditions ) {
        if ( typeof conditions[ field ] === 'object' ) {
            for ( operator in conditions[ field ] ) {
                sql += "( " + field + " " + operator + " '" + conditions[ field ][ operator ] + "') AND "
            }
        } else {
            sql += "( " + field + " = '" + conditions[ field ] + "') AND "
        }

    }
    sql += "true;" //escape last AND
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } );
}

var findOne = function( pool, table, conditions, cb ) {
    var sql = "select * from " + table + " where "
    for ( field in conditions ) {
        if ( typeof conditions[ field ] === 'object' ) {
            for ( operator in conditions[ field ] ) {
                sql += "( " + field + " " + operator + " '" + conditions[ field ][ operator ] + "') AND "
            }
        } else {
            sql += "( " + field + " = '" + conditions[ field ] + "') AND "
        }
    }
    sql += "true limit 1;" //escape last AND , and limti to 1
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        if ( cols == 0 ) {
            cb( err, null, cols )
        } else {
            cb( err, rows[ 0 ], cols )
        }

    } );
}


var create = function( pool, table, object, cb ) {
    // object = cleanDates( object )

    var usedFields = [];
    var vals = [];
    var fields = DBfields[ table ]

    for ( var i = 0; i < fields.length; i++ ) {
        var curField = fields[ i ];
        if ( object[ curField ] ) {
            usedFields.push( fields[ i ] )
        }
    }

    var sql = "Insert into " + table + " ( "
    for ( var i = 0; i < usedFields.length; i++ ) {
        var curField = usedFields[ i ];
        sql += curField
        if ( i != usedFields.length - 1 ) {
            sql += " , "
        }
    }

    sql += ") values ( "

    for ( var i = 0; i < usedFields.length; i++ ) {
        var curField = usedFields[ i ];
        vals.push( object[ curField ] )
        sql += "?"
        if ( i != usedFields.length - 1 ) {
            sql += ", "
        }
    }

    sql += " );"

    //replace the ?'s with the values stored in vals while formatting them for mysql
    sql = mysql.format( sql, vals );

    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } );
}


var update = function( pool, table, object, cb ) {
    var update = [];
    var fields = DBfields[ table ]

    //object = cleanDates( object )

    for ( var i = 0; i < fields.length; i++ ) {
        var curField = fields[ i ];
        if ( curField in object ) {
            var curVal = object[ curField ]

            //mysql needs null date values as null not 'null' or ''
            if ( curVal == "" || curVal == null ) {
                update.push( curField + " = null " )
            } else {
                update.push( curField + " = '" + object[ curField ] + "'" )
            }

        }
    }

    var sql = "Update " + table + " Set "
    for ( var i = 0; i < update.length; i++ ) {
        sql += update[ i ]
        if ( i != update.length - 1 ) {
            sql += ", "
        }
    }

    sql += " where id = " + object.id;
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } );
}

var remove = function( pool, table, id, cb ) {
    var sql = "delete from " + table + " where id = " + id
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } );
}

var query = function( pool, sql, cb ) {
    if ( logSQL ) console.log( sql )
    pool.query( sql, function( err, rows, cols ) {
        if ( err ) {
            error( err, sql )
        }
        cb( err, rows, cols )
    } )
}

module.exports = {
    pivot: pivot,
    join: join,
    all: all,
    get: get,
    find: find,
    findOne: findOne,
    create: create,
    update: update,
    remove: remove,
    query: query
}
