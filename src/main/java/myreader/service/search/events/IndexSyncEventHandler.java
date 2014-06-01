package myreader.service.search.events;

import myreader.service.IndexSyncEvent;
import myreader.service.search.jobs.IndexSyncJob;
import org.springframework.context.ApplicationListener;

/**
 * @author Kamill Sokol
 */
public class IndexSyncEventHandler implements ApplicationListener<IndexSyncEvent> {

    private final IndexSyncJob indexSyncJob;

    public IndexSyncEventHandler(IndexSyncJob indexSyncJob) {
        this.indexSyncJob = indexSyncJob;
    }

    @Override
    public void onApplicationEvent(IndexSyncEvent event) {
        indexSyncJob.run();
    }
}
