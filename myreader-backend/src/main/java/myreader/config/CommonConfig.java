package myreader.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.SimpleApplicationEventMulticaster;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.annotation.PostConstruct;
import java.time.Clock;

import static java.util.Objects.requireNonNull;

@Configuration
@EnableScheduling
public class CommonConfig {

  private final ThreadPoolTaskExecutor executor;
  private final SimpleApplicationEventMulticaster eventMulticaster;

  public CommonConfig(ThreadPoolTaskExecutor executor, SimpleApplicationEventMulticaster eventMulticaster) {
    this.executor = requireNonNull(executor, "executor is null");
    this.eventMulticaster = requireNonNull(eventMulticaster, "eventMulticaster is null");
  }

  @PostConstruct
  void postConstruct() {
    eventMulticaster.setTaskExecutor(executor);
  }

  @Bean
  public Clock clock() {
    return Clock.systemUTC();
  }
}
