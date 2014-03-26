package myreader.resource.subscription;

import myreader.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Controller
@RequestMapping("subscriptions")
public class ListController {

    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public ListController(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @ResponseBody
    @RequestMapping("")
    public String list() {

        System.out.println("drin");

        return "ok";

    }
}
