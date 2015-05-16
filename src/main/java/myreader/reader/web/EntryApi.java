package myreader.reader.web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

import myreader.API;
import myreader.entity.FeedIcon;
import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.reader.web.UserEntryQuery.IconDto;
import myreader.repository.SubscriptionRepository;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.service.subscription.SubscriptionService;
import myreader.service.subscriptionentry.SubscriptionEntrySearchQuery;
import myreader.service.subscriptionentry.SubscriptionEntryService;
import spring.data.domain.SequenceRequest;
import spring.data.domain.Sequenceable;
import spring.security.MyReaderUser;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Deprecated
@Transactional
@Controller
@RequestMapping(API.V1 + "subscription/entry")
public class EntryApi {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SubscriptionEntryService subscriptionEntryService;
    @Autowired
    private SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public List<UserEntryQuery> feed(@RequestParam(value = "feed.tag", required = false) String feedTag,
            @RequestParam(value = "tag", required = false) String tag, boolean headingsOnly,
            SubscriptionEntrySearchQuery query, @RequestParam(required = false) String fl, Authentication authentication) {
        MyReaderUser user = (MyReaderUser) authentication.getPrincipal();

        String feedUuidEqual = "*";
        String feedTagEqual = "*";
        String seenEqual = "*";
        String q = query.getQ() == null ? "*" : query.getQ();

        if(feedTag != null) {
            final List<Subscription> s = subscriptionRepository.findByTitleAndUsername(feedTag, user.getUsername());
            if(!s.isEmpty()) {
                feedUuidEqual = s.get(0).getId().toString();
            } else {
                feedTagEqual = feedTag;
            }
        }

        if(!query.isShowAll()) {
            seenEqual = "false";
        }

        Sequenceable sequenceable;
        if(query.getLastId() != null) {
            sequenceable = new SequenceRequest(10, query.getLastId());
        } else {
            sequenceable = new SequenceRequest(10, Long.MAX_VALUE);
        }

        Slice<SearchableSubscriptionEntry> pagedEntries = subscriptionEntrySearchRepository.findBy(q, user.getId(), feedUuidEqual, feedTagEqual,  seenEqual, sequenceable.getNext(), sequenceable.toPageable());
        List<UserEntryQuery> dtoList = new ArrayList<>();

        for (SearchableSubscriptionEntry e : pagedEntries.getContent()) {
            UserEntryQuery dto = new UserEntryQuery();

            if (!headingsOnly) {
                dto.setContent(e.getContent());
            }

            dto.setCreatedAt(e.getCreatedAt());
            dto.setFeedTitle(e.getSubscriptionTitle());
            dto.setId(e.getId());
            dto.setTag(e.getTag());
            dto.setTitle(e.getTitle());
            dto.setUnseen(!e.isSeen());
            dto.setUrl(e.getUrl());

            if ("icon".equals(fl)) {
                final Subscription one = subscriptionRepository.findOne(e.getSubscriptionId());

                if(one != null) {
                    FeedIcon icon = one.getFeed().getIcon();

                    if (icon != null) {
                        IconDto iconDto = new UserEntryQuery.IconDto(icon.getMimeType(), icon.getIcon());
                        dto.setIcon(iconDto);
                    }
                }
            }

            dtoList.add(dto);
        }

        return dtoList;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    @ResponseBody
    public UserEntryQuery feed(@PathVariable Long id, boolean headingsOnly) {
        SubscriptionEntry subscriptionEntry = subscriptionEntryService.findById(id);
        UserEntryQuery dto = new UserEntryQuery();

        dto.setCreatedAt(subscriptionEntry.getCreatedAt());
        dto.setFeedTitle(subscriptionEntry.getSubscription().getTitle());
        dto.setId(subscriptionEntry.getId());
        dto.setTag(subscriptionEntry.getTag());
        dto.setTitle(subscriptionEntry.getFeedEntry().getTitle());
        dto.setUnseen(!subscriptionEntry.isSeen());
        dto.setUrl(subscriptionEntry.getFeedEntry().getUrl());

        if (headingsOnly) {
            dto.setContent(null);
        } else {
            dto.setContent(subscriptionEntry.getFeedEntry().getContent());
        }

        return dto;
    }

    @RequestMapping(value = "", method = RequestMethod.GET, params = "distinct")
    @ResponseBody
    public Collection<String> distinct(@RequestParam String distinct) {
        // TODO
        if ("tag".equals(distinct)) {
            return subscriptionEntryService.findDistinctTags();
        } else if ("feed.tag".equals(distinct)) {
            List<Subscription> findAll = subscriptionService.findAll();
            SortedSet<String> set = new TreeSet<String>();

            for (Subscription s : findAll) {
                if (s.getTag() != null && !s.getTag().isEmpty()) {
                    set.add(s.getTag());
                }
            }

            return set;
        } else {
            return Collections.emptyList();
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @RequestMapping(value = "{id}", method = RequestMethod.POST)
    public void editPostXhr(@RequestBody Map<String, String> map, @PathVariable Long id) {
        SubscriptionEntry subscriptionEntry = subscriptionEntryService.findById(id);

        if (map.containsKey("unseen")) {
            boolean unseen = Boolean.valueOf(map.get("unseen"));

            subscriptionEntry.setSeen(!unseen);
        }

        if (map.containsKey("tag")) {
            String tag = map.get("tag");

            if ("".equals(tag) || tag == null) {
                subscriptionEntry.setTag(null);
            } else {
                subscriptionEntry.setTag(tag);
            }
        }

        subscriptionEntryService.save(subscriptionEntry);
    }

    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    @RequestMapping(value = "", method = RequestMethod.PUT)
    @ResponseBody
    public void batchUpdateEntry(@RequestBody Map<String, Object>[] map) {
        for (Map<String, Object> m : map) {
            if (m.containsKey("id")) {
                Long id = Long.valueOf(m.get("id").toString());
                SubscriptionEntry userEntry = subscriptionEntryService.findById(id);

                if (userEntry != null) {
                    if (m.containsKey("unseen")) {
                        userEntry.setSeen(!Boolean.valueOf(m.get("unseen").toString()));
                    }

                    if (m.containsKey("tag")) {
                        Object tag = m.get("tag");

                        if (tag == null) {
                            userEntry.setTag(null);
                        } else {
                            userEntry.setTag(tag.toString());
                        }
                    }

                    subscriptionEntryService.save(userEntry);
                }
            }
        }
    }
}
