package myreader.fetcher.impl;

import static org.junit.Assert.assertTrue;

import java.io.FileInputStream;
import java.io.InputStream;

import myreader.fetcher.FeedParser;

import org.junit.Before;
import org.junit.Test;

public class FeedParserImplTest {
    private static InputStream FIS;
    private static FeedParser parser;
    private static String URL = "http://localhost:8000";

    @Before
    public void setUp() throws Exception {
        FIS = new FileInputStream("src/test/resources/feed.rss");
        parser = new FeedParser(new HttpConnector() {
            @Override
            public void connect(HttpObject httpObject) {
                httpObject.setResponseBody(FIS);
            }
        });
    }

    @Test
    public void testEtagExists() throws Exception {
        FetchResult result = parser.parse(URL);
        assertTrue(result.getEntries().size() == 2);
    }
}