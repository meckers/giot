Editor = Class.extend({

    editing: false,
    titleBox: null,
    titleAtLastSave: "",
    bodyAtLastSave: "",

    init: function(article) {
        this.titleBox = new TitleBox();
        if (article) {
            this.article = article;
            this.populate();
        }
        this.registerEvents();
    },

    registerEvents: function() {
        var me = this;
        $("#body").on('change keyup paste', function() {
            me.startEdit();
        });
    },

    populate: function() {
        if (this.article) {
            //$("#title").val(this.article.title);
            this.titleBox.setValue(this.article.title);
            $("#body").val(this.article.body);
            this.updatePermaLink(this.article._id);
        }
    },


    bodyValue: function() {
        return $("#body").val();
    },

    hasChanged: function() {
        return this.titleAtLastSave !== this.titleBox.getValue() || this.bodyAtLastSave !== this.bodyValue();
    },


    // TODO: Testa om det är/känns smidigare med att monitorera eventen 'change keyup paste' för förändringar.
    updateLastSavedValues: function() {
        this.titleAtLastSave = this.titleBox.getValue();
        this.bodyAtLastSave = this.bodyValue();
    },

    updatePermaLink: function(id) {
        $("#permalink").val("http://localhost:9589/" + id);
    },

    startEdit: function() {
        console.log("startEdit");
        if (!this.editing) {
            this.editing = true;
            var me = this;
            window.setInterval(function() {
                me.saveArticle();
            }, 5000);
            /*
            window.setTimeout(function() {
                me.getSuggestions();
            }, 6000); */
        }
    },

    saveSuccess: function(result) {
        console.log("saveSuccess", result, this.updatePermaLink);
        this.id = result.id;
        this.updatePermaLink(result.id);
        this.updateLastSavedValues();
    },

    saveArticle: function() {

        if (this.hasChanged()) {
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
    }

});