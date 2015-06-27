package myreader.web.reader;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import myreader.entity.User;
import myreader.reader.web.UserEntryQuery;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.user.UserService;
import myreader.web.QueryString;
import myreader.web.treenavigation.TreeNavigation;
import myreader.web.treenavigation.TreeNavigationBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Slice;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.view.RedirectView;

import spring.data.domain.SequenceRequest;
import spring.data.domain.Sequenceable;
import spring.security.MyReaderUser;

@Deprecated
@Scope(value = WebApplicationContext.SCOPE_REQUEST)
@Controller
@RequestMapping("web/tags")
public class TagsController {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TreeNavigationBuilder treeNavigationBuilder;

    private QueryString queryString = new QueryString();

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringURLDecoderEditor());
    }

    @ModelAttribute("treeNavigation")
    TreeNavigation subscriptionList(Map<String, Object> model, HttpServletRequest servletRequest)
            throws UnsupportedEncodingException {
        // http://tedyoung.me/2011/05/09/spring-mvc-optional-path-variables/
        @SuppressWarnings("unchecked")
        Map<String, Object> pathVariables = (Map<String, Object>) servletRequest
                .getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        String collection = "";

        if (pathVariables != null && pathVariables.containsKey("collection")) {
            collection = URLDecoder.decode(String.valueOf(pathVariables.get("collection")), "UTF-8");
        }

        model.put("collection", collection);
        // TODO
        model.put("path", "web/tags");

        final User currentUser = userService.getCurrentUser();
        Collection<String> tags = subscriptionEntryRepository.findDistinctTags(currentUser.getId());
        TreeNavigation nav = treeNavigationBuilder.build(new ArrayList<>(tags));

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
    QueryString queryString(@RequestParam(required = false) String showAll,
            @RequestParam(required = false, defaultValue = "true") String showDetails, @RequestParam(required = false) String q) {
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

    @RequestMapping("")
    public RedirectView index() {
        /*
         * http://static.springsource.org/spring/docs/2.5.6/api/org/springframework
         * /web/servlet/view/RedirectView.html
         */
        return new RedirectView("/web/tags/all", true, false, false);
    }

    @RequestMapping(value = "{collection:.+}", params = "entry")
    public String entry(Long entry, Map<String, Object> model, Authentication authentication) {
        final myreader.entity.SubscriptionEntry byIdAndUsername = subscriptionEntryRepository.findByIdAndUsername(entry, authentication.getName());
        SubscriptionEntry ue = new SubscriptionEntry(byIdAndUsername);
        final List<SubscriptionEntry> l = Collections.singletonList(ue);
        model.put("entryList", l);
        return "reader/index";
    }

    @Transactional(readOnly = true)
    @RequestMapping(value = "{collection:.+}")
    public String entries(@PathVariable String collection, @RequestParam(required = false) Long offset, Map<String, Object> model, Authentication authentication) {
        String feedTagEqual = "all".equalsIgnoreCase(collection) ? null : collection;
        MyReaderUser user = (MyReaderUser) authentication.getPrincipal();
        String feedUuidEqual = null;
        String q = null;

        if(queryString.get("q") != null) {
            q = queryString.get("q").toString();
        }

        Sequenceable sequenceable;
        if(offset != null) {
            sequenceable = new SequenceRequest(10, offset -1);
        } else {
            sequenceable = new SequenceRequest(10, Long.MAX_VALUE);
        }

        Slice<myreader.entity.SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findBy(q, user.getId(), feedUuidEqual, null, feedTagEqual,  null, sequenceable.getNext(), sequenceable.toPageable());
        List<UserEntryQuery> dtoList = new ArrayList<>();

        for (myreader.entity.SubscriptionEntry e : pagedEntries.getContent()) {
            UserEntryQuery dto = new UserEntryQuery();
            dto.setContent(e.getFeedEntry().getContent());

            dto.setCreatedAt(e.getCreatedAt());
            dto.setFeedTitle(e.getSubscription().getTitle());
            dto.setId(e.getId());
            dto.setTag(e.getTag());
            dto.setTitle(e.getFeedEntry().getTitle());
            dto.setUnseen(String.valueOf(!e.isSeen()));
            dto.setUrl(e.getFeedEntry().getUrl());

            dtoList.add(dto);
        }

        final List<UserEntryQuery> newList = new ArrayList<>(10);

        if(dtoList.size() > 10) {
            newList.addAll(dtoList.subList(0, 10));
        } else {
            newList.addAll(dtoList);
        }

        model.put("entryList", newList);
        return "reader/index";
    }

    @RequestMapping(value = "{collection:.+}", params = "q", method = RequestMethod.POST)
    public RedirectView q(@PathVariable String collection, @RequestParam(required = false) Long offset, Map<String, Object> model,
            Principal principal) {
        /*
         * http://static.springsource.org/spring/docs/2.5.6/api/org/springframework
         * /web/servlet/view/RedirectView.html
         */
        return new RedirectView("/web/tags/" + collection + this.queryString.toString(), true, false, false);
    }
}
