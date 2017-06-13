package myreader.fetcher;

import junit.framework.Assert;
import junit.framework.AssertionFailedError;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;

import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static junit.framework.Assert.assertTrue;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

/**
 * @author Kamill Sokol
 */
public class FeedQueueTests {

    private static final long SHORT_DELAY_MS  = 50;
    private static final long LONG_DELAY_MS = SHORT_DELAY_MS * 200;

    private FeedQueue uut;

    /**
     * The first exception encountered if any threadAssertXXX method fails.
     */
    private final AtomicReference<Throwable> threadFailure = new AtomicReference<>(null);

    @Before
    public void setUp() {
        uut = new FeedQueue();
    }

    @Test
    public void add() {
        uut.add(new FetchResult("url"));
        assertThat(uut.getSize(), is(1));
    }

    @Test
    public void addDuplicate() {
        uut.add(new FetchResult("url"));
        uut.add(new FetchResult("url"));
        assertThat(uut.getSize(), is(1));
    }

    @Test
    public void take() {
        uut.add(new FetchResult("url"));
        assertThat(uut.take(), is(new FetchResult("url")));

        final CountDownLatch threadStarted = new CountDownLatch(1);
        Thread t = newStartedThread(new CheckedRunnable() {
            public void realRun() {
                threadStarted.countDown();
                uut.take();
            }});
        await(threadStarted);
        assertThreadStaysAlive(t);
        t.interrupt();
        awaitTermination(t);
    }

    /**
     * Returns a new started daemon Thread running the given runnable.
     */
    private Thread newStartedThread(Runnable runnable) {
        Thread t = new Thread(runnable);
        t.setDaemon(true);
        t.start();
        return t;
    }

    private abstract class CheckedRunnable implements Runnable {
        protected abstract void realRun() throws Throwable;

        public final void run() {
            try {
                realRun();
            } catch (Throwable t) {
                threadUnexpectedException(t);
            }
        }
    }

    /**
     * Waits for the specified time (in milliseconds) for the thread
     * to terminate (using {@link Thread#join(long)}), else interrupts
     * the thread (in the hope that it may terminate later) and fails.
     */
    private void awaitTermination(Thread t, long timeoutMillis) {
        try {
            t.join(timeoutMillis);
        } catch (InterruptedException ie) {
            threadUnexpectedException(ie);
        } finally {
            if (t.isAlive()) {
                t.interrupt();
                fail("Test timed out");
            }
        }
    }

    /**
     * Waits for LONG_DELAY_MS milliseconds for the thread to
     * terminate (using {@link Thread#join(long)}), else interrupts
     * the thread (in the hope that it may terminate later) and fails.
     */
    private void awaitTermination(Thread t) {
        awaitTermination(t, LONG_DELAY_MS);
    }

    /**
     * Records the given exception using {@link #threadRecordFailure},
     * then rethrows the exception, wrapping it in an
     * AssertionFailedError if necessary.
     */
    private void threadUnexpectedException(Throwable t) {
        threadRecordFailure(t);
        t.printStackTrace();
        if (t instanceof RuntimeException)
            throw (RuntimeException) t;
        else if (t instanceof Error)
            throw (Error) t;
        else {
            AssertionFailedError afe =
                    new AssertionFailedError("unexpected exception: " + t);
            t.initCause(t);
            throw afe;
        }
    }

    /**
     * Records an exception so that it can be rethrown later in the test
     * harness thread, triggering a test case failure.  Only the first
     * failure is recorded; subsequent calls to this method from within
     * the same test have no effect.
     */
    private void threadRecordFailure(Throwable t) {
        threadFailure.compareAndSet(null, t);
    }

    /**
     * Returns a timeout in milliseconds to be used in tests that
     * verify that operations block or time out.
     */
    private long timeoutMillis() {
        return SHORT_DELAY_MS / 4;
    }

    /**
     * Checks that thread does not terminate within the default
     * millisecond delay of {@code timeoutMillis()}.
     */
    private  void assertThreadStaysAlive(Thread thread) {
        assertThreadStaysAlive(thread, timeoutMillis());
    }

    /**
     * Checks that thread does not terminate within the given millisecond delay.
     */
    private void assertThreadStaysAlive(Thread thread, long millis) {
        try {
            // No need to optimize the Assert.failing case via Thread.join.
            delay(millis);
            assertTrue(thread.isAlive());
        } catch (InterruptedException ie) {
            Assert.fail("Unexpected InterruptedException");
        }
    }

    private void await(CountDownLatch latch) {
        try {
            assertTrue(latch.await(LONG_DELAY_MS, MILLISECONDS));
        } catch (Throwable t) {
            threadUnexpectedException(t);
        }
    }

    /**
     * Delays, via Thread.sleep, for the given millisecond delay, but
     * if the sleep is shorter than specified, may re-sleep or yield
     * until time elapses.
     */
    private static void delay(long millis) throws InterruptedException {
        long startTime = System.nanoTime();
        long ns = millis * 1000 * 1000;
        for (; ; ) {
            if (millis > 0L)
                Thread.sleep(millis);
            else // too short to sleep
                Thread.yield();
            long d = ns - (System.nanoTime() - startTime);
            if (d > 0L)
                millis = d / (1000 * 1000);
            else
                break;
        }
    }
}
