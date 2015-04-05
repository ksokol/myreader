package myreader.web.subscription;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import myreader.dto.SubscriptionDto;
import myreader.subscription.web.SubscriptionApi;

@Controller
@RequestMapping("web/subscription")
class SubscriptionController {

    @Autowired
    private SubscriptionApi subscriptionApi;

    @RequestMapping(method = RequestMethod.GET)
    public String subscriptions(Map<String, Object> model, Authentication principal) {
        final List<SubscriptionDto> subscriptionList = subscriptionApi.test(true, principal);
        model.put("subscriptionList", subscriptionList);
        return "subscription/index";
    }
}
