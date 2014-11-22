package spring;

import myreader.test.KnownUser;
import myreader.test.SecurityTestSupport;
import org.apache.commons.codec.binary.Base64;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.token.TokenStore;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

import static myreader.config.SecurityConfig.IMPLICIT_OAUTH_CLIENT;
import static myreader.test.KnownUser.USER1;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class ApiSecurityTest extends SecurityTestSupport {

    public static final String TEST_ACCESS_TOKEN = "test";

    @Autowired
    private TokenStore tokenStore;

    @Test
    public void testApi1Unauthorized() throws Exception {
        mockMvc.perform(get(API_1))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("WWW-Authenticate", "Basic realm=\"API\""));
    }

    @Test
    public void testApi1Ok() throws Exception {
        mockMvc.perform(get(API_1)
                .header("Authorization", basic(USER1)))
                .andExpect(status().isOk());
    }

    @Test
    public void testApi2Unauthorized() throws Exception {
        mockMvc.perform(get(API_2))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testAccessControlAllowOrigin() throws Exception {
        createAccessTokenInTokenStore();

        mockMvc.perform(get(API_2)
                .header("Authorization", "Bearer " + TEST_ACCESS_TOKEN))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }

    @Test
    public void testAccessControlAllowMethodsNotPresent() throws Exception {
        createAccessTokenInTokenStore();

        mockMvc.perform(options(API_2)
                .header("Authorization", "Bearer " + TEST_ACCESS_TOKEN))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Methods", nullValue()));
    }

    @Test
    public void testAccessControlAllowMethods() throws Exception {
        createAccessTokenInTokenStore();

        String method = "POST";
        mockMvc.perform(options(API_2)
                .header("Authorization", "Bearer " + TEST_ACCESS_TOKEN)
                .header("Access-Control-Request-Method", method))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Methods", is("POST")));
    }

    public void testAccessControlAllowHeadersNotPresent() throws Exception {
        createAccessTokenInTokenStore();

        mockMvc.perform(options(API_2)
                .header("Authorization", "Bearer " + TEST_ACCESS_TOKEN))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Headers", nullValue()));
    }

    @Test
    public void testAccessControlAllowHeaders() throws Exception {
        createAccessTokenInTokenStore();

        String header = "X-Test-Header";
        mockMvc.perform(options(API_2)
                .header("Authorization", "Bearer " + TEST_ACCESS_TOKEN)
                .header("Access-Control-Request-Headers", header))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Headers", is(header)));
    }

    private void createAccessTokenInTokenStore() {
        OAuth2Request oAuth2Request = createOauth2Request();
        OAuth2Authentication oAuth2Authentication = new OAuth2Authentication(oAuth2Request, null);
        DefaultOAuth2AccessToken defaultOAuth2AccessToken = new DefaultOAuth2AccessToken(TEST_ACCESS_TOKEN);
        tokenStore.storeAccessToken(defaultOAuth2AccessToken, oAuth2Authentication);
    }

    private OAuth2Request createOauth2Request() {
        Map<String, String> requestParameters = null;
        Collection<? extends GrantedAuthority> authorities = null;
        boolean approved = true;
        Set<String> scope = Collections.singleton("all");
        Set<String> resourceIds = null;
        String redirectUri = null;
        Set<String> responseTypes = Collections.singleton("token");
        Map<String, Serializable> extensionProperties = null;

        return new OAuth2Request( requestParameters, IMPLICIT_OAUTH_CLIENT, authorities, approved,  scope, resourceIds, redirectUri, responseTypes, extensionProperties);
    }

    private static String basic(KnownUser user) {
        return "Basic " + new String(Base64.encodeBase64((String.format("%s:%s", user.username, user.password)).getBytes()));
    }
}
