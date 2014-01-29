Body = Class.extend({

    element: null,
    onChange: null,

    init: function(element) {
        this.element = $(element) || $("#textcontent");
        this.registerEvents();
    },

    setValue: function(value) {
        $(this.element).html(value);
    },

    getValue: function() {
        return $(this.element).html();
    },

    registerEvents: function() {
        var me = this;
        this.element.on('change keyup paste', function() {
            Events.trigger("BODY_CHANGED", me.getValue());
        });
    }
});