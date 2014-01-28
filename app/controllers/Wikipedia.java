package controllers;

import info.bliki.api.Connector;
import info.bliki.api.SearchResult;
import info.bliki.api.User;
import info.bliki.api.XMLSearchParser;
import org.xml.sax.SAXException;
import play.mvc.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.*;

public class Wikipedia extends Controller {

    public static void search(String query) {

        String resultJson = "";

        try {
            Connector connector = new Connector();
            User user = new User("", "", "http://en.wikipedia.org/w/api.php");
            user.login();
            String[] valuePairs = { "list", "search", "srsearch", query };
            //Connector connector = new Connector();
            List<SearchResult> resultSearchResults = new ArrayList<SearchResult>(1024);
            List<String> titles = new ArrayList<String>();
            XMLSearchParser parser;
            try {
                // get all search results
                String responseBody = connector.queryXML(user, valuePairs);

                parser = new XMLSearchParser(responseBody);
                parser.parse();
                //srOffset = parser.getSrOffset();
                //System.out.println(">>>>> " + srOffset);
                List<SearchResult> listOfSearchResults = parser.getSearchResultList();
                resultSearchResults.addAll(listOfSearchResults);
                for (SearchResult searchResult : listOfSearchResults) {
                    // print search result information
                    titles.add(searchResult.getTitle());
                    //System.out.println(searchResult.toString());
                }

                resultJson = new Gson().toJson(titles);

            } catch (SAXException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }


        }
        catch(Exception ex) {
            resultJson = ex.getMessage();
        }



        renderJSON(resultJson);

    }



}
