package myreader;

import myreader.security.SecurityFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
public class Starter {

  public static void main(String[] args) {
    SpringApplication.run(Starter.class);
  }

  @Bean
  public SecurityFilter securityFilter(@Value("${user.password.sha512}") String userPassword) {
    return new SecurityFilter(userPassword);
  }
}
