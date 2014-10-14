package spring.hateoas;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class DelegatingResourceAssemblersTest {

    private static final Link SELF_LINK = new Link("http://localhost?{q}", Link.REL_SELF);

    private DelegatingResourceAssemblers uut;

    @BeforeClass
    public static void beforeClass() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Before
    public void before() {
        AbstractResourceAssembler mock = mock(AbstractResourceAssembler.class);
        when(mock.supports(Object.class, Object.class)).thenReturn(true);
        uut = new DelegatingResourceAssemblers(Arrays.asList(mock), new PagedResourcesAssembler());
    }

    @Test
    public void testToPagedResourceNextLink() throws Exception {
        PagedResources<Object> pages = uut.toPagedResource(page(0), Object.class);
        assertThat(pages.getNextLink(), is(new Link("http://localhost?page=1&size=1", Link.REL_NEXT)));
    }

    @Test
    public void testToPagedResourceBeforeLink() throws Exception {
        PagedResources<Object> pages = uut.toPagedResource(page(1), Object.class);
        assertThat(pages.getPreviousLink(), is(new Link("http://localhost?page=0&size=1", Link.REL_PREVIOUS)));
    }

    private Page page(int page) {
        List<Object> content = Arrays.asList(new Object(), new Object());
        return new PageImpl(content, new PageRequest(page, 1), 2);
    }
}
