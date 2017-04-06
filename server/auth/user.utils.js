var Q = require("q");
var _ = require('lodash');

exports.createOrUpdateUserBasedOnOathProfile = function (User, profile, type, conversionMethod, isimport) {

  console.log("Profile received from " + type, JSON.stringify(profile));
  var deferred = Q.defer();
  var selector = {};

  var cleanedType = type;
  if(cleanedType.indexOf("_")>0){
    cleanedType = cleanedType.substring(0, cleanedType.indexOf("_"));
    console.log(cleanedType);
  }

  selector["oauth." + cleanedType + ".id"] = profile.id
 // console.log(JSON.stringify(selector));

  User.findOne(selector,
    function (err, user) {
      if (err) {
        deferred.reject(err);
      }

      if (!user) {
        console.log("User doesn't exist, creating it based on ",JSON.stringify( profile));
        var oauthProfile = conversionMethod(profile, type, cleanedType);
        console.log("Converted profile to", JSON.stringify(oauthProfile));

        user = new User({
          provider: cleanedType,
          oauth: {}
        });
        //avoid duplicate!!!!
        //oauth: {
        //  instagram: useritem
        //}

        copyOAuthToUser(user, oauthProfile,isimport);

        user.oauth[cleanedType] = oauthProfile;

        if(!isimport){
          user.loginCount = 1;
          user.oauth[cleanedType].loginCount = 1;
        }

        console.log("creating user ", JSON.stringify(user));
        user.save(function (err) {
          if (err) {
            console.log(err);
            deferred.reject(err);
          }

          deferred.resolve(user);
        });
      }
      else {
        console.log("Existing user, updating oauth profile for user ", JSON.stringify(user));

        var oauthProfile = conversionMethod(profile, type, cleanedType);

        if (user.oauth[cleanedType] == null) {
          user.oauth[cleanedType] = oauthProfile
        }else{
          _.merge(user.oauth[cleanedType],oauthProfile);
        }

        if (user.provider == cleanedType) {
          //same provider, copy the details to the main user section
          copyOAuthToUser(user, oauthProfile, JSON.stringify(isimport));
        }
        console.log("Updating to ", JSON.stringify(user));

        if(!isimport){
          user.loginCount = (user.loginCount || 0 ) + 1;
          user.oauth[cleanedType].loginCount = (user.oauth[cleanedType].loginCount || 0 ) + 1;
        }

        user.save(function (err) {
          if (err) {
            deferred.reject(err);
          }
          deferred.resolve(user);
        });
      }
    });
  return deferred.promise;
}
function copyOAuthToUser(user, oauthProfile, isimport) {
  user.name = oauthProfile.username;
  user.fullname = oauthProfile.fullname;
  if (oauthProfile.email) {
    user.email = oauthProfile.email;
  }
  user.profile_picture = oauthProfile.profile_picture;
  user.profile_link = oauthProfile.profile_link;

  if(isimport){
    user.imported = true;
  }

}



