define(function(require) {

    require("./actions/view-in-kaltura.js");
    require("./fields/kaltura-video-picker-field.js");
    require("./gadgets/project/kaltura/videos/kaltura-videos-list.js");
    require("./gadgets/project/manage/kaltura/manage-kaltura.js");
    require("./pickers/kaltura-video-picker.js");

    require("css!./styles/kaltura.css");

    require ("./engine.js");
});