/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Climatezone = require('./climatezone.model');

exports.register = function(socket) {
  Climatezone.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Climatezone.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('climatezone:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('climatezone:remove', doc);
}