/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var marker = require('./marker.model');

exports.register = function(socket) {
  marker.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  marker.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('marker:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('marker:remove', doc);
}
