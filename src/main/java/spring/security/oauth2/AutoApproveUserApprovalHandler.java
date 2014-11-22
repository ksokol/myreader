package spring.security.oauth2;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.AuthorizationRequest;
import org.springframework.security.oauth2.provider.approval.DefaultUserApprovalHandler;

/**
 * @author Kamill Sokol
 */
public class AutoApproveUserApprovalHandler extends DefaultUserApprovalHandler {

    @Override
    public boolean isApproved(final AuthorizationRequest authorizationRequest, final Authentication userAuthentication) {
        return true;
    }
}
