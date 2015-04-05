package spring;

import static myreader.config.SecurityConfig.ACCOUNT_CONTEXT;
import static myreader.config.SecurityConfig.LOGIN_PROCESSING_URL;
import static myreader.config.SecurityConfig.LOGIN_URL;
import static myreader.test.KnownUser.USER1;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.net.URL;

import org.apache.commons.codec.binary.Base64;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;

import com.gargoylesoftware.htmlunit.StringWebResponse;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HTMLParser;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

import myreader.test.KnownUser;
import myreader.test.SecurityTestSupport;

/**
 * @author Kamill Sokol
 */
public class ApiSecurityTest extends SecurityTestSupport {

    private static final String USERNAME_INPUT = "username";
    private static final String PASSWORD_INPUT = "password";
    private static final String CSRF_INPUT = "_csrf";
    private static final String LOGIN_FORM_NAME = "loginForm";

    @Test
    public void testApi1Unauthorized() throws Exception {
        mockMvc.perform(get(API_1)
                .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testApi1Ok() throws Exception {
        mockMvc.perform(get(API_1)
                .header("Authorization", basic(USER1)))
                .andExpect(status().isOk());
    }

    @Ignore
    @Test
    public void testApi2Unauthorized() throws Exception {
        mockMvc.perform(get(API_2))
                .andExpect(status().isUnauthorized());
    }

    @Ignore
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

    private static String basic(KnownUser user) {
        return "Basic " + new String(Base64.encodeBase64((String.format("%s:%s", user.username, user.password)).getBytes()));
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

}
