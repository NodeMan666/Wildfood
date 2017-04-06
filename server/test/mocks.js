var user = {
  provider: 'local',
  name: 'Test User',
  fullname: 'full name',
  email: 'test@test.com',
  password: 'test',
  imported: false,
  profile_picture: "http://graph.facebook.com/10152019315226916/picture",
  profile_link: "https://www.facebook.com/app_scoped_user_id/10152019315226916/",
  facebook: {
    profile_picture: 'test'
  }
};

var admin = {
  provider: 'local',
  role: 'admin',
  name: 'Admin',
  email: 'admin@admin.com',
  imported: false,
  password: 'admin',
  profile_picture: "http://graph.facebook.com/10152019315226916/picture",
  profile_link: "https://www.facebook.com/app_scoped_user_id/10152019315226916/"
};

function getMarker2(plantid, userid) {
  return {
    plant: plantid,
    location: {
      position: [151.211547, -33.866473],
      address: {
        name: "Sydney Park",
        state: "NSW",
        country: "Australia"
      }
    },
    comments: [],
    images: [
      {

        versions: {
          thumb: {
            url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_s.jpg"
          },
          low: {
            url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_a.jpg"
          },
          standard: {
            url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_n.jpg"
          }
        }

      }
    ],
    description: "yep yep",
    source: "instagram",
    private: false,
    owner: userid
  }
}

function getMarker(plantid, userid) {
  return {
    plant: plantid,
    location: {

      position: [151.1893535, -33.9123199],
      address: {
        locality: {},
        state: {},
        country: {},
        formatted_long: 'Bronte NSW AU',
        formatted_short: 'Bronte NSW AU'
      }
    },
    comments: [
      {
        text: "my comment",
        owner: userid,
        images: [
          {
            versions: {
              thumb: {
                url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_s.jpg"
              },
              low: {
                url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_a.jpg"
              },
              standard: {
                url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_n.jpg"
              }
            }
          }
        ]
      }
    ],
    images: [
      {

        versions: {
          thumb: {
            url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_s.jpg"
          },
          low: {
            url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_a.jpg"
          },
          standard: {
            url: "http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/928686_329349567267172_1632714988_n.jpg"
          }
        }

      }
    ],
    tags: "#raspberries",
    description: "blaah blaah",
    source: "instagram",
    private: false,
    owner: userid
  }
}

function getCleanMarker() {
  return {
    location: {
      position: [151.1893535, -33.9123199]

    },
    description: "test",
    source: "web"
  }
}


var plants = [
  {
    scientificName: 'Rubus parvifolius',
    family: 'Rose',
    legacyid: 123,
    localisedProfile: {
      en_au: {
        commonNames: ['Native Raspberry'],
        origin: 'Europe',
        habitat: 'Heathland and eucalyptus woodland',
        description: 'Scrambling shrub with red fruit 1cm in size',
        characteristics: 'hardy wooded sparse bush',
        distinguishingFeatures: 'Young stems are finely pubescent, becoming hairless with age. The leaves are pinnate with 3 to 5 toothed leaflets. Flowers have red or pink petals',
        notes: [
          {alerttype: 'info', text: "info message"},
          {alerttype: 'info', text: "info message2"}

        ],
        warnings: [
          {alerttype: 'warning', text: "warning message"}

        ],
        danger: [
          {alerttype: 'danger', text: "danger message"}

        ]
      }
    }, images: [
    {
      title: "Fruit of native raspberry",
      versions: {
        thumb: {
          url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Rubus_parvifolius_fruit.jpg/640px-Rubus_parvifolius_fruit.jpg"
        },
        standard: {
          url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Rubus_parvifolius_fruit.jpg/640px-Rubus_parvifolius_fruit.jpg"
        },
        low: {
          url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Rubus_parvifolius_fruit.jpg/640px-Rubus_parvifolius_fruit.jpg"
        }
      },
      describedParts: {
        roots: false,
        stems: true,
        bark: false,
        leaves: true,
        flowers: true,
        fruit: true
      }
    }
  ],
    edibility: {
      edible: true,
      rating: 5,
      parts: [{
        edible: true,
        part: 'berries'
      }, {
        notedible: true,
        part: 'leaves'
      }]
    }


  },
  {
    scientificName: 'Taraxacum officinale',
    localisedProfile: {
      en_au: {
        commonNames: ['Dandelion', 'Common Dandelion'],
        origin: 'Europe',
        habitat: 'Open fields',
        description: 'Yellow flower, white fluffy seed ball',
        characteristics: 'seeds can be blown from the stem',
        distinguishingFeatures: '',
        hazards: 'None'
      }
    },
    family: 'Asteraceae',
    legacyid: 1234,
    images: [
      {

        title: "Illustration of plant",


        versions: {
          thumb: {
            url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/320px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg"
          },
          low: {
            url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/320px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg"
          },
          standard: {
            url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/320px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg"
          }
        },
        describedParts: {
          roots: true,
          stems: true,
          bark: false,
          leaves: true,
          flowers: true,
          fruit: true
        }
      }
    ]

  }
];

exports.plants = plants;
exports.user = user;
exports.admin = admin;
exports.getMarker = getMarker;
exports.getMarker2 = getMarker2;
exports.getCleanMarker = getCleanMarker;
