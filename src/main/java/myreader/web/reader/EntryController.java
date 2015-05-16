package myreader.web.reader;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import myreader.reader.web.EntryApi;
import myreader.reader.web.UserEntryQuery;

@Deprecated
@Controller
@RequestMapping("web/entry")
public class EntryController {

    @Autowired
    private EntryApi entryApi;

    @RequestMapping(value = { "edit" }, method = RequestMethod.GET)
    public String editGet(@RequestParam Long id, Map<String, Object> model, Authentication authentication) {
        final UserEntryQuery feed = entryApi.feed(id, false);
        SubscriptionEntry entry = new SubscriptionEntry(feed);
        Collection<String> tags = entryApi.distinct("tag", authentication);

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

    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @RequestMapping(value = { "edit" }, method = RequestMethod.POST)
    public void post(WebRequest webRequest, Long id) {
        Map<String, String> map = new HashMap<>(5);

        if (webRequest.getParameter("unseen") != null) {
            map.put("unseen", webRequest.getParameter("unseen"));
        }

        if (webRequest.getParameter("tag") != null) {
            map.put("tag", webRequest.getParameter("tag"));
        }

        entryApi.editPostXhr(map, id);
    }
}
