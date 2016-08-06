angular.module( 'mainCtrl', [] )

.controller( 'mainController', function( $scope, $window, Auth, $rootScope, $scope, $location, $mdSidenav, $timeout, $mdComponentRegistry ) {
    var vm = this;
    vm.isMobile = null;

    function init() {
        determineIfMobile()
    }

    $rootScope.$on( '$routeChangeStart', function( ev, next, start ) {
        vm.loggedIn = Auth.isLoggedIn();
        $mdSidenav( 'left' ).close();
        determineUser()
    } );

    //google annalytics fix for ng-view
    $scope.$on( '$viewContentLoaded', function( event ) {
        console.log( $location.url() )
        $window.ga( 'send', 'pageview', {
            page: $location.url()
        } );
    } );

    var determineUser = function() {
        //if we dont know the user find out
        if ( !vm.user ) {
            Auth.getUser().then( function( response ) {
                vm.user = response.data;
            } )
        }
    }

    var determineIfMobile = function() {
        var width = document.getElementById( 'body' ).offsetWidth
        if ( width > 480 ) {
            vm.isMobile = false;
        } else {
            vm.isMobile = true;
        }
    }

    vm.toggleSideNav = function() {
        $mdSidenav( 'left' ).toggle();
    };

    // function to handle login form
    vm.doLogin = function() {
        vm.processing = true;
        Auth.login( vm.loginData.email, vm.loginData.password ).success( function( response ) {
            vm.processing = false;
            if ( response.success ) {
                Auth.getUser().then( function( response ) { //make sure client knows user immidiatly
                    vm.user = response.data;
                    $window.location.href = '/log';
                } )
            } else {
                vm.error = response.message;
            }
        } );
    };

    // function to handle logging out
    vm.doLogout = function() {
        Auth.logout();
        vm.loggedIn = false;
        vm.user = {};
        $location.path( '/login' );
    };

    init();
} )
