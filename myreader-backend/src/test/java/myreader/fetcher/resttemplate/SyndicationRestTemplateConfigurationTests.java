package myreader.fetcher.resttemplate;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import static com.github.tomakehurst.wiremock.client.RequestPatternBuilder.allRequests;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static org.mortbay.jetty.HttpHeaders.SET_COOKIE;
import static org.springframework.http.HttpHeaders.COOKIE;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FeedParserConfiguration.class)
public class SyndicationRestTemplateConfigurationTests {

    private static final int PORT = 18444;
    private static final String HTTP_URL = String.format("http://localhost:%d/rss", PORT);

    @Rule
    public final WireMockRule wireMockRule = new WireMockRule(PORT);

    @Autowired
    private RestTemplate syndicationRestTemplate;

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
}
