package myreader.web.reader;

import myreader.reader.web.EntryApi;
import myreader.reader.web.UserEntryQuery;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Deprecated
@Controller
@RequestMapping("web/entry")
public class EntryController {

    @Autowired
    private EntryApi entryApi;

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserService userService;

    @RequestMapping(value = { "edit" }, method = RequestMethod.GET)
    public String editGet(@RequestParam Long id, Map<String, Object> model) {
        final UserEntryQuery feed = entryApi.feed(id, false);
        SubscriptionEntry entry = new SubscriptionEntry(feed);
        Collection<String> tags = subscriptionEntryRepository.findDistinctTags(userService.getCurrentUser().getId());

        model.put("entry", entry);
        model.put("tags", tags);
        return "reader/entry/ajax_edit";
    }

    @RequestMapping(value = { "{id}" }, method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public SubscriptionEntry editGet(@PathVariable Long id) {
        final UserEntryQuery feed = entryApi.feed(id, true);
        return new SubscriptionEntry(feed);
    }

    @Transactional
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @RequestMapping(value = { "edit" }, method = RequestMethod.POST)
    public void post(WebRequest webRequest, Long id, Authentication authentication) {
        final myreader.entity.SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndUsername(id, authentication.getName());

        if(subscriptionEntry == null) {
            return;
        }

        if (webRequest.getParameter("unseen") != null) {
            boolean unseen = Boolean.valueOf(webRequest.getParameter("unseen"));

            if(unseen == subscriptionEntry.isSeen()) {
                if (unseen){
                    subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
                } else {
                    subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
                }
            }

            subscriptionEntry.setSeen(!unseen);
        }


        if (webRequest.getParameter("tag") != null) {
            final String tag = webRequest.getParameter("tag");

            if ("".equals(tag) || tag == null) {
                subscriptionEntry.setTag(null);
            } else {
                subscriptionEntry.setTag(tag);
            }
        }

        subscriptionEntryRepository.save(subscriptionEntry);
    }
}
