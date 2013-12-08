package myreader.reader.web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

import myreader.API;
import myreader.dao.SubscriptionDao;
import myreader.dao.SubscriptionEntryDao;
import myreader.dao.UserDao;
import myreader.entity.FeedIcon;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionEntryQuery;
import myreader.entity.User;
import myreader.reader.persistence.UserEntryQuery;
import myreader.reader.persistence.UserEntryQuery.IconDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Transactional
@Controller
@RequestMapping(API.V1 + "subscription/entry")
public class EntryApi {

    @Autowired
    SubscriptionDao subscriptionDao;

    @Autowired
    SubscriptionEntryDao subscriptionEntryDao;

    // TODO
    @Autowired
    UserDao userDao;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringURLDecoderEditor());
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public List<UserEntryQuery> feed(@RequestParam(value = "feed.tag", required = false) String feedTag,
            @RequestParam(value = "tag", required = false) String tag, boolean headingsOnly,
            SubscriptionEntryQuery query, @RequestParam(required = false) String fl, Authentication auth) {

        // TODO
        if (feedTag != null) {
            query.addFilter("subscription.tag", feedTag);
            query.addFilter("subscription.title", feedTag);
        }
        // TODO
        if (tag != null) {
            query.addFilter("tag", tag);
        }

        // TODO
        User user = userDao.findByEmail(auth.getName());
        List<SubscriptionEntry> query2 = subscriptionEntryDao.query(query, user.getId());

        List<UserEntryQuery> dtoList = new ArrayList<UserEntryQuery>();

        for (SubscriptionEntry e : query2) {
            UserEntryQuery dto = new UserEntryQuery();

            if (!headingsOnly) {
                dto.setContent(e.getFeedEntry().getContent());
            }

            dto.setCreatedAt(e.getCreatedAt());
            dto.setFeedTitle(e.getSubscription().getTitle());
            dto.setId(e.getId());
            dto.setTag(e.getTag());
            dto.setTitle(e.getFeedEntry().getTitle());
            dto.setUnseen(!e.isSeen());
            dto.setUrl(e.getFeedEntry().getUrl());

            if ("icon".equals(fl)) {
                FeedIcon icon = e.getSubscription().getFeed().getIcon();

                if (icon != null) {
                    IconDto iconDto = new UserEntryQuery.IconDto(icon.getMimeType(), icon.getIcon());
                    dto.setIcon(iconDto);
                }
            }

            dtoList.add(dto);
        }

        return dtoList;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    @ResponseBody
    public UserEntryQuery feed(@PathVariable Long id, boolean headingsOnly, Authentication user) {
        SubscriptionEntry subscriptionEntry = subscriptionEntryDao.findById(id, user.getName());
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
    public Collection<String> distinct(@RequestParam String distinct, Authentication authentication) {
        // TODO
        if ("tag".equals(distinct)) {
            return subscriptionEntryDao.findByDistinctTag(authentication.getName());
        } else if ("feed.tag".equals(distinct)) {
            List<Subscription> findAll = subscriptionDao.findAll(authentication.getName());
            SortedSet<String> set = new TreeSet<String>();

            for (Subscription s : findAll) {
                if (s.getTag() != null)
                    set.add(s.getTag());
            }

            return set;
        } else {
            return Collections.emptyList();
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @RequestMapping(value = "{id}", method = RequestMethod.POST)
    public void editPostXhr(@RequestBody Map<String, String> map, @PathVariable Long id, Authentication authentication) {
        SubscriptionEntry subscriptionEntry = subscriptionEntryDao.findById(id, authentication.getName());

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

        subscriptionEntryDao.saveOrUpdate(subscriptionEntry);
    }

    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    @RequestMapping(value = "", method = RequestMethod.PUT)
    @ResponseBody
    public void batchUpdateEntry(@RequestBody Map<String, Object>[] map, Authentication authentication) {
        for (Map<String, Object> m : map) {
            if (m.containsKey("id")) {
                Long id = Long.valueOf(m.get("id").toString());
                SubscriptionEntry userEntry = subscriptionEntryDao.findById(id, authentication.getName());

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

                    subscriptionEntryDao.saveOrUpdate(userEntry);
                }
            }
        }
    }
}
