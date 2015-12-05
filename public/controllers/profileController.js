var crudApp = angular.module('crudApp');

crudApp.factory('profileService', function(){
	var userStore = {}

	userStore.user = null

	userStore.setUser = function(user){
		this.user = user
	}

	return userStore
})


crudApp.controller('profileController', function (profileService, $scope, $http, $compile, $routeParams, $location) {
	$scope.user = {
		_id: "1234",
		username: "Username",
		imageurl: "/images/cool_cat.png",
		email: "email address",
		description: "description",
		age: 38,
		gender: 'male',
		interests: []
	}

	$scope.posts = [{text: "Example post. Ideally style and structure for posts from other parts of the site can be used here to see all posts of a user."}]

	$scope.groups =[]

	$scope.editing = false

	$scope.edits = {
		newDescription: ''
	}

	/* Interest control for md-autocomplete */
	$scope.interestCtrl = {}

	$scope.interestCtrl.searchTextChange = function (text) {
		this.showSubmit = false
	}

	$scope.interestCtrl.selectedItemChange = function (item) {
		this.showSubmit = true
	}

	$scope.interestCtrl.querySearch = function (query) {
		return $http.get("/interests").then(function (result) {
			var interests = result.data.map( function (interest) {
				interest.value = interest.name.toLowerCase();
				return interest;
			});
			return interests.filter($scope.interestCtrl.createFilterFor(query))
		})
	}

	$scope.interestCtrl.createFilterFor = function (query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(item) {
			return (item.value.indexOf(lowercaseQuery) === 0) && $scope.user
			.interests.filter(function (x) {
				return x._id == item._id
			}).length == 0;
		};
	}

	$scope.interestCtrl.interestText = ''
	$scope.interestCtrl.selectedInterest = null
	$scope.showSubmit = false

	$scope.interestCtrl.addNewInterest = function () {
		if(!this.selectedInterest){
			return
		}
		$scope.saveEdits({interests: $scope.user.interests.concat([this.selectedInterest])}, function () {
			$scope.interestCtrl.selectedInterest = null
			$scope.interestCtrl.interestText = ''
			$scope.interestCtrl.showSubmit = false
		})
	}

	/* End Interest Control */

	/* Group control for md-autocomplete */
	$scope.groupCtrl = {}
	$scope.descriptionCutOff = 100 // Max length of desc

	$scope.groupCtrl.searchTextChange = function (text) {
	    this.showSubmit = false
	}

	$scope.groupCtrl.selectedItemChange = function (item) {
	    this.showSubmit = true
	}

	$scope.groupCtrl.querySearch = function (query) {
	    return $http.get("/groups").then(function (result) {
	        var groups = result.data.map( function (group) {
	            group.value = group.name.toLowerCase();
				if(group.description.length > $scope.descriptionCutOff){
					group.description = group.description.substring(0, $scope.descriptionCutOff) + '...'
				}
	            return group;
	        });
			console.log(result.data)
			console.log(groups)
	        return groups.filter($scope.groupCtrl.createFilterFor(query))
	    })
	}

	$scope.groupCtrl.createFilterFor = function (query) {
	    var lowercaseQuery = angular.lowercase(query);
	    return function filterFn(item) {
	        return (item.value.indexOf(lowercaseQuery) === 0) && $scope
	        .groups.filter(function (x) {
	            return x._id == item._id
	        }).length == 0;
	    };
	}

	$scope.groupCtrl.groupText = ''
	$scope.groupCtrl.selectedGroup = null
	$scope.showSubmit = false

	$scope.groupCtrl.addNewGroup = function () {
	    if(!this.selectedGroup){
	        return
	    }
	    //$scope.saveEdits({groups: $scope.groups.concat([this.selectedGroup])}, function () {
		$http.post('/groups/group/addmember', {group: $scope.groupCtrl.selectedGroup})
		.success(function (data, status, headers, config) {
			$scope.groups.push($scope.groupCtrl.selectedGroup)
	        $scope.groupCtrl.selectedGroup = null
	        $scope.groupCtrl.groupText = ''
	        $scope.groupCtrl.showSubmit = false
		}).error(function (data, status, headers, config){
			alert("Failed to add group " + data.error)
		})
	    //})
	}

	/* End groupCtrl*/

	$scope.setUser = function(username){
		$http.get('/users/profile?username='+username)
		.success(function(data, status, headers, config){
			console.log(data)
			$scope.user = data
			profileService.setUser($scope.user)

			$http.get('/users/user/groups?id='+data._id)
			.success(function(data, status, headers, config){
				$scope.groups = data.map(function (x) {
					var g = x
					if(g.description.length > $scope.descriptionCutOff){
						g.description = g.description.substring(0, $scope.descriptionCutOff) + '...'
					}
					return g
				})
			}).error(function(data, status, headers, config){
				$scope.groups = []
			})

			$http.get('/users/user/posts?username=' + data.username)
			.success(function (data, status, headers, config) {
				$scope.Posts = data
			}).error(function (data, status, headers, config) {
				console.log("Error fetching posts")
			})
		}).error(function(data, status, headers, config){
			$location.path("login")
		})

		$http.get('/users/hasEditPermission?username='+username)
		.success(function(data, status, headers, config){
			$scope.hasEditPermission = data.hasEditPermission
		}).error(function(data, status, headers, config){
			$location.path("login")
			$scope.hasEditPermission = false
		})

	}

	$scope.dismissChanges = function () {
		$scope.editing = false
		$scope.edits = {}
	}

	$scope.isEmpty = function(list){
		return list.length == 0
	}

	$scope.enterEditMode = function(){
		if(!$scope.hasEditPermission){
			return
		}
		$scope.editing = true
	}

	$scope.test = function(){
		alert("Test")
	}

	$scope.saveEdits = function(edits, complete){
		var newUser = jQuery.extend(true, {}, $scope.user)
		for(property in edits){
			newUser[property] = edits[property]
		}
		console.log(edits)

		$http.put("/users/profile", {user: newUser})
		.success(function(data, status, headers, config){
			console.log("Saved changes")
			complete()
			$scope.user = newUser
			profileService.setUser(newUser)
		}).error(function(data, status, headers, config){
			console.log("Failed to save changes")
		})
	}

	$scope.saveChanges = function () {
		$scope.saveEdits($scope.edits, function () {
			$scope.editing = false
			$scope.edits = {}
		})
	}

	if(angular.equals({}, $routeParams)){
		$http.get("/auth/loggedInUser")
		.success(function(data, status, headers, config){
			if(!data.user){
				$location.path("/")
			}else{
				$scope.setUser(data.user.username)
			}
		}).error(function(data, status, headers, config){
			$location.path("/")
		})
	}else{
		$scope.setUser($routeParams.username)
	}
})

