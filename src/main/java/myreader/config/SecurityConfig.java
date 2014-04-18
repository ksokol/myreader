package myreader.config;

import myreader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;

import spring.security.UserRepositoryUserDetailsService;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = {"spring"})
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // http://youtrack.jetbrains.com/issue/IDEA-118733
        http
          .csrf().disable()
          .httpBasic().realmName("API")
                .and()
          .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
            .antMatchers("/**").hasAnyRole("USER", "ADMIN")
          ;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Md5PasswordEncoder();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService())
            .passwordEncoder(passwordEncoder());
    }

    public UserDetailsService userDetailsService() {
        UserRepositoryUserDetailsService customUserDetailsService = new UserRepositoryUserDetailsService(userRepository);
        return customUserDetailsService;
    }
}
