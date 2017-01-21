package myreader.repository;

import myreader.config.CommonConfig;
import myreader.test.annotation.WithMockUser4;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Set;

import static org.hamcrest.Matchers.contains;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@Import(CommonConfig.class)
@WithMockUser4
@Sql("classpath:test-data.sql")
@DataJpaTest
public class SubscriptionEntryRepositoryTests {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Test
    public void distinctTags() {
        final Set<String> distinctTags = subscriptionEntryRepository.findDistinctTagsForCurrentUser();
        assertThat(distinctTags, contains("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9"));
    }
}
