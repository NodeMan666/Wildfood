'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');
var TestMarkerUtils = require('./../../test/test.marker.utils.js');
var Mocks = require('./../../test/mocks');

describe('marker tests', function () {
  describe('Test based on creating markers', function () {
    var plant;
    before(function (done) {
      TestMarkerUtils.seedPlantLoginAndGetRandomPlant().then(function (m) {
        plant = m;
        done();
      });
    });

    describe('addmarker functions', function () {
      var plant;
      before(function (done) {
        TestMarkerUtils.seedPlantLoginAndGetRandomPlant().then(function (m) {
          plant = m;
          done();
        });
      });

      it('add marker, delete marker', function (done) {
        //   this.timeout(1000000)
        // ;
        var marker = Mocks.getCleanMarker();
        TestMarkerUtils.addMarker(marker).then(function (returnvalue) {
          console.log(returnvalue);

          assert.equal(returnvalue.description, "test");
          TestMarkerUtils.getmarker(returnvalue._id).then(function (m) {
            assert.equal(m.description, "test");
            TestUserUtils.getCurrentUser().then(function (user) {
              assert.equal(returnvalue.owner._id, user._id);
              request(app)
                .delete('/api/marker/' + returnvalue._id)
                .set('Authorization', 'Bearer ' + TestUserUtils.getToken())
                .expect(204)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                  TestMarkerUtils.getmarker(returnvalue._id, 404).then(function (m) {
                    done();
                  });


                });
            })
          });
        })
      });

      it('test geo location', function (done) {
        var marker = Mocks.getCleanMarker();

        marker.location.position = [151.211547, -33.866473];

        TestMarkerUtils.addMarker(marker).then(function (returnvalue) {

          marker = returnvalue;

          var address = returnvalue.location.address;
          console.log(JSON.stringify(address));
          console.log(JSON.stringify(returnvalue.location.position));
          assert.notStrictEqual(returnvalue.location.position, [151.211547, -33.866473]);
          assert.equal(address.country.short_name, "AU");
          assert.equal(address.state.short_name, "NSW");
          assert.equal(address.locality.short_name, "Sydney");
          assert.equal(address.country.long_name, "Australia");
          assert.equal(address.state.long_name, "New South Wales");
          assert.equal(address.locality.long_name, "Sydney");
          assert.equal(address.formatted_short, "Sydney NSW AU");
          assert.equal(address.formatted_long, "Sydney, New South Wales, Australia");

          // done();

          marker.location.position = [145.192226, -37.713767];
          marker.plant = null;

          TestMarkerUtils.updateMarker(marker).then(function (returnvalue) {
            marker = returnvalue;
            //console.log(JSON.stringify(returnvalue));
            assert.notStrictEqual(returnvalue.location.position, [145.192226, -37.713767]);

            var address = returnvalue.location.address;
            console.log(JSON.stringify(address));
            assert.equal(address.country.short_name, "AU");
            assert.equal(address.state.short_name, "VIC");
            assert.equal(address.locality.short_name, "Research");
            assert.equal(address.country.long_name, "Australia");
            assert.equal(address.state.long_name, "Victoria");
            assert.equal(address.locality.long_name, "Research");
            assert.equal(address.formatted_short, "Research VIC AU");
            assert.equal(address.formatted_long, "Research, Victoria, Australia");
            done();
          });
        });
      });

      it('add marker with image', function (done) {
        this.timeout(30000);
        var marker = Mocks.getCleanMarker();
        TestMarkerUtils.addMarkerWithImage(marker).then(function (returnvalue) {
          console.log(returnvalue);

          assert.equal(returnvalue.description, "test");
          assert.equal(returnvalue.images.length, 1)
          done();
        })
      });

      it('add marker without image then add image at update', function (done) {
        this.timeout(30000);
        var marker = Mocks.getCleanMarker();
        TestMarkerUtils.addMarker(marker).then(function (returnmarker) {
          console.log(returnmarker);
          assert.equal(returnmarker.images.length, 0);
          TestMarkerUtils.postimage().then(function (resultimage) {
            returnmarker.images = [resultimage];
            TestMarkerUtils.updateMarker(returnmarker).then(function (returnvalue) {
              console.log(returnvalue);
              assert.equal(returnvalue.images.length, 1);
              done();
            });
          });
        })
      });

      it('make sure marker count is updated for plant', function (done) {
        var marker = Mocks.getCleanMarker();
        var originalMarkerCount = plant.marker_count || 0;

        marker.plant = plant._id;
        TestMarkerUtils.addMarker(marker).then(function (returnmarker) {
          assert.equal(returnmarker.plant.marker_count, originalMarkerCount + 1)
          TestMarkerUtils.getPlant(plant._id).then(function (returnplant) {
            assert.equal(returnplant.marker_count, originalMarkerCount + 1)
            TestMarkerUtils.addMarker(marker).then(function (returnmarker) {
              assert.equal(returnmarker.plant.marker_count, originalMarkerCount + 2);
              TestMarkerUtils.getPlant(plant._id).then(function (returnplant) {
                console.log(returnplant);
                assert.equal(returnplant.marker_count, originalMarkerCount + 2);
                done();
              }).done();
            }).done();
          }).done();
        }).done();
      });


    });
  });

  describe('marker count update for plants', function () {
    var plants;
    before(function (done) {
      TestMarkerUtils.seedPlantsAndLogin().then(function (m) {
        plants = m;
        done();
      });
    });

    it('make sure marker count is updated for plants when changing plant at edit marker', function (done) {
      this.timeout(10000);
      var marker = Mocks.getCleanMarker();

      var originalMarkerCount0 = plants[0].marker_count || 0;
      var originalMarkerCount1 = plants[1].marker_count || 0;
      marker.plant = plants[0]._id;
      var returnmarker1, returnmarker2;
      TestMarkerUtils.addMarker(marker).then(function (returnmarker) {
        returnmarker1 = returnmarker;
        console.log(returnmarker);
        console.log(originalMarkerCount0 + 1);
        assert.equal(returnmarker.plant.marker_count, originalMarkerCount0 + 1)
        TestMarkerUtils.getPlant(plants[0]._id).then(function (returnplant) {

          assert.equal(returnplant.marker_count, originalMarkerCount0 + 1)

          marker.plant = plants[1]._id;
          TestMarkerUtils.addMarker(marker).then(function (returnmarker) {
            returnmarker2 = returnmarker;
            assert.equal(returnmarker.plant.marker_count, originalMarkerCount1 + 1)

            TestMarkerUtils.getPlant(plants[1]._id).then(function (returnplant) {

              assert.equal(returnplant.marker_count, originalMarkerCount1 + 1)
              //change the plant of the second marker
              returnmarker1.plant = plants[1]._id

              TestMarkerUtils.updateMarker(returnmarker1).then(function (returnmarker) {
                console.log("RETURNAMARKER", returnmarker);

                assert.equal(returnmarker.plant.marker_count, originalMarkerCount1 + 2)

                TestMarkerUtils.getPlant(plants[1]._id).then(function (returnplant) {
                  console.log(returnplant);
                  console.log(originalMarkerCount1 + 2);
                  //done();

                  assert.equal(returnplant.marker_count, originalMarkerCount1 + 2)
                  TestMarkerUtils.getPlant(plants[0]._id).then(function (returnplant) {
                    console.log(returnplant);
                    console.log(originalMarkerCount0);

                    assert.equal(returnplant.marker_count, originalMarkerCount0)
                    done();
                  }).done();
                }).done();

              }).done();
            }).done();

          }).done();
        }).done();
      }).done();
    });
  });


  describe('Voting functions', function () {
    var marker;
    var currentuser;
    before(function (done) {
      TestMarkerUtils.seedDbLoginAndGetRandomMarker().then(function (m) {
        TestUserUtils.getCurrentUser().then(function (returnuser) {
          marker = m;
          currentuser = returnuser;
          done();
        });
      });
    });

    it('like, unlike', function (done) {
      this.timeout(3000);
      var atstart = (marker.likes.items.length || 0);
      var atstartUser = (currentuser.likedMarkers.length || 0);

      TestMarkerUtils.httpPost('/api/marker/' + marker._id + '/likes', {}).then(function (returnvalue) {
        console.log(returnvalue);
        assert.equal(returnvalue.likes.items.length, atstart + 1);
        assert.equal(returnvalue.likes.count, atstart + 1);

        return TestUserUtils.getCurrentUser().then(function (returnuser) {
          console.log(returnuser);
          assert.equal(returnuser.likedMarkers.items.length, atstartUser + 1);
          assert.equal(returnuser.likedMarkers.count, atstartUser + 1);
          return TestMarkerUtils.httpDelete('/api/marker/' + marker._id + '/likes', {}).then(function (returnvalue) {
            assert.equal(returnvalue.likes.items.length, atstart);
            assert.equal(returnvalue.likes.count, atstart);
            return TestUserUtils.getCurrentUser().then(function (returnuser) {
              assert.equal(returnuser.likedMarkers.items.length, atstartUser);
              assert.equal(returnuser.likedMarkers.count, atstartUser);
              done();

            });
          });
        })
      }).done();
    })


  });


  describe('comment functions', function () {
    var marker;
    var currentuser;
    before(function (done) {
      TestMarkerUtils.seedDbLoginAndGetRandomMarker().then(function (m) {
        TestUserUtils.getCurrentUser().then(function (returnuser) {
          marker = m;
          currentuser = returnuser;
          done();
        });
      });
    });

    it('add comment, delete comment', function (done) {
      //   this.timeout(1000000);
      var atstart = marker.comments.length;


      TestMarkerUtils.addcomment(marker, {text: 'blaah'}).then(function (returnvalue) {
        console.log(returnvalue);
        var comment = returnvalue.comments[returnvalue.comments.length - 1];
        assert.equal(returnvalue.comments.length, atstart + 1);
        assert.equal(comment.text, "blaah")
        //comment.text.should.be('blaah');

        TestUserUtils.getCurrentUser().then(function (user) {
          assert.equal(comment.owner._id, user._id);
          request(app)
            .delete('/api/marker/' + marker._id + '/comment/' + comment._id)
            .set('Authorization', 'Bearer ' + TestUserUtils.getToken())
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              assert.equal(res.body.comments.length, atstart - 0);
              done();

            });
        })
      })
    });

    it('add comment with image', function (done) {
      this.timeout(30000);
      var atstart = marker.comments.length;
      TestMarkerUtils.addcommentWithImage(marker, {text: 'blaah'}).then(function (returnvalue) {
        console.log(returnvalue);
        var comment = returnvalue.comments[returnvalue.comments.length - 1];
        console.log(comment);
        assert.equal(returnvalue.comments.length, atstart + 1);
        assert.equal(comment.text, "blaah")
        assert.equal(comment.images.length, 1)

        TestUserUtils.getCurrentUser().then(function (user) {
          assert.equal(comment.owner._id, user._id);
          done();
        })
      })

    });
  });

  describe('admin marker functions', function () {
    var marker;
    var currentuser;
    before(function (done) {
      TestMarkerUtils.seedDbLoginAndGetRandomMarker().then(function (m) {
        marker = m;
        TestUserUtils.loginAdmin().then(function (m) {
          currentuser = m;
          done();
        }).done();
      }).done();

    });

    it('admin marker', function (done) {

      var plantid = marker.plant._id;

      marker.verified = true;
      marker.active = true;
      marker.plant_unknown = true;
      marker.plant = null;

      TestMarkerUtils.adminMarker(marker).then(function (returnvalue) {
        console.log(returnvalue);
        assert.equal(returnvalue.plant_unknown, true);
        assert.equal(returnvalue.active, true);
        assert.equal(returnvalue.verified, true);
        assert(returnvalue.plant == null);

        marker.verified = false;
        marker.active = false;
        marker.plant_unknown = false;
        marker.plant = plantid;

        TestMarkerUtils.adminMarker(marker).then(function (returnvalue) {
          console.log(returnvalue);
          assert.equal(returnvalue.plant_unknown, false);
          assert.equal(returnvalue.active, false);
          assert.equal(returnvalue.verified, false);
          assert.equal(returnvalue.plant._id, plantid);
          done();
        }).done()
      }).done()
    });


  });

  describe('editmarker functions', function () {

    var marker;
    var currentuser;
    beforeEach(function (done) {
      TestMarkerUtils.seedDbLoginAndGetRandomMarker().then(function (m) {
        TestUserUtils.getCurrentUser().then(function (returnuser) {
          marker = m;
          currentuser = returnuser;
          done();
        }).done();
      }).done();
    });
    //it('remove image at update', function (done) {
    //  assert.equal(marker.images.length, 1);
    //  marker.plant = marker.plant._id;
    //  marker.images = [];
    //  TestMarkerUtils.updateMarker(marker).then(function (returnvalue) {
    //    console.log(returnvalue);
    //    assert.equal(returnvalue.images.length, 0);
    //    done();
    //  }).done();
    //});
    //
    //it('edit  fields', function (done) {
    //
    //  marker.description = "newvalue";
    //  marker.location = {position: [1, 2]};
    //  marker.plant_unknown = true;
    //  marker.plant = null;
    //
    //  TestMarkerUtils.updateMarker(marker).then(function (returnvalue) {
    //    console.log(returnvalue);
    //    assert.equal(returnvalue.plant_unknown, true);
    //    assert(returnvalue.plant == null);
    //    assert.equal(returnvalue.description, "newvalue");
    //    assert.equal(returnvalue.location.position[0], 1);
    //    assert.equal(returnvalue.location.position[1], 2);
    //    done();
    //  }).done()
    //});

    it('edit plant fields', function (done) {

      marker.plant_unknown = false;
      marker.plant = null;
      marker.plant_by_user = "testplant"

      TestMarkerUtils.updateMarker(marker).then(function (returnvalue) {
        console.log(returnvalue);

        assert.equal(returnvalue.plant_unknown, false);
        assert(returnvalue.plant == null);
        assert.equal(returnvalue.plant_by_user, "testplant");
        done();
      }).done();
    });

  });
})
;

