define(function(require, exports, module) {

    var html = require("text!./titlemanager-notifications-dashlet.html");
    require("css!./titlemanager-notifications-dashlet.css");

    var UI = require("ui");

    return UI.registerDashlet("titlemanager-notifications-dashlet", UI.AbstractDashlet.extend({

        TEMPLATE: html,

        configureDefault: function()
        {
            // call this first
            this.base();

            // now add in our custom configuration
            this.config({
                "chrome": true,
                "columnHeaders": true,
                "columns": [{
                    "title": "Project",
                    "key": "project"
                },{
                    "title": "Task Description",
                    "key": "taskDescription"
                }],
                "options": {
                    "filter": false,
                    "paginate": false,
                    "info": false,
                    "sizing": false,
                    "processing": false,
                    "zeroRecords": "No content items were found."
                },
                "icon": true,
                "loader": "remote"
            });
        },

        columnValue: function(row, item, model)
        {
            var self = this;

            var value = this.base(row, item);

            if (item.key == "project")
            {
                var title = row.title;
                if (!title) {
                    title = row._doc;
                }

                var contentUri = self.linkUri(row, model);

                // title
                value =  "<h2 class='list-row-info title'>";
                value += "<a href='" + contentUri + "'>";
                value += OneTeam.filterXss(title);
                value += "</a>";
                value += "</h2>";

                // description
                if (row.description)
                {
                    value += "<p class='list-row-info description'>" + OneTeam.filterXss(row.description) + "</p>";
                }

                /*
                // project
                var projectUri = "#/projects/" + row["_projectId"];
                value += "<p class='list-row-info description'>";
                value += "Located in project: ";
                value += "<a href='" + projectUri + "'>";
                value += row._projectTitle;
                value += "</a>";
                value += "</p>";
                */

                if (row._system.created_on)
                {
                    var date = new Date(row._system.created_on.ms);
                    value += "<p class='list-row-info created'>Created " + Bundle.relativeDate(date);
                    if (row._system.created_by) {
                        value += " by " + row._system.created_by;
                    }
                    value += "</p>";
                }
                else if (row._system.modified_on)
                {
                    var date = new Date(row._system.modified_on.ms);
                    value += "<p class='list-row-info modified'>Modified " + Bundle.relativeDate(date);
                    if (row._system.modified_by) {
                        value += " by " + row._system.modified_by;
                    }
                    value += "</p>";
                }

                //var date = new Date(row._system.created_on.ms);
                //var dateString = Bundle.relativeDate(date);
            } else if (item.key == "taskDescription") {
                var date = new Date();
                value += "<p class='list-row-info created'>Due " + Bundle.relativeDate(date);
                value += "</p>";
            }

            return value;
        },

        /**
         * Puts variables into the model for rendering within our template.
         * Once we've finished setting up the model, we must fire callback().
         *
         * @param el
         * @param model
         * @param callback
         */
        prepareModel: function(el, model, callback) {

            // get the current project
            // var project = this.observable("project").get();

            // the current branch
            var branch = this.observable("branch").get();

            // call into base method and then set up the model
            this.base(el, model, function() {

                // query for catalog:product instances
                branch.queryNodes({ "_type": "beacon:schedule" }).then(function() {

                    // all of the products
                    var products = this.asArray();
                    for(var i = 0; i < products.length; i++) {
                        var product = products[i];

                        product.imageUrl = "/preview/repository/" + product.getRepositoryId() + "/branch/" + product.getBranchId() + "/node/" + product.getId() + "/default?size=64&name=preview64";
                    }

                    model.products = products;
                    
                    callback();
                });
            });
        },

        /**
         * This method gets called before the rendered DOM element is injected into the page.
         *
         * @param el the dom element
         * @param model the model used to render the template
         * @param callback
         */
        /*
        beforeSwap: function(el, model, callback)
        {
            this.base(el, model, function() {
                callback();
            });
        },
        */

        /**
         * This method gets called after the rendered DOM element has been injected into the page.
         *
         * @param el the new dom element (in page)
         * @param model the model used to render the template
         * @param originalContext the dispatch context used to inject
         * @param callback
         */
        afterSwap: function(el, model, context, callback)
        {
            var self = this;

            this.base(el, model, context, function() {

                // TODO: grab any injected DOM elements and bind JS behaviors if needed

                callback();

            });
        }
        
    }));
});