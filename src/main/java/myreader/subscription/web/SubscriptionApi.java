package myreader.subscription.web;

import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import myreader.API;
import myreader.dto.ExclusionPatternDto;
import myreader.dto.SubscriptionDto;
import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.fetcher.icon.IconUpdateRequestEvent;
import myreader.repository.ExclusionRepository;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.EntityNotFoundException;
import myreader.service.search.SubscriptionSearchService;
import myreader.service.subscription.SubscriptionService;
import spring.security.MyReaderUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
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

@Deprecated
@Transactional
@Controller
@RequestMapping(API.V1 + "subscription")
public class SubscriptionApi {

    static String pattern = "^https?://.*";
    static Pattern patternUrl = Pattern.compile(pattern);

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private ExclusionRepository exclusionRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ApplicationEventPublisher publisher;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public List<SubscriptionDto> test(boolean showAll, Authentication authentication) {
        MyReaderUser user = (MyReaderUser) authentication.getPrincipal();
        int count = 0;

        if(showAll) {
            count = -1;
        }

        final List<Subscription> l = subscriptionRepository.findAllByUserAndUnseenGreaterThan(user.getId(), count);
        List<SubscriptionDto> dtos = new ArrayList<>();

        for (Subscription s : l) {
            SubscriptionDto dto = new SubscriptionDto();

            dto.setCreatedAt(s.getCreatedAt());
            dto.setId(s.getId());
            dto.setSum(s.getSum());
            dto.setTag(s.getTag());
            dto.setTitle(s.getTitle());
            dto.setUrl(s.getFeed().getUrl());
            dto.setExclusions(Collections.EMPTY_LIST);
            dto.setUnseen(s.getUnseen());

            dtos.add(dto);
        }

        return dtos;
    }

    @RequestMapping(value = "", method = RequestMethod.GET, params = "distinct")
    @ResponseBody
    public Collection<String> distinct(@RequestParam String distinct) {
        List<Subscription> subscriptionList = subscriptionService.findAll();
        Set<String> distinction = new TreeSet<String>();

        for (Subscription s : subscriptionList) {
            // TODO
            if ("tag".equals(distinct)) {
                if (s.getTag() != null && !s.getTag().isEmpty()) {
                    distinction.add(s.getTag());
                }
            } else {
                break;
            }
        }

        return distinction;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    @ResponseBody
    public SubscriptionDto findById(@PathVariable Long id, Authentication authentication) {
        Subscription s = subscriptionRepository.findByIdAndUsername(id, authentication.getName());

        if(s == null) {
            throw new EntityNotFoundException();
        }

        SubscriptionDto dto = new SubscriptionDto();
        dto.setCreatedAt(s.getCreatedAt());
        dto.setId(s.getId());
        dto.setSum(s.getSum());
        dto.setTag(s.getTag());
        dto.setTitle(s.getTitle());
        dto.setUrl(s.getFeed().getUrl());
        dto.setUnseen(s.getUnseen());

        List<ExclusionPatternDto> expDtos = new ArrayList<>();

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
    public void delete(@PathVariable Long id) {
        subscriptionService.delete(id);
    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = { "{id}" }, method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public void editPost(@PathVariable Long id, @RequestBody Map<String, Object> map) {
        Subscription subscription = subscriptionService.findById(id);

        if (map.containsKey("tag")) {
            String valueOf = String.valueOf(map.get("tag"));

            if (!"".equals(valueOf) || !"null".equals(valueOf)) {
                subscription.setTag(valueOf);
            } else {
                subscription.setTag(null);
            }
        }

        if (map.containsKey("title")) {
            if (map.get("title") == null || "".equals(map.get("title"))) throw new ValidationException("title", "empty");
            subscription.setTitle(String.valueOf(map.get("title")));
        }

        subscriptionService.save(subscription);

        if (map.containsKey("exclusions")) {
            Set<ExclusionPattern> patterns = subscription.getExclusions();
            Set<String> newPatterns = new TreeSet<>();
            List exclusions = (List) map.get("exclusions");

            OUTER:
            for (Object o : exclusions) {
                Map<String, String> exclusionMap = (Map<String, String>) o;

                for (ExclusionPattern ep : patterns) {
                    if (ep.getPattern().equals(exclusionMap.get("pattern"))) {
                        continue OUTER;
                    }
                }
                newPatterns.add(exclusionMap.get("pattern"));
            }

            for (final String exclusionPattern : newPatterns) {
                try {
                    Pattern.compile(exclusionPattern);
                } catch (Exception e) {
                    throw new ValidationException("exclusion", "invalid.pattern " + exclusionPattern);
                }
                ExclusionPattern pattern1 = new ExclusionPattern(exclusionPattern);
                pattern1.setSubscription(subscription);
                exclusionRepository.save(pattern1);
            }

            Map<String, ExclusionPattern> subscriptionPatterns = new HashMap<>();
            for (final ExclusionPattern exclusionPattern : patterns) {
                subscriptionPatterns.put(exclusionPattern.getPattern(), exclusionPattern);
            }
            for (Object o : exclusions) {
                Map<String, String> exclusionMap = (Map<String, String>) o;
                String pattern = exclusionMap.get("pattern");
                if(subscriptionPatterns.containsKey(pattern)) {
                    subscriptionPatterns.remove(pattern);
                }
            }
            exclusionRepository.delete(subscriptionPatterns.values());
        }
    }

    @RequestMapping(value = "", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public void post(@RequestBody Map<String, Object> map, Authentication authentication) throws Exception {
        // TODO: everything

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

        Feed feed = feedRepository.findByUrl(String.valueOf(map.get("url")));

        if(feed == null) {
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

            IconUpdateRequestEvent iconUpdateRequestEvent = new IconUpdateRequestEvent(feed.getUrl());
            publisher.publishEvent(iconUpdateRequestEvent);
        }

        Subscription userFeed = null;

        try {
            userFeed = subscriptionService.findByUrl(String.valueOf(map.get("url")));
        } catch (EntityNotFoundException e) {
            userFeed = new Subscription();
        }

        userFeed.setFeed(feed);
        userFeed.setTitle(feed.getTitle());
        userFeed.setCreatedAt(new Date());

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

        subscriptionService.save(userFeed);
        // TODO: copy entries for user if feed exists already

    }
}
