package myreader.config;

import java.util.HashMap;
import java.util.Map;

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
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import myreader.repository.UserRepository;
import spring.security.AjaxExceptionTranslationFilter;
import spring.security.RoleBasedAuthenticationSuccessHandler;
import spring.security.UserRepositoryUserDetailsService;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = {"spring.security"})
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String ACCOUNT_CONTEXT = "/web";
    public static final String LOGIN_URL = ACCOUNT_CONTEXT + "/login";
    public static final String LOGOUT_URL = ACCOUNT_CONTEXT + "/logout";
    public static final String LOGIN_PROCESSING_URL = ACCOUNT_CONTEXT + "/check";

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
                .antMatchers("/static/**", "/js-min/**");
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
                .authorizeRequests()
                .antMatchers("/web/admin/**", "/api/1/admin/**")
                .hasRole("ADMIN")
                .and()
                .antMatcher("/**")
                .authorizeRequests()
                .anyRequest()
                .hasAnyRole("USER")
                .and()
                .csrf().disable()
                .httpBasic().realmName("API")
                .and()
                .formLogin()
                .loginPage(LOGIN_URL).permitAll()
                .loginProcessingUrl(LOGIN_PROCESSING_URL).permitAll()
                .successHandler(successHandler())
                .failureUrl(LOGIN_URL + "?result=failed")
                .and()
                .rememberMe()
                .and()
                .logout().logoutUrl(LOGOUT_URL).logoutSuccessUrl(LOGIN_URL).permitAll().deleteCookies("JSESSIONID")
                .and()
                .addFilterBefore(ajaxExceptionTranslationFilter(), FilterSecurityInterceptor.class)
                .headers().frameOptions().disable();
    }

    private AjaxExceptionTranslationFilter ajaxExceptionTranslationFilter() {
        return new AjaxExceptionTranslationFilter(authenticationEntryPoint());
    }

    private AuthenticationEntryPoint authenticationEntryPoint() {
        return new LoginUrlAuthenticationEntryPoint(LOGIN_URL);
    }

    private AuthenticationSuccessHandler successHandler() {
        final SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setRedirectStrategy(redirectStrategy());
        return successHandler;
    }

    private RedirectStrategy redirectStrategy() {
        final Map<String, String> roleUrlMap = new HashMap<>();
        roleUrlMap.put("ROLE_ADMIN", "/web/admin");
        roleUrlMap.put("ROLE_USER", "/web/rss");
        return new RoleBasedAuthenticationSuccessHandler(roleUrlMap);
    }

}
