angular.module( 'updatePasswordCtrl', [] )

.controller( 'updatePasswordController', function( Auth, $location ) {
    var vm = this;
    vm.password = {}
    vm.proccessing = false
    vm.error = null

    vm.submit = function() {
        if ( vm.password.new == vm.password.newConfirm ) {
            vm.proccessing = true
            var data = {
                oldPassword: vm.password.old,
                newPassword: vm.password.new
            }
            Auth.updatePassword( data ).success( function( response ) {
                if ( response.success == false ) {
                    vm.error = response.error;
                    vm.proccessing = false
                } else {
                    Auth.logout()
                    $location.path( '/login' );
                }
            } )
        } else {
            vm.error = "Passwords don't match"
        }
    }

} )
