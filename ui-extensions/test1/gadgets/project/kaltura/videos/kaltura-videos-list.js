define(function(require, exports, module) {

    require("css!./kaltura-videos-list.css");

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var OneTeam = require("oneteam");
    var Engine = require("../../../../engine");

    return Ratchet.GadgetRegistry.register("kaltura-videos-list", DocList.extend({

        configureDefault: function()
        {
            this.base();

            this.config({
                "observables": {
                    "query": "kaltura-videos-list_query",
                    "sort": "kaltura-videos-list_sort",
                    "sortDirection": "kaltura-videos-list_sortDirection",
                    "searchTerm": "kaltura-videos-list_searchTerm",
                    "selectedItems": "kaltura-videos-list_selectedItems"
                }
            });
        },

        setup: function()
        {
            this.get("/projects/{projectId}/kaltura/videos", this.index);
        },

        doclistDefaultConfig: function()
        {
            var config = this.base();
            config.columns = [];

            return config;
        },

        prepareModel: function(el, model, callback)
        {
            this.base(el, model, function() {
                callback();
            });
        },

        doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            var datastoreId = self.observable(self.DATASTORE_OBSERVABLE_ID).get();

            var fields = self.defaultQueryFields(context, model);

            if (!query)
            {
                query = {};
            }

            if (Ratchet.countProperties(query) === 0 && searchTerm)
            {
                query = self.buildSearchQuery(searchTerm, fields);
            }

            self.readDatastore(datastoreId, function(datastore) {
                self.queryGitanaDatastore(datastore, context, model, searchTerm, query, pagination, callback);
            });
        },

        doRemoteQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            var project = self.observable("project").get();

            Engine.queryVideos(project, searchTerm, pagination, function(err, results) {

                var rs = {};
                rs.totalRows = results.totalCount;
                rs.size = results.objects.length;
                rs.rows = results.objects;

                callback(rs);
            });
        },

        linkUri: function(row, model, context)
        {
            return null;
        },

        iconClass: function(row)
        {
            return null;
        },

        iconUri: function(row)
        {
            return row.thumbnailUrl;
        },

        columnValue: function(row, item, model, context)
        {
            var value = this.base(row, item);

            if (item.key === "name")
            {
                value = OneTeam.listTitleDescription(context, row, row.dataUrl, row.name);
            }
            else if (item.key === "views")
            {
                value = "" + row.views;
            }
            else if (item.key === "plays")
            {
                value = "" + row.plays;
            }
            else if (item.key === "info")
            {
                value = "Created By: " + row.creatorId;
                value += "<br/>";
                value += "Created On: " + row.createdAt;
                value += "<br/>";
                value += "Length: " + row.duration + " seconds";
                value += "<br/>";
                value += "Width: " + row.width;
                value += "<br/>";
                value += "Height: " + row.height;
            }

            return value;
        }

    }));

});