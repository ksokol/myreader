package myreader.repository;

import static org.hamcrest.Matchers.contains;
import static org.junit.Assert.assertThat;

import java.util.Set;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import myreader.test.IntegrationTestSupport;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryRepositoryTests extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Test
    public void distinctTags() {
        final Set<String> distinctTags = subscriptionEntryRepository.findDistinctTags(4L);
        assertThat(distinctTags, contains("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9"
        ));
    }
}
