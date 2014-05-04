package myreader.resource;

import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.user.UserCollectionResource;
import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.List;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
@Controller
public class Resources {

    private final PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public Resources(PagedResourcesAssembler pagedResourcesAssembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @RequestMapping({"", "/"})
    @ResponseBody
    public Links get() {
        Link users = withPaginationParameterTemplates(linkTo(methodOn(UserCollectionResource.class).get(null, null)).withRel("users"));
        Link subscriptions = withPaginationParameterTemplates(linkTo(methodOn(SubscriptionCollectionResource.class).get(null, null)).withRel("subscriptions"));
        Link subscriptionTagGroups = withPaginationParameterTemplates(linkTo(methodOn(SubscriptionTagGroupCollectionResource.class).get(null, null)).withRel("subscriptionTagGroups"));
        Link subscriptionEntries = withPaginationParameterTemplates(linkTo(methodOn(SubscriptionEntryCollectionResource.class).get(null, null)).withRel("subscriptionEntries"));
        return new Links(users, subscriptions, subscriptionTagGroups, subscriptionEntries);
    }

    private Link withPaginationParameterTemplates(Link link) {
        return pagedResourcesAssembler.appendPaginationParameterTemplates(link);
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY, getterVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.NONE)
    class Links {
        private final List<Link> links;

        Links(Link...links) {
            this.links = Arrays.asList(links);
        }
    }
}
