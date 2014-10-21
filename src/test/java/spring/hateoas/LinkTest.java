package spring.hateoas;

import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import org.junit.Before;
import org.junit.Test;
import org.springframework.hateoas.Link;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class LinkTest {

    @Before
    public void setUp() {
        ServletRequestAttributes servletRequestAttributes = new ServletRequestAttributes(new MockHttpServletRequest());
        RequestContextHolder.setRequestAttributes(servletRequestAttributes);
    }

    @Test
    public void linksToMethodWithPathVariableWithBlank() {
        Link link = linkTo(methodOn(Controller.class).get("with blank")).withSelfRel();
        assertThat(link.getRel(), is(Link.REL_SELF));
        assertThat(link.getHref(), endsWith("/before/with%20blank/after"));
    }

    @Test
    public void linksToMethodWithPathVariableWithSlashEncodedBeforeHand() {
        Link link = linkTo(methodOn(Controller.class).get("with%2Fslash")).withSelfRel();
        assertThat(link.getRel(), is(Link.REL_SELF));
        assertThat(link.getHref(), endsWith("/before/with%252Fslash/after"));
    }

    class Controller {
        @RequestMapping("before/{id}/after")
        Object get(@PathVariable("id") String id) {
            return null;
        }
    }
}
