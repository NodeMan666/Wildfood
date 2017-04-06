'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

var oauth = {

    'wildfoodmapdev.herokuapp.com': {
        facebook: {
            clientID: '733690470053754',
            clientSecret: '8dc547d8de6498b233af929b0645819a',
            callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
        },

        twitter: {
            clientID: 'bEJgo8NlVyVEvHDBg9e2Ay5iZ ',
            clientSecret: 'ENMKqV9knL8wUxeFgZnrPu5yzAbtVAsQGq1WLB9oCVTcp9KcqT',
            callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
        },

        google: {
            clientID: '323676162153-htkojlq5j2vqk0kp84h18ok0i3ja54q6.apps.googleusercontent.com',
            clientSecret: 'N_eW7OnYrieYedP8AEz3ZShJ',
            callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
        },


        instagram: {
            clientID: 'fa54dfe159084afa95bb45982e8812d1',
            clientSecret: 'ae021995456a454285c54392baef8b48',
            callbackURL: (process.env.DOMAIN || '') + '/auth/instagram/callback'
        }
    },
    'wildfoodmap.herokuapp.com': {
        facebook: {
            clientID: '733689513387183',
            clientSecret: 'c62ce76eaaeea41f90c6abce74637e17',
            callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
        },

        twitter: {
            clientID: 'vfrjYdctpwqAfol0CoeisgEDo',
            clientSecret: 'eTzvRRuQipYtQWrYgyZdPS81mMUbSh15bQpAE8UUXzjvQef3Mu',
            callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
        },

        google: {
            clientID: '323676162153-12nvdq30q2gf00qslr1dof47umo4dtav.apps.googleusercontent.com',
            clientSecret: 'Sz7JSP3Zjgzj4liOPRAVICCq',
            callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
        },


        instagram: {
            clientID: '5ae4e91645ee4339a4568646bd2b90fe',
            clientSecret: '23525d976a0141e28dddb2a9cf4200c9',
            callbackURL: (process.env.DOMAIN || '') + '/auth/instagram/callback'
        }
    },
    'wildfoodmapdev2.herokuapp.com': {
        facebook: {
            clientID: '698111850312341',
            clientSecret: '947faef74104ab2a7c959f6d3bb5c613',
            callbackURL: '/auth/facebook/callback'
        },

        twitter: {
            clientID: 'Pp64DYYxtJE7kZFItrxbynI5g',
            clientSecret: 'Qc7BmoaNsMXW5zrcTtUtido2p2D9gY7VbA2hKZS3qglPyEq6Kz',
            callbackURL: '/auth/twitter/callback'
        },

        google: {
            clientID: '323676162153-52pjkakpshg2v5hngjmovcrg0vgvlcr5.apps.googleusercontent.com',
            clientSecret: 'R9CN4CLByzGtSuQuX4gR4OMT',
            callbackURL: '/auth/google/callback'
        },


        instagram: {
            clientID: '66acd9ce91b8468da6ab4c1629b61bcd',
            clientSecret: '70ae427c982a48b091c35f85cf0d1cb0',
            callbackURL: '/auth/instagram/callback'
        }
    },
    'wildfood.me': {
        facebook: {
            clientID: '736325779790223',
            clientSecret: '18c82641d8981ca984c549e548ce508d',
            callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
        },

        twitter: {
            clientID: 'DZShTwl5DsGKn0yQ8ZJ0h3WEE',
            clientSecret: 'S8WHjbksBVLo4noNDWyb6jWZ060WXelnMcv9vQdpTVVfPYU1yi',
            callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
        },

        google: {
            clientID: '323676162153-t5ko6bokoesb2om40r6to3tdkd1phvql.apps.googleusercontent.com',
            clientSecret: 'C_6H4Jfb2PaPR1zu9HzStoMI',
            callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
        },


        instagram: {
            clientID: '3ce16ff4085242699195e0562b09717b',
            clientSecret: 'ffff16ccb99444778cfb8a3ca5ecc890',
            callbackURL: (process.env.DOMAIN || '') + '/auth/instagram/callback'
        }
    },

    'wildfood.in': {
        facebook: {
            clientID: '733688820053919',
            clientSecret: '350e9da80636cbe7f8b56d1502db0b55',
            callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
        },

        twitter: {
            clientID: '6zOE99cMQdXg7heMFmH2eidzL',
            clientSecret: 'PxyowHatJSHmhyyKXU1aPD4p9b4IVNRKuwY28Bvc2A4VPmwJvk',
            callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
        },

        google: {
            clientID: '323676162153-m5j7pl5r1n1uoahb05bui6119d2g0dvs.apps.googleusercontent.com',
            clientSecret: 'DBiZ7NIFyhwSAzBxcbQKZjKj',
            callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
        },


        instagram: {
            clientID: 'b4ed304afc40490b9f26696596e3b3e6',
            clientSecret: '83e5238d0120492ca618ac1122f882e4',
            callbackURL: (process.env.DOMAIN || '') + '/auth/instagram/callback'
        }
    }

};

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Should we populate the DB with sample data?
    seedDB: false,

    runJobs: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'wildfood-secret'
    },

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    jobs: {
        userrefresh: {timeout: 2000},
        migratemarkers: {timeout: 1050, pagesize: 1000, maxpage: 100},
        importmarkers: {timeout: 1050, maxpage: 10,
            //var tags = ['wildfood', 'wildedibles', 'wildfoodmap', "hortoilu", "foraging"];
            //var tags = ['wildfood', 'wildedibles', 'wildfoodmap'];
            tags:['wildfood', 'wildedibles', 'wildfoodmap', "foraging"]
        }
    },


    google: {
        api_key: "AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM"
    },

    instagram: {
        client_id: "66acd9ce91b8468da6ab4c1629b61bcd",
        client_secret: "70ae427c982a48b091c35f85cf0d1cb0"
    },

    flickr:  {
        api_key: "abe0822b463e844239ddbb63155613b3",
        secret: "a02cf544c03ed917",
        permissions: "write",
        user_id: "129640022@N06",
        access_token: "72157650062184755-091b588453a80e44",
        access_token_secret: "edf165e722fd7d6a"
    },

    getOauthConfig: function (key) {
       // console.log("getting CONFIG for " + key + " in " + process.env.DOMAIN);


        var currentConfig = oauth[process.env.DOMAIN];
        if (currentConfig == undefined) {
          //  console.log("no config found getting default");
            currentConfig = {
                facebook: {
                    clientID: process.env.FACEBOOK_ID || 'id',
                    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
                    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
                },

                twitter: {
                    clientID: process.env.TWITTER_ID || 'id',
                    clientSecret: process.env.TWITTER_SECRET || 'secret',
                    callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
                },

                google: {
                    clientID: process.env.GOOGLE_ID || 'id',
                    clientSecret: process.env.GOOGLE_SECRET || 'secret',
                    callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback',
                    api_key: "AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM"
                },

                instagram: {
                    clientID: process.env.INSTARAM_ID || 'id',
                    clientSecret: process.env.INSTARAM_SECRET || 'secret',
                    callbackURL: (process.env.DOMAIN || '') + '/auth/instagram/callback'
                }
            }
        }
        return currentConfig[key];
    }

};


// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
        require('./' + process.env.NODE_ENV + '.js') || {});











