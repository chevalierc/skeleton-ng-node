angular.module( 'app.routes', [ 'ngRoute' ] )

.config( function( $routeProvider, $locationProvider ) {

    $routeProvider

    //Misc Pages
    .when( '/', {
        templateUrl: 'app/search.html'
    } )

    $locationProvider.html5Mode( true );

} );
