Title = Class.extend({

    autoComplete: null,
    element: null,

    init: function(element) {
        this.element = $(element) || $("#title");
        //this.autoComplete = new AutoComplete(this.element, "/wikipedia/search");
        this.registerEvents();
    },

    setValue: function(value) {
        $(this.element).val(value);
    },

    getValue: function() {
        return $(this.element).val();
    },

    registerEvents: function() {
        var me = this;
        this.element.on('change keyup paste', function() {
            Events.trigger("TITLE_CHANGED", me.getValue());
        })
        this.element.click(function() {
            this.select();
        })
    }
});