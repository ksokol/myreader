package myreader.fetcher.impl;

import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetcherEntry;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import java.io.FileInputStream;

import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;

/**
 * @author Kamill Sokol
 */
public class FeedParserTest {

    private static String URL = "http://localhost:8000";

	private HttpConnector httpConnectorMock = mock(HttpConnector.class);

	private FeedParser parser;

    @Before
    public void setUp() throws Exception {
		reset(httpConnectorMock);
		parser = new FeedParser(httpConnectorMock);
    }

    @Test
	public void testFeed1() throws Exception {
		mockAnswer("feed1");
		FetchResult result = parser.parse(URL);
		assertThat(result.getEntries(), hasSize(2));
	}

	@Test
	public void testFeed2() throws Exception {
		mockAnswer("feed2");
		FetchResult result = parser.parse(URL);
		assertThat(result.getEntries(), Matchers.<FetcherEntry>hasItems(
				hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue217.html")),
				hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue217b.html"))
		));
	}

	@Test
	public void testFeed3() throws Exception {
		mockAnswer("feed3");
		FetchResult result = parser.parse("http://www.vzbv.de/klagenurteile.xml");
		assertThat(result.getEntries(), Matchers.<FetcherEntry>hasItems(
				hasProperty("url", is("http://www.vzbv.de/12539.htm")),
				hasProperty("url", is("http://www.vzbv.de/12673.htm"))
		));
	}

    @Test
    public void testFeed4() throws Exception {
        mockAnswer("feed4");
        FetchResult result = parser.parse(URL);
        assertThat(result.getEntries(), Matchers.<FetcherEntry>hasItems(
                hasProperty("content", startsWith("<!-- issue_comment -->"))
        ));
    }

    @Test
    public void testFeed5() throws Exception {
        mockAnswer("feed5");
        FetchResult result = parser.parse(URL);
        assertThat(result.getEntries(), Matchers.<FetcherEntry>hasItems(
                hasProperty("content", startsWith("Ein Gastbeitrag von Erik W. Ende Juni 2014 sagte"))
        ));
    }

	private void mockAnswer(final String file) {
		doAnswer(new Answer<Void>() {
			@Override
			public Void answer(InvocationOnMock invocation) throws Throwable {
				HttpObject httpObject = (HttpObject) invocation.getArguments()[0];
				httpObject.setResponseBody(new FileInputStream(String.format("src/test/resources/rss/%s.xml", file)));
				return null;
			}
		}).when(httpConnectorMock).connect(org.mockito.Matchers.<HttpObject>anyObject());
	}
}