(function($) {

    var Alpaca = $.alpaca;

    if (!Alpaca.Fields) {
        Alpaca.Fields = {};
    }

    Alpaca.Fields.KalturaVideoPickerField = Alpaca.Fields.AbstractGitanaPickerField.extend(
    /**
     * @lends Alpaca.Fields.KalturaVideoPickerField.prototype
     */
    {
        getFieldType: function()
        {
            return "kaltura-video-picker";
        },

        validateEntry: function(value, callback)
        {
            callback({
                "status": true
            });
        },

        generateItem: function(picked)
        {
            var item = this.base(picked);
            item.dataUrl = picked.dataUrl;
            item.thumbnailUrl = picked.thumbnailUrl;
            item.id = picked.id;
            item.title = picked.name;

            return item;
        },

        assignItems: function(items)
        {
            /*
             for (var i = 0; i < items.length; i++)
             {
             // todo
             }
             */
        },

        pickerConfiguration: function()
        {
            return {
                "title": "Select Kaltura Video(s)",
                "type": "kaltura-video-picker"
            };
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Kaltura Video Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for picking a Kaltura Video";
        }
    });

    Alpaca.registerFieldClass("kaltura-video-picker", Alpaca.Fields.KalturaVideoPickerField);
})(jQuery);
