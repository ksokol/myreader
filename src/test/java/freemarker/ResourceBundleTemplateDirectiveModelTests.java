package freemarker;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import freemarker.core.Environment;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;
import net.jawr.web.JawrConstant;
import net.jawr.web.resource.bundle.handler.ResourceBundlesHandler;
import net.jawr.web.resource.bundle.renderer.BundleRenderer;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;

/**
 * @author Kamill Sokol
 */
public class ResourceBundleTemplateDirectiveModelTests {

    private final TemplateDirectiveBody body = mock(TemplateDirectiveBody.class);
    private final TemplateModel[] loopVars = new TemplateModel[] { TemplateModel.NOTHING };

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void before() {
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(new MockHttpServletRequest()));
    }

    @Test
    public void idNotGiven() throws Exception {
        final Map params = mock(Map.class);

        when(params.get("id")).thenReturn(null);

        expectedException.expectMessage("id is not set");
        expectedException.expect(TemplateModelException.class);

        new NullResourceBundleTemplateDirectiveModel().execute(Environment.getCurrentEnvironment(), params, loopVars, body);
    }

    @Test
    public void unknownType() throws Exception {
        final Map params = mock(Map.class);

        when(params.get("id")).thenReturn("junit");

        expectedException.expectMessage("unknown type");
        expectedException.expect(IllegalStateException.class);

        new NullResourceBundleTemplateDirectiveModel().execute(Environment.getCurrentEnvironment(), params, loopVars, body);
    }

    @Test
    public void resourceBundlesHandlerNotPresent() throws Exception {
        final Map params = mock(Map.class);

        when(params.get("id")).thenReturn("junit");

        expectedException.expectMessage("ResourceBundlesHandler not present in servlet context. Initialization of Jawr either failed or never occurred.");
        expectedException.expect(TemplateModelException.class);

        new TestCsslResourceBundleTemplateDirectiveModel().execute(Environment.getCurrentEnvironment(), params, loopVars, body);
    }

    static class NullResourceBundleTemplateDirectiveModel extends ResourceBundleTemplateDirectiveModel {

        @Override
        protected String getType() {
            return null;
        }

        @Override
        protected BundleRenderer createRenderer(final ResourceBundlesHandler rsHandler, final Boolean useRandomParam, final Map<String, Object> params) {
            return null;
        }
    }

    static class TestCsslResourceBundleTemplateDirectiveModel extends NullResourceBundleTemplateDirectiveModel {

        @Override
        protected String getType() {
            return JawrConstant.CSS_TYPE;
        }
    }
}
