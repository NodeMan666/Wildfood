'use strict';

angular.module('wildfoodApp')
    .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
        var currentUser = {};
        if ($cookieStore.get('token')) {
            console.log("set current user");
            currentUser = User.get();
        }

        return {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            login: function (user, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();

                $http.post('/auth/local', {
                    email: user.email,
                    password: user.password
                }).
                    success(function (data) {
                        $cookieStore.put('token', data.token);
                        currentUser = User.get();
                        deferred.resolve(data);
                        return cb();
                    }).
                    error(function (err) {
                        this.logout();
                        deferred.reject(err);
                        return cb(err);
                    }.bind(this));

                return deferred.promise;
            },

            /**
             * Delete access token and user info
             *
             * @param  {Function}
             */
            logout: function () {
                $cookieStore.remove('token');
                currentUser = {};
            },
            refreshUser: function () {
                currentUser = User.get();
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            createUser: function (user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function (data) {
                        $cookieStore.put('token', data.token);
                        currentUser = User.get();
                        return cb(user);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changePassword: function (oldPassword, newPassword, callback) {
            var cb = callback || angular.noop;

            return User.changePassword({ id: currentUser._id }, {
              oldPassword: oldPassword,
              newPassword: newPassword
            }, function (user) {
              return cb(user);
            }, function (err) {
              return cb(err);
            }).$promise;
          },
          updateDetails: function (details,image, callback) {

            if(image!=null){
              if(image.preview != details.profile_picture){
                details.profile_picture =image.versions.thumb.url;
              }
            }else{
              details.profile_picture =null;
            }
            var cb = callback || angular.noop;


            return User.update({ id: currentUser._id }, details, function (user) {
              return cb(user);
            }, function (err) {
              return cb(err);
            }).$promise;
          },
            /**
             * Gets all available info on authenticated user
             *
             * @return {Object} user
             */
            getCurrentUser: function () {
                return currentUser;
            },
            isCurrentUserLocal: function () {
            // console.log(currentUser);
            return currentUser && currentUser.provider=="local";
          },

            getCurrentUserId: function () {
                if (currentUser) {
                    return currentUser._id;
                }
                return null;
            },

            /**
             * Check if a user is logged in
             *
             * @return {Boolean}
             */

            isLoggedIn: function () {
                return currentUser.hasOwnProperty('role');
            },

            /**
             * Waits for currentUser to resolve before checking if user is logged in
             */
            isLoggedInAsync: function (cb) {
                if (currentUser.hasOwnProperty('$promise')) {
                    currentUser.$promise.then(function () {
                        cb(true);
                    }).catch(function () {
                        cb(false);
                    });
                } else if (currentUser.hasOwnProperty('role')) {
                    cb(true);
                } else {
                    cb(false);
                }
            },

            /**
             * Check if a user is an admin
             *
             * @return {Boolean}
             */
            isAdmin: function () {
                return currentUser.role === 'admin';
            },

            /**
             * Get auth token
             */
            getToken: function () {
                return $cookieStore.get('token');
            }
        };
    });
