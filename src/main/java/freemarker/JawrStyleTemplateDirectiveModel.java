package freemarker;

import java.util.Map;

import net.jawr.web.JawrConstant;
import net.jawr.web.resource.bundle.handler.ResourceBundlesHandler;
import net.jawr.web.resource.bundle.renderer.BundleRenderer;
import net.jawr.web.resource.bundle.renderer.RendererFactory;

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
        String media = null;
        String title = null;
        boolean alternate = false;
        boolean displayAlternate = false;

        if(params.get("media") != null) {
            media = params.get("media").toString();
        }
        if(params.get("title") != null) {
            media = params.get("title").toString();
        }
        if(params.get("alternate") != null) {
            alternate = "true".equalsIgnoreCase(params.get("alternate").toString()) ? true : false;
        }
        if(params.get("displayAlternate") != null) {
            alternate = "true".equalsIgnoreCase(params.get("displayAlternate").toString()) ? true : false;
        }
        
        return RendererFactory.getCssBundleRenderer(rsHandler, useRandomParam, media, alternate, displayAlternate, title);
    }
}
