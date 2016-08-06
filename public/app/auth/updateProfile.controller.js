angular.module( 'updateProfileCtrl', [] )

.controller( 'updateProfileController', function( Auth, $location ) {
    var vm = this;

    vm.userData = {}
    vm.error = null
    vm.proccessing = false

    init = function() {
        Auth.getProfile().success( function( user ) {
            vm.userData = user
        } );
    }

    vm.submit = function() {
        vm.proccessing = true
        Auth.updateUser( vm.userData ).success( function( response ) {
            vm.proccessing = false
            if ( response.success ) {
                $location.path( '/profile' );
            } else {
                vm.error = response.error
            }
        } )
    }

    init()
} )
