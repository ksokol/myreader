package freemarker;

import net.jawr.web.JawrConstant;
import net.jawr.web.resource.bundle.handler.ResourceBundlesHandler;
import net.jawr.web.resource.bundle.renderer.BundleRenderer;
import net.jawr.web.resource.bundle.renderer.RendererFactory;

import java.util.Map;

/**
 * @author Kamill Sokol
 */
public class JawrScriptTemplateDirectiveModel extends ResourceBundleTemplateDirectiveModel {

    @Override
    protected String getType() {
        return JawrConstant.JS_TYPE;
    }

    @Override
    protected BundleRenderer createRenderer(ResourceBundlesHandler rsHandler, Boolean useRandomParam, Map<String, Object> params) {
        return RendererFactory.getJsBundleRenderer(rsHandler, useRandomParam, false, false);
    }
}
