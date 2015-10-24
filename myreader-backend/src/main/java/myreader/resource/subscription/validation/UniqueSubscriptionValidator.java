package myreader.resource.subscription.validation;

import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.service.user.UserService;
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
    private final UserService userService;

    @Autowired
    public UniqueSubscriptionValidator(SubscriptionRepository subscriptionRepository, UserService userService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userService = userService;
    }

    @Override
    public void initialize(UniqueSubscription uniqueSubscription) {
        //not needed
    }

    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findByUsernameAndFeedUrl(currentUser.getEmail(), url);
        return subscription == null;
    }
}
