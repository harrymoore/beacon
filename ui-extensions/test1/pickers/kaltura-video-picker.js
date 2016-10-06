define(function(require) {

    var OneTeam = undefined;
    if (typeof(require) !== "undefined")
    {
        OneTeam = require("oneteam");
    }

    var Engine = require("../engine");

    var kalturaVideoPicker = Ratchet.Gadgets.AbstractGitanaPicker.extend({

        /**
         * @override
         */
        configureDefault: function()
        {
            var self = this;

            // call this first
            this.base();

            // update the config
            var c = {
                "columns": [],
                "selectorGroups": {
                    "sort-selector-group": {
                        "fields": []
                    }
                }
            };

            c.loader = "remote";

            if (typeof(OneTeam) !== "undefined")
            {
                c.icon = true;
            }

            c.columns.push({
                "title": "Title",
                "property": "title",
                "sort": true
            });
            c.columns.push({
                "title": "Info",
                "key": "info",
                "sort": true
            });
            c.selectorGroups["sort-selector-group"].fields.push({
                "key": "title",
                "title": "Title",
                "field": "title"
            });

            this.config(c);
        },

        entityTypes: function()
        {
            var self = this;

            return {
                "plural": "videos",
                "singular": "video"
            }
        },

        /**
         * @override
         */
        defaultQueryFields: function(context, model)
        {
            return ["name"];
        },

        doRemoteQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            var project = self.observable("project").get();

            var fields = self.defaultQueryFields(context, model);

            if (!query)
            {
                query = {};
            }

            if (Ratchet.countProperties(query) === 0 && searchTerm)
            {
                query = self.buildSearchQuery(searchTerm, fields);
            }

            Engine.queryVideos(project, searchTerm, pagination, function(err, results) {

                var rs = {};
                rs.totalRows = results.totalCount;
                rs.size = results.objects.length;
                rs.rows = results.objects;

                callback(rs);
            });
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
                value += "<br/>";
                value += "Views: " + row.views;
                value += "<br/>";
                value += "Plays: " + row.plays;
            }

            return value;
        }

    });

    Ratchet.GadgetRegistry.register("kaltura-video-picker", kalturaVideoPicker);

});