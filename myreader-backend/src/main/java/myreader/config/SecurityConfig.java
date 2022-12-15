package myreader.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import java.util.Collections;
import java.util.Objects;

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

  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return (web) -> web.ignoring()
      .requestMatchers("/", "/index.html", "/app/**", "/favicon.ico", "/favicon.png");
  }

  @Bean
  public UserDetailsService userDetailsService() {
    return username -> new User("user", userPassword, true, true, true, true, Collections.emptyList());
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
      .formLogin().loginPage("/")
      .loginProcessingUrl("/check")
      .successHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_NO_CONTENT))
      .failureHandler((request, response, exception) -> response.setStatus(HttpServletResponse.SC_BAD_REQUEST))
      .and()
      .rememberMe().key(rememberMeKey).alwaysRemember(true)
      .and()
      .logout().logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_NO_CONTENT))
      .and()
      .authorizeHttpRequests().requestMatchers("/**").authenticated()
      .and()
      .csrf().disable()
      .exceptionHandling().authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
      .and()
      .headers().frameOptions().disable()
      .and().build();
  }
}
