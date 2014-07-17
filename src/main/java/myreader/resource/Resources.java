package myreader.resource;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Link;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@RestController
public class Resources {

    private final EntityLinks entityLinks;

    @Autowired
    public Resources(EntityLinks entityLinks) {
        this.entityLinks = entityLinks;
    }

    @RequestMapping({"", "/"})
    public Links get() {
        Link users = entityLinks.linkToCollectionResource(UserGetResponse.class);
        Link subscriptions = entityLinks.linkToCollectionResource(SubscriptionGetResponse.class);
        Link subscriptionTagGroups = entityLinks.linkToCollectionResource(SubscriptionTagGroupGetResponse.class);
        Link subscriptionEntries = entityLinks.linkToCollectionResource(SubscriptionEntryGetResponse.class);

        return new Links(users, subscriptions, subscriptionTagGroups,  subscriptionEntries);
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY, getterVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.NONE)
    class Links {
        private final List<Link> links;

        Links(Link...links) {
            this.links = Arrays.asList(links);
        }
    }
}
