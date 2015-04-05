package freemarker;

import java.io.IOException;
import java.util.Map;

import freemarker.core.Environment;
import freemarker.template.SimpleScalar;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;

/**
 * @author Kamill Sokol
 */
public class LoginTemplateDirective extends RequestAwareTemplateDirectiveModel {

    private static final String RESULT = "result";

    @Override
    public void execute(final Environment env, final Map params, final TemplateModel[] loopVars, final TemplateDirectiveBody body) throws TemplateException, IOException {
        final SimpleScalar login = (SimpleScalar) params.get(RESULT);

        if(login == null) {
            return;
        }

        final String parameterValue = getRequest().getParameter(RESULT);

        if(!login.getAsString().equals(parameterValue)) {
            return;
        }

        body.render(env.getOut());
    }
}
