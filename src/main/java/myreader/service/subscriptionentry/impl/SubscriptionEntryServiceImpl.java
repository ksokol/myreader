package myreader.service.subscriptionentry.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.subscriptionentry.SubscriptionEntryService;
import myreader.service.user.UserService;

/**
 * @author Kamill Sokol
 */
@Transactional
@Service
public class SubscriptionEntryServiceImpl implements SubscriptionEntryService {

    private final UserService userService;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    public SubscriptionEntryServiceImpl(UserService userService, SubscriptionEntryRepository subscriptionEntryRepository) {
        this.userService = userService;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @Override
    public SubscriptionEntry findById(Long id) {
        User currentUser = userService.getCurrentUser();
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, currentUser.getEmail());
        return entry;
    }

    @Override
    public void save(SubscriptionEntry subscriptionEntry) {
        subscriptionEntryRepository.save(subscriptionEntry);
    }
}
