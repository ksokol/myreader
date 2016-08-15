package myreader.repository;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ExclusionRepositoryTest extends IntegrationTestSupport {

    private static final long EXCLUSION_PATTERN_ID = 0L;

    @Autowired
    private ExclusionRepository exclusionRepository;

    @Test
    public void findBySubscriptionId() {
        assertThat(exclusionRepository.findBySubscriptionId(1L), hasSize(2));
    }

    @Test
    public void incrementHitCount() throws Exception {
        assertThat(exclusionRepository.findOne(EXCLUSION_PATTERN_ID).getHitCount(), is(1));

        exclusionRepository.incrementHitCount(EXCLUSION_PATTERN_ID);

        assertThat(exclusionRepository.findOne(EXCLUSION_PATTERN_ID).getHitCount(), is(2));
    }

}