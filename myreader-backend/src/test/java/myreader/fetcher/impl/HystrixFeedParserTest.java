package myreader.fetcher.impl;

import com.netflix.config.ConfigurationManager;
import com.netflix.hystrix.Hystrix;
import com.netflix.hystrix.HystrixCircuitBreaker;
import com.netflix.hystrix.HystrixCommandKey;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class HystrixFeedParserTest {

    private static final String URL_COMMAND_KEY = "url";

    @InjectMocks
    private HystrixFeedParser hystrixFeedParser;

    @Mock
    private FeedParser feedParser;

    @Before
    public void setUp() {
        resetHystrix();
        warmUpCircuitBreaker();
        openCircuitBreakerAfterOneFailingRequest();
    }

    @Test
    public void shouldDelegateToFeedParser() throws Exception {
        hystrixFeedParser.parse(URL_COMMAND_KEY);

        verify(feedParser).parse(URL_COMMAND_KEY, null);
    }

    @Test
    public void shouldReturnFallbackResult() throws Exception {
        given(feedParser.parse(URL_COMMAND_KEY, null)).willThrow(new RuntimeException("expected"));

        FetchResult fetchResult = hystrixFeedParser.parse(URL_COMMAND_KEY);

        assertThat(fetchResult.getUrl(), is(URL_COMMAND_KEY));
        assertThat(fetchResult.getLastModified(), nullValue());
        assertThat(fetchResult.getEntries(), hasSize(0));
    }

    @Test
    public void shouldTripCircuitBreaker() throws Exception {
        given(feedParser.parse(URL_COMMAND_KEY, null)).willThrow(new RuntimeException("expected"));

        HystrixCircuitBreaker circuitBreaker = getCircuitBreaker();

        hystrixFeedParser.parse(URL_COMMAND_KEY);

        waitUntilCircuitBreakerOpens();
        assertThat(circuitBreaker.isOpen(), is(true));
        assertThat(circuitBreaker.allowRequest(), is(false));
    }

    private void resetHystrix() {
        Hystrix.reset();
    }

    private void warmUpCircuitBreaker() {
        hystrixFeedParser.parse(URL_COMMAND_KEY);
        // reset mock state after warm up
        reset(feedParser);
    }

    private void waitUntilCircuitBreakerOpens() throws InterruptedException {
        /*
           one second is almost sufficient
           borrowed from https://github.com/Netflix/Hystrix/blob/v1.5.5/hystrix-core/src/test/java/com/netflix/hystrix/HystrixCircuitBreakerTest.java#L140
         */
        Thread.sleep(1000);
    }

    public static HystrixCircuitBreaker getCircuitBreaker() {
        return HystrixCircuitBreaker.Factory.getInstance(getCommandKey());
    }

    private static HystrixCommandKey getCommandKey() {
        return HystrixCommandKey.Factory.asKey(URL_COMMAND_KEY);
    }

    private void openCircuitBreakerAfterOneFailingRequest() {
        ConfigurationManager.getConfigInstance().setProperty("hystrix.command." + URL_COMMAND_KEY + ".circuitBreaker.requestVolumeThreshold", 1);
    }

}