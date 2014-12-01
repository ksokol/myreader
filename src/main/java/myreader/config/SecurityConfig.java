package myreader.config;

import myreader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;
import spring.security.UserRepositoryUserDetailsService;
import spring.security.oauth2.AutoApproveUserApprovalHandler;
import spring.security.web.headers.writers.CorsHeaderWriter;

import java.util.Collections;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = {"spring.security"})
public class SecurityConfig {

    public static final String ACCOUNT_CONTEXT = "/account";
    public static final String LOGIN_URL = ACCOUNT_CONTEXT + "/login";
    public static final String LOGIN_PROCESSING_URL = ACCOUNT_CONTEXT + "/check";
    public static final String IMPLICIT_OAUTH_CLIENT = "public";

    @Autowired
    private UserRepository userRepository;

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

    private UserDetailsService userDetailsService() {
        return new UserRepositoryUserDetailsService(userRepository);
    }

    @EnableWebMvc
    @Configuration
    public static class LoginConf extends WebMvcConfigurerAdapter {

        @Override
        public void addViewControllers(final ViewControllerRegistry registry) {
            registry.addViewController(LOGIN_URL).setViewName("login");
        }

        @Override
        public void configureViewResolvers(ViewResolverRegistry registry) {
            FreeMarkerViewResolver freeMarkerViewResolver = new FreeMarkerViewResolver();
            freeMarkerViewResolver.setExposeSpringMacroHelpers(false);
            freeMarkerViewResolver.setRequestContextAttribute("requestContext");
            freeMarkerViewResolver.setSuffix(".ftl");
            freeMarkerViewResolver.setAttributesMap(Collections.singletonMap("LOGIN_PROCESSING_URL", LOGIN_PROCESSING_URL));
            registry.viewResolver(freeMarkerViewResolver);
        }

        @Bean
        public FreeMarkerConfigurer freeMarkerConfig() {
            FreeMarkerConfigurer freeMarkerConfigurer = new FreeMarkerConfigurer();
            freeMarkerConfigurer.setTemplateLoaderPath("/WEB-INF/views/");
            return freeMarkerConfigurer;
        }
    }

    @Configuration
    @EnableAuthorizationServer
    public static class OAuth2Configuration extends AuthorizationServerConfigurerAdapter {

        @Override
        public void configure(final AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints.userApprovalHandler(new AutoApproveUserApprovalHandler());
        }

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            clients
                    .inMemory()
                    .withClient(IMPLICIT_OAUTH_CLIENT)
                    .authorizedGrantTypes("implicit")
                    .scopes("all");
        }
    }

    @Configuration
    @Order(1)
    public static class ApiWebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {

       @Override
       protected void configure(HttpSecurity http) throws Exception {
            http
                    .regexMatcher("/api/(1|user)/.*")
                    .authorizeRequests()
                    .anyRequest()
                    .hasAnyRole("USER", "ADMIN")
                    .and()
                    .csrf().disable()
                    .httpBasic().realmName("API")
                    .and()
                    .sessionManagement().sessionCreationPolicy(STATELESS);
        }
    }

    @Order(2)
    @Configuration
    public static class FormLoginWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .regexMatcher("/(oauth|account)/.*")
                    .authorizeRequests()
                    .anyRequest().authenticated()
                    .and()
                    .formLogin()
                    .loginProcessingUrl(LOGIN_PROCESSING_URL).permitAll()
                    .loginPage(LOGIN_URL).permitAll();
        }
    }

    @Configuration
    @EnableResourceServer
    public static class CustomResourceServerConfigurerAdapter extends ResourceServerConfigurerAdapter {

        @Override
        public void configure(final HttpSecurity http) throws Exception {
            http
                    .antMatcher("/api/2/**")
                    .authorizeRequests()
                    .anyRequest().fullyAuthenticated()
                    .and()
                    .sessionManagement().sessionCreationPolicy(STATELESS)
                    .and()
                    .headers()
                    .cacheControl()
                    .httpStrictTransportSecurity()
                    .addHeaderWriter(new XFrameOptionsHeaderWriter(SAMEORIGIN))
                    .addHeaderWriter(new CorsHeaderWriter());
        }
    }
}
