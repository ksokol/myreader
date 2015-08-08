package spring;

import static myreader.config.UrlMappings.LANDING_PAGE;
import static myreader.config.UrlMappings.LOGIN;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.test.KnownUser.USER1;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;
import myreader.test.KnownUser;
import myreader.test.SecurityTestSupport;
import org.apache.commons.codec.binary.Base64;
import org.junit.Test;

import java.io.IOException;

/**
 * @author Kamill Sokol
 */
public class ApiSecurityTest extends SecurityTestSupport {

    private static final String USERNAME_INPUT = "username";
    private static final String PASSWORD_INPUT = "password";
    private static final String CSRF_INPUT = "_csrf";
    private static final String LOGIN_FORM_NAME = "loginForm";

    @Test
    public void testApiUnauthorized() throws Exception {
        mockMvc.perform(get(API_2)
                .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testApiOk() throws Exception {
        mockMvc.perform(get(API_2)
                .header("Authorization", basic(USER1)))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testApi2Unauthorized() throws Exception {
        mockMvc.perform(get(API_2))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "http://localhost/login"));
    }

    @Test
    public void testLoginPage() throws IOException {
        String loginUrl = "http://localhost" + LOGIN.mapping();

        HtmlPage page = webClient.getPage(loginUrl);

        assertThat(page.getUrl().toString(), is("http://localhost" + LOGIN.mapping() ));

        HtmlForm loginForm = page.getFormByName(LOGIN_FORM_NAME);

        DomElement username = loginForm.getInputByName(USERNAME_INPUT);
        DomElement password = loginForm.getInputByName(PASSWORD_INPUT);
       // HtmlInput csrf = loginForm.getInputByName(CSRF_INPUT);
        HtmlElement submit = loginForm.getOneHtmlElementByAttribute("button", "type", "submit");

        assertThat(username, notNullValue());
        assertThat(password, notNullValue());
       // assertThat(csrf, notNullValue());
        assertThat(submit, notNullValue());
        assertThat(loginForm.getAttribute("action"), is(LOGIN_PROCESSING.mapping()));
    }

    @Test
    public void testLoginPageWithWrongCredentials() throws IOException {
        String loginUrl = "http://localhost" + LOGIN.mapping();

        HtmlPage page = webClient.getPage(loginUrl);
        HtmlForm loginForm = page.getFormByName(LOGIN_FORM_NAME);

        DomElement username = loginForm.getInputByName(USERNAME_INPUT);
        DomElement password = loginForm.getInputByName(PASSWORD_INPUT);
        // HtmlInput csrf = loginForm.getInputByName(CSRF_INPUT);
        HtmlElement submit = loginForm.getOneHtmlElementByAttribute("button", "type", "submit");

        username.setNodeValue("unknown");
        password.setNodeValue("unknown");

        final HtmlPage afterSubmit = submit.click();

        assertThat(afterSubmit.getUrl().toString(), is("http://localhost" + LOGIN.mapping() + "?result=failed"));

        HtmlForm loginFormAfterSubmit = afterSubmit.getFormByName(LOGIN_FORM_NAME);

        assertThat(loginFormAfterSubmit.getAttribute("action"), is(LOGIN_PROCESSING.mapping()));
    }

    @Test
    public void testLoginPageWithCorrectCredentials() throws IOException {
        String loginUrl = "http://localhost" + LOGIN.mapping();

        HtmlPage page = webClient.getPage(loginUrl);
        HtmlForm loginForm = page.getFormByName(LOGIN_FORM_NAME);

        HtmlTextInput username = loginForm.getInputByName(USERNAME_INPUT);
        HtmlPasswordInput password = loginForm.getInputByName(PASSWORD_INPUT);
        // HtmlInput csrf = loginForm.getInputByName(CSRF_INPUT);
        HtmlElement submit = loginForm.getOneHtmlElementByAttribute("button", "type", "submit");

        username.setValueAttribute(USER1.username);
        password.setValueAttribute(USER1.password);

        final HtmlPage afterSubmit = submit.click();

        assertThat(afterSubmit.getUrl().toString(), is("http://localhost" + LANDING_PAGE.mapping()));
    }

    @Test
    public void testRedirectAfterLogin() throws IOException {
        String loginUrl = "http://localhost/";

        HtmlPage page = webClient.getPage(loginUrl);
        HtmlForm loginForm = page.getFormByName(LOGIN_FORM_NAME);

        HtmlTextInput username = loginForm.getInputByName(USERNAME_INPUT);
        HtmlPasswordInput password = loginForm.getInputByName(PASSWORD_INPUT);
        // HtmlInput csrf = loginForm.getInputByName(CSRF_INPUT);
        HtmlElement submit = loginForm.getOneHtmlElementByAttribute("button", "type", "submit");

        username.setValueAttribute(USER1.username);
        password.setValueAttribute(USER1.password);

        final HtmlPage afterSubmit = submit.click();

        assertThat(afterSubmit.getUrl().toString(), is("http://localhost" + LANDING_PAGE.mapping()));
    }

    @Test
    public void testRedirectAfterLogin2() throws IOException {
        String loginUrl = "http://localhost/irrelevant";

        HtmlPage page = webClient.getPage(loginUrl);
        HtmlForm loginForm = page.getFormByName(LOGIN_FORM_NAME);

        HtmlTextInput username = loginForm.getInputByName(USERNAME_INPUT);
        HtmlPasswordInput password = loginForm.getInputByName(PASSWORD_INPUT);
        // HtmlInput csrf = loginForm.getInputByName(CSRF_INPUT);
        HtmlElement submit = loginForm.getOneHtmlElementByAttribute("button", "type", "submit");

        username.setValueAttribute(USER1.username);
        password.setValueAttribute(USER1.password);

        final HtmlPage afterSubmit = submit.click();

        assertThat(afterSubmit.getUrl().toString(), is("http://localhost" + LANDING_PAGE.mapping()));
    }

    private static String basic(KnownUser user) {
        return "Basic " + new String(Base64.encodeBase64((String.format("%s:%s", user.username, user.password)).getBytes()));
    }
}
