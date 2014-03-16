package myreader.service;

import org.springframework.context.ApplicationEvent;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class IndexSyncEvent extends ApplicationEvent {

    private static final long serialVersionUID = 1L;

    public IndexSyncEvent() {
        super(new Object());
    }
}