var Importer = require('./importer');
var assert = require("assert")
var Q = require("q");
var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');

var sample = [
  {
    "attribution": null,
    "tags": [
      "fathen",
      "wildfood",
      "purslane",
      "warrigalgreens"
    ],
    "location": {
      "latitude": -33.920561343,
      "name": "Clovelly, New South Wales, Australia",
      "longitude": 151.254015126,
      "id": 217670352
    },
    "comments": {
      "count": 2,
      "data": [
        {
          "created_time": "1422510718",
          "text": "Are they growing in the shade @smankinen ?",
          "from": {
            "username": "havingago",
            "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10903352_832159390179741_574602296_a.jpg",
            "id": "1650481932",
            "full_name": "Linda Hooton"
          },
          "id": "908408202911077417"
        },
        {
          "created_time": "1422522787",
          "text": "hmm I think all of them like the sun but I'm sure you can find the odd exception in the shade too",
          "from": {
            "username": "smankinen",
            "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg",
            "id": "400486076",
            "full_name": "salla"
          },
          "id": "908509449978697641"
        }
      ]
    },
    "filter": "Crema",
    "created_time": "1422507777",
    "link": "http://instagram.com/p/ybOgKUENfT/",
    "likes": {
      "count": 4,
      "data": [
        {
          "username": "theweedyone",
          "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_335719760_75sq_1369519838.jpg",
          "id": "335719760",
          "full_name": "Diego"
        },
        {
          "username": "havingago",
          "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10903352_832159390179741_574602296_a.jpg",
          "id": "1650481932",
          "full_name": "Linda Hooton"
        },
        {
          "username": "foodnfamily_",
          "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10525504_672528449502158_978666113_a.jpg",
          "id": "15726133",
          "full_name": "Karyn"
        },
        {
          "username": "stolengoodssista",
          "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10413269_308903875942526_1146801856_a.jpg",
          "id": "1369227437",
          "full_name": "Indiana K'"
        }
      ]
    },
    "images": {
      "low_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/s306x306/e15/10932132_926227504075210_446662317_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/10932132_926227504075210_446662317_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10932132_926227504075210_446662317_n.jpg",
        "width": 640,
        "height": 640
      }
    },
    "users_in_photo": [],
    "caption": {
      "created_time": "1422507777",
      "text": "The incredible salad mix straight from the ground #Warrigalgreens #fathen #purslane #wildfood added bonus of  salt provided by the sea spray",
      "from": {
        "username": "smankinen",
        "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg",
        "id": "400486076",
        "full_name": "salla"
      },
      "id": "908383532862199684"
    },
    "type": "image",
    "id": "908383532593764307_400486076",
    "user": {
      "username": "smankinen",
      "website": "",
      "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg",
      "full_name": "salla",
      "bio": "",
      "id": "400486076"
    }
  },
  {
    "attribution": null,
    "tags": [
      "wildfood",
      "warrigalgreens"
    ],
    "location": {
      "latitude": -33.920561343,
      "name": "Clovelly, New South Wales, Australia",
      "longitude": 151.254015126,
      "id": 217670352
    },
    "comments": {
      "count": 0,
      "data": []
    },
    "filter": "Crema",
    "created_time": "1422499580",
    "link": "http://instagram.com/p/ya-3mDENcJ/",
    "likes": {
      "count": 4,
      "data": [
        {
          "username": "theweedyone",
          "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_335719760_75sq_1369519838.jpg",
          "id": "335719760",
          "full_name": "Diego"
        },
        {
          "username": "gardeningfirststeps",
          "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_1434352708_75sq_1406910241.jpg",
          "id": "1434352708",
          "full_name": "gardeningfirststeps"
        },
        {
          "username": "stolengoodssista",
          "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10413269_308903875942526_1146801856_a.jpg",
          "id": "1369227437",
          "full_name": "Indiana K'"
        },
        {
          "username": "mexicorosel",
          "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10903569_765885323487303_193278589_a.jpg",
          "id": "11699078",
          "full_name": "mexico rosel"
        }
      ]
    },
    "images": {
      "low_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/s306x306/e15/10549835_576092842534384_1808862412_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/s150x150/e15/10549835_576092842534384_1808862412_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/e15/10549835_576092842534384_1808862412_n.jpg",
        "width": 640,
        "height": 640
      }
    },
    "users_in_photo": [],
    "caption": {
      "created_time": "1422499580",
      "text": "#Warrigalgreens #wildfood at the sunset last sunday",
      "from": {
        "username": "smankinen",
        "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg",
        "id": "400486076",
        "full_name": "salla"
      },
      "id": "908314774420378685"
    },
    "type": "image",
    "id": "908314774177109769_400486076",
    "user": {
      "username": "smankinen",
      "website": "",
      "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg",
      "full_name": "salla",
      "bio": "",
      "id": "400486076"
    }
  },
  {
    "attribution": null,
    "tags": [
      "wildfood",
      "boroughmarket",
      "mushroom",
      "dairyfree",
      "veggie",
      "vegan",
      "vegansofinstagram",
      "organicfood",
      "instavegan",
      "vegetablephotography",
      "veganshare",
      "vegetables",
      "veganaccount",
      "crueltyfree",
      "whatveganseat",
      "vegetarian"
    ],
    "location": {
      "latitude": 55.945404638,
      "longitude": -3.191086901
    },
    "comments": {
      "count": 2,
      "data": [
        {
          "created_time": "1422463431",
          "text": "#vegan#whatveganseat#instavegan#veganshare#boroughmarket#mushroom#wildfood#organicfood#vegansofinstagram#dairyfree#crueltyfree#vegetables#vegetarian#veggie#veganaccount#vegetablephotography",
          "from": {
            "username": "createcesca",
            "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10467847_804016132971817_1640180864_a.jpg",
            "id": "1428859916",
            "full_name": "Francesca"
          },
          "id": "908011537620063681"
        },
        {
          "created_time": "1422463585",
          "text": "They are my absolute fave! ❤️",
          "from": {
            "username": "justanotherhighcarbvegan",
            "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xap1/t51.2885-19/10611273_391007581058477_868791422_a.jpg",
            "id": "1526968867",
            "full_name": "EATING FRUIT & LOVING LIFE"
          },
          "id": "908012823258125868"
        }
      ]
    },
    "filter": "Normal",
    "created_time": "1422463328",
    "link": "http://instagram.com/p/yZ5uUlzNVf/",
    "likes": {
      "count": 21,
      "data": [
        {
          "username": "veganrebecca",
          "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10808610_353874314772261_1861334831_a.jpg",
          "id": "544269009",
          "full_name": "Animal lover 🐏"
        },
        {
          "username": "semiraxfood",
          "profile_picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10890534_921881731185986_2110185438_a.jpg",
          "id": "1556043971",
          "full_name": "Semira 🍓"
        },
        {
          "username": "fitfruity",
          "profile_picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10899291_338706646313410_706845518_a.jpg",
          "id": "1635698956",
          "full_name": "Fit and Fruity"
        },
        {
          "username": "saffronlamont",
          "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_292052212_75sq_1358707943.jpg",
          "id": "292052212",
          "full_name": "Saffron Lamont"
        }
      ]
    },
    "images": {
      "low_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/s306x306/e15/924629_1535405430063497_1803174720_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/s150x150/e15/924629_1535405430063497_1803174720_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/e15/924629_1535405430063497_1803174720_n.jpg",
        "width": 640,
        "height": 640
      }
    },
    "users_in_photo": [],
    "caption": {
      "created_time": "1422463328",
      "text": "I don't get how so many people hate mushrooms, they are one of my absolute favourite vegetables! Was in my element with this table of beauties 😍",
      "from": {
        "username": "createcesca",
        "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10467847_804016132971817_1640180864_a.jpg",
        "id": "1428859916",
        "full_name": "Francesca"
      },
      "id": "908010672007992688"
    },
    "type": "image",
    "id": "908010671747945823_1428859916",
    "user": {
      "username": "createcesca",
      "website": "",
      "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10467847_804016132971817_1640180864_a.jpg",
      "full_name": "Francesca",
      "bio": "",
      "id": "1428859916"
    }
  },
  {
    "attribution": null,
    "tags": [
      "wildfood",
      "boroughmarket",
      "mushroom",
      "dairyfree",
      "veggie",
      "vegan",
      "vegansofinstagram",
      "organicfood",
      "instavegan",
      "vegetablephotography",
      "veganshare",
      "vegetables",
      "veganaccount",
      "crueltyfree",
      "whatveganseat",
      "vegetarian"
    ],
    "location": null,
    "comments": {
      "count": 2,
      "data": [
        {
          "created_time": "1422463431",
          "text": "#vegan#whatveganseat#instavegan#veganshare#boroughmarket#mushroom#wildfood#organicfood#vegansofinstagram#dairyfree#crueltyfree#vegetables#vegetarian#veggie#veganaccount#vegetablephotography",
          "from": {
            "username": "createcesca",
            "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10467847_804016132971817_1640180864_a.jpg",
            "id": "1428859916",
            "full_name": "Francesca"
          },
          "id": "908011537620063681"
        },
        {
          "created_time": "1422463585",
          "text": "They are my absolute fave! ❤️",
          "from": {
            "username": "justanotherhighcarbvegan",
            "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xap1/t51.2885-19/10611273_391007581058477_868791422_a.jpg",
            "id": "1526968867",
            "full_name": "EATING FRUIT & LOVING LIFE"
          },
          "id": "908012823258125868"
        }
      ]
    },
    "filter": "Normal",
    "created_time": "1422463328",
    "link": "http://instagram.com/p/yZ5uUlzNVf/",
    "likes": {
      "count": 21,
      "data": [
        {
          "username": "veganrebecca",
          "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10808610_353874314772261_1861334831_a.jpg",
          "id": "544269009",
          "full_name": "Animal lover 🐏"
        },
        {
          "username": "semiraxfood",
          "profile_picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10890534_921881731185986_2110185438_a.jpg",
          "id": "1556043971",
          "full_name": "Semira 🍓"
        },
        {
          "username": "fitfruity",
          "profile_picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10899291_338706646313410_706845518_a.jpg",
          "id": "1635698956",
          "full_name": "Fit and Fruity"
        },
        {
          "username": "saffronlamont",
          "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_292052212_75sq_1358707943.jpg",
          "id": "292052212",
          "full_name": "Saffron Lamont"
        }
      ]
    },
    "images": {
      "low_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/s306x306/e15/924629_1535405430063497_1803174720_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/s150x150/e15/924629_1535405430063497_1803174720_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/e15/924629_1535405430063497_1803174720_n.jpg",
        "width": 640,
        "height": 640
      }
    },
    "users_in_photo": [],
    "caption": {
      "created_time": "1422463328",
      "text": "I don't get how so many people hate mushrooms, they are one of my absolute favourite vegetables! Was in my element with this table of beauties 😍",
      "from": {
        "username": "createcesca",
        "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10467847_804016132971817_1640180864_a.jpg",
        "id": "1428859916",
        "full_name": "Francesca"
      },
      "id": "908010672007992688"
    },
    "type": "image",
    "id": "908010671ddd747945823_1428859916",
    "user": {
      "username": "createcesca",
      "website": "",
      "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10467847_804016132971817_1640180864_a.jpg",
      "full_name": "Francesca",
      "bio": "",
      "id": "1428859916"
    }
  }
];
describe('Instgram import', function () {
  before(function (done) {

    TestMarkerUtils.clearAll().then(function (m) {
      return TestUserUtils.createUserAndLogin().then(function (m) {
        done();
      });
    }).done();
  });

  it('test mock instagram return', function (done) {

    var deferred = Q.defer();
    this.timeout(8000);

    Importer.onInstagramResponse(deferred, {plants: [], maxpages: 1}, sample, {});
    deferred.promise.then(function (results) {
      console.log(results.length);
      assert.equal(results.length, 4);
      assert(results[0]._id != null);
      assert(results[1]._id != null);
      assert(results[2]._id != null);

      assert.equal(results[3].status, 1);

      var deferred2 = Q.defer();
      Importer.onInstagramResponse(deferred2, {plants: [], maxpages: 1}, sample, {});

     return deferred2.promise.then(function (results) {
        console.log(results.length);
        //results.forEach(function(item){
        //  console.log(JSON.stringify(item));
        //});
        assert.equal(results.length, 4);
        assert.equal(results[0].status, 2);
        assert.equal(results[1].status, 2);
        assert.equal(results[2].status, 2);
        assert.equal(results[3].status, 1);
        // assert.equal(results.length, 0);

        done();
      });

    }).done();


  });
});

