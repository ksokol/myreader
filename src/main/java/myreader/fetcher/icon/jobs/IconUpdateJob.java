package myreader.fetcher.icon.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class IconUpdateJob implements Runnable {

    @Autowired
    private myreader.fetcher.icon.impl.IconUpdater iconUpdater;

    @Override
    public void run() {
        iconUpdater.start();
    }

}
