package myreader.config;

import myreader.repository.ExclusionRepository;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionEntryRepository;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
  basePackages = "myreader.repository",
  excludeFilters = @Filter(
    type = FilterType.ASSIGNABLE_TYPE,
    classes = {FetchErrorRepository.class, ExclusionRepository.class, SubscriptionEntryRepository.class}
  )
)
@EnableJdbcRepositories(
  basePackages = "myreader.repository",
  includeFilters = @Filter(
    type = FilterType.ASSIGNABLE_TYPE,
    classes = {FetchErrorRepository.class, ExclusionRepository.class, SubscriptionEntryRepository.class}
  )
)
public class RepositoryConfig {
}
