package controllers;

import com.alchemyapi.api.AlchemyAPI;
import org.w3c.dom.Document;
import play.Play;
import play.mvc.Controller;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;


public class Analysis extends Controller {

    public static void suggest(String text) {
        try {
            AlchemyAPI alchemyObj = AlchemyAPI.GetInstanceFromFile(Play.applicationPath + "/conf/api_key.txt");
            Document doc = alchemyObj.TextGetRankedNamedEntities(text);
            //System.out.println(getStringFromDocument(doc));
            renderText(getStringFromDocument(doc));
        }
        catch(Exception ex) {
            renderText(ex.getMessage());
        }
    }

    private static String getStringFromDocument(Document doc) {
        try {
            DOMSource domSource = new DOMSource(doc);
            StringWriter writer = new StringWriter();
            StreamResult result = new StreamResult(writer);

            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.transform(domSource, result);

            return writer.toString();
        } catch (TransformerException ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
