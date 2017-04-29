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

    public SecurityConfig(UserRepository userRepository, @Value("${remember-me.key}") String rememberMeKey) {
        this.userRepository = userRepository;
        this.rememberMeKey = rememberMeKey;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService())
            .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Md5PasswordEncoder();
    }

    @Override
    public UserDetailsService userDetailsService() {
        return new UserRepositoryUserDetailsService(userRepository);
    }

    @Order(100)
    @Configuration
    class DefaultSecurityConfiguration extends WebSecurityConfigurerAdapter {

        @Override
        public void configure(WebSecurity webSecurity) throws Exception {
            webSecurity
                    .ignoring()
                    .antMatchers(LANDING_PAGE.mapping(), "/node_modules/**", "/app/**", "/templates/**", "/index.html", "/*.css", "/*.js");
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
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
                .authorizeRequests().antMatchers("/**").authenticated()
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
                .httpBasic().realmName("API")
                .and()
                .addFilterAfter(new XAuthoritiesFilter(), FilterSecurityInterceptor.class)
                .csrf().disable()
                .exceptionHandling().authenticationEntryPoint(new Http401AuthenticationEntryPoint("Form realm=\"MyReader\""));
        }
    }
}
