define(function(require, exports, module) {

    require("css!./titlemanager-products-list.css");

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var OneTeam = require("oneteam");

    return Ratchet.GadgetRegistry.register("titlemanager-products-list", DocList.extend({

        configureDefault: function()
        {
            this.base();

            this.config({
                "observables": {
                    "query": "titlemanager-products-list_query",
                    "sort": "titlemanager-products-list_sort",
                    "sortDirection": "titlemanager-products-list_sortDirection",
                    "searchTerm": "titlemanager-products-list_searchTerm",
                    "selectedItems": "titlemanager-products-list_selectedItems"
                },
                "columnHeaders": true,
                "columns": [{
                    "title": "Date",
                    "key": "date"
                }, {
                    "title": "Type",
                    "key": "type"
                }, {
                    "title": "Details",
                    "key": "details"
                }, {
                    "title": "Status",
                    "key": "status"
                }, {
                    "title": "Actions",
                    "key": "links"
                }],
                "options": {
                    "filter": false,
                    "paginate": true,
                    "info": true,
                    "sizing": true,
                    "processing": false
                },
                "icon": false,
                "loader": "remote"
            });
        },

        doclistDefaultConfig: function()
        {
            var config = this.base();
            config.columns = [];

            return config;
        },

        setup: function()
        {
            this.get("/projects/{projectId}/titlemanagerschedules", this.index);
        },

        beforeSwap: function(el, model, callback)
        {
            var self = this;

            this.base(el, model, function() {

                // set up a subscriber to update documents tree
                var refreshHandler = self.refreshHandler(el);
                self.on("refresh-titlemanager-projects-list", function(el) {
                    refreshHandler();
                });

                callback();

            });
        },

        doRemoteQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            var filter = self.observable("titlemanager-products-filter-form").get();
            if (!filter) {
                filter = {};
            }

            var response = {
                "totalRows": 0,
                "rows": []
            };

            if (!query)
            {
                query = {};
            }

            if (!pagination)
            {
                pagination = {};
            }

            if (!pagination.sort)
            {
                pagination.sort = {
                    "timestamp": -1
                };
            }

            OneTeam.projectBranch(self, function() {
                var branch = this;
                
                // project is equivalent to a beacon:schedule
                var projects;

                // find all of the flows
                Chain(branch).queryNodes({
                    "_type": "beacon:schedule"
                }).each(function() {
                    var project = this;
                    var result = {
                        "id": project._doc,
                        "title": project.title,
                        "scheduleType": project.scheduleType,
                        "bookTitle": project.bookTitle || "",
                        "isbn": project.isbn || "",
                        "overdueTasks": [
                            "ms2prd",
                            "MStoCopyeditor"
                        ],
                        "tasksDueToday": [
                            "editedms2author"
                        ]
                    };

                    response.rows.push(result);

                }).then(function() {
                    response.totalRows = submissions.totalRows();
                    callback(response);
                });
            });
        },

        entityTypes: function()
        {
            return {
                "plural": "titlemanager products",
                "singular": "titlemanager product"
            }
        },

        linkUri: function(row, model, context)
        {
            var self = this;
            var projectId = self.observable("project").get()._doc;

            return "#/projects/" + projectId + "/grants/" + row._doc;
        },

        iconClass: function(row)
        {
            return "grant-icon-64";
        },

        columnValue: function(row, item, model, context)
        {
            var self = this;

            var projectId = self.observable("project").get().getId();

            var value = this.base(row, item);

            if (item.key == "type")
            {
                value = row.flow.title;
                if (!value)
                {
                    value = row.flow.name;
                }
            }
            else if (item.key == "date")
            {
                try {
                    value = moment(row.submission.submittedOn).format("MM/DD/YYYY");
                } catch (ex) {
                    value = moment(row.submission.timestamp).format("MM/DD/YYYY");
                }
            }
            else if (item.key == "details")
            {
                value = "";

                // organization name
                value += "<p>";
                if (row.organizationFolder) {
                    value += "<a href='#/projects/" + projectId + "/organizations/" + row.organizationFolder._doc + "' target='_blank'>";
                }
                value += row.assignment.properties.organizationName;
                if (row.organizationFolder) {
                    value += "</a>";
                }

                // grant
                value += " ";
                value += "(";
                if (row.grantFolder) {
                    value += "<a href='#/projects/" + projectId + "/grants/" + row.grantFolder._doc + "' target='_blank'>";
                }
                value += row.assignment.properties.grantId;
                if (row.grantFolder) {
                    value += "</a>";
                }
                value += ")";



                var contact = row.assignment.properties.contact;
                if (contact)
                {
                    value += "<br/>";
                    value += contact.firstName + " " + contact.lastName;
                    if (contact.email)
                    {
                        value += " (<a href='mailto:" + contact.email + "'>";
                        value += contact.email;
                        value += "</a>)";
                    }
                }

                // report info
                value += "<br/>";
                value += row.assignment.title;


                value += "</p>";


                // summary
                var summary = "";
                summary += "Submission: ";
                summary += "<a href='#/projects/" + projectId + "/documents/" + row.submission._doc + "'>";
                summary += row.submission._doc;
                summary += "</a>";
                if (row.workflow)
                {
                    summary += "<br/>";
                    summary += "Workflow State: " + row.workflow.state;
                    summary += "<br/>";
                    summary += "Workflow Model: " + row.workflow.modelId + " / " + row.workflow.modelVersion;

                    if (row.workflow.payloadData && row.workflow.payloadData.resources)
                    {
                        summary += "<br/>";
                        summary += "<br/>";
                        summary += "<b>Workflow Documents</b>";
                        summary += "<br/>";

                        for (var docId in row.workflow.payloadData.resources)
                        {
                            summary += "<a href='#/projects/" + projectId + "/documents/" + docId + "' target='_blank'>";
                            summary += "<i class='fa fa-file-o'></i>&nbsp;";
                            summary += docId;
                            summary += "</a>";
                            summary += "<br/>";
                        }
                    }
                }

                value += "<p class='list-row-info summary'>" + summary + "</p>";
            }
            else if (item.key == "status")
            {
                if (row.submission)
                {
                    var status = row.submission.status;
                    var alertClass = null;

                    if (row.submission.status == "initialized")
                    {
                        //alertClass = "alert-warning";
                        status = "Initialized";
                    }
                    else if (row.submission.status == "in-progress")
                    {
                        //alertClass = "alert-warning";
                        status = "In Progress";
                    }
                    else if (row.submission.status == "pending")
                    {
                        alertClass = "alert-warning";
                        status = "Pending";
                    }
                    else if (row.submission.status == "error")
                    {
                        alertClass = "alert-danger";
                        status = "Error";
                    }
                    else if (row.submission.status == "complete")
                    {
                        alertClass = "alert-success";
                        status = "Complete";
                    }
                    if (alertClass)
                    {
                        value = "<p class='alert " + alertClass + " alert-thin'>" + status + "</p>";
                    }
                    else
                    {
                        value = "<p class='alert-thin'>" + status + "</p>";
                    }
                }
            }
            else if (item.key == "links")
            {
                var workflowId = null;
                if (row.workflow)
                {
                    workflowId = row.workflow._doc;
                }

                value = "";

                if (workflowId)
                {
                    value += "<a href='#/workflows/" + workflowId + "/history' target='_blank'>";
                    value += "<i class='fa fa-list'></i>&nbsp;";
                    value += "History";
                    value += "</a>";
                    value += "<br/>";

                    value += "<a href='#/workflows/" + workflowId + "/comments' target='_blank'>";
                    value += "<i class='fa fa-comments'></i>&nbsp;";
                    value += "Comments";
                    value += "</a>";
                    value += "<br/>";

                }

                if (row.grantFolder)
                {
                    value += "<a href='#/projects/" + projectId + "/documents/" + row.grantFolder._doc + "/browse' target='_blank'>";
                    value += "<i class='fa fa-folder'></i>&nbsp;";
                    value += "Grant Folder";
                    value += "</a>";
                    value += "<br/>";

                    value += "<a href='#/projects/" + projectId + "/grants/" + row.grantFolder._doc + "' target='_blank'>";
                    value += "<i class='fa fa-dashboard'></i>&nbsp;";
                    value += "Grant Dashboard";
                    value += "</a>";
                    value += "<br/>";
                }

                if (workflowId)
                {
                    value += "<a href='#/workflows/" + workflowId + "' target='_blank'>";
                    value += "<i class='fa fa-cogs'></i>&nbsp;";
                    value += "Workflow";
                    value += "</a>";
                    value += "<br/>";
                }

                /*
                value += "<a href='/admin/#/repositories/" + row.submission.getRepositoryId() + "/branches/" + row.submission.getBranchId() + "/nodes/" + row.submission._doc + "' target='_blank'>";
                value += "<i class='fa fa-database'></i>&nbsp;";
                value += "View Submission";
                value += "</a>";
                value += "<br/>";

                value += "<a href='/admin/#/repositories/" + row.assignment.getRepositoryId() + "/branches/" + row.assignment.getBranchId() + "/nodes/" + row.assignment._doc + "' target='_blank'>";
                value += "<i class='fa fa-database'></i>&nbsp;";
                value += "View Assignment";
                value += "</a>";
                value += "<br/>";
                */

                if (row.submission.status == "error")
                {
                    value += "<a href='#' class='view-error' data-titlemanager-projects-id='" + row.submission._doc + "'>";
                    value += "<i class='fa fa-info-circle'></i>&nbsp;";
                    value += "View Error";
                    value += "</a>";
                    value += "<br/>";
                }
            }

            return value;
        },

        afterSwap: function(el, model, context, callback)
        {
            var self = this;

            this.base(el, model, context, function() {

                $(el).find(".view-error").off().click(function(e) {
                    e.preventDefault();

                    var projectId = $(this).attr("data-titlemanager-projects-id");

                    OneTeam.projectBranch(self, function() {

                        this.trap(function() {
                            return false;
                        }).queryNodes({
                            "_doc": projectId
                        }).keepOne().then(function() {
                            window.open("/admin/#/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this._doc + "/edit/json");
                        });
                    });
                });

                callback();

            });
        }

    }));

});
