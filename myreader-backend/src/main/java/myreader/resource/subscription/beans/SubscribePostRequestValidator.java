package myreader.resource.subscription.beans;

import myreader.repository.SubscriptionRepository;
import myreader.security.AuthenticatedUser;
import myreader.service.feed.FeedService;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
public class SubscribePostRequestValidator implements Validator {

    private static final Pattern ORIGIN_PATTERN = Pattern.compile("^https?://.*");
    private static final String FIELD_NAME = "origin";

    private final SubscriptionRepository subscriptionRepository;
    private final FeedService feedService;
    private final AuthenticatedUser authenticatedUser;

    public SubscribePostRequestValidator(
            SubscriptionRepository subscriptionRepository,
            FeedService feedService,
            AuthenticatedUser authenticatedUser
    ) {
        this.subscriptionRepository = requireNonNull(subscriptionRepository, "subscriptionRepository is null");
        this.feedService = requireNonNull(feedService, "feedService is null");
        this.authenticatedUser = requireNonNull(authenticatedUser, "authenticatedUser is null");
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return SubscribePostRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SubscribePostRequest request = (SubscribePostRequest) target;

        String origin = request.getOrigin();
        if (origin == null || !ORIGIN_PATTERN.matcher(origin).matches()) {
            errors.rejectValue(FIELD_NAME, "Pattern.origin", "must begin with http(s)://");
            return;
        }
        if (subscriptionRepository.findByFeedUrlAndUserId(origin, authenticatedUser.getId()).isPresent()) {
            errors.rejectValue(FIELD_NAME, "UniqueSubscription.origin", "subscription exists");
            return;
        }
        if (!feedService.valid(origin)) {
            errors.rejectValue(FIELD_NAME, "ValidSyndication.origin", "invalid syndication feed");
        }
    }
}