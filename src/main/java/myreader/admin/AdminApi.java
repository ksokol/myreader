package myreader.admin;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import myreader.API;
import myreader.bootstrap.SearchIndexRebuildListener;
import myreader.dto.FeedQueryDto;
import myreader.entity.Feed;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.icon.IconUpdateRequestEvent;

import myreader.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@PreAuthorize("hasRole('ROLE_ADMIN')")
@Controller
@RequestMapping(API.V1 + "admin")
class AdminApi {

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    FeedQueue feedQueue;

    @RequestMapping("/fetcher/queue")
    @ResponseBody
    public Object index() {
        return feedQueue;
    }

    @Transactional
    @RequestMapping(value = "feeds", method = RequestMethod.GET)
    @ResponseBody
    public List<FeedQueryDto> feeds() {
        Iterable<Feed> feedList = feedRepository.findAll();
        List<FeedQueryDto> dtoList = new ArrayList<FeedQueryDto>();

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

        return dtoList;
    }

    @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "searchIndex", method = RequestMethod.POST)
    public void searchIndex() {
        publisher.publishEvent(new SearchIndexRebuildListener.ReindexApplicationEvent());
    }

    @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "iconUpdate", method = RequestMethod.POST)
    public void iconUpdate() {
        publisher.publishEvent(new IconUpdateRequestEvent());
    }
}
