package org.springframework.test.web.servlet.request;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpMethod;
/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class MockMvcRequestBuildersWithAuthenticatedUserSupport extends MockMvcRequestBuilders {

    private enum KnownUser {
        ADMIN("user0@localhost","0"), USER1("user1@localhost","1"), USER2("user2@localhost","2");

        KnownUser(String username, String password) {
            this.username = username;
            this.password = password;
        }

        final String username;
        final String password;
    }

    public static MockHttpServletRequestBuilder getAsAdmin(String urlTemplate, Object... urlVariables) {
        return getAsUserX(KnownUser.ADMIN, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder getAsUser1(String urlTemplate, Object... urlVariables) {
        return getAsUserX(KnownUser.USER1, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder getAsUser2(String urlTemplate, Object... urlVariables) {
        return getAsUserX(KnownUser.USER2, urlTemplate, urlVariables);
    }

    private static MockHttpServletRequestBuilder getAsUserX( KnownUser user, String urlTemplate, Object... urlVariables) {
        MockHttpServletRequestBuilder mockHttpServletRequestBuilder = new MockHttpServletRequestBuilder(HttpMethod.GET, urlTemplate, urlVariables);
        addAuthentication(mockHttpServletRequestBuilder, user);
        return  mockHttpServletRequestBuilder;
    }

    private static void addAuthentication(MockHttpServletRequestBuilder mockHttpServletRequestBuilder, KnownUser user) {
        String basicDigestHeaderValue = "Basic " + new String(Base64.encodeBase64((String.format("%s:%s", user.username, user.password)).getBytes()));
        mockHttpServletRequestBuilder.header("Authorization", basicDigestHeaderValue);
    }
}
