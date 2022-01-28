package myreader.fetcher.resttemplate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.HttpHeaders.SET_COOKIE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.test.web.client.ExpectedCount.twice;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class SyndicationRestTemplateConfigurationTests {

  private static final String HTTP_URL = "https://localhost/rss";

  private MockRestServiceServer mockServer;
  private RestTemplate syndicationRestTemplate;

  @BeforeEach
  public void setUp() throws Exception {
    syndicationRestTemplate = new SyndicationRestTemplateConfiguration().syndicationRestTemplate();
    mockServer = MockRestServiceServer.createServer(syndicationRestTemplate);
  }

  @Test
  void shouldAddCookiesToRequest() {
    var httpHeaders = new HttpHeaders();
    httpHeaders.add(SET_COOKIE, "expected_cookie_value");

    mockServer.expect(twice(), requestTo(HTTP_URL))
      .andExpect(method(GET))
      .andRespond(withSuccess().headers(httpHeaders));

    syndicationRestTemplate.getForEntity(HTTP_URL, Void.class);
    syndicationRestTemplate.getForEntity(HTTP_URL, Void.class);

    mockServer.verify();
  }

  @Test
  void insecureSslConnection() {
    var httpHeaders = new HttpHeaders();
    httpHeaders.add(CONTENT_TYPE, "text/xml");

    mockServer.expect(requestTo(HTTP_URL))
      .andExpect(method(GET))
      .andRespond(withSuccess().headers(httpHeaders));

    syndicationRestTemplate.getForEntity(HTTP_URL, Void.class);

    mockServer.verify();
  }
}
