package myreader.resource.subscription.validation;

import myreader.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author Kamill Sokol
 */
@Component
public class UniqueSubscriptionValidator implements ConstraintValidator<UniqueSubscription, String> {

    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public UniqueSubscriptionValidator(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    public void initialize(UniqueSubscription uniqueSubscription) {
        //not needed
    }

    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        return subscriptionRepository.findByFeedUrlAndCurrentUser(url) == null;
    }
}
