angular.module( 'app', [ 'ngMaterial',
    'ngAnimate',
    'ngRoute',
    'ngMessages',

    'app.routes',
    'mainCtrl'
] )

// // application configuration to integrate token into requests
.config( function( $httpProvider ) {

    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push( 'AuthInterceptor' );

} )
