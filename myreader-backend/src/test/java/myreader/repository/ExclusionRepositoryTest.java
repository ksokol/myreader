package myreader.repository;

import myreader.entity.ExclusionPattern;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("/test-data.sql")
public class ExclusionRepositoryTest {

    private static final long EXCLUSION_PATTERN_ID = 0L;

    @Autowired
    private ExclusionRepository exclusionRepository;

    @Autowired
    private TestEntityManager em;

    @Test
    public void findBySubscriptionId() {
        assertThat(exclusionRepository.findBySubscriptionId(1L), hasSize(2));
    }

    @Test
    public void incrementHitCount() throws Exception {
        ExclusionPattern exclusionPattern = em.find(ExclusionPattern.class, EXCLUSION_PATTERN_ID);

        assertThat(exclusionPattern.getHitCount(), is(1));

        exclusionRepository.incrementHitCount(EXCLUSION_PATTERN_ID);

        exclusionPattern = em.refresh(exclusionPattern);

        assertThat(exclusionPattern.getHitCount(), is(2));
    }

}