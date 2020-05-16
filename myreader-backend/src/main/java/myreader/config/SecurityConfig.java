package myreader.config;

import myreader.security.CustomAuthenticationSuccessHandler;
import myreader.security.UserRepositoryUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpServletResponse;

import java.util.Objects;

import static javax.servlet.http.HttpServletResponse.SC_NO_CONTENT;
import static myreader.config.UrlMappings.API_2;
import static myreader.config.UrlMappings.LANDING_PAGE;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;

/**
 * @author Kamill Sokol
 */
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
            auth.userDetailsService(userRepositoryUserDetailsService);
        }
    }

    @Order(100)
    @Configuration
    class LoginSecurityConfiguration extends WebSecurityConfigurerAdapter {

        private final AuthenticationSuccessHandler authenticationSuccessHandler = new CustomAuthenticationSuccessHandler();

        @Override
        public void configure(WebSecurity webSecurity) {
            webSecurity
                    .ignoring()
                    .antMatchers(LANDING_PAGE.mapping(), "/app/**", "/index.html", "/favicon.ico", "/service-worker.js");
        }

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
                .authorizeRequests().antMatchers("/**").authenticated()
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
                .authorizeRequests().anyRequest().hasAnyRole("USER", "ADMIN")
                .and()
                .rememberMe().key(rememberMeKey)
                .and()
                .csrf().disable()
                .exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
                    response.setHeader("WWW-Authenticate", "Form realm=\"MyReader\"");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
                });
        }
    }
}
