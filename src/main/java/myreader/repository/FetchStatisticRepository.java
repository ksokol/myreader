package myreader.repository;

import myreader.entity.FetchStatistics;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional(propagation = Propagation.REQUIRES_NEW)
public interface FetchStatisticRepository extends CrudRepository<FetchStatistics, Long> {
}
