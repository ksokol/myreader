package myreader.fetcher.event;

import org.junit.Test;

import java.util.Date;

import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;

/**
 * @author Kamill Sokol
 */
public class FetchErrorEventTest {

    @Test
    public void testEventConstruction() {
        FetchErrorEvent event = new FetchErrorEvent("url", "errorMessage");

        assertThat(event.getFeedUrl(), is("url"));
        assertThat(event.getErrorMessage(), is("errorMessage"));
        assertThat(event.getCreatedAt(), instanceOf(Date.class));
    }
}