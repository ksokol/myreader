package myreader.service.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.user.UserService;
import myreader.solr.IndexService;
import myreader.solr.SubscriptionEntrySearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Service
public class SubscriptionEntryServiceImpl implements SubscriptionEntryService {

    private final UserService userService;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final IndexService indexService;
    private final SubscriptionEntrySearchService searchService;

    @Autowired
    public SubscriptionEntryServiceImpl(UserService userService, SubscriptionEntryRepository subscriptionEntryRepository, IndexService indexService, SubscriptionEntrySearchService searchService) {
        this.userService = userService;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.indexService = indexService;
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
    public List<SubscriptionEntry> search(SubscriptionEntrySearchQuery search) {
        if (search.getLastId() != null) {
            SubscriptionEntry findById = findById(search.getLastId());
            search.setOffset(findById.getCreatedAt());
        }
        User currentUser = userService.getCurrentUser();
        return searchService.findByQueryAndUser(search, currentUser.getEmail());
    }

    @Override
    public void save(SubscriptionEntry subscriptionEntry) {
        subscriptionEntryRepository.save(subscriptionEntry);
        indexService.save(subscriptionEntry);
    }
}
