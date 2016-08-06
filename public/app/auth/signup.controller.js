angular.module( 'signupCtrl', [] )

.controller( 'signupController', function( Auth, $location ) {
    var vm = this;

    vm.userData = {}
    vm.error = null

    vm.submit = function() {
        if ( vm.userData.password != vm.userData.passwordConfirm ) {
            vm.error = "Passwords do not match"
        } else if ( !vm.userData.gender ) {
            vm.error = "Please enter a gender"
        } else if ( !vm.userData.fitness ) {
            vm.error = "Please enter a fitness level"
        } else {
            Auth.signup( vm.userData ).success( function( response ) {
                if ( !response.success ) {
                    vm.error = response.message
                } else {
                    $location.path( '/tutorial' );
                }
            } )
        }
    }

} )
