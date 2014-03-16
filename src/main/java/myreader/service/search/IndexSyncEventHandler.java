package myreader.service.search;

import myreader.service.IndexSyncEvent;
import myreader.service.search.jobs.IndexSyncJob;
import org.springframework.context.ApplicationListener;

/**
 * @author Kamill Sokol dev@sokol-web.de
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
