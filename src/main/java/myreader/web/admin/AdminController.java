package myreader.web.admin;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import myreader.web.FeedQueryDto;
import myreader.entity.Feed;
import myreader.fetcher.FeedQueue;
import myreader.repository.FeedRepository;
import myreader.service.search.events.IndexSyncEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@PreAuthorize("hasRole('ROLE_ADMIN')")
@Deprecated
@Controller
@RequestMapping(value = "web/admin")
class AdminController {

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedQueue feedQueue;

    @Autowired
    private ApplicationEventPublisher publisher;

    @RequestMapping(value = "", method = GET)
    String index(Map<String, Object> model) {
        model.put("queue", feedQueue);
        return "admin/index";
    }

    @Transactional(readOnly = true)
    @RequestMapping(value = "feeds", method = GET)
    String feeds(Map<String, Object> model) {
        Iterable<Feed> feedList = feedRepository.findAll();
        List<FeedQueryDto> dtoList = new ArrayList<>();

        for (Feed feed : feedList) {
            FeedQueryDto dto = new FeedQueryDto();

            dto.setAbonnements((long) feed.getSubscriptions().size());
            dto.setCreatedAt(feed.getCreatedAt());
            dto.setFetched((long) feed.getFetched());
            dto.setId(BigInteger.valueOf(feed.getId()));
            dto.setLastModified(feed.getLastModified());
            dto.setTitle(feed.getTitle());
            dto.setUrl(feed.getUrl());

            dtoList.add(dto);
        }
        model.put("feedList", dtoList);
        return "admin/feeds";
    }

    @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "searchIndex", method = RequestMethod.POST)
    public void searchIndex() {
        publisher.publishEvent(new IndexSyncEvent());
    }
}
