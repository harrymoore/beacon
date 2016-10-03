define(function(require, exports, module) {

    require("css!./titlemanager-notifications-dashlet.css");

    var Ratchet = require("ratchet/web");
    var OneTeam = require("oneteam");
    var Bundle = Ratchet.Messages.using();
    var List = require("ratchet/dynamic/list");

    return Ratchet.DashletRegistry.register("project-tasks", List.extend({

        setup: function()
        {
            this.get(this.index);
        },

        configureDefault: function()
        {
            // call this first
            this.base();

            // now add in our custom configuration
            this.config({
                "chrome": false,
                "columnHeaders": false,
                "columns": [{
                    "title": "Task",
                    "key": "titleDescription"
                }],
                "options": {
                    "filter": false,
                    "paginate": false,
                    "info": false,
                    "sizing": false,
                    "processing": false,
                    "zeroRecords": "No tasks were found."
                },
                "icon": true,
                "loader": "gitana"
            });
        },

        entityTypes: function()
        {
            return {
                "plural": "tasks",
                "singular": "task"
            }
        },

        prepareModel: function(el, model, callback)
        {
            callback();
        },

        doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            var project = self.observable("project").get();

            // bring back the last 5 projects
            OneTeam.platform(function() {

                var query = {};

                if (project)
                {
                    query["context.projectId"] = project.getId();
                }

                pagination = {
                    "limit": 5,
                    "sort": {
                        "_system.modified_on.ms": -1
                    }
                };

                var filter = "assigned";

                this.queryTasksForCurrentUser(filter, query, pagination).then(function() {
                    callback(this);
                });

            });
        },

        linkUri: function(row, model, context)
        {
            return OneTeam.linkUri(this, row);
        },

        iconClass: function(row)
        {
            return "workflow-task-icon-48";
        },

        columnValue: function(row, item, model, context)
        {
            var value = this.base(row, item);

            if (item.key == "titleDescription") {
                value = OneTeam.listTitleDescription(context, row, null, null, true);

                if (row.workflowTitle)
                {
                    value += "<p class='list-row-info description'>Workflow: " + OneTeam.filterXss(row.workflowTitle) + "</p>";
                }
            }
            else if (item.key == "project") {
                if (row.context && row.context.projectTitle)
                {
                    value = "<a href='#/projects/" + row.context.projectId + "'>";
                    value += OneTeam.filterXss(row.context.projectTitle);
                    value += "</a>";
                }
            }
            else if (item.key == "assignedTo") {
                value = "<a href='#/members/" + row.assigneePrincipalId + "'>";
                value += OneTeam.filterXss(row.assigneePrincipalName);
                value += "</a>";
                value += "<p class='list-row-info description'>" + row.timeStarted.timestamp + "</p>";
            }

            return value;
        },

        /**
         * @override
         */
        afterSwap: function(el, model, context, callback)
        {
            var self = this;

            this.base(el, model, context, function() {

                callback();
            });
        }

    }));

});