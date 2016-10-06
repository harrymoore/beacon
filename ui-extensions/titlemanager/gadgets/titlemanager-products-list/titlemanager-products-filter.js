define(function(require, exports, module) {

    require("css!./titlemanager-products-filter.css");
    var html = require("text!./titlemanager-products-filter.html");

    var Ratchet = require("ratchet/web");
    var Empty = require("ratchet/dynamic/empty");
    var OneTeam = require("oneteam");
    var $ = require("jquery");

    return Ratchet.GadgetRegistry.register("titlemanager-products-filter", Empty.extend({

        TEMPLATE: html,

        setup: function()
        {
            this.get("/projects/{projectId}/titlemanager-products-filter", this.index);
        },

        prepareModel: function(el, model, callback)
        {
            var self = this;

            this.base(el, model, function() {

                callback();

            });
        },

        afterSwap: function(el, model, originalContext, callback)
        {
            var self = this;

            var control = null;

            var handleChange = function()
            {
                var filter = control.getValue();

                self.observable("title-manager-products-filter-form").set(filter);

                // trigger
                self.trigger("refresh-products-list");
            };

            // control
            var formConfig = {
                "schema": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "enum": [
                                "In-Progress",
                                "Complete"
                            ]
                        },
                        "projectType": {
                            "type": "string",
                            "enum": [
                                "Book",
                                "Cover",
                                "Reprint",
                                "ePub"
                            ]
                        },
                        "isbn": {
                            "type": "string"
                        },
                        "author": {
                            "type": "string"
                        },
                        "title": {
                            "type": "string"
                        }
                    }
                },
                "options": {
                    "fields": {
                        "title": {
                            "type": "text",
                            "label": "Title"
                        },
                        "projectType": {
                            "type": "select",
                            "label": "Project Type",
                            "optionLabels": [
                                "Book",
                                "Cover",
                                "Reprint",
                                "ePub"
                            ],
                            "noneLabel": "-- All --"
                        },
                        "status": {
                            "type": "select",
                            "label": "Status",
                            "optionLabels": [
                                "In-Progress",
                                "Complete"
                            ],
                            "noneLabel": "-- All --"
                        },
                        "isbn": {
                            "type": "text",
                            "label": "ISBN"
                        },
                        "author": {
                            "type": "text",
                            "label": "Author Name"
                        }
                    }
                },
                "postRender": function(_c)
                {
                    control = _c;

                    control.on("change", function() {
                        handleChange();
                    });
                }
            };
            $(el).find(".form").alpaca(formConfig);

            // search button
            $(el).find("button.search").off().click(function() {
                handleChange();
            });

            callback();

        }

    }));

});
