package myreader.resource.subscriptiontag;

import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionTagRepository;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Date;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
public class SubscriptionTagCollectionResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionTagRepository subscriptionTagRepository;

    @Test
    public void shouldFetchSubscriptionTags() throws Exception {
        SubscriptionTag st1 = new SubscriptionTag();
        st1.setId(1L);
        st1.setName("tag1");
        st1.setColor("#111111");
        st1.setCreatedAt(new Date(1000));
        SubscriptionTag st2 = new SubscriptionTag();
        st2.setId(2L);
        st2.setName("tag2");
        st2.setColor("#000000");
        st2.setCreatedAt(new Date(2000));

        given(subscriptionTagRepository.findAllByUserId(TestUser.USER4.id)).willReturn(Arrays.asList(st1, st2));

        mockMvc.perform(get("/api/2/subscriptionTags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("1")))
                .andExpect(jsonPath("$.content[0].name", is("tag1")))
                .andExpect(jsonPath("$.content[0].color", is("#111111")))
                .andExpect(jsonPath("$.content[0].createdAt", is("1970-01-01T00:00:01.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("2")))
                .andExpect(jsonPath("$.content[1].name", is("tag2")))
                .andExpect(jsonPath("$.content[1].color", is("#000000")))
                .andExpect(jsonPath("$.content[1].createdAt", is("1970-01-01T00:00:02.000+0000")));
    }
}
