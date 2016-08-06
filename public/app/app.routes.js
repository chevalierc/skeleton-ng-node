angular.module( 'app.routes', [ 'ngRoute' ] )

.config( function( $routeProvider, $locationProvider ) {

    $routeProvider

    //Misc Pages
        .when( '/', {
        templateUrl: 'app/pages/home.html'
    } )

    //auth and user acounts
    .when( '/login', {
        templateUrl: 'app/auth/login.html',
        controller: 'mainController',
        controllerAs: 'login'
    } )

    .when( '/signup', {
        templateUrl: 'app/auth/signup.html',
        controller: 'signupController',
        controllerAs: 'signup'
    } )

    .when( '/update-password', {
        templateUrl: 'app/auth/updatePassword.html',
        controller: 'updatePasswordController',
        controllerAs: 'updatePassword'
    } )

    .when( '/update-profile', {
        templateUrl: 'app/auth/updateProfile.html',
        controller: 'updateProfileController',
        controllerAs: 'updateProfile'
    } )

    $locationProvider.html5Mode( true );

} );
