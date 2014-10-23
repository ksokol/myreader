package myreader.service.time;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class TimeServiceImplTest {

    @Test
    public void testGetCurrentTime() throws Exception {
        assertThat(new TimeServiceImpl().getCurrentTime(), not(nullValue()));
    }
}
