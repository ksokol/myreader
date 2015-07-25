package myreader.fetcher.impl;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertThat;

import myreader.config.PersistenceConfig;
import myreader.config.ResourceConfig;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.test.TestDataSourceConfig;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.client.RestTemplate;

import com.github.tomakehurst.wiremock.junit.WireMockRule;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, FeedParserTest.TestConfig.class})
@WebAppConfiguration
public class FeedParserHttpsTests {

    @Configuration
    @ComponentScan({"myreader.service", "myreader.fetcher"})
    public static class TestConfig  {}

    private static final int PORT = 18443;
    private static final String HTTPS_URL = "https://localhost:" + PORT + "/rss";

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().httpsPort(PORT));

    @Autowired
    private RestTemplate syndicationRestTemplate;

    @Autowired
    private ConversionService conversionService;

    private FeedParser parser;

    @Before
    public void beforeTest() {
        parser = new FeedParser(syndicationRestTemplate, conversionService);
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
