define(function(require, exports, module) {

    var html = require("text!./manage-kaltura.html");
    require("css!./manage-kaltura.css");

    var Ratchet = require("ratchet/web");
    var OneTeam = require("oneteam");
    var Empty = require("ratchet/dynamic/empty");

    return Ratchet.GadgetRegistry.register("manage-kaltura", Empty.extend({

        TEMPLATE: html,

        configureDefault: function()
        {
            this.base();
        },

        setup: function()
        {
            this.get("/projects/{projectId}/manage/kaltura", this.index);
        },

        prepareModel: function(el, model, callback)
        {
            var self = this;

            var project = model.project = self.observable("project").get();

            this.base(el, model, function() {
                callback();
            });
        },

        afterSwap: function(el, model, originalContext, callback)
        {
            var self = this;

            this.base(el, model, originalContext, function() {

                self.renderSettings(el, model, function(control) {

                    // bind the button
                    $(el).find("button.update").click(function() {

                        var form = control.getValue();

                        Chain(model.project).then(function() {

                            this.kalturaConfig = form.kalturaConfig;
                            this.update().then(function() {

                                // use a growl notification to indicate the update worked?
                                OneTeam.growl("The Kaltura settings were updated");

                                callback();
                            });
                        });

                    });

                    callback();
                });
            });
        },

        renderSettings: function(el, model, callback)
        {
            var self = this;

            self.renderForm(el, model, function(control) {
                callback(control);
            });
        },

        renderForm: function(el, model, callback)
        {
            var self = this;

            var c = {};
            c.data = {};
            if (model.project.kalturaConfig) {
                c.data.kalturaConfig = model.project.kalturaConfig;
            }
            c.schema = {
                "type": "object",
                "properties": {
                    "kalturaConfig": {
                        "type": "object",
                        "properties": {
                            "partnerId": {
                                "type": "number",
                                "title": "Partner ID"
                            },
                            "secretHash": {
                                "type": "string",
                                "title": "Secret Hash"
                            },
                            "userEmail": {
                                "type": "string",
                                "title": "User Email"
                            }
                        }
                    }
                }
            };
            c.options = {};
            c.postRender = function(control)
            {
                callback(control);
            };

            OneTeam.formEdit($(el).find(".form"), c, self);

        }

    }));

});