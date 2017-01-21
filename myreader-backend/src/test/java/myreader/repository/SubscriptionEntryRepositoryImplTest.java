package myreader.repository;

import myreader.config.CommonConfig;
import myreader.entity.SubscriptionEntry;
import myreader.test.annotation.WithMockUser4;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Slice;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@Import(CommonConfig.class)
@WithMockUser4
@Sql("classpath:test-data.sql")
@DataJpaTest
public class SubscriptionEntryRepositoryImplTest {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void findByPageableIsNull() throws Exception {
        final Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findByForCurrentUser(null, null, null, null, null, null, 0);
        assertThat(slice.getSize(), is(0));
    }
}
