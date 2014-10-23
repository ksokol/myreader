package spring.hateoas;

import static org.hamcrest.Matchers.is;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
public class SlicedResourcesTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void testEqualsReturnFalse() throws Exception {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage(is("Size must not be negative!"));
        new SlicedResources.PageMetadata(-1, 1);
    }

    @Test
    public void testEqualsReturnFalse1() throws Exception {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage(is("Number must not be negative!"));
        new SlicedResources.PageMetadata(1, -1);
    }

}
