define(function(require, exports, module) {

    require("css!./products-filter.css");
    var html = require("text!./products-filter.html");

    var Ratchet = require("ratchet/web");
    var Empty = require("ratchet/dynamic/empty");
    var OneTeam = require("oneteam");
    var $ = require("jquery");

    return Ratchet.GadgetRegistry.register("products-filter", Empty.extend({

        TEMPLATE: html,

        setup: function()
        {
            this.get("/projects/{projectId}/products", this.index);
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

                self.observable("products-filter-form").set(filter);

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
                                "initialized",
                                "in-progress",
                                "pending",
                                "rejected",
                                "error",
                                "complete"
                            ]
                        },
                        "reportType": {
                            "type": "string",
                            "enum": [
                                "progress",
                                "financial",
                                "nce"
                            ]
                        },
                        "id": {
                            "type": "string"
                        },
                        "organizationId": {
                            "type": "string"
                        },
                        "grantId": {
                            "type": "string"
                        }
                    }
                },
                "options": {
                    "fields": {
                        "status": {
                            "type": "select",
                            "label": "Status",
                            "optionLabels": [
                                "Initialized",
                                "In-Progress",
                                "Pending",
                                "Rejected",
                                "Error",
                                "Complete"
                            ],
                            "noneLabel": "-- All States --"
                        },
                        "reportType": {
                            "type": "select",
                            "label": "Report Type",
                            "optionLabels": [
                                "Progress Report",
                                "Financial Report",
                                "No Cost Extension Request"
                            ],
                            "noneLabel": "-- All Report Types --"
                        },
                        "id": {
                            "type": "text",
                            "label": "Submission ID"
                        },
                        "organizationId": {
                            "type": "text",
                            "label": "Organization ID"
                        },
                        "grantId": {
                            "type": "text",
                            "label": "Grant ID"
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
