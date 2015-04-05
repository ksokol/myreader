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
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.WebRequest;

import myreader.dto.SubscriptionDto;
import myreader.reader.web.EntryApi;
import myreader.reader.web.UserEntryQuery;
import myreader.service.subscriptionentry.SubscriptionEntrySearchQuery;
import myreader.service.subscriptionentry.SubscriptionEntryService;
import myreader.subscription.web.SubscriptionApi;
import myreader.web.treenavigation.TreeNavigation;
import myreader.web.treenavigation.TreeNavigationBuilder;

@Controller
@RequestMapping("mobile/reader")
class MobileController {

    @Autowired
    private SubscriptionApi subscriptionApi;

    @Autowired
    private TreeNavigationBuilder treeNavigationBuilder;

    @Autowired
    private EntryApi entryApi;

    @Autowired
    private SubscriptionEntryService subscriptionEntryService;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringURLDecoderEditor());
    }

    @ModelAttribute("treeNavigation")
    TreeNavigation subscriptionList(Authentication principal) {
        final List<SubscriptionDto> test = subscriptionApi.test(false, principal);
        TreeNavigation nav = treeNavigationBuilder.build(test);

        return nav;
    }

    @RequestMapping(value = { "", "/" }, method = RequestMethod.GET)
    String index(Device device) {
        if (device.isNormal()) {
            return "redirect:/web/rss";
        } else {
            return "reader/mobile/index";
        }
    }

    @RequestMapping(value = { "entry" }, method = RequestMethod.GET)
    public String index(Map<String, Object> model) {
        return this.index(null, model);
    }

    @RequestMapping(value = { "entry/{collection:.+}" }, method = RequestMethod.GET)
    public String index(@PathVariable String collection, Map<String, Object> model) {
        List<SubscriptionEntry> l = new ArrayList<>();
        List<UserEntryQuery> feed;

        if (collection == null) {
            feed = entryApi.feed(null, null, true, new SubscriptionEntrySearchQuery(), null);
        } else {
            feed = entryApi.feed(collection, null, true, new SubscriptionEntrySearchQuery(), null);
        }

        for (final UserEntryQuery userEntryQuery : feed) {
            l.add(new SubscriptionEntry(userEntryQuery));
        }

        model.put("entryList", l);
        return "reader/mobile/entry";
    }

    @RequestMapping(value = { "entry/{collection:.+}" }, method = RequestMethod.POST)
    public String batchMarkAsRead(@PathVariable String collection, @RequestParam("id[]") Long[] ids, Map<String, Object> model) {
        for (Long id : ids) {
            myreader.entity.SubscriptionEntry subscriptionEntry = subscriptionEntryService.findById(id);
            subscriptionEntry.setSeen(true);
            subscriptionEntryService.save(subscriptionEntry);
        }

        return this.index(collection, model);
    }

    @RequestMapping(value = "entry/{collection:.+}", method = RequestMethod.GET, params = { "id" })
    public String showEntryDetails(@RequestParam Long id, Map<String, Object> model) {
        final UserEntryQuery feed = entryApi.feed(id, true);
        SubscriptionEntry userEntry = new SubscriptionEntry(feed);
        Collection<String> tags = entryApi.distinct("tag");

        model.put("tagList", tags);
        model.put("entry", userEntry);
        return "reader/mobile/entry_details";
    }

    @RequestMapping(value = "entry/{collection:.+}", method = RequestMethod.POST, params = { "id" })
    public String editPostXhr(@PathVariable String collection, @RequestParam Long id, WebRequest request) {
        if (request.getParameterValues("id") != null) {
            final myreader.entity.SubscriptionEntry subscriptionEntry = subscriptionEntryService.findById(id);

            if (subscriptionEntry == null) {
                throw new RuntimeException("no entry");
            }

            if ("true".equalsIgnoreCase(request.getParameterValues("unseen")[0])) {
                subscriptionEntry.setSeen(false);
            }

            if ("false".equalsIgnoreCase(request.getParameterValues("unseen")[0])) {
                subscriptionEntry.setSeen(true);
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
