package spring.data.domain;

import org.junit.Test;

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class SequenceImplTest {

    @Test
    public void testGetNextAndHasNext() throws Exception {
        SequenceRequest sequenceRequest = new SequenceRequest(0, null);
        SequenceImpl<Object> sequence = new SequenceImpl<>(Collections.emptyList(), sequenceRequest);
        assertThat(sequence.getNext(), nullValue());
        assertThat(sequence.hasNext(), is(false));
    }

    @Test
    public void testGetPageSize() throws Exception {
        SequenceRequest sequenceRequest = new SequenceRequest(0, null);
        SequenceImpl<Object> sequence = new SequenceImpl<>(Collections.emptyList(), sequenceRequest);
        assertThat(sequence.getPageSize(), is(0));
    }
}