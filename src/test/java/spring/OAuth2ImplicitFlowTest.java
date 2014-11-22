package spring;

import com.gargoylesoftware.htmlunit.StringWebResponse;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HTMLParser;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import myreader.test.SecurityTestSupport;
import org.junit.Test;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;

import java.io.IOException;
import java.net.URL;

import static myreader.config.SecurityConfig.ACCOUNT_CONTEXT;
import static myreader.config.SecurityConfig.LOGIN_PROCESSING_URL;
import static myreader.config.SecurityConfig.LOGIN_URL;
import static myreader.test.KnownUser.USER1;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class OAuth2ImplicitFlowTest extends SecurityTestSupport {

    private static final String USERNAME_INPUT = "username";
    private static final String PASSWORD_INPUT = "password";
    private static final String CSRF_INPUT = "_csrf";
    private static final String LOGIN_FORM_NAME = "loginForm";

    @Test
    public void testLoginPage() throws IOException {
        //https://github.com/spring-projects/spring-test-htmlunit/issues/40
        String loginUrl = "http://localhost" + ACCOUNT_CONTEXT + LOGIN_URL;
        String loginProcessingUrl = ACCOUNT_CONTEXT + LOGIN_PROCESSING_URL;

        HtmlPage page = webClient.getPage(loginUrl);
        HtmlForm loginForm = page.getFormByName(LOGIN_FORM_NAME);

        DomElement username = loginForm.getInputByName(USERNAME_INPUT);
        DomElement password = loginForm.getInputByName(PASSWORD_INPUT);
        HtmlInput csrf = loginForm.getInputByName(CSRF_INPUT);
        HtmlElement submit = loginForm.getOneHtmlElementByAttribute("input", "type", "submit");

        assertThat(username, notNullValue());
        assertThat(password, notNullValue());
        assertThat(csrf, notNullValue());
        assertThat(submit, notNullValue());
        assertThat(loginForm.getAttribute("action"), is(loginProcessingUrl));
    }

    @Test
    public void testOAuth2ImplicitFlow() throws Exception {
        String redirectUri = "data:test";
        String oauthAuthorize = "/oauth/authorize?client_id=public&response_type=token&scope=all&redirect_uri=" + redirectUri;

        MockHttpSession httpSessionStep1 = requestAuthorizeEndpointAndRedirectToLoginPage(oauthAuthorize);
        String csrfToken = requestLoginPageAndExtractCsrfToken(httpSessionStep1);
        MockHttpSession httpSessionStep2 = doLoginAndRedirectToAuthorizeEndpoint(oauthAuthorize, httpSessionStep1, csrfToken);
        String accessToken = requestAuthorizeEndpointAndExtractAccessToken(redirectUri, oauthAuthorize, httpSessionStep2);
        callToApiWithAccessToken(accessToken);
    }

    private void callToApiWithAccessToken(final String accessToken) throws Exception {
        mockMvc.perform(get(API_2)
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());
    }

    private String requestAuthorizeEndpointAndExtractAccessToken(final String redirectUri, final String oauthAuthorize, final MockHttpSession step2Session) throws Exception {
        MvcResult mvcResult = mockMvc.perform(get(oauthAuthorize)
                .session(step2Session))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", startsWith(redirectUri + "#access_token=")))
                .andReturn();

        String locationRedirectUri = mvcResult.getResponse().getHeader("Location");
        return extractAccessToken(locationRedirectUri);
    }

    private MockHttpSession doLoginAndRedirectToAuthorizeEndpoint(final String oauthAuthorize, final MockHttpSession step1Session, final String csrfToken) throws Exception {
        MvcResult mvcResult = mockMvc.perform(post(LOGIN_PROCESSING_URL)
                .session(step1Session)
                .contentType(APPLICATION_FORM_URLENCODED)
                .param(USERNAME_INPUT, USER1.username)
                .param(PASSWORD_INPUT, USER1.password)
                .param("_csrf", csrfToken))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", endsWith(oauthAuthorize)))
                .andReturn();

        return extractSession(mvcResult);
    }

    private String requestLoginPageAndExtractCsrfToken(final MockHttpSession step1Session) throws Exception {
        MvcResult mvcResult = mockMvc.perform(get(LOGIN_URL).session(step1Session)).andReturn();
        return extractCsrfToken(mvcResult);
    }

    private MockHttpSession requestAuthorizeEndpointAndRedirectToLoginPage(final String oauthAuthorize) throws Exception {
        String loginUrl = "http://localhost" + LOGIN_URL;
        MvcResult mvcResult = mockMvc.perform(get(oauthAuthorize))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", loginUrl))
                .andReturn();

        String locationLoginPage = mvcResult.getResponse().getHeader("Location");
        assertThat(locationLoginPage, is(locationLoginPage));
        return extractSession(mvcResult);
    }

    private String extractCsrfToken(final MvcResult mvcResult) throws IOException {
        /*
         * workaround for https://github.com/spring-projects/spring-test-htmlunit/issues/40
         * otherwise use webClient.getPage(mvcResult.getResponse().getHeader("Location"))
         */
        StringWebResponse response = new StringWebResponse(mvcResult.getResponse().getContentAsString(), new URL("http://irrelevant"));
        HtmlPage htmlPage = HTMLParser.parseHtml(response, webClient.getCurrentWindow());
        return htmlPage.getFormByName(LOGIN_FORM_NAME).getInputByName(CSRF_INPUT).getValueAttribute();
    }

    private MockHttpSession extractSession(final MvcResult mvcResult) {
        return (MockHttpSession) mvcResult.getRequest().getSession();
    }

    private static String extractAccessToken(final String location) {
        return location.substring(23, 59);
    }
}
