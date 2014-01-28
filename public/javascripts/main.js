$(function() {
    var editor = new Editor(_article);
})


Editor = Class.extend({
    editing: false,
    id: null,
    article: null,
    autoComplete: null,
    titleQuery: "",
    queries: 0,

    init: function(article) {
        if (article) {
            this.article = article;
            this.populate();
        }
        this.registerEvents();
    },

    populate: function() {
        if (this.article) {
            $("#title").val(this.article.title);
            $("#body").val(this.article.body);
            this.updatePermaLink(this.article._id);
        }
    },

    updatePermaLink: function(id) {
        $("#permalink").val("http://localhost:9589/" + id);
    },

    registerEvents: function() {
        var me = this;
        $("#body").keypress(function() {
            me.startEdit();
        });
        $("#title").on('change keyup paste', function() {
            window.clearTimeout(this.titleKeyPressTimeout);
            this.titleKeyPressTimeout = window.setTimeout(function() {
                me.onTitleKeyPress();
            }, 500);
        });
    },

    onTitleKeyPress: function() {
        if ($("#title").val() !== this.query)
        {
            var me = this;
            var length = $("#title").val().length;
            console.log("title length is now", length);
            if($("#title").val().length > 3) {
                console.log("will search now");
                me.searchTitles();
            }
            else if ($("#title").val().length === 0) {
                this.autoComplete.addClass("hidden");
            }
            this.query = $("#title").val();
        }
        else {
            console.log("query unchanged");
        }
    },

    searchTitles: function() {
        var me = this;
        $.post("/wikipedia/search", {
            query: $("#title").val()
        }, function(result) {
            me.onTitleSearchComplete(result);
        });
        this.queries++;
        console.log("Queried Wikipedia. Queries made=", this.queries);
    },

    onTitleSearchComplete: function(result) {
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
            this.autoComplete.append(li);
        }
    },

    startEdit: function() {
        console.log("startEdit");
        if (!this.editing) {
            this.editing = true;
            var me = this;
            window.setInterval(function() {
                me.saveArticle();
            }, 5000);
            window.setTimeout(function() {
                me.getSuggestions();
            }, 6000);
        }
    },

    getSuggestions: function() {
        var body = $("#body").val();
        $.post("/analysis/suggest", {
            text: body
        }, function(result) {
            console.log(result);
        });
    },

    saveSuccess: function(result) {
        console.log("saveSuccess", result, this.updatePermaLink);
        this.id = result.id;
        this.updatePermaLink(result.id);
    },

    saveArticle: function() {
        var title = $("#title").val();
        var body = $("#body").val();
        var saveUrl = "/store/save";
        var me = this;

        var data = {
            title: title,
            thebody: body
        }

        if (this.id) {
            data.id = this.id;
        }

        $.post(saveUrl, data, function(result) {
            me.saveSuccess(result);
        });
    }
});


Article = Class.extend({



});