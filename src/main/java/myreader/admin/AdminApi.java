package myreader.admin;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;

import myreader.API;
import myreader.bootstrap.SearchIndexCheck;
import myreader.dao.FeedDao;
import myreader.dto.FeedQueryDto;
import myreader.dto.FeedQueryDto.UserQueryDto;
import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.icon.IconUpdateRequestEvent;

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
    private FeedDao feedDao;

    @Autowired
    private Executor executor;

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
        List<Feed> feedList = feedDao.findAll();
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

            List<UserQueryDto> userDtoList = new ArrayList<UserQueryDto>();
            for (Subscription subscription : feed.getSubscriptions()) {
                UserQueryDto userDto = new UserQueryDto();

                userDto.setCreatedAt(subscription.getCreatedAt());
                userDto.setEmail(subscription.getUser().getEmail());
                userDto.setSum(subscription.getSum());
                userDto.setTag(subscription.getTag());
                userDto.setUnseen((long) subscription.getUnseen());

                userDtoList.add(userDto);
            }
            dto.setUsers(userDtoList);

            dtoList.add(dto);
        }

        return dtoList;
    }

    @Transactional
    @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "searchIndex", method = RequestMethod.POST)
    public void searchIndex() {
        publisher.publishEvent(new SearchIndexCheck.ReindexApplicationEvent(this));
    }

    @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "iconUpdate", method = RequestMethod.POST)
    public void iconUpdate() {
        Runnable runnable = new Runnable() {

            @Override
            public void run() {
                publisher.publishEvent(new IconUpdateRequestEvent(this));
            }
        };

        executor.execute(runnable);
    }
}
