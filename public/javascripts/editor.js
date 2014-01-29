Editor = Class.extend({

    editing: false,
    title: null,
    titleAtLastSave: "",
    bodyAtLastSave: "",
    element: null,

    init: function(options) {
        this.article = new Article(options.article);
        this.element = $(options.element);
        this.title = new Title("#title");
        this.body = new Body("#textcontent");

        if (this.article.isFromPageLoad) {
            this.populate();
        }

        this.registerEvents();
    },

    registerEvents: function() {
        var me = this;

        Events.register("TITLE_CHANGED", this, this.onTitleChange);
        Events.register("BODY_CHANGED", this, this.onBodyChange);

        this.element.on('dragover', function() {
            me.showDropZone();
        });
    },

    showDropZone:function() {
        $(".dropzone").css('display', 'block');
    },

    hideDropZone: function() {
        $(".dropzone").css('display', 'none');
    },

    populate: function() {
        if (this.article) {
            this.title.setValue(this.article.title);
            this.body.setValue(this.article.body);
            this.updatePermaLink(this.article.id);
        }
    },

    hasChanged: function() {
        return this.titleAtLastSave !== this.title.getValue() || this.bodyAtLastSave !== this.body.getValue();
    },

    // TODO: Testa om det är/känns smidigare med att monitorera eventen 'change keyup paste' för förändringar.
    updateLastSavedValues: function() {
        this.titleAtLastSave = this.title.getValue();
        this.bodyAtLastSave = this.body.getValue();
    },

    updatePermaLink: function(id) {
        $("#permalink").val("http://localhost:9589/" + id);
    },

    onTitleChange: function(value) {
        this.onArticleChange();
    },

    onBodyChange: function(value) {
        this.onArticleChange();
    },

    onArticleChange: function() {
        console.log("article changed - resetting timeout to save");
        var me = this;
        if (this.saveTimeout) {
            window.clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = window.setInterval(function() {
            me.saveArticle();
        }, 1000);
        /*
         window.setTimeout(function() {
         me.getSuggestions();
         }, 6000); */
    },

    saveSuccess: function(result) {
        console.log("saveSuccess", result);
        this.article.id = result.id;
        this.updatePermaLink(result.id);
        this.updateLastSavedValues();
    },

    saveArticle: function() {

        if (this.hasChanged()) {
            var title = this.title.getValue();
            var body = this.body.getValue();
            var saveUrl = "/store/save";
            var me = this;

            var data = {
                title: title,
                thebody: body
            }

            if (this.article.id) {
                data.id = this.article.id;
            }

            console.log("posting to save:", data);

            $.post(saveUrl, data, function(result) {
                me.saveSuccess(result);
            });
        }
    }

});