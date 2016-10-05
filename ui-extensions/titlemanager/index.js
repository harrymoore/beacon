define(function(require) {

    // page: "titlemanager-products-list"
    require("./gadgets/titlemanager-products-list/titlemanager-products-list.js");
    require("./gadgets/titlemanager-products-list/products-filter.js");

    // dashlet: "titlemanager-notifications-dashlet"
    // require("./gadgets/titlemanager-notifications-dashlet/titlemanager-notifications-dashlet.js");

    // global CSS overrides
    require("css!./styles/titlemanager.css");
});
