angular.module( 'profileCtrl', [] )

.controller( 'profileController', function( Auth, $location, workoutService ) {
    var vm = this;
    vm.error = null
    vm.user = {}

    init = function() {
        Auth.getProfile().success( function( user ) {
            vm.user = user
        } );
    }

    init()

} )
