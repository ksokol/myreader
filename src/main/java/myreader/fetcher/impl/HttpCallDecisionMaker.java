package myreader.fetcher.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("httpCallDecisionMaker")
public class HttpCallDecisionMaker {

    private HttpConnector httpConnector;

    @Autowired
    public HttpCallDecisionMaker(HttpConnector httpConnector) {
        this.httpConnector = httpConnector;
    }

    public boolean decide(String url) {
        return decide(url, null);
    }

    public boolean decide(String url, String lastModified) {
        boolean result = false;
        HttpObject httpObject = new HttpObject(url, "HEAD", lastModified);
        httpConnector.connect(httpObject);

        switch (httpObject.getReturnCode()) {
        case 200:
            result = true;
            break;
        case 405: // temporär
            result = true;
        default:
            break;
        }

        return result;
    }
}