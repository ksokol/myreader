package myreader.fetcher.icon.impl.converter;

import myreader.fetcher.icon.IconUpdateRequestEvent;
import myreader.fetcher.icon.impl.IconUpdater;
import myreader.fetcher.icon.jobs.IconUpdateJob;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Component
public class IconUpdateEventHandler implements ApplicationListener<IconUpdateRequestEvent> {

    @Autowired
    private IconUpdater iconUpdater;

    //TODO refactore me
    @Autowired
    private IconUpdateJob iconUpdateJob;

    @Override
    public void onApplicationEvent(IconUpdateRequestEvent event) {
        if (event.getUrl() == null) {
            iconUpdateJob.run();
        } else {
            iconUpdater.updateIcon(event.getUrl());
        }
    }
}
