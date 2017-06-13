package myreader.fetcher.resttemplate;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import static com.github.tomakehurst.wiremock.client.RequestPatternBuilder.allRequests;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.mortbay.jetty.HttpHeaders.SET_COOKIE;
import static org.springframework.http.HttpHeaders.COOKIE;

/**
 * @author Kamill Sokol
 */
public class SyndicationRestTemplateConfigurationTests {

    private static final int PORT = 18444;
    private static final String HTTP_URL = String.format("https://localhost:%d/rss", PORT);

    @ClassRule
    public static WireMockRule wireMockRule = new WireMockRule(wireMockConfig().httpsPort(PORT));

    private RestTemplate syndicationRestTemplate;

    @Before
    public void setUp() throws Exception {
        syndicationRestTemplate = new SyndicationRestTemplateConfiguration().syndicationRestTemplate();
    }

    @Test
    public void shouldAddCookiesToRequest() throws Exception {
        stubFor(get(urlEqualTo("/rss"))
                .willReturn(aResponse()
                        .withHeader(SET_COOKIE, "expected_cookie_value")
                ));

        syndicationRestTemplate.getForEntity(HTTP_URL, Void.class);
        syndicationRestTemplate.getForEntity(HTTP_URL, Void.class);

        verify(allRequests().withHeader(COOKIE, equalTo("expected_cookie_value")));
    }

    // TODO Convert to nested tests with JUnit 5. Missing custom SSL configuration for insecure connections should not affect other tests.
    @Test
    public void insecureSslConnection() throws Exception {
        stubFor(get(urlEqualTo("/rss"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "text/xml")
                ));

        syndicationRestTemplate.getForEntity(HTTP_URL, Void.class);

        verify(allRequests());
    }
}
