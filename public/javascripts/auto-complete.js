AutoComplete = Class.extend({

    element: null,
    action: "",
    queries: 0,
    lastQuery: "",

    init: function(element, action) {
        this.element = element;
        this.action = action;
        this.registerEvents();
    },

    value: function() {
        return this.element.val();
    },

    registerEvents: function() {
        var me = this;
        this.element.on('change keyup paste', function() {
            console.log("input detected in title");
            window.clearTimeout(this.titleKeyPressTimeout);
            this.titleKeyPressTimeout = window.setTimeout(function() {
                me.onTitleKeyPress();
            }, 500);

            //this.titleKeyPressTimeout = window.setTimeout(me.onTitleKeyPress, 500);
        });
    },

    onTitleKeyPress: function() {
        if (this.value() !== this.lastQuery)
        {
            var me = this;
            var length = $("#title").val().length;
            console.log("title length is now", length);
            if(this.value().length >= 3) {
                console.log("will search now");
                me.query();
            }
            else if (this.value().length === 0) {
                this.autoComplete.addClass("hidden");
            }
            this.lastQuery = this.value();
        }
        else {
            console.log("query unchanged");
        }
    },

    query: function() {
        var me = this;
        $.post(this.action, {
            query: this.value()
        }, function(result) {
            me.onTitleSearchComplete(result);
        });
        this.queries++;
        console.log("Queried Wikipedia. Queries made=", this.queries);
    },

    onTitleSearchComplete: function(result) {
        var me = this;
        if (this.autoComplete) {
            this.autoComplete.empty();
            this.autoComplete.removeClass("hidden");
        }
        else {
            this.autoComplete = $("<ul></ul>");
            this.autoComplete.addClass("auto-complete");
            $("body").append(this.autoComplete);
        }

        for (var i=0; i<result.length; i++) {
            var li = $("<li></li>");
            li.html(result[i]);
            li.on("click", function() {
                me.onClickedRow(this);
            });
            this.autoComplete.append(li);
        }
    },

    onClickedRow: function(row) {
        console.log("Clicked row", row);
    }

})