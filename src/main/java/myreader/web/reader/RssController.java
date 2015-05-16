package myreader.web.reader;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.mobile.device.Device;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.view.RedirectView;

import myreader.dto.SubscriptionDto;
import myreader.reader.web.EntryApi;
import myreader.reader.web.UserEntryQuery;
import myreader.service.subscriptionentry.SubscriptionEntrySearchQuery;
import myreader.subscription.web.SubscriptionApi;
import myreader.web.QueryString;
import myreader.web.treenavigation.TreeNavigation;
import myreader.web.treenavigation.TreeNavigationBuilder;

@Deprecated
@Scope(value = WebApplicationContext.SCOPE_REQUEST)
@Controller
@RequestMapping("web/rss")
public class RssController {

    @Autowired
    private SubscriptionApi subscriptionApi;

    @Autowired
    private TreeNavigationBuilder treeNavigationBuilder;

    @Autowired
    private EntryApi entryApi;

    private QueryString queryString = new QueryString();

    @ModelAttribute("treeNavigation")
    TreeNavigation subscriptionList(Map<String, Object> model, boolean showAll, Authentication principal, HttpServletRequest servletRequest)
            throws UnsupportedEncodingException {
        // http://tedyoung.me/2011/05/09/spring-mvc-optional-path-variables/
        @SuppressWarnings("unchecked")
        Map<String, Object> pathVariables = (Map<String, Object>) servletRequest.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        String collection = "all";

        if (pathVariables != null && pathVariables.containsKey("collection")) {
            collection = URLDecoder.decode(String.valueOf(pathVariables.get("collection")), "UTF-8");
        }

        model.put("collection", collection);
        //TODO
        model.put("path", "web/rss");

        final List<SubscriptionDto> list = subscriptionApi.test(showAll, principal);
        TreeNavigation nav = treeNavigationBuilder.build(list);

        if (collection.equals(nav.getName())) {
            nav.setSelected(true);
        } else {
            for (TreeNavigation tn : nav) {
                if (collection.equals(tn.getName())) {
                    tn.setSelected(true);
                    break;
                }

                for (TreeNavigation child : tn) {
                    if (collection.equals(child.getName())) {
                        child.setSelected(true);
                        break;
                    }
                }
            }
        }

        return nav;
    }

    @ModelAttribute("queryString")
    QueryString queryString(@RequestParam(required = false) String showAll, @RequestParam(required = false, defaultValue = "true") String showDetails,
            @RequestParam(required = false) String q) {
        if ("true".equals(showAll)) {
            queryString.put("showAll", true);
        } else {
            queryString.put("showAll", false);
        }

        if ("false".equals(showDetails)) {
            queryString.put("showDetails", false);
        } else {
            queryString.put("showDetails", true);
        }

        if (q != null) {
            queryString.put("q", q);
        } else {
            queryString.remove("q");
        }

        return queryString;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public RedirectView index(Device device) {
        /*
         * http://static.springsource.org/spring/docs/2.5.6/api/org/springframework/web/servlet/view/RedirectView.html
         */

        //TODO
        if (device.isMobile()) {
            return new RedirectView("/mobile/reader", true, false, false);
        } else {

            return new RedirectView("/web/rss/all", true, false, false);
        }
    }

    @RequestMapping(value = "{collection:.+}", params = "entry")
    public String entry(@PathVariable String collection, @RequestParam(required = false) Long offset, Long entry, Map<String, Object> model, Authentication authentication) {
        List<SubscriptionEntry> l = new ArrayList<>();

        if (entry == null) {
            String theCollection = "all".equalsIgnoreCase(collection) ? null : collection;
            final SubscriptionEntrySearchQuery search = new SubscriptionEntrySearchQuery();
            final Object q = queryString.get("q");
            if(q != null) {
                search.setQ(q.toString());
            }

            search.setLastId(offset);

            final List<UserEntryQuery> feed = entryApi.feed(null, theCollection, true, search, null, authentication);

            for (final UserEntryQuery userEntryQuery : feed) {
                l.add(new SubscriptionEntry(userEntryQuery));
            }
        } else {
            final UserEntryQuery feed = entryApi.feed(entry, true);
            SubscriptionEntry ue = new SubscriptionEntry(feed);
            l = Collections.singletonList(ue);
        }

        model.put("entryList", l);
        return "reader/index";
    }

    @RequestMapping("{collection:.+}")
    public String entries(@PathVariable String collection, @RequestParam(required = false) Long offset, @RequestParam(required = false) boolean showAll,
                          Map<String, Object> model, Authentication authentication) {
        List<SubscriptionEntry> l = new ArrayList<>();
        String theCollection = "all".equalsIgnoreCase(collection) ? null : collection;

        final SubscriptionEntrySearchQuery search = new SubscriptionEntrySearchQuery();
        final Object q = queryString.get("q");
        if(q != null) {
            search.setQ(q.toString());
        }

        search.setLastId(offset);
        search.setShowAll(showAll);

        final List<UserEntryQuery> feed = entryApi.feed(theCollection, null, false, search, null, authentication);

        for (final UserEntryQuery userEntryQuery : feed) {
            l.add(new SubscriptionEntry(userEntryQuery));
        }

        model.put("entryList", l);
        return "reader/index";
    }

    @RequestMapping(value = "{collection:.+}", params = "q", method = RequestMethod.POST)
    public RedirectView q(@PathVariable String collection, @RequestParam(required = false) Long offset, Map<String, Object> model, Principal principal) {
        /*
         * http://static.springsource.org/spring/docs/2.5.6/api/org/springframework/web/servlet/view/RedirectView.html
         */
        return new RedirectView("/web/rss/" + collection + this.queryString.toString(), true, false, false);
    }
}
