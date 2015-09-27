package spring.security;

import myreader.entity.User;
import myreader.repository.UserRepository;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

/**
 * @author Kamill Sokol
 */
public class UserRepositoryUserDetailsServiceTest {

    private static UserRepositoryUserDetailsService uut;
    private static UserRepository userRepositoryMock = mock(UserRepository.class);

    @BeforeClass
    public static void beforeClass() {
        uut = new UserRepositoryUserDetailsService(userRepositoryMock);
    }

    @Before
    public void before() {
        reset(userRepositoryMock);
    }

    @Test(expected = UsernameNotFoundException.class)
    public void testExpectedUsernameNotFoundException() {
        when(userRepositoryMock.findByEmail(anyString())).thenReturn(null);
        uut.loadUserByUsername("not found");
    }

    @Test
    public void testLoadUserByUsername() {
        User user = new User();
        user.setId(1L);
        user.setPassword("password");
        user.setRole("role");
        user.setEmail("email");

        when(userRepositoryMock.findByEmail("email")).thenReturn(user);
        MyReaderUser userDetails = (MyReaderUser) uut.loadUserByUsername("email");

        assertThat(userDetails, hasProperty("id", is(1L)));
        assertThat(userDetails, hasProperty("password", is("password")));
        assertThat(userDetails, hasProperty("username", is("email")));
        assertThat(userDetails, hasProperty("accountNonExpired", is(true)));
        assertThat(userDetails, hasProperty("credentialsNonExpired", is(true)));
        assertThat(userDetails, hasProperty("accountNonLocked", is(true)));

        assertThat(userDetails.getAuthorities(),hasSize(1));
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority(), is("role"));
    }
}