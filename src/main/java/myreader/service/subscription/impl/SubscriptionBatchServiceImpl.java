package myreader.service.subscription.impl;

import java.util.List;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.subscription.SubscriptionBatchService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@Transactional
@Service
public class SubscriptionBatchServiceImpl implements SubscriptionBatchService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionBatchServiceImpl.class);

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    public SubscriptionBatchServiceImpl(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void calculateUnseenAggregate() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        logger.info("start adjusting unseen aggregates. size {}", subscriptions.size());

        for (Subscription subscription : subscriptions) {
            int count = subscriptionEntryRepository.countBySeen(subscription, false);

            if(subscription.getUnseen() != count) {
                logger.info("adjusting unseen aggregate for {} [{}->{}]", new Object[] {subscription.getId(), subscription.getUnseen(), count});
                subscriptionRepository.updateUnseen(count, subscription.getId());
            }
        }

        logger.info("end adjusting unseen aggregates. size {}", subscriptions.size());
    }
}
