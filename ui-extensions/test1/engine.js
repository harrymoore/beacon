define(function(require) {

    var self = this;

    var OneTeam = require("oneteam");

    require("./lib/js/ox.ajast.js");
    require("./lib/js/webtoolkit.md5.js");
    require("./lib/js/KalturaClientBase.js");
    require("./lib/js/KalturaTypes.js");
    require("./lib/js/KalturaVO.js");
    require("./lib/js/KalturaServices.js");
    require("./lib/js/KalturaClient.js");

    var loadClient = function() {
        var _client = null;

        return function(project, callback) {
            if (_client) {
                return callback(null, _client);
            }

            var partnerId = null;
            var secretHash = null;
            var userEmail = null;

            var kalturaConfig = project.kalturaConfig;
            if (kalturaConfig)
            {
                partnerId = kalturaConfig.partnerId;
                secretHash = kalturaConfig.secretHash;
                userEmail = kalturaConfig.userEmail;
            }
            else
            {
                return callback({
                    "message": "Project is missing 'kaltura' configuration block"
                });
            }

            if (!partnerId) {
                return callback({
                    "message": "Project is missing 'kaltura.partnerId' configuration setting"
                });
            }

            if (!secretHash) {
                return callback({
                    "message": "Project is missing 'kaltura.secretHash' configuration setting"
                });
            }

            if (!userEmail) {
                return callback({
                    "message": "Project is missing 'kaltura.userEmail' configuration setting"
                });
            }

            var sessionType = KalturaSessionType.USER;

            var config = new KalturaConfiguration(partnerId);
            config.serviceUrl = window.location.protocol + "//www.kaltura.com/";
            _client = new KalturaClient(config);

            _client.session.start(function(success, ks) {

                if (!success || (ks.code && ks.message)) {
                    console.log('Error starting session', success, ks);
                    console.log(ks.message || 'Unknown Error')
                } else {
                    _client.setKs(ks);
                }

                callback(null, _client)

            }, secretHash, userEmail, sessionType, partnerId);
        }
    }();

    var r = {};

    r.queryVideos = function(project, text, pagination, callback)
    {
        loadClient(project, function(err, client) {

            if (err) {
                return OneTeam.showError(err);
            }

            // set up the filter
            var filter = new KalturaMediaEntryFilter();
            filter.orderBy = KalturaMediaEntryOrderBy.CREATED_AT_DESC;
            filter.mediaTypeEqual = 1; // video
            if (text) {
                filter.searchTextMatchOr = text;
            }

            // set up the pager
            var pager = null;

            // list media
            client.media.listAction(function(success, results) {
                callback(null, results);
            }, filter, pager);

        });
    };

    return r;
});