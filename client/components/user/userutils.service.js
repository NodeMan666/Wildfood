'use strict';
angular
    .module('wildfoodApp.utils')
    .service(
    'UserUtils',
    [

        function () {

            function enhanceUser(user) {

                user.username = user.name;

                user.hasUserName = user.username != null
                    && user.username !== "";

                user.hasFullName = user.fullname != null
                    && user.fullname !== "";

                user.areNamesDifferent = user.hasUserName
                    && user.hasFullName
                    && user.fullname != user.username;

                var formatted_name;
                if (user.username != null && user.fullname != null) {
                    if (user.username != user.fullname) {
                        formatted_name = user.fullname + "@" + user.username;
                    } else {
                        formatted_name = user.fullname;
                    }

                } else if (user.username != null) {
                    formatted_name = user.username;
                } else if (user.fullname != null) {
                    formatted_name = user.fullname;
                }

                user.formatted_name = formatted_name;

                user.showUser = !user.hasFullName
                    || (user.hasUserName && user.areNamesDifferent);

                user.showAt = user.showUser && user.hasFullName
                    && user.areNamesDifferent;

                user.showUserNameAsLink = user.hasUserName
                    && !user.hasFullName;
            }


            return {
                refineUser: function (user) {
                    return enhanceUser(user);
                }
            }

        } ]);
