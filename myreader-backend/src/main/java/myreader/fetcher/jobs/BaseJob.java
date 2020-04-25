package myreader.fetcher.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.util.StopWatch;

/**
 * @author Kamill Sokol
 */
@SuppressWarnings("PMD.LoggerIsNotStaticFinal")
public abstract class BaseJob implements Runnable, ApplicationListener<ContextClosedEvent> {

    private final Logger log;
    private volatile boolean alive = true;

    protected BaseJob(final String jobName) {
        log = LoggerFactory.getLogger(jobName);
    }

    public Logger getLog() {
        return log;
    }

    public boolean isAlive() {
        return alive;
    }

    public abstract void work() throws InterruptedException;

    @Override
    public final void run() {
        log.debug("start");

        StopWatch timer = new StopWatch();

        try {
            timer.start();
            work();
        } catch(Exception exception) {
            log.warn(exception.getMessage(), exception);
        } finally {
            timer.stop();
            log.info("total time {} sec", timer.getTotalTimeSeconds());
            log.debug("stop");
        }
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
    }
}
