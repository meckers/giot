Editor = Class.extend({

    editing: false,
    titleBox: null,
    titleAtLastSave: "",
    bodyAtLastSave: "",
    element: null,

    init: function(options) {

        //this.article = options.article;
        this.article = new Article(options.article);
        this.element = $(options.element);
        this.titleBox = new TitleBox();

        if (this.article.isFromPageLoad) {
            this.populate();
        }
        this.registerEvents();

        console.log("element", this.element);
    },

    registerEvents: function() {
        var me = this;
        this.element.on('change keyup paste', function() {
            me.onBodyChange();
        });

        this.element.on('dragover', function() {
            me.showDropZone();
        });

        /*
        this.element.on('dragleave', function() {
            me.hideDropZone();
        });*/
    },

    showDropZone:function() {
        $(".dropzone").css('display', 'block');
    },

    hideDropZone: function() {
        $(".dropzone").css('display', 'none');
    },

    populate: function() {
        if (this.article) {
            //$("#title").val(this.article.title);
            this.titleBox.setValue(this.article.title);
            this.element.html(this.article.body);
            this.updatePermaLink(this.article.id);
        }
    },


    bodyValue: function() {
        return this.element.html();
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

    onBodyChange: function() {
        //if (!this.editing) {
            console.log("startEdit");
          //  this.editing = true;
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
        //}
    },

    saveSuccess: function(result) {
        console.log("saveSuccess", result);
        //this.id = result.id;
        this.article.id = result.id;
        this.updatePermaLink(result.id);
        this.updateLastSavedValues();
    },

    saveArticle: function() {

        if (this.hasChanged()) {
            var title = $("#title").val();
            var body = this.element.html();
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