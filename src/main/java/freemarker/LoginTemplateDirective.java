package freemarker;

import freemarker.core.Environment;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;

import java.io.IOException;
import java.util.Map;

/**
 * @author Kamill Sokol
 */
@Deprecated
public class LoginTemplateDirective extends RequestAwareTemplateDirectiveModel {

    private static final String RESULT = "result";

    @Override
    public void execute(final Environment env, final Map params, final TemplateModel[] loopVars, final TemplateDirectiveBody body) throws TemplateException, IOException {
        if("failed".equalsIgnoreCase(getRequest().getParameter(RESULT))) {
            body.render(env.getOut());
        }
    }
}
