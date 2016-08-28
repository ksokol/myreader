package myreader.fetcher.impl;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.resttemplate.FeedParserConfiguration;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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
public class FeedParserHttpsTests {

    private static final int PORT = 18443;
    private static final String HTTPS_URL = "https://localhost:" + PORT + "/rss";

    @Autowired
    private FeedParser parser;

    @Rule
    public final WireMockRule wireMockRule = new WireMockRule(wireMockConfig().httpsPort(PORT));

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
