package myreader.repository;

import myreader.config.CommonConfig;
import myreader.entity.SubscriptionEntry;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.annotation.WithMockUser1;
import myreader.test.annotation.WithMockUser115;
import myreader.test.annotation.WithMockUser4;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Slice;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Set;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@Import(CommonConfig.class)
@WithMockUser4
@Sql("classpath:test-data.sql")
@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = IndexSyncJob.class))
public class SubscriptionEntryRepositoryTests {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private IndexSyncJob indexSyncJob;

    private Slice<SubscriptionEntry> slice;

    @Before
    public void setUp() throws Exception {
        indexSyncJob.work();
    }

    @Test
    @WithMockUser4
    public void distinctTags() {
        final Set<String> distinctTags = subscriptionEntryRepository.findDistinctTagsForCurrentUser();
        assertThat(distinctTags, contains("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9"));
    }

    @Test
    @WithMockUser4
    public void searchWithPageSizeOne() throws Exception {
        givenQuery(null, null, null, null, null, null, 1);
        assertThat(slice.getContent().get(0).getId(), is(1013L));
    }

    @Test
    @WithMockUser1
    public void searchSubscriptionEntryByTitle() throws Exception {
        givenQuery("mysql", null, null, null, null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1002L));
    }

    @Test
    @WithMockUser1
    public void searchSubscriptionEntryByContent() throws Exception {
        givenQuery("content", null, null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(2));
    }

    @Test
    @WithMockUser1
    public void searchWithNextId() throws Exception {
        givenQuery(null, null, null, null, null, 1001L, 10);
        assertThat(slice.getContent().get(0).getId(), is(1001L));

        givenQuery(null, null, null, null, null, 1000L, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser1
    public void searchSubscriptionEntryByTag() throws Exception {
        givenQuery("tag1", null, null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(2));
    }

    @Test
    @WithMockUser4
    public void searchSubscriptionEntryTag() throws Exception {
        givenQuery("help", null, null, null, null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1011L));
    }

    @Test
    @WithMockUser4
    public void seenEqualFalse() throws Exception {
        givenQuery(null, null, null, null, "false", null, 10);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    @WithMockUser4
    public void seenEqualTrue() throws Exception {
        givenQuery(null, null, null, null, "true", null, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser4
    public void feedUuidEqual14() throws Exception {
        givenQuery(null, "14", null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    @WithMockUser4
    public void feedUuidEqual9114() throws Exception {
        givenQuery(null, "9114", null, null, null, null, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser4
    public void feedTagEqualUnknown() throws Exception {
        givenQuery(null, null, "unknown", null, null, null, 10);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    @WithMockUser115
    public void feedTagEqualTag1() throws Exception {
        givenQuery(null, null, "tag1", null, null, null, 10);
        assertThat(slice.getContent(), hasSize(2));
    }

    @Test
    @WithMockUser4
    public void entryTagEqualTag2Tag3() throws Exception {
        givenQuery(null, null, null, "tag2", null, null, 10);
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag2-tag3", null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1010L));
        assertThat(slice.getContent().get(0).getTag(), is("tag2-tag3"));
    }

    @Test
    @WithMockUser4
    public void entryTagEqualTag4AndTag5() throws Exception {
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
    @WithMockUser4
    public void entryTagEqualTag6AndTag7() throws Exception {
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
    @WithMockUser4
    public void entryTagEqualTag8Tag9() throws Exception {
        givenQuery(null, null, null, "tag8tag9", null, null, 10);
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag8Tag9", null, null, 10);
        assertThat(slice.getContent().get(0).getId(), is(1013L));
        assertThat(slice.getContent().get(0).getTag(), is("tag8Tag9"));
    }

    private void givenQuery(String q, String feedId, String feedTagEqual, String entryTagEqual, String seen, Long nextId, int pageSize) {
        slice = subscriptionEntryRepository.findByForCurrentUser(q, feedId, feedTagEqual, entryTagEqual, seen, nextId, pageSize);
    }
}