crudApp.controller('profilePasswordController', function(profileService, $scope, $http){
	$scope.passwordChange = {
		old: '',
		new1: '',
		new2: ''
	}

	$scope.error = ''

	$scope.resetError = function(){
		$scope.error = ''
	}

	$scope.resetPasswords = function(){
		$scope.passwordChange = {
			old: '',
			new1: '',
			new2: ''
		}
	}

	$scope.changePassword = function(){
		if(!profileService.user){
			return alert("No user!")
		}

		if(!this.passwordChange.old){
			return this.error = "Old password can't be empty!"

		}else if(!this.passwordChange.new1){
			return this.error = "New password can't be empty!"

		}else if(!this.passwordChange.new2){
			return this.error = "Confirm password can't be empty!"

		}else if(this.passwordChange.new1 != this.passwordChange.new2){
			return this.error = "New password doesn't match confirmed password!"
		}

		$http.put("/users/profile/passwordchange", {_id: profileService.user._id,
													new_password: this.passwordChange.new1,
													old_password: this.passwordChange.old})
		.success(function(data, status, headers, config){
			$("#password-modal").modal('hide')
		}).error(function(data, status, headers, config){
			$scope.error = data.error
		})
	}
})

crudApp.controller('profileImageController', function(profileService, $scope, $http){
	$scope.imageChange = {
		file: null
	}

	$scope.error = ''

	$scope.resetError = function(){
		$scope.error = ''
	}

	$scope.resetImage = function(){
		$scope.imageChange = {
			file: null
		}
	}

	$scope.changeImage = function(){
		$scope.resetError()
		if(!profileService.user){
			return alert("No user!")
		}

		var file = document.getElementById("new_image").files[0]
		console.log(file)

		if(!file){
			return $scope.error = "You must choose a file!"

		}

		var reader = new FileReader();
		reader.onload = function(){
			$http.post("/users/fileupload", {_id: profileService.user._id,
											file: reader.result})
			.success(function(data, status, headers, config){
				$("#image-upload-modal").modal('hide')
				profileService.user.imageurl = data.newURL + '?decache=' + Math.random();
				//$("#profile-img").attr('src', data.newURL)
			}).error(function(data, status, headers, config){
				$scope.error = data.error
			})
		}
		reader.readAsDataURL(file)
	}
})
