package myreader.test;

import myreader.Starter;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.util.TimeZone;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * @author Kamill Sokol
 *
 * @deprecated
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Starter.class, TestConfig.class, TestDataSourceConfig.class})
@TestPropertySource(properties = { "task.enabled = false" })
public abstract class IntegrationTestSupport {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.setProperty("file.encoding", "UTF-8");
    }

    protected MockMvc mockMvc;

    @Autowired
    protected WebApplicationContext wac;
    @Autowired
    private FeedParser feedParserMock;
    @Autowired
    private FeedQueue feedQueueMock;

    @Before
    public final void before() {
        reset(feedParserMock, feedQueueMock);

        this.mockMvc = webAppContextSetup(this.wac)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .build();
    }

    @After
    public final void after() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }
}
