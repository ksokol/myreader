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

import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryRepositoryImplTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void findByOwnerIdIsNullTest() throws Exception {
        expectedException.expect(InvalidDataAccessApiUsageException.class);
        expectedException.expectMessage("ownerId is null");
        subscriptionEntryRepository.findBy(Collections.emptyMap(), null);
    }

    @Test
    public void findByPageableIsnullTest() throws Exception {
        final Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findBy(Collections.emptyMap(), 1L);
        assertThat(slice.getSize(), is(0));
    }
}
