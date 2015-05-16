package myreader.service.subscriptionentry.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntrySearchService;
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
    private final SubscriptionEntrySearchService searchService;

    @Autowired
    public SubscriptionEntryServiceImpl(UserService userService, SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchService searchService) {
        this.userService = userService;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.searchService = searchService;
    }

    @Override
    public SubscriptionEntry findById(Long id) {
        User currentUser = userService.getCurrentUser();
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, currentUser.getEmail());
        return entry;
    }

    @Override
    public List<String> findDistinctTags() {
        User currentUser = userService.getCurrentUser();
        List<String> tags = subscriptionEntryRepository.findDistinctTagsByUsername(currentUser.getEmail());
        return tags;
    }

    @Override
    public void save(SubscriptionEntry subscriptionEntry) {
        subscriptionEntryRepository.save(subscriptionEntry);
        searchService.save(subscriptionEntry);
    }
}
