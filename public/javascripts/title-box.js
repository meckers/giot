TitleBox = Class.extend({

    autoComplete: null,
    element: null,

    init: function(element) {
        this.element = element || $("#title");
        //this.autoComplete = new AutoComplete(this.element, "/wikipedia/search");
        this.registerEvents();
    },

    getValue: function() {
        return $(this.element).val();
    },

    registerEvents: function() {

    }
});