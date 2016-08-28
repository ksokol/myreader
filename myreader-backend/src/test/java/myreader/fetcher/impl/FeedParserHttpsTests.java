package myreader.fetcher.impl;

import com.github.tomakehurst.wiremock.WireMockServer;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.resttemplate.FeedParserConfiguration;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FeedParserConfiguration.class)
@RestClientTest
public class FeedParserHttpsTests {

    private static final int PORT = 18443;
    private static final String HTTPS_URL = "https://localhost:" + PORT + "/rss";

    private WireMockServer wireMockServer;

    @Autowired
    private FeedParser parser;

    @Before
    public void before() {
        wireMockServer = new WireMockServer(wireMockConfig().httpsPort(PORT));
        wireMockServer.start();
    }

    @After
    public void after() {
        wireMockServer.stop();
    }

    @Test
    public void insecureSslConnection() throws Exception {
        stubFor(get(urlEqualTo("/rss"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "text/xml")
                        .withBodyFile("feed1.xml")));

        FetchResult result = parser.parse(HTTPS_URL);
        assertThat(result.getEntries(), hasSize(2));
    }
}
