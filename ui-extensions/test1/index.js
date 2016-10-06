define(function(require) {

    require("./actions/view-in-kaltura");
    require("./fields/kaltura-video-picker-field");
    require("./gadgets/project/kaltura/videos/kaltura-videos-list");
    require("./gadgets/project/manage/kaltura/manage-kaltura");
    require("./pickers/kaltura-video-picker");

    require("css!./styles/kaltura.css");

    require ("./engine");
});