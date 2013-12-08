package myreader.fetcher.impl;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import myreader.fetcher.impl.HttpCallDecisionMaker;
import myreader.fetcher.impl.HttpObject;

import org.junit.Test;

public class HttpCallDecisionMakerTest {

    private static String URL = "http://localhost:8000";

    @Test
    public void testIfModifiedSinceNull() throws Exception {
        HttpCallDecisionMaker maker = new HttpCallDecisionMaker(new HttpConnector() {
            @Override
            public void connect(HttpObject httpObject) {
                httpObject.setReturnCode(200);
            }
        });

        boolean b = maker.decide(URL);
        assertTrue(b);
    }

    @Test
    public void testLastModifiedErrorResponse() throws Exception {
        HttpCallDecisionMaker maker = new HttpCallDecisionMaker(new HttpConnector() {
            @Override
            public void connect(HttpObject httpObject) {
                httpObject.setReturnCode(304);
            }
        });

        boolean result = maker.decide(URL);
        assertFalse(result);
    }

    @Test
    public void testLastModifiedErrorResponse1() throws Exception {
        HttpCallDecisionMaker maker = new HttpCallDecisionMaker(new HttpConnector() {
            @Override
            public void connect(HttpObject httpObject) {
                httpObject.setReturnCode(504);
            }
        });

        boolean result = maker.decide(URL);
        assertFalse(result);
    }

    @Test(expected = RuntimeException.class)
    public void testLastModifiedParamIsNull() throws Exception {
        HttpCallDecisionMaker maker = new HttpCallDecisionMaker(new HttpConnector() {
            @Override
            public void connect(HttpObject httpObject) {
                throw new RuntimeException("test");
            }
        });

        boolean result = maker.decide(URL, null);
        assertTrue(result);
    }
}