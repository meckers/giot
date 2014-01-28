package controllers;

import com.google.gson.JsonObject;
import org.lightcouch.CouchDbClient;
import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

public class Application extends Controller {

    public static void index(String id) {
        if (id != null) {
            JsonObject article = load(id);
            //renderJSON(json);
            render(article);
        }
        else {
            render();
        }
    }

    public static JsonObject load(String id) {
        JsonObject json = null;
        CouchDbClient dbClient = new CouchDbClient();
        try {
            json = dbClient.find(JsonObject.class, id);
        }
        catch (Exception ex) {
            // oh mama can't you tell, oh mama can't you tell when you catch my exeption do you ring my BEEEELLLL=?!=?!=?!==!
        }
        return json;
    }

}