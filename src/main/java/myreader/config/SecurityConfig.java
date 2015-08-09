package myreader.config;

import static myreader.config.UrlMappings.JAWR_CSS;
import static myreader.config.UrlMappings.JAWR_JS;
import static myreader.config.UrlMappings.LANDING_PAGE;
import static myreader.config.UrlMappings.LOGIN;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.config.UrlMappings.LOGOUT;

import myreader.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

import spring.security.AjaxExceptionTranslationFilter;
import spring.security.CustomAuthenticationSuccessHandler;
import spring.security.CustomFailureAuthenticationSuccessHandler;
import spring.security.UserRepositoryUserDetailsService;
import spring.security.XAuthoritiesFilter;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = {"spring.security"})
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserRepository userRepository;

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
                .antMatchers("/static/**", JAWR_JS.mapping() + "/**", JAWR_CSS.mapping() + "/**", LANDING_PAGE.mapping());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Md5PasswordEncoder();
    }

    public UserDetailsService userDetailsService() {
        return new UserRepositoryUserDetailsService(userRepository);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .antMatcher("/**")
                .authorizeRequests()
                .anyRequest()
                .hasAnyRole("USER", "ADMIN")
                .and()
                .csrf().disable()
                .httpBasic().realmName("API")
                .and()
                .formLogin()
                .loginProcessingUrl(LOGIN_PROCESSING.mapping()).permitAll()
                .successHandler(new CustomAuthenticationSuccessHandler())
                .failureHandler(new CustomFailureAuthenticationSuccessHandler())
                .and()
                .rememberMe()
                .and()
                .logout()
                .logoutUrl(LOGOUT.mapping())
                .logoutSuccessUrl(LOGIN.mapping()).permitAll()
                .deleteCookies("JSESSIONID")
                .and()
                .addFilterBefore(ajaxExceptionTranslationFilter(), FilterSecurityInterceptor.class)
                .addFilterAfter(new XAuthoritiesFilter(), FilterSecurityInterceptor.class)
                .headers().frameOptions().disable();
    }

    private AjaxExceptionTranslationFilter ajaxExceptionTranslationFilter() {
        return new AjaxExceptionTranslationFilter(authenticationEntryPoint());
    }

    private AuthenticationEntryPoint authenticationEntryPoint() {
        return new LoginUrlAuthenticationEntryPoint(LOGIN.mapping());
    }
}
