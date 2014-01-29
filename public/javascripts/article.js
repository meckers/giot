Article = Class.extend({
    id: null,
    title: "",
    body: "",
    isFromPageLoad: false,

    init: function(loadedArticle) {
        if (loadedArticle) {
            this.id = loadedArticle._id;
            this.title = loadedArticle.title;
            this.body = loadedArticle.body;
            this.isFromPageLoad = true;
        }
    }
});