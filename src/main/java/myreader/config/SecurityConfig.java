package myreader.config;

import static myreader.config.UrlMappings.JAWR_JS;
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
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import spring.security.AjaxExceptionTranslationFilter;
import spring.security.RoleBasedAuthenticationSuccessHandler;
import spring.security.UserRepositoryUserDetailsService;
import spring.security.XAuthoritiesFilter;

import java.util.HashMap;
import java.util.Map;

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
                .antMatchers("/static/**", JAWR_JS + "/**");
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
                .antMatchers("/web/admin/**")
                .hasRole("ADMIN")
                .and()
                .antMatcher("/**")
                .authorizeRequests()
                .anyRequest()
                .hasAnyRole("USER", "ADMIN")
                .and()
                .csrf().disable()
                .httpBasic().realmName("API")
                .and()
                .formLogin()
                .loginPage(LOGIN).permitAll()
                .loginProcessingUrl(LOGIN_PROCESSING).permitAll()
                .successHandler(successHandler())
                .failureUrl(LOGIN + "?result=failed")
                .and()
                .rememberMe()
                .and()
                .logout().logoutUrl(LOGOUT).logoutSuccessUrl(LOGIN).permitAll().deleteCookies("JSESSIONID")
                .and()
                .addFilterBefore(ajaxExceptionTranslationFilter(), FilterSecurityInterceptor.class)
                .addFilterAfter(new XAuthoritiesFilter(), FilterSecurityInterceptor.class)
                .headers().frameOptions().disable();
    }

    private AjaxExceptionTranslationFilter ajaxExceptionTranslationFilter() {
        return new AjaxExceptionTranslationFilter(authenticationEntryPoint());
    }

    private AuthenticationEntryPoint authenticationEntryPoint() {
        return new LoginUrlAuthenticationEntryPoint(LOGIN);
    }

    private AuthenticationSuccessHandler successHandler() {
        final SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setRedirectStrategy(redirectStrategy());
        return successHandler;
    }

    private RedirectStrategy redirectStrategy() {
        final Map<String, String> roleUrlMap = new HashMap<>();
        roleUrlMap.put("ROLE_ADMIN", "/mobile/reader");
        roleUrlMap.put("ROLE_USER", "/web/rss");
        return new RoleBasedAuthenticationSuccessHandler(roleUrlMap);
    }

}
