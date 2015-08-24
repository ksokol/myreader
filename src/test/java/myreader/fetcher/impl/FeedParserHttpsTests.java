package myreader.fetcher.impl;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertThat;

import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.test.IntegrationTestSupport;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import com.github.tomakehurst.wiremock.junit.WireMockRule;

/**
 * @author Kamill Sokol
 */
public class FeedParserHttpsTests extends IntegrationTestSupport {

    private static final int PORT = 18443;
    private static final String HTTPS_URL = "https://localhost:" + PORT + "/rss";

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().httpsPort(PORT));

    @Autowired
    private RestTemplate syndicationRestTemplate;

    private FeedParser parser;

    @Before
    public void beforeTest() {
        parser = new FeedParser(syndicationRestTemplate);
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
