package myreader.service.search.events;

import org.springframework.context.ApplicationEvent;

/**
 * @author Kamill Sokol
 */
public class IndexSyncEvent extends ApplicationEvent {

    private static final long serialVersionUID = 2L;

    public IndexSyncEvent() {
        super(new Object());
    }
}
