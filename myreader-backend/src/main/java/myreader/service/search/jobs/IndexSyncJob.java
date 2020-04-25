package myreader.service.search.jobs;

import myreader.fetcher.jobs.BaseJob;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;

import static java.util.Objects.requireNonNull;

/**
 *
 * @author Kamill Sokol
 */
@Component
public class IndexSyncJob extends BaseJob {

    private final EntityManager entityManager;

    public IndexSyncJob(EntityManager entityManager) {
        super("indexSyncJob");
        this.entityManager = requireNonNull(entityManager, "entityManager is null");
    }

    @Override
    public void work() throws InterruptedException {
        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);
        fullTextEntityManager.createIndexer().startAndWait();
    }
}
