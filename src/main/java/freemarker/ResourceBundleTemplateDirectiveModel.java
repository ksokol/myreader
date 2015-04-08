package freemarker;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.jawr.web.JawrConstant;
import net.jawr.web.config.JawrConfig;
import net.jawr.web.context.ThreadLocalJawrContext;
import net.jawr.web.resource.bundle.handler.ResourceBundlesHandler;
import net.jawr.web.resource.bundle.renderer.BundleRenderer;
import net.jawr.web.resource.bundle.renderer.BundleRendererContext;
import net.jawr.web.servlet.RendererRequestUtils;
import freemarker.core.Environment;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

/**
 * @author Kamill Sokol
 */
public abstract class ResourceBundleTemplateDirectiveModel extends RequestAwareTemplateDirectiveModel {

    @Override
    public void execute(final Environment env, final Map params, final TemplateModel[] loopVars, final TemplateDirectiveBody body) throws TemplateException, IOException {
        final HttpServletRequest request = getRequest();

        String id = String.valueOf(params.get("id"));
        if("null".equals(id)) {
            throw new TemplateModelException("id is not set");
        }

        Boolean useRandomFlag = null;
        String useRandomParam = String.valueOf(params.get("useRandomParam"));
        if(!"null".equals(useRandomParam)) {
            useRandomFlag = Boolean.valueOf(useRandomParam);
        }

        if(null == getServletContext().getAttribute(getResourceHandlerAttributeName())) {
            throw new TemplateModelException("ResourceBundlesHandler not present in servlet context. Initialization of Jawr either failed or never occurred.");
        }

        ResourceBundlesHandler rsHandler = (ResourceBundlesHandler) getServletContext().getAttribute(getResourceHandlerAttributeName());
        JawrConfig jawrConfig = rsHandler.getConfig();

        if(RendererRequestUtils.refreshConfigIfNeeded(request, jawrConfig)){
            rsHandler = (ResourceBundlesHandler) getServletContext().getAttribute(getResourceHandlerAttributeName());
            jawrConfig = rsHandler.getConfig();
        }

        // Renderer instance which takes care of generating the response
        BundleRenderer renderer = createRenderer(rsHandler, useRandomFlag, params);

        // set the debug override
        RendererRequestUtils.setRequestDebuggable(request, jawrConfig);

        try {
            BundleRendererContext ctx = RendererRequestUtils.getBundleRendererContext(request, renderer);
            renderer.renderBundleLinks("/" + id + "." + getType(), ctx, env.getOut());
        } finally {
            // Reset the Thread local for the Jawr context
            ThreadLocalJawrContext.reset();
        }
    }

    private String getResourceHandlerAttributeName() {
        final String type = getType();

        if(JawrConstant.JS_TYPE.equals(type)) {
            return JawrConstant.JS_CONTEXT_ATTRIBUTE;
        }
        if(JawrConstant.CSS_TYPE.equals(type)) {
            return JawrConstant.CSS_CONTEXT_ATTRIBUTE;
        }

        throw new IllegalStateException("unknown type");
    }

    protected abstract String getType();

    protected abstract BundleRenderer createRenderer(ResourceBundlesHandler rsHandler, Boolean useRandomParam, Map<String, Object> params);

}
