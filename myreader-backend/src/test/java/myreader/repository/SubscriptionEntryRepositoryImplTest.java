package myreader.repository;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import myreader.entity.SubscriptionEntry;
import myreader.test.IntegrationTestSupport;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.Slice;

public class SubscriptionEntryRepositoryImplTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void findByOwnerIdIsNullTest() throws Exception {
        expectedException.expect(InvalidDataAccessApiUsageException.class);
        expectedException.expectMessage("ownerId is null");
        subscriptionEntryRepository.findBy(null, null, null, null, null, null, null, null);
    }

    @Test
    public void findByPageableIsnullTest() throws Exception {
        final Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findBy(null, 1L, null, null, null, null, null, null);
        assertThat(slice.getSize(), is(0));
    }
}
