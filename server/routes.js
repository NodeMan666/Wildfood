/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  //app.use('/api/migratejobss', require('./api/migratejobs'));
  app.use('/api/climate', require('./api/climate'));
  app.use('/api/plant', require('./api/plant'));
  app.use('/api/marker', require('./api/marker'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/common', require('./api/common'));
  app.use('/auth', require('./auth'));
  app.use('/api/jobs', require('./jobs'));
  app.use('/api/feedback', require('./api/feedback'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
