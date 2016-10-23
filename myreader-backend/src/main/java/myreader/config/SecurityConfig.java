package myreader.config;

import myreader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.Http401AuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import spring.security.UserRepositoryUserDetailsService;
import spring.security.XAuthoritiesFilter;

import javax.servlet.http.HttpServletResponse;

import static javax.servlet.http.HttpServletResponse.SC_NO_CONTENT;
import static myreader.config.UrlMappings.API;
import static myreader.config.UrlMappings.HYSTRIX;
import static myreader.config.UrlMappings.HYSTRIX_DASHBOARD;
import static myreader.config.UrlMappings.HYSTRIX_PROXY;
import static myreader.config.UrlMappings.HYSTRIX_STREAM;
import static myreader.config.UrlMappings.LANDING_PAGE;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;

/**
 * @author Kamill Sokol
 */
@Order(Ordered.LOWEST_PRECEDENCE)
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserRepository userRepository;
    private final String rememberMeKey;
    private final String hystrixStreamAllowedIp;

    public SecurityConfig(UserRepository userRepository,
                          @Value("${remember-me.key}") String rememberMeKey,
                          @Value("${myreader.hystrix.stream.allowed-ip}") String hystrixStreamAllowedIp) {
        this.userRepository = userRepository;
        this.rememberMeKey = rememberMeKey;
        this.hystrixStreamAllowedIp = hystrixStreamAllowedIp;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService())
            .passwordEncoder(passwordEncoder());
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        webSecurity
                .ignoring()
                .antMatchers(LANDING_PAGE.mapping(), "/index.html", "/*.css", "/*.js");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Md5PasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserRepositoryUserDetailsService(userRepository);
    }

    @Order(100)
    @Configuration
    class DefaultSecurityConfiguration extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                .authorizeRequests().antMatchers("/**").permitAll()
                .and()
                .formLogin().loginPage("/")
                .loginProcessingUrl(LOGIN_PROCESSING.mapping()).permitAll()
                .successHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_NO_CONTENT))
                .failureHandler((request, response, exception) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                .and()
                .rememberMe().key(rememberMeKey)
                .and()
                .logout().logoutSuccessHandler((request, response, authentication) -> response.setStatus(SC_NO_CONTENT))
                .permitAll()
                .deleteCookies("JSESSIONID")
                .and()
                .addFilterAfter(new XAuthoritiesFilter(), FilterSecurityInterceptor.class)
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
                .antMatcher(API.mapping() + "/**")
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .rememberMe().key(rememberMeKey)
                .and()
                .addFilterAfter(new XAuthoritiesFilter(), FilterSecurityInterceptor.class)
                .csrf().disable()
                .exceptionHandling().authenticationEntryPoint(new Http401AuthenticationEntryPoint("Form realm=\"MyReader\""));
        }
    }

    @Order(98)
    @Configuration
    class HystrixStreamSecurityConfiguration extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                .antMatcher(HYSTRIX_STREAM.mapping())
                .authorizeRequests().anyRequest()
                .hasIpAddress(hystrixStreamAllowedIp).and()
                .csrf().disable();
        }
    }

    @Order(97)
    @Configuration
    class HystrixSecurityConfiguration extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            String urlRegexp = String.format("(%s|%s.*|%s|%s/.*)", HYSTRIX_DASHBOARD.mapping(), HYSTRIX_PROXY.mapping(), HYSTRIX.mapping(), HYSTRIX.mapping());

            http
                .regexMatcher(urlRegexp)
                .authorizeRequests().anyRequest()
                .hasRole("ADMIN")
                .and()
                .rememberMe().key(rememberMeKey)
                .and()
                .csrf().disable();
        }
    }
}
