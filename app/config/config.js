module.exports = {
    port: 80, //'port': process.env.PORT || 8080,

    //Whether the sqlhelper module logs every command it runs. helpful for debugging
    logSQL: true,

    database: {
        host: "localhost",
        user: "root",
        password: 'password',
        database: "db",
        connectionLimit: 20,
    },

    secret: 'SwiftySecret', //For Token encryption

    publicRoutes: [
        'routes/route.createUser'
    ],

    privateRoutes: [
        'routes/route.user'
    ],

    dbColumns: {
        users: [ 'nickname', 'email', 'id', 'password' ],
    }
};
