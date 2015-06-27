package myreader.web.subscription;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import myreader.web.SubscriptionDto;
import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.service.user.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Deprecated
@Controller
@RequestMapping("web/subscription")
class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserService userService;

    @RequestMapping(method = RequestMethod.GET)
    public String subscriptions(Map<String, Object> model) {
        final List<Subscription> l = subscriptionRepository.findAllByUserAndUnseenGreaterThan(userService.getCurrentUser().getId(), -1);
        List<SubscriptionDto> list = new ArrayList<>();

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

            list.add(dto);
        }

        model.put("subscriptionList", list);
        return "subscription/index";
    }
}
