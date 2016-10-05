define(function(require, exports, module) {

    require("css!./titlemanager-products-list.css");

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var OneTeam = require("oneteam");
    var bundle = Ratchet.Messages.using();

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
                }
            });
        },

        setup: function()
        {
            this.get("/projects/{projectId}/titlemanager-products", this.index);
        },

        prepareModel: function(el, model, callback)
        {
            this.base(el, model, function() {

                callback();

            });
        },

        beforeSwap: function(el, model, callback)
        {
            var self = this;

            this.base(el, model, function() {

                callback();

            });
        },

        doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            if (!query)
            {
                query = {};
            }

            if (!query._type)
            {
                query._type = "beacon:schedule";
            }

            OneTeam.projectBranch(self, function() {

                this.queryNodes(query, pagination).then(function() {
                    callback(this);
                });
            });

        },

        linkUri: function(row, model, context)
        {
            var self = this;
            var projectId = self.observable("project").get()._doc;

            return "#/projects/" + projectId + "/titlemanager-products/" + row._doc;
        },

        iconClass: function(row)
        {
            return null;
        },

        iconUri: function(row, model, context)
        {
            var self = this;

            return OneTeam.nodeStaticUrl(self, {
                "path": "/Organizations/" + row.organizationName + "/Resources/logo.png",
                "fallback": "/spacer.gif"
            });
        },

        columnValue: function(row, item, model, context)
        {
            var self = this;

            var value = this.base(row, item);

            if (item.key == "titleDescription") {
                value = OneTeam.listTitleDescription(context, row, self.linkUri(row, model, context));
            }

            return value;
        }

    }));

});