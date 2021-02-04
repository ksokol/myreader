package myreader.security;

import myreader.entity.User;
import myreader.repository.UserRepository;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

public class UserRepositoryUserDetailsServiceTests {

  private static final UserRepository userRepositoryMock = mock(UserRepository.class);

  private static UserRepositoryUserDetailsService uut;

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
    User user = new User("email");
    user.setId(1L);
    user.setPassword("password");

    when(userRepositoryMock.findByEmail("email")).thenReturn(user);
    UserDetails userDetails = uut.loadUserByUsername("email");

    assertThat(userDetails, hasProperty("password", is("password")));
    assertThat(userDetails, hasProperty("username", is("email")));
    assertThat(userDetails, hasProperty("accountNonExpired", is(true)));
    assertThat(userDetails, hasProperty("credentialsNonExpired", is(true)));
    assertThat(userDetails, hasProperty("accountNonLocked", is(true)));
  }
}
