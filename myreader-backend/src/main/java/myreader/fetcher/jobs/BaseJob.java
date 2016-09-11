package myreader.fetcher.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.util.Assert;
import org.springframework.util.StopWatch;

/**
 * @author Kamill Sokol
 */
public abstract class BaseJob implements Runnable, ApplicationListener<ContextClosedEvent> {

    private final String jobName;
    private String swap;

    protected final Logger log;
    protected volatile boolean alive = true;

    protected BaseJob(final String jobName) {
        Assert.notNull(jobName, "jobName is null");
        this.jobName = jobName;
        log = LoggerFactory.getLogger(jobName);
    }

    public abstract void work();

    @Override
    public final void run() {
        log.debug("start");

        toggleCurrentThreadName();
        StopWatch timer = new StopWatch();

        try {
            timer.start();
            work();
        } catch(Exception exception) {
            log.warn(exception.getMessage(), exception);
        } finally {
            timer.stop();
            log.info("total time {} sec", timer.getTotalTimeSeconds());
            toggleCurrentThreadName();
            log.debug("stop");
        }
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
    }

    public String getJobName() {
        return jobName;
    }

    private void toggleCurrentThreadName() {
        Thread thread = Thread.currentThread();
        if(swap == null) {
            swap = Thread.currentThread().getName();
            thread.setName(jobName);
        } else {
            thread.setName(swap);
            swap = null;
        }
    }

}
