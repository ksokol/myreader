package freemarker;

import net.jawr.web.JawrConstant;
import net.jawr.web.resource.bundle.handler.ResourceBundlesHandler;
import net.jawr.web.resource.bundle.renderer.BundleRenderer;
import net.jawr.web.resource.bundle.renderer.RendererFactory;

import java.util.Map;

/**
 * @author Kamill Sokol
 */
public class JawrStyleTemplateDirectiveModel extends ResourceBundleTemplateDirectiveModel {

    @Override
    protected String getType() {
        return JawrConstant.CSS_TYPE;
    }

    @Override
    protected BundleRenderer createRenderer(ResourceBundlesHandler rsHandler, Boolean useRandomParam, Map<String, Object> params) {
        return RendererFactory.getCssBundleRenderer(rsHandler, useRandomParam, null, false, false, null);
    }
}
