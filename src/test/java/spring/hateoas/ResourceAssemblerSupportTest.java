package spring.hateoas;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.springframework.hateoas.ResourceSupport;

/**
 * @author Kamill Sokol
 */
public class ResourceAssemblerSupportTest {

    private TestResourceAssemblerSupportSupport uut1 = new TestResourceAssemblerSupportSupport(Integer.class, Long.class);
    private TestResourceAssemblerSupportSupport uut2 = new TestResourceAssemblerSupportSupport(Long.class, Integer.class);

    @Test
    public void testSupportsRightInputClassOutputClass() throws Exception {
        assertThat(uut1.supports(Integer.class, Long.class), is(true));
        assertThat(uut2.supports(Long.class, Integer.class), is(true));
    }

    @Test
    public void testSupportsWrongInputClassOutputClass1() throws Exception {
        assertThat(uut1.supports(Integer.class, Object.class), is(false));
        assertThat(uut2.supports(Object.class, Integer.class), is(false));
    }

    @Test
    public void testSupportsWrongInputClassOutputClass2() throws Exception {
        assertThat(uut1.supports(Object.class, Long.class), is(false));
        assertThat(uut2.supports(Long.class, Object.class), is(false));
    }

    @Test
    public void testSupportsWrongInputClassOutputClass() throws Exception {
        assertThat(uut1.supports(Object.class, Object.class), is(false));
    }

    static class TestResourceAssemblerSupportSupport extends ResourceAssemblerSupport {

        protected TestResourceAssemblerSupportSupport(Class inputClass, Class outputClass) {
            super(inputClass, outputClass);
        }

        @Override
        public ResourceSupport toResource(Object entity) {
            return null;
        }
    }
}
