define(function(require, exports, module) {

    var Ratchet = require("ratchet/ratchet");
    var Actions = require("ratchet/actions");
    var OneTeam = require("oneteam");
    var $ = require("jquery");

    return Ratchet.Actions.register("view-in-kaltura", Ratchet.AbstractAction.extend({

        defaultConfiguration: function()
        {
            var config = this.base();

            config.title = "View in Kaltura";
            config.iconClass = "glyphicon glyphicon-pencil";

            return config;
        },

        execute: function(config, actionContext, callback)
        {
            this.doAction(actionContext, function(err, result) {
                callback(err, result);
            });
        },

        doAction: function(actionContext, callback)
        {
            var self = this;

            // redirect the browser window
            var url = "/proxy/repositories/" + repositoryId + "/branches/" + branchId + "/nodes/" + document.getId() + "/attachments/" + attachmentId;
            window.open(url);
        }

    }));
});

