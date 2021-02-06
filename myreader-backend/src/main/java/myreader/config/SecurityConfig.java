package myreader.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.Objects;

import static myreader.config.UrlMappings.API_2;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;

@Configuration
public class SecurityConfig {

  private final String rememberMeKey;
  private final String userPassword;

  public SecurityConfig(
    @Value("${remember-me.key}") String rememberMeKey,
    @Value("${user.password.bcrypt}") String userPassword
  ) {
    this.rememberMeKey = Objects.requireNonNull(rememberMeKey, "rememberMeKey is null");
    this.userPassword = Objects.requireNonNull(userPassword, "userPassword is null");
  }

  @Order(101)
  @Configuration
  class DefaultSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
      auth
        .userDetailsService(username -> new User("user", userPassword, true, true, true, true, Collections.emptyList()))
        .passwordEncoder(new BCryptPasswordEncoder());
    }
  }

  @Order(100)
  @Configuration
  class LoginSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
        .formLogin().loginPage("/")
        .loginProcessingUrl(LOGIN_PROCESSING.mapping()).permitAll()
        .successHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_NO_CONTENT))
        .failureHandler((request, response, exception) -> response.setStatus(HttpServletResponse.SC_BAD_REQUEST))
        .and()
        .rememberMe().key(rememberMeKey).alwaysRemember(true)
        .and()
        .logout().logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_NO_CONTENT))
        .permitAll()
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
