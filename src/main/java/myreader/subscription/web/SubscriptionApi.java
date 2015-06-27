package myreader.subscription.web;

import myreader.API;
import myreader.dto.SubscriptionDto;
import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import spring.security.MyReaderUser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Deprecated
@Transactional
@Controller
@RequestMapping(API.V1 + "subscription")
public class SubscriptionApi {

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
}
