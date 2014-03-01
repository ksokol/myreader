package myreader.subscription.web;

import java.net.URL;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import myreader.API;
import myreader.dao.SubscriptionDao;
import myreader.dto.ExclusionPatternDto;
import myreader.dto.SubscriptionDto;
import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.fetcher.icon.IconUpdateRequestEvent;

import myreader.repository.FeedRepository;
import myreader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.hibernate4.HibernateObjectRetrievalFailureException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;

@Transactional
@Controller
@RequestMapping(API.V1 + "subscription")
class SubscriptionApi {

    static String pattern = "^https?://.*";
    static Pattern patternUrl = Pattern.compile(pattern);

    @Autowired
    SubscriptionDao subscriptionDao;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    ApplicationEventPublisher publisher;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public List<SubscriptionDto> test(boolean showAll, Authentication user) {
        List<Subscription> l = subscriptionDao.findAll(user.getName());
        List<SubscriptionDto> ld = new ArrayList<SubscriptionDto>();

        for (Subscription s : l) {
            if (showAll || s.getUnseen() > 0) {
                SubscriptionDto dto = new SubscriptionDto();

                dto.setCreatedAt(s.getCreatedAt());
                dto.setId(s.getId());
                dto.setSum(s.getSum());
                dto.setTag(s.getTag());
                dto.setTitle(s.getTitle());
                dto.setUnseen(s.getUnseen());
                dto.setUrl(s.getUrl());
                dto.setExclusions(Collections.EMPTY_LIST);

                ld.add(dto);
            }
        }

        return ld;
    }

