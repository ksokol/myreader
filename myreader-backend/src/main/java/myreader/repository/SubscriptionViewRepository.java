package myreader.repository;

import myreader.entity.SubscriptionView;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface SubscriptionViewRepository extends Repository<SubscriptionView, Long> {

  List<SubscriptionView> findAllByOrderByCreatedAtDesc();
}
