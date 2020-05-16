package myreader.resource.subscriptionentry;

import com.jayway.jsonpath.JsonPath;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionEntryRepository;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.TreeSet;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithAuthenticatedUser(TestUser.USER4)
@WithTestProperties
public class SubscriptionEntryCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionEntryRepository subscriptionEntryRepository;

    private SubscriptionEntry se1;
    private SubscriptionEntry se2;
    private SubscriptionEntry se3;

    @Before
    public void setup() {
        SubscriptionTag subscriptionTag1 = new SubscriptionTag();
        subscriptionTag1.setName("subscriptiontag name");
        subscriptionTag1.setColor("#111111");

        Subscription subscription1 = new Subscription();
        subscription1.setId(1L);
        subscription1.setTitle("user4_subscription1");
        subscription1.setFeed(new Feed());
        subscription1.setSubscriptionTag(subscriptionTag1);

        FeedEntry fe1 = new FeedEntry();
        fe1.setTitle("Livelocks from wait/notify");
        fe1.setContent("content");
        fe1.setUrl("http://www.javaspecialists.eu/archive/Issue213.html");

        se1 = new SubscriptionEntry(subscription1, fe1);
        se1.setId(1018L);
        se1.setSeen(true);
        se1.setTag("tag8Tag9");
        se1.setCreatedAt(new Date(1000));

        Subscription subscription2 = new Subscription();
        subscription2.setId(2L);
        subscription2.setTitle("user4_subscription1");

        FeedEntry fe2 = new FeedEntry();
        fe2.setTitle("Throwing Exceptions from Fields");
        fe2.setContent("content");
        fe2.setUrl("http://www.javaspecialists.eu/archive/Issue208.html");

        se2 = new SubscriptionEntry(subscription2, fe2);
        se2.setId(1019L);
        se2.setSeen(true);
        se2.setTag("otherTag");
        se2.setTag("tag6,tag7");
        se2.setCreatedAt(new Date(2000));

        Subscription subscription3 = new Subscription();
        subscription3.setId(3L);

        se3 = new SubscriptionEntry(subscription3, new FeedEntry());
        se3.setId(1020L);
    }

    @Test
    public void shouldReturnExpectedJsonStructure() throws Exception {
        Slice<SubscriptionEntry> sliceOne = new SliceImpl<>(Arrays.asList(se1, se2), Pageable.unpaged(), true);
        given(subscriptionEntryRepository.findBy(anyInt(), any(), any(), any(), any(), any(), any(), anyLong())).willReturn(sliceOne);

        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='self')].href", everyItem(endsWith("/api/2/subscriptionEntries"))))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", everyItem(endsWith("/api/2/subscriptionEntries?next=1019"))))
                .andExpect(jsonPath("$.content[0].uuid", is("1018")))
                .andExpect(jsonPath("$.content[0].title", is("Livelocks from wait/notify")))
                .andExpect(jsonPath("$.content[0].feedTitle", is("user4_subscription1")))
                .andExpect(jsonPath("$.content[0].tag", is("tag8Tag9")))
                .andExpect(jsonPath("$.content[0].content", is("content")))
                .andExpect(jsonPath("$.content[0].seen", is(true)))
                .andExpect(jsonPath("$.content[0].feedTag", is("subscriptiontag name")))
                .andExpect(jsonPath("$.content[0].feedTagColor", is("#111111")))
                .andExpect(jsonPath("$.content[0].feedUuid", is("1")))
                .andExpect(jsonPath("$.content[0].origin", is("http://www.javaspecialists.eu/archive/Issue213.html")))
                .andExpect(jsonPath("$.content[0].createdAt", is("1970-01-01T00:00:01.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("1019")))
                .andExpect(jsonPath("$.content[1].title", is("Throwing Exceptions from Fields")))
                .andExpect(jsonPath("$.content[1].feedTitle", is("user4_subscription1")))
                .andExpect(jsonPath("$.content[1].tag", is("tag6,tag7")))
                .andExpect(jsonPath("$.content[1].content", is("content")))
                .andExpect(jsonPath("$.content[1].seen", is(true)))
                .andExpect(jsonPath("$.content[1].feedTag", nullValue()))
                .andExpect(jsonPath("$.content[1].feedTagColor", nullValue()))
                .andExpect(jsonPath("$.content[1].feedUuid", is("2")))
                .andExpect(jsonPath("$.content[1].origin", is("http://www.javaspecialists.eu/archive/Issue208.html")))
                .andExpect(jsonPath("$.content[1].createdAt", is("1970-01-01T00:00:02.000+0000")))
                .andExpect(jsonPath("$.page", nullValue()));
    }

    @Test
    public void shouldPaginate() throws Exception {
        Slice<SubscriptionEntry> sliceOne = new SliceImpl<>(Arrays.asList(se1, se2), Pageable.unpaged(), true);
        given(subscriptionEntryRepository.findBy(2, null, null, null, null, null, null, TestUser.USER4.id))
                .willReturn(sliceOne);

        MvcResult firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries?size=2"))
                .andExpect(jsonPath("links[?(@.rel=='self')].href", everyItem(endsWith("/api/2/subscriptionEntries?size=2"))))
                .andExpect(jsonPath("content[0].uuid", is("1018")))
                .andExpect(jsonPath("content[1].uuid", is("1019")))
                .andReturn();

        Slice<SubscriptionEntry> sliceTwo = new SliceImpl<>(Collections.singletonList(se3), Pageable.unpaged(), false);
        given(subscriptionEntryRepository.findBy(2, null, null, null, null, null, 1019L, TestUser.USER4.id))
                .willReturn(sliceTwo);

        mockMvc.perform(get(nextPage(firstResponse)))
                .andExpect(jsonPath("links[?(@.rel=='self')].href", everyItem(endsWith("/api/2/subscriptionEntries?size=2"))))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", is(empty())))
                .andExpect(jsonPath("content[0].uuid", is("1020")));
    }

    @Test
    public void shouldSearchWithGivenQueryParameters() throws Exception {
        given(subscriptionEntryRepository.findBy(anyInt(), any(), any(), any(), any(), any(), any(), anyLong()))
                .willReturn(new SliceImpl<>(Collections.emptyList(), Pageable.unpaged(), false));

        mockMvc.perform(
                get("/api/2/subscriptionEntries?q=l*&size=1&feedUuidEqual=2&feedTagEqual=expectedTag&entryTagEqual=expectedEntryTag&seenEqual=true&next=100")
        );

        verify(subscriptionEntryRepository).findBy(
                1, "l*", "2", "expectedTag", "expectedEntryTag", "true", 100L, TestUser.USER4.id
        );
    }

    @Test
    public void shouldDoNothingWhenPatchRequestContainsNoPatchableEntries() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content' : []}")))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    public void shouldPatchSeenAndTagInMultipleEntries() throws Exception {
        given(subscriptionEntryRepository.findByIdAndUserId(1018L, TestUser.USER4.id)).willReturn(Optional.of(se1));
        given(subscriptionEntryRepository.findByIdAndUserId(1019L, TestUser.USER4.id)).willReturn(Optional.of(se2));
        given(subscriptionEntryRepository.save(se1)).willReturn(se1);
        given(subscriptionEntryRepository.save(se2)).willReturn(se2);

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content': [{'uuid': '1018', 'seen': false}, {'uuid': '1019', 'tag': 'expectedTag'}]}")))
                .andExpect(jsonPath("content[0].tag", nullValue()))
                .andExpect(jsonPath("content[1].tag", is("expectedTag")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        verify(subscriptionEntryRepository).save(argThat(
                allOf(
                        hasProperty("id", is(1018L)),
                        hasProperty("seen", is(false)),
                        hasProperty("tag", nullValue())
                )));
        verify(subscriptionEntryRepository).save(argThat(
                allOf(
                        hasProperty("id", is(1019L)),
                        hasProperty("seen", is(true)),
                        hasProperty("tag", is("expectedTag"))
                )));
    }

    @Test
    public void shouldRejectPatchRequestWhenUuidContainsAnInvalidValue() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content':[{'uuid': 'digits-only'}]}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("content[0].uuid", is("numeric value out of bounds (<2147483647 digits>.<0 digits> expected)")));
    }

    @Test
    public void shouldReturnAllEntryTags() throws Exception {
        given(subscriptionEntryRepository.findDistinctTagsByUserId(TestUser.USER4.id))
                .willReturn(new TreeSet<>(Arrays.asList("tag1", "tag2")));

        mockMvc.perform(get("/api/2/subscriptionEntries/availableTags"))
                .andExpect(jsonPath("$", hasItems("tag1", "tag2")));
    }

    private String nextPage(MvcResult mvcResult) throws IOException {
        List<String> nextHrefs = JsonPath.read(mvcResult.getResponse().getContentAsString(), "$.links[?(@.rel=='next')].href");
        if (nextHrefs.size() == 0) {
            throw new AssertionError("href with rel next not found");
        }
        return nextHrefs.get(0);
    }
}
