package myreader.resource;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

/**
 * @author Kamill Sokol
 */
public class ResourcesTest extends IntegrationTestSupport {

    @Test
    public void test() throws Exception {
        mockMvc.perform(getAsUser1("/"))
                .andDo(print());
    }
}
