'use strict';
angular.module('wildfoodApp.utils').service('ImageUtils',
  ['Utils', '$timeout', '$filter', 'RemoteService', function (Utils, $timeout, $filter,RemoteService) {

    this.setImagePreviewSource = function (file) {
      var fileReader = new FileReader();
      var loadFile = function (fileReader) {
        fileReader.onload = function (e) {
          $timeout(function () {
            file.preview = e.target.result;
          });
        }
      }(fileReader);
      fileReader.readAsDataURL(file);
    }

    this.uploadFile = function (item) {
      RemoteService.postfile("common/postimage", item).progress(function (evt) {
        console.log(evt.loaded + " " + evt.total);
        //item.progress = parseInt(100.0 * evt.loaded / evt.total);
        item.progress = 99;
        item.progressString = "uploading...";
        //console.log('progress: ' + item.progress);
        //item.progressBarType = getProgressBarType(item.progress);
      }).success(function (data, status, headers, config) {
        console.log('file ' + config.file.name + 'is uploaded successfully. Response:', data);
        item.downloadReady = true;
        checkIfValid(item);
        item.progress = 100;
        item.progressString = "100%";
        item.progressBarType = getProgressBarType(item.progress);
        item = _.merge(item, data);

        $timeout(function () {
          item.showprogress = false;
        }, 2000);

      });
    }
    function checkIfValid(file) {
      file.valid = file.downloadReady;
    }


    this.onFileSelectSingle = function (files, alerts) {

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!this.isValidUploadType(file)) {
          alerts.push({
            type: 'info',
            msg: "You did not select an image."

          });

        } else {

          var kilobytes = file.size / 1024;
          setFileSize(file);

          if (!isSizeOk(kilobytes)) {
            tooBIgAlert(files, alerts);
          } else {
            this.setImagePreviewSource(file);
            return file;
          }


        }
      }
      return null;
    };

    function tooBIgAlert(file, alerts) {
      var megs = kilobytes / 1024;
      var sizeFormatted = $filter('number')(megs, 0);
      alerts.alerts.push({
        type: 'danger',
        msg: "File is too bix, maximum size for uploads is 10 MB" + " - " + file.name + " (" + sizeFormatted + " MB)"
      });
    }

    function setFileSize(file) {
      var kilobytes = file.size / 1024;
      if (kilobytes < 1) {
        kilobytes = 1;
      }
      file.sizeInKB = kilobytes;
      file.valid = false;
      file.progress = 0;
      file.showprogress = true;
    }

    this.onFileSelectMultiple = function (files, alerts) {
      var result = [];

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!this.isValidUploadType(file)) {
          alerts.push({
            type: 'info',
            msg: "You did not select an image."

          });
        } else {

          var kilobytes = file.size / 1024;
          setFileSize(file);

          if (!isSizeOk(kilobytes)) {
            tooBIgAlert(files, alerts);
          } else {
            this.setImagePreviewSource(file);
            result.push(file);
          }
        }
      }
      return result;
    };

    this.isValidUploadType = function (file) {
      return fileTypeStartsWith('image', file);
    }

    function fileTypeStartsWith(str, file) {
      return Utils.startsWith(file.type, str);
    }

    function extensionIs(suffix, file) {
      var str = file.name;
      return Utils.ndsWith(str, suffix);
    }

    function fileTypeContains(str, file) {
      return Utils.contains(file.type, str);
    }

    function isSizeOk(sizeinkb) {
      return sizeinkb <= 10000;
    }

    function getProgressBarType(value) {
      if (value < 25) {
        return 'danger';
      } else if (value < 50) {
        return 'warning';
      } else if (value < 75) {
        return 'info';
      } else {
        return 'success';

      }
    }
  }]);
