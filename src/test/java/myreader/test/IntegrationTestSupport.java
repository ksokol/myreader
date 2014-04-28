package myreader.test;

import myreader.config.PersistenceConfig;
import myreader.config.SearchConfig;
import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import myreader.resource.ResourceConfig;
import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.Filter;
import java.io.IOException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, TestConfig.class, SecurityConfig.class, SearchConfig.class, TaskConfig.class})
@WebAppConfiguration
@Transactional
public class IntegrationTestSupport {

    protected MockMvc mockMvc;

    @Autowired
    protected WebApplicationContext wac;

    @Autowired
    private Filter springSecurityFilterChain;

    @Before
    public void setUp() throws Exception {
        this.mockMvc = webAppContextSetup(this.wac)
                .addFilter(springSecurityFilterChain)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .alwaysExpect(content().contentType(MediaType.APPLICATION_JSON))
                .build();
    }

    protected String jsonFromFile(String file) {
        ClassPathResource classPathResource = new ClassPathResource("/json/"+file);
        try {
            return FileUtils.readFileToString(classPathResource.getFile());
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
