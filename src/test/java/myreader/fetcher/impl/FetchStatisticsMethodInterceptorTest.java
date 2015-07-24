package myreader.fetcher.impl;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import myreader.entity.FetchStatistics;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FetchStatisticRepository;
import myreader.service.time.TimeService;
import org.aopalliance.intercept.MethodInvocation;
import org.joda.time.LocalDateTime;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class FetchStatisticsMethodInterceptorTest {

    private FetchStatisticsMethodInterceptor uut;
    private FetchStatisticRepository fetchStatisticRepository;
    private TimeService timeService;
    private static String originalTreadName;
    private static String junitThreadName = "junit-FetchStatisticsMethodInterceptorTest";

    @BeforeClass
    public static void beforeClass() {
        originalTreadName = Thread.currentThread().getName();
        Thread.currentThread().setName(junitThreadName);
    }

    @AfterClass
    public static void afterClass() {
        Thread.currentThread().setName(originalTreadName);
    }

    @Before
    public void setUp() throws Exception {
        fetchStatisticRepository = mock(FetchStatisticRepository.class);
        timeService = mock(TimeService.class);

        uut = new FetchStatisticsMethodInterceptor(fetchStatisticRepository, timeService);
    }

    @Test
    public void testInvoke() throws Throwable {
        final MethodInvocation methodInvocation = mock(MethodInvocation.class);

        final Date started = new LocalDateTime("2015-01-01T00:00:00").toDate();
        final Date stopped = new LocalDateTime("2015-01-01T01:00:00").toDate();
        final FetchResult fetchResult = new FetchResult("url");

        ArgumentCaptor<FetchStatistics> argumentCaptor = ArgumentCaptor.forClass(FetchStatistics.class);
        when(fetchStatisticRepository.save(argumentCaptor.capture())).thenReturn(null);

        when(methodInvocation.getArguments()).thenReturn(new Object[] {fetchResult});
        when(methodInvocation.proceed()).thenReturn(1L);
        when(timeService.getCurrentTime()).thenReturn(started, stopped);

        uut.invoke(methodInvocation);

        final FetchStatistics expected = argumentCaptor.getValue();
        assertThat(expected.getFetchCount(), is(1L));
        assertThat(expected.getUrl(), is("url"));
        assertThat(expected.getStartedAt(), is(started));
        assertThat(expected.getStoppedAt(), is(stopped));
        assertThat(expected.getIssuer(), is(junitThreadName));
        assertThat(expected.getMessage(), nullValue());
        assertThat(expected.getResult(), is(FetchStatistics.Result.SUCCESS));
        assertThat(expected.getType(), is(FetchStatistics.Type.ENTRY_LIST));
    }

    @Test
    public void testInvoke2() throws Throwable {
        final MethodInvocation methodInvocation = mock(MethodInvocation.class);

        final Date started = new LocalDateTime("2015-01-01T00:00:00").toDate();
        final Date stopped = new LocalDateTime("2015-01-01T01:00:00").toDate();
        final FetchResult fetchResult = new FetchResult("url");

        ArgumentCaptor<FetchStatistics> argumentCaptor = ArgumentCaptor.forClass(FetchStatistics.class);
        when(fetchStatisticRepository.save(argumentCaptor.capture())).thenReturn(null);

        when(methodInvocation.getArguments()).thenReturn(new Object[]{fetchResult});
        when(methodInvocation.proceed()).thenThrow(new TestException("junit"));
        when(timeService.getCurrentTime()).thenReturn(started, stopped);

        try {
            uut.invoke(methodInvocation);
            fail("jjj");
        } catch (TestException e) {
            final FetchStatistics expected = argumentCaptor.getValue();
            assertThat(e.getMessage(), is("junit"));
            assertThat(expected.getFetchCount(), is(0L));
            assertThat(expected.getUrl(), is("url"));
            assertThat(expected.getStartedAt(), is(started));
            assertThat(expected.getStoppedAt(), is(stopped));
            assertThat(expected.getIssuer(), is(junitThreadName));
            assertThat(expected.getMessage(), is("junit"));
            assertThat(expected.getResult(), is(FetchStatistics.Result.ERROR));
            assertThat(expected.getType(), is(FetchStatistics.Type.ENTRY_LIST));
        }
    }

    static class TestException extends RuntimeException {
        public TestException(String message) {
            super(message);
        }
    }
}
