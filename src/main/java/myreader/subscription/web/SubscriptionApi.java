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
import myreader.repository.ExclusionRepository;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.EntityNotFoundException;
import myreader.service.subscription.SubscriptionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import spring.security.MyReaderUser;

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
    private SubscriptionService subscriptionService;

    @Autowired
    private ExclusionRepository exclusionRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

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

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = { "{id}" }, method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public void editPost(@PathVariable Long id, @RequestBody Map<String, Object> map) {
        Subscription subscription = subscriptionService.findById(id);

        if (map.containsKey("tag")) {
            String valueOf = "".equals(map.get("tag")) ? null : String.valueOf(map.get("tag"));
            subscription.setTag(valueOf);
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
}
