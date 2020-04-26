package myreader.repository;

import myreader.entity.SubscriptionEntry;
import myreader.test.TestConstants;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Slice;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@Import({SubscriptionEntryRepositoryTests.TestConfiguration.class})
@Sql("classpath:test-data.sql")
@Transactional(propagation = Propagation.SUPPORTS)
@DataJpaTest(showSql = false)
public class SubscriptionEntryRepositoryTests {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    private Slice<SubscriptionEntry> slice;

    @Before
    public void setUp() throws InterruptedException {
        Search.getFullTextEntityManager(testEntityManager.getEntityManager()).createIndexer().startAndWait();
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void distinctTags() {
        final Set<String> distinctTags = subscriptionEntryRepository.findDistinctTagsForCurrentUser();
        assertThat(distinctTags, contains("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9"));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void searchWithPageSizeOne() {
        givenQuery(null, null, null, null, null, null, 1);
        assertThat(slice.getContent().get(0).getId(), is(1013L));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void searchSubscriptionEntryByTitle() {
        givenQuery("mysql", null, null, null, null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1002L));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void searchSubscriptionEntryByContent() {
        givenQuery("content", null, null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(2));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void searchPaginated() {
        givenQuery(null, null, null, null, null, null, 10);
        assertThat(slice.getNumberOfElements(), is(2));

        givenQuery(null, null, null, null, null, null, 1);
        assertThat(slice.getContent().get(0).getId(), is(1002L));
        assertThat(slice.hasNext(), is(true));

        givenQuery(null, null, null, null, null, 1002L, 1);
        assertThat(slice.getContent().get(0).getId(), is(1001L));
        assertThat(slice.hasNext(), is(false));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void searchNextPage() {
        givenQuery(null, null, null, null, null, 1582801646000L, 1);
        assertThat(slice.getContent().get(0).getId(), is(1002L));

        assertThat(slice.hasNext(), is(true));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void searchSubscriptionEntryByTag() {
        givenQuery("tag1", null, null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(2));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void searchSubscriptionEntryTag() {
        givenQuery("help", null, null, null, null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1011L));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void seenEqualFalse() {
        givenQuery(null, null, null, null, "false", null, 10);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void seenEqualTrue() {
        givenQuery(null, null, null, null, "true", null, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void seenEqualWildcard() {
        givenQuery(null, null, null, null, "*", null, 10);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void feedUuidEqual14() {
        givenQuery(null, "14", null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void feedUuidEqual9114() {
        givenQuery(null, "9114", null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void feedTagEqualUnknown() {
        givenQuery(null, null, "unknown", null, null, null, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser(TestConstants.USER115)
    public void feedTagEqualTag1() {
        givenQuery(null, null, "tag1", null, null, null, 10);
        assertThat(slice.getContent(), hasSize(2));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void entryTagEqualTag2Tag3() {
        givenQuery(null, null, null, "tag2", null, null, 10);
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag2-tag3", null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1010L));
        assertThat(slice.getContent().get(0).getTag(), is("tag2-tag3"));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void entryTagEqualTag4AndTag5() {
        givenQuery(null, null, null, "tag4", null, null, 10);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1011L));
        assertThat(slice.getContent().get(0).getTag(), is("tag4 tag5"));

        givenQuery(null, null, null, "tag5", null, null, 10);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1011L));
        assertThat(slice.getContent().get(0).getTag(), is("tag4 tag5"));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void entryTagEqualTag6AndTag7() {
        givenQuery(null, null, null, "tag6", null, null, 10);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1012L));
        assertThat(slice.getContent().get(0).getTag(), is("tag6,tag7"));

        givenQuery(null, null, null, "tag7", null, null, 10);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1012L));
        assertThat(slice.getContent().get(0).getTag(), is("tag6,tag7"));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void entryTagEqualTag8Tag9() {
        givenQuery(null, null, null, "tag8tag9", null, null, 10);
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag8Tag9", null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1013L));
        assertThat(slice.getContent().get(0).getTag(), is("tag8Tag9"));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldAppendAsteriskToSearchParameterWhenSearchParameterDoesNotEndWithAsterisk() {
        givenQuery("con", null, null, null, "*", null, 10);
        assertThat(slice.getContent(), hasSize(5));

        givenQuery("con*", null, null, null, "*", null, 10);
        assertThat(slice.getContent(), hasSize(5));
    }

    public void givenQuery(String q, String feedId, String feedTagEqual, String entryTagEqual, String seen, Long next, int size) {
        slice = subscriptionEntryRepository.findByForCurrentUser(
                size,
                q,
                feedId,
                feedTagEqual,
                entryTagEqual,
                seen,
                next
        );
    }

    static class TestConfiguration {

        @Bean
        public SecurityEvaluationContextExtension securityEvaluationContextExtension() {
            return new SecurityEvaluationContextExtension();
        }
    }
}
