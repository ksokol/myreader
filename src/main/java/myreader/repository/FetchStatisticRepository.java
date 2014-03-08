package myreader.repository;

import myreader.entity.FetchStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional(propagation = Propagation.REQUIRES_NEW)
public interface FetchStatisticRepository extends JpaRepository<FetchStatistics, Long> {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    FetchStatistics save(FetchStatistics fetchStatistics);
}
