/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var plant = require('./plant.model');

exports.register = function(socket) {
  plant.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  plant.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('plant:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('plant:remove', doc);
}
