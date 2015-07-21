package myreader.resource.feed;

import static org.slf4j.LoggerFactory.getLogger;

import myreader.resource.feed.beans.FeedProbeRequest;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/feeds")
public class FeedCollectionResource {

    private static final Logger LOG = getLogger(FeedCollectionResource.class);

    @RequestMapping(value = "probe", method = RequestMethod.POST)
    public void probe(@Valid @RequestBody FeedProbeRequest request) {
        LOG.info("probe {}", request.getUrl());
    }
}
