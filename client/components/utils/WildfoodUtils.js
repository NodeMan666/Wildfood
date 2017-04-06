'use strict';
angular
  .module('wildfoodApp.utils')
  .service(
  'wfUtils',
  [function () {

    function linkify(inputText) {
      if (inputText != null) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        // URLs starting with http://, https://, or
        // ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1,
          '<a href="$1" target="_blank">$1</a>');

        // URLs starting with "www." (without // before
        // it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText
          .replace(replacePattern2,
          '$1<a href="http://$2" target="_blank">$2</a>');

        // Change email addresses to mailto:: links.
        // replacePattern3 =
        // /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        // replacedText =
        // replacedText.replace(replacePattern3, '<a
        // href="mailto:$1">$1</a>');

        return replacedText;
      }
      return "";
    }


    this.getShorterVersion = function (input) {
      if (input == null) {
        return "";
      }
      var n = 15;
      if (input.length > n) {

        // if(input.indexOf(" ")>0){}

        return input.substring(0, n) + "...";
      }
      return input;
    }

    this.getLongerVersion = function (input) {
      if (input == null) {
        return "";
      }
      var n = 50;
      if (input.length > n) {

        return input.substring(0, n) + "...";
      }
      return input;
    }

    this.pickImageProperties = function (image) {
      return _.pick(image, ['title', 'flickr', 'versions', 'describedParts', '_id']);
    }

    this.enhanceWithImageMethods = function (item) {
      item.hasImage = function () {
        return item.images != null
          && item.images.length > 0;
      }

      item.getImage = function () {
        if (item.images != null && item.images.length > 0) {
          return item.images[0];
        } else {
          return null;
        }
      };

      item.getImageThumbUrl = function () {
        if (item.images != null && item.images.length > 0 && item.images[0].versions && item.images[0].versions.thumb != null) {
          return item.images[0].versions.thumb.url;
        } else {
          return "assets/images/plant_placeholder.png"
        }
      };
      item.getImageStandardUrl = function () {
        if (item.images != null && item.images.length > 0 && item.images[0].versions && item.images[0].versions.standard != null) {
          return item.images[0].versions.standard.url;
        } else {
          return "assets/images/plant_placeholder.png"
        }
      };
      item.getImageLowResUrl = function () {
        if (item.images != null && item.images.length > 0 && item.images[0].versions && item.images[0].versions.low != null) {
          return item.images[0].versions.low.url;
        } else {
          return "assets/images/plant_placeholder.png"
        }
      };
    }

    this.getEnchancedString = function (text) {
      // info@weedyconnection.com
      // @trolleyd
      // #flowers
      // http://stackoverflow.com/questions/13655333/how-do-i-use-javascript-to-replace-hash-tags-with-links-from-a-jquery-data-attri

      text = linkify(text);

      text = text
        .replace(/#(\S*)/g,
        '<a href="http://twitter.com/#!/search/$1" target="_blank">#$1</a>');

      text = text
        .replace(/@(\S*)/g,
        '<a href="http://instagram.com/$1" target="_blank">@$1</a>');

      text = text.replace(/[\uE000-\uF8FF]/g, '');

      text = text.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')

      return text;
    }
    this.getEmptyImagesElement = function () {

      var url = "assets/images/plant_placeholder.png";
      return [
        {
          versions: [
            {
              "type": "low_resolution",
              "url": url,
              "width": 306,
              "height": 306
            },
            {
              "type": "thumbnail",
              "url": url,
              "width": 150,
              "height": 150
            },
            {
              "type": "standard_resolution",
              "url": url,
              "width": 640,
              "height": 640
            }
          ]
        }


      ];
    }

  }]);
