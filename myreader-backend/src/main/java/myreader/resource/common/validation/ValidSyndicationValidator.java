package myreader.resource.common.validation;

import myreader.service.feed.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author Kamill Sokol
 */
@Component
public class ValidSyndicationValidator implements ConstraintValidator<ValidSyndication, String> {

    private final FeedService feedService;

    @Autowired
    public ValidSyndicationValidator(final FeedService feedService) {
        this.feedService = feedService;
    }

    @Override
    public void initialize(ValidSyndication uniqueSubscription) {}

    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        return feedService.valid(url);
    }
}
