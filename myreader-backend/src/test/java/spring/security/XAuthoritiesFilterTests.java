package spring.security;

import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

import java.security.Principal;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isEmptyString;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class XAuthoritiesFilterTests {

    private static final String X_MY_AUTHORITIES = "X-MY-AUTHORITIES";
    private XAuthoritiesFilter filter = new XAuthoritiesFilter();

    @Test
    public void noPrincipal() throws Exception {
        final MockHttpServletResponse mockHttpServletResponse = setup(null);
        assertThat(mockHttpServletResponse.getHeader(X_MY_AUTHORITIES), isEmptyString());
    }

    @Test
    public void principalWithoutAuthorities() throws Exception {
        final MockHttpServletResponse mockHttpServletResponse = setup(new UsernamePasswordAuthenticationToken("irrelevant", "irrelevant"));
        assertThat(mockHttpServletResponse.getHeader(X_MY_AUTHORITIES), isEmptyString());
    }

    @Test
    public void principalWithAuthorities() throws Exception {
        final MockHttpServletResponse mockHttpServletResponse =
                setup(new UsernamePasswordAuthenticationToken("irrelevant", "irrelevant",
                      AuthorityUtils.createAuthorityList("ROLE1", "ROLE2")));
        assertThat(mockHttpServletResponse.getHeader(X_MY_AUTHORITIES), is("ROLE1,ROLE2"));
    }

    private MockHttpServletResponse setup(Principal principal) throws Exception {
        final MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        mockHttpServletRequest.setUserPrincipal(principal);
        final MockHttpServletResponse mockHttpServletResponse = new MockHttpServletResponse();
        filter.doFilter(mockHttpServletRequest, mockHttpServletResponse, new MockFilterChain());
        return mockHttpServletResponse;
    }
}