    @RequestMapping(value = "", method = RequestMethod.GET, params = "distinct")
    @ResponseBody
    public Collection<String> distinct(@RequestParam String distinct, Authentication user) {
        List<Subscription> subscriptionList = subscriptionDao.findAll(user.getName());
        Set<String> distinction = new TreeSet<String>();

        for (Subscription s : subscriptionList) {
            // TODO
            if ("tag".equals(distinct)) {
                if (s.getTag() != null) distinction.add(s.getTag());
            } else {
                break;
            }
        }

        return distinction;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    @ResponseBody
    public SubscriptionDto findById(@PathVariable Long id, Authentication user) {
        Subscription s = subscriptionDao.findById(id, user.getName());

        SubscriptionDto dto = new SubscriptionDto();
        dto.setCreatedAt(s.getCreatedAt());
        dto.setId(s.getId());
        dto.setSum(s.getSum());
        dto.setTag(s.getTag());
        dto.setTitle(s.getTitle());
        dto.setUrl(s.getUrl());
        dto.setUnseen(s.getUnseen());

        List<ExclusionPatternDto> expDtos = new ArrayList<ExclusionPatternDto>();

        for (ExclusionPattern ep : s.getExclusions()) {
            ExclusionPatternDto expDto = new ExclusionPatternDto();
            expDto.setPattern(ep.getPattern());
            expDto.setHitCount(ep.getHitCount());
            expDtos.add(expDto);
        }

        dto.setExclusions(expDtos);

        return dto;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(@PathVariable Long id, Authentication user) {
        subscriptionDao.deleteById(id, user.getName());
    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = { "{id}" }, method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public void editPost(@PathVariable Long id, @RequestBody Map<String, Object> map, Authentication authentication) {
        Subscription subscription = subscriptionDao.findById(id, authentication.getName()); // read(Long.valueOf(id));

        if (map.containsKey("tag")) {
            String valueOf = String.valueOf(map.get("tag"));

            if (!"".equals(valueOf)) {
                subscription.setTag(valueOf);
            } else {
                subscription.setTag(null);
            }
        }

        if (map.containsKey("title")) {
            if (map.get("title") == null || "".equals(map.get("title"))) throw new ValidationException("title", "empty");
            subscription.setTitle(String.valueOf(map.get("title")));
        }

        if (map.containsKey("exclusions")) {
            Set<ExclusionPattern> patterns = subscription.getExclusions();
            Set<ExclusionPattern> newSet = new TreeSet<ExclusionPattern>();

            List exclusions = (List) map.get("exclusions");

            for (Object o : exclusions) {
                Map<String, String> exclusionMap = (Map<String, String>) o;

                for (ExclusionPattern ep : patterns) {
                    if (ep.getPattern().equals(exclusionMap.get("pattern"))) {
                        newSet.add(ep);
                        continue;
                    }
                }

                try {
                    Pattern.compile(exclusionMap.get("pattern"));
                } catch (Exception e) {
                    throw new ValidationException("exclusion", "invalid.pattern " + exclusionMap.get("pattern"));
                }

                newSet.add(new ExclusionPattern(exclusionMap.get("pattern")));
            }

            subscription.setExclusions(newSet);
        }

        subscriptionDao.saveOrUpdate(subscription);
    }

    @RequestMapping(value = "", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public void post(@RequestBody Map<String, Object> map, Authentication authentication) throws Exception {
        // TODO: alles

        if (map.containsKey("url")) {
            Matcher m = patternUrl.matcher(String.valueOf(map.get("url")));

            if (m == null || !m.matches()) {
                ValidationException ve = new ValidationException("url", "pattern");
                ve.addMessage("expected", pattern);
                throw ve;
            }
        } else {
            throw new ValidationException("url", "empty");
        }

        Feed feed = null;

        try {
            feed = feedRepository.findByUrl(String.valueOf(map.get("url")));
        } catch (HibernateObjectRetrievalFailureException e) {
            String feedTitle = null;

            try {
                feedTitle = new SyndFeedInput().build(new XmlReader(new URL(String.valueOf(map.get("url"))))).getTitle();
            } catch (Exception e1) {
                throw new ValidationException("url", "no feed under url " + map.get("url") + " found");
            }

            feedTitle = (feedTitle == null) ? "" : feedTitle.replaceAll("\\p{Space}", " ");

            feed = new Feed();

            feed.setUrl(String.valueOf(map.get("url")));
            feed.setTitle(feedTitle);

            feedRepository.save(feed);

            IconUpdateRequestEvent iconUpdateRequestEvent = new IconUpdateRequestEvent(this);
            iconUpdateRequestEvent.setUrl(feed.getUrl());
            publisher.publishEvent(iconUpdateRequestEvent);
        }

        Subscription userFeed = null;

        try {
            userFeed = subscriptionDao.findByUrl(String.valueOf(map.get("url")), authentication.getName()); // dao.findUserFeedByUrl(map.get("url"));
        } catch (HibernateObjectRetrievalFailureException e) {

            userFeed = new Subscription();

        }

        userFeed.setFeed(feed);
        userFeed.setTitle(feed.getTitle());

        if (map.containsKey("tag")) {
            if (!"".equals(map.get("tag"))) {
                userFeed.setTag(String.valueOf(map.get("tag")));
            } else {
                userFeed.setTag(null);
            }
        }

        if (map.containsKey("exclusions")) {
            Set<ExclusionPattern> newSet = new TreeSet<ExclusionPattern>();
            List exclusions = (List) map.get("exclusions");

            for (Object o : exclusions) {
                Map<String, String> exclusionMap = (Map<String, String>) o;

                try {
                    Pattern.compile(exclusionMap.get("pattern"));
                } catch (Exception e) {
                    throw new ValidationException("exclusion", "invalid.pattern " + exclusionMap.get("pattern"));
                }

                newSet.add(new ExclusionPattern(exclusionMap.get("pattern")));
            }

            userFeed.setExclusions(newSet);
        }

        User user = userRepository.findByEmail(authentication.getName());

        userFeed.setUser(user);

        subscriptionDao.saveOrUpdate(userFeed);
        // TODO: copy entries for user if feed exists already

    }
}
