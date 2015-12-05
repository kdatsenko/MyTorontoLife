var crudApp = angular.module('crudApp')

crudApp.controller('loginbarController', function ($scope, $location, $http) {
    $scope.logout = function(){
        $scope.state.is_logged = false;
        /*$.ajax({
            url: "/auth/logout",
            type: "GET",
            success: function(data){
                location.href = "index.html"
            }
        })*/

        $http.get('/auth/logout').success(function(data, status, headers, config) {
            redirect();
        });
    }

    $scope.profileClicked = function () {
        $location.path("/profile")
    }

    var redirect = function(){
        console.log('dwdwdfwf');
        $scope.showLogin = false;
        $scope.showRegister = false;
        return $location.path('/'); // path not hash
    }

    $http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
        $scope.logged = data.logged
        if(data.user){
            $scope.username = data.user.username
        }
    });
})
