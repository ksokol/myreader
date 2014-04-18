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

    public static MockHttpServletRequestBuilder getAsUser(String username, String password, String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, username, password, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder getAsAdmin(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, KnownUser.ADMIN.username, KnownUser.ADMIN.password, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder getAsUser1(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, KnownUser.USER1.username, KnownUser.USER1.password, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder getAsUser2(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, KnownUser.USER2.username, KnownUser.USER2.password, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder patchAsUser1(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.PATCH, KnownUser.USER1.username, KnownUser.USER1.password, urlTemplate, urlVariables);
    }

    public static MockHttpServletRequestBuilder patchAsUser2(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.PATCH, KnownUser.USER2.username, KnownUser.USER2.password, urlTemplate, urlVariables);
    }

    private static MockHttpServletRequestBuilder actionAsUserX(HttpMethod method, String username, String password, String urlTemplate, Object... urlVariables) {
        MockHttpServletRequestBuilder mockHttpServletRequestBuilder = new MockHttpServletRequestBuilder(method, urlTemplate, urlVariables);
        addAuthentication(mockHttpServletRequestBuilder, username, password);
        return  mockHttpServletRequestBuilder;
    }

    private static void addAuthentication(MockHttpServletRequestBuilder mockHttpServletRequestBuilder, String username, String password) {
        String basicDigestHeaderValue = "Basic " + new String(Base64.encodeBase64((String.format("%s:%s", username, password)).getBytes()));
        mockHttpServletRequestBuilder.header("Authorization", basicDigestHeaderValue);
    }
}
