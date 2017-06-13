package myreader.resource.common.validation;

import myreader.service.feed.FeedService;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
@Component
public class ValidSyndicationValidator implements ConstraintValidator<ValidSyndication, String> {

    private final FeedService feedService;

    public ValidSyndicationValidator(final FeedService feedService) {
        this.feedService = requireNonNull(feedService, "feedService is null");
    }

    @Override
    public void initialize(ValidSyndication uniqueSubscription) {
        //not needed
    }

    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        return feedService.valid(url);
    }
}
