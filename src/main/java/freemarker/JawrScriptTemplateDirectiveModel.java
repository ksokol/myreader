package freemarker;

import java.util.Map;

import net.jawr.web.JawrConstant;
import net.jawr.web.resource.bundle.handler.ResourceBundlesHandler;
import net.jawr.web.resource.bundle.renderer.BundleRenderer;
import net.jawr.web.resource.bundle.renderer.RendererFactory;

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
        boolean async = false;
        boolean defer = false;

        if(params.get("async") != null) {
            async = "true".equalsIgnoreCase(params.get("async").toString()) ? true : false;
        }
        if(params.get("defer") != null) {
            defer = "true".equalsIgnoreCase(params.get("defer").toString()) ? true : false;
        }

        return RendererFactory.getJsBundleRenderer(rsHandler, useRandomParam, async, defer);
    }
}
