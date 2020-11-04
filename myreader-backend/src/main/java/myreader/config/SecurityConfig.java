package myreader.config;

import myreader.security.CustomAuthenticationSuccessHandler;
import myreader.security.UserRepositoryUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Objects;

import static javax.servlet.http.HttpServletResponse.SC_NO_CONTENT;
import static myreader.config.UrlMappings.API_2;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;

@Configuration
public class SecurityConfig {

  private final UserRepositoryUserDetailsService userRepositoryUserDetailsService;
  private final String rememberMeKey;

  public SecurityConfig(UserRepositoryUserDetailsService userRepositoryUserDetailsService, @Value("${remember-me.key}") String rememberMeKey) {
    this.userRepositoryUserDetailsService = Objects.requireNonNull(userRepositoryUserDetailsService, "userRepositoryUserDetailsService is null");
    this.rememberMeKey = Objects.requireNonNull(rememberMeKey, "rememberMeKey is null");
  }

  @Order(101)
  @Configuration
  class DefaultSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
      auth
        .userDetailsService(userRepositoryUserDetailsService)
        .passwordEncoder(new DelegatingPasswordEncoder("MD5", Map.of("MD5", new MessageDigestPasswordEncoder("MD5"))));
    }
  }

  @Order(100)
  @Configuration
  class LoginSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final AuthenticationSuccessHandler authenticationSuccessHandler = new CustomAuthenticationSuccessHandler();

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
        .formLogin().loginPage("/")
        .loginProcessingUrl(LOGIN_PROCESSING.mapping()).permitAll()
        .successHandler(authenticationSuccessHandler)
        .failureHandler((request, response, exception) -> response.setStatus(HttpServletResponse.SC_BAD_REQUEST))
        .and()
        .rememberMe().key(rememberMeKey).alwaysRemember(true)
        .and()
        .logout().logoutSuccessHandler((request, response, authentication) -> response.setStatus(SC_NO_CONTENT))
        .permitAll()
        .deleteCookies("JSESSIONID")
        .and()
        .authorizeRequests().antMatchers("/**").permitAll()
        .and()
        .csrf().disable()
        .headers().frameOptions().disable();
    }
  }

  @Order(99)
  @Configuration
  class ApiSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

      http
        .antMatcher(API_2.mapping() + "/**")
        .authorizeRequests().antMatchers(API_2.path("processing"), API_2.path("feeds") + "/**").hasRole("ADMIN")
        .and()
        .authorizeRequests().anyRequest().authenticated()
        .and()
        .rememberMe().key(rememberMeKey)
        .and()
        .csrf().disable()
        .exceptionHandling().authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
    }
  }

  @Order(98)
  @Configuration
  class ActuatorSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
        .antMatcher(UrlMappings.INFO.mapping())
        .authorizeRequests().antMatchers(UrlMappings.INFO.mapping()).authenticated()
        .and()
        .rememberMe().key(rememberMeKey)
        .and()
        .csrf().disable()
        .exceptionHandling().authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
    }
  }
}
