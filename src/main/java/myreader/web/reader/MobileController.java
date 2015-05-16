package myreader.web.reader;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mobile.device.Device;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.WebRequest;

import myreader.reader.web.EntryApi;
import myreader.reader.web.UserEntryQuery;
import myreader.repository.SubscriptionRepository;
import myreader.service.subscriptionentry.SubscriptionEntrySearchQuery;
import myreader.service.subscriptionentry.SubscriptionEntryService;

@Deprecated
@Controller
@RequestMapping("mobile/reader")
class MobileController {

    @Autowired
    private EntryApi entryApi;

    @Autowired
    private SubscriptionEntryService subscriptionEntryService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringURLDecoderEditor());
    }

    @RequestMapping(value = { "", "/" }, method = RequestMethod.GET)
    String index(Device device) {
        if (device.isNormal()) {
            return "redirect:/web/rss";
        } else {
            return "reader/mobile/index";
        }
    }

    @RequestMapping(value = "entry/{collection:.+}", method = RequestMethod.GET, params = { "id" })
    public String showEntryDetails(@RequestParam Long id, Map<String, Object> model, Authentication authentication) {
        final UserEntryQuery feed = entryApi.feed(id, true);
        SubscriptionEntry userEntry = new SubscriptionEntry(feed);
        Collection<String> tags = entryApi.distinct("tag", authentication);

        model.put("tagList", tags);
        model.put("entry", userEntry);
        return "reader/mobile/entry_details";
    }

    @Transactional
    @RequestMapping(value = "entry/{collection:.+}", method = RequestMethod.POST, params = { "id" })
    public String editPostXhr(@PathVariable String collection, @RequestParam Long id, WebRequest request) {
        if (request.getParameterValues("id") != null) {
            final myreader.entity.SubscriptionEntry subscriptionEntry = subscriptionEntryService.findById(id);

            if (subscriptionEntry == null) {
                throw new RuntimeException("no entry");
            }

            if ("true".equalsIgnoreCase(request.getParameterValues("unseen")[0])) {
                subscriptionEntry.setSeen(false);
                subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
            }

            if ("false".equalsIgnoreCase(request.getParameterValues("unseen")[0])) {
                subscriptionEntry.setSeen(true);
                subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
            }

            if (request.getParameterValues("tag") != null) {
                String tag = request.getParameterValues("tag")[0];
                if ("".equals(tag)) {
                    subscriptionEntry.setTag(null);
                } else {
                    subscriptionEntry.setTag(tag);
                }
            }
            subscriptionEntryService.save(subscriptionEntry);
        } else {
            throw new RuntimeException("no id");
        }

        String encoded;
        try {
            encoded = URLEncoder.encode(collection, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage(), e);
        }

        return "redirect:" + encoded;
    }
}
