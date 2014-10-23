package spring.hateoas;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.hateoas.Link;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import spring.hateoas.annotation.Rel;

public class EntityLinkerTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @BeforeClass
    public static void beforeClass() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    public void testEntityClassWithRel() {
        EntityLinker entityLinker = new EntityLinker(Entity.class, Object.class);
        assertThat(entityLinker.getRel(), is("test"));
    }

    @Test
    public void testEntityClassWithoutRel() {
        EntityLinker entityLinker = new EntityLinker(Object.class, Object.class);
        assertThat(entityLinker.getRel(), is("object"));
    }

    @Test
    public void testLinkForSingleResourceNpe() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage(is("type is null"));
        EntityLinker entityLinker = new EntityLinker(Object.class, Object.class);
        entityLinker.linkForSingleResource(null, new Object());
    }

    @Test
    public void testLinkForSingleResource() {
        EntityLinker entityLinker = new EntityLinker(Object.class, Object.class);
        Link link = entityLinker.linkForSingleResource(Object.class, 1L);
        assertThat(link, is(new Link("http://localhost/1")));
    }

    @Test
    public void testLinkForSingleResourceException() {
        expectedException.expect(RuntimeException.class);
        expectedException.expectMessage(is("encoding [] not supported"));
        EntityLinker entityLinker = new EntityLinker(Object.class, Object.class, "");
        entityLinker.linkFor(Object.class, 1L);
    }

    @Rel("test")
    static class Entity {}

}
