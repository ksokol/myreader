package spring.security;

import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.security.Principal;

/**
 * @author Kamill Sokol
 */
public class XAuthoritiesFilterTests {

    private static final String X_MY_AUTHORITIES = "X-MY-AUTHORITIES";
    private XAuthoritiesFilter filter = new XAuthoritiesFilter();

    @Test
    public void noPrincipal() throws Exception {
        final MockHttpServletResponse mockHttpServletResponse = setup(null);
        assertThat(mockHttpServletResponse.getHeader(X_MY_AUTHORITIES), nullValue());
    }

    @Test
    public void principalWithoutAuthorities() throws Exception {
        final MockHttpServletResponse mockHttpServletResponse = setup(new UsernamePasswordAuthenticationToken("irrelevant", "irrelevant"));
        assertThat(mockHttpServletResponse.getHeader(X_MY_AUTHORITIES), nullValue());
    }

    private MockHttpServletResponse setup(Principal principal) throws Exception {
        final MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        mockHttpServletRequest.setUserPrincipal(principal);
        final MockHttpServletResponse mockHttpServletResponse = new MockHttpServletResponse();
        filter.doFilter(mockHttpServletRequest, mockHttpServletResponse, new MockFilterChain());
        return mockHttpServletResponse;
    }
}
