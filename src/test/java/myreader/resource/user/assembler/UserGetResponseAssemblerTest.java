package myreader.resource.user.assembler;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import myreader.entity.User;

/**
 * @author Kamill Sokol
 */
public class UserGetResponseAssemblerTest {

    private UserGetResponseAssembler uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new UserGetResponseAssembler();
    }

    @Test
    public void testNpe() throws Exception {
        User user = new User();
        uut.toResource(user);
    }
}
