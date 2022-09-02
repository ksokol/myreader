package myreader.fetcher.jobs;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.util.StopWatch;

import java.lang.System.Logger;

import static java.lang.System.Logger.Level.DEBUG;
import static java.lang.System.Logger.Level.INFO;
import static java.lang.System.Logger.Level.WARNING;

public abstract class BaseJob implements Runnable, ApplicationListener<ContextClosedEvent> {

  protected final Logger logger;
  private volatile boolean alive = true;

  protected BaseJob(final String jobName) {
    logger = System.getLogger(jobName);
  }

  @Deprecated
  public Logger getLogger() {
    return logger;
  }

  public boolean isAlive() {
    return alive;
  }

  public abstract void work() throws InterruptedException;

  @Override
  public final void run() {
    logger.log(DEBUG, "start");

    var timer = new StopWatch();

    try {
      timer.start();
      work();
    } catch (Exception exception) {
      logger.log(WARNING, exception.getMessage(), exception);
    } finally {
      timer.stop();
      logger.log(INFO, "total time {0} sec", timer.getTotalTimeSeconds());
      logger.log(DEBUG, "stop");
    }
  }

  @Override
  public void onApplicationEvent(ContextClosedEvent event) {
    logger.log(INFO, "got stop signal");
    alive = false;
  }
}
