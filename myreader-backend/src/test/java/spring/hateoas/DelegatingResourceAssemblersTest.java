package spring.hateoas;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
public class DelegatingResourceAssemblersTest {

    private DelegatingResourceAssemblers uut;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @BeforeClass
    public static void beforeClass() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/junit");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Before
    public void before() {
        ResourceAssemblerSupport mock = mock(ResourceAssemblerSupport.class);
        when(mock.supports(Object.class, Object.class)).thenReturn(true);
        uut = new DelegatingResourceAssemblers(Arrays.asList(mock), new PagedResourcesAssembler());
    }

    @Test
    public void testToPagedResourceNextLink() throws Exception {
        PagedResources<Object> pages = uut.toResource(page(0), Object.class);
        assertThat(pages.getNextLink(), is(new Link("/junit?page=1&size=1", Link.REL_NEXT)));
    }

    @Test
    public void testToPagedResourceBeforeLink() throws Exception {
        PagedResources<Object> pages = uut.toResource(page(1), Object.class);
        assertThat(pages.getPreviousLink(), is(new Link("/junit?page=0&size=1", Link.REL_PREVIOUS)));
    }

    @Test
    public void testObjectToResourceNpe() {
        Object result = uut.toResource((Object) null, Object.class);
        assertThat(result, nullValue());
    }

    @Test
    public void testPageToResourceNpe() {
        PagedResources<Object> result = uut.toResource((Page) null, Object.class);
        assertThat(result, instanceOf(PagedResources.class));
    }

    @Test
    public void testPageToResourceEmptyContent() {
        Page<Object> page = new PageImpl(Collections.emptyList());
        PagedResources<Object> result = uut.toResource(page, Object.class);
        assertThat(result, instanceOf(PagedResources.class));
    }

    @Test
    public void testToResourceException() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage(is("Cannot determine resource assembler for java.lang.Class -> java.lang.Object!"));
        uut = new DelegatingResourceAssemblers(Collections.<ResourceAssemblerSupport>emptyList(), new PagedResourcesAssembler());
        uut.toResource(Object.class, Object.class);
    }

    private Page page(int page) {
        List<Object> content = Arrays.asList(new Object(), new Object());
        return new PageImpl(content, new PageRequest(page, 1), 2);
    }
}
