package myreader.web.subscription;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.EntityNotFoundException;
import myreader.service.subscription.SubscriptionService;
import myreader.service.user.UserService;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Transactional
@Deprecated
@Controller
@RequestMapping("web/subscription/edit")
class SubscriptionEditController {

    private final SubscriptionEditFormValidator validator = new SubscriptionEditFormValidator();

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ExclusionRepository exclusionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SubscriptionService subscriptionService;

    @ModelAttribute("isNew")
    boolean model(@RequestParam(required = false) Long id) {
        return (id == null) ? true : false;
    }

    @ModelAttribute("tags")
    Collection<String> model() {
        final User currentUser = userService.getCurrentUser();
        return subscriptionRepository.findDistinctTags(currentUser.getId());
    }

    @RequestMapping(method = RequestMethod.GET)
    String editGet(@RequestParam(required = false) Long id, Map<String, Object> model, Authentication authentication) {
        if (id == null) {
            model.put("subscriptionEditForm", new SubscriptionEditForm());
        } else {
            Subscription s = subscriptionRepository.findByIdAndUsername(id, authentication.getName());

            if(s == null) {
                model.put("subscriptionEditForm", new SubscriptionEditForm());
            } else {
                SubscriptionEditForm form = new SubscriptionEditForm(s);

                final List<ExclusionPattern> exclusionPatterns = exclusionRepository.findAllSetsBySubscriptionAndUser(s.getId(), userService.getCurrentUser().getId());
                List<SubscriptionEditForm.Exclusion> exclusions = new ArrayList<>(exclusionPatterns.size());

                for (final ExclusionPattern exclusionPattern : exclusionPatterns) {
                    exclusions.add(new SubscriptionEditForm.Exclusion(exclusionPattern));
                }

                form.setExclusions(exclusions);
                model.put("subscriptionEditForm", form);
            }
        }

        return "subscription/edit";
    }

    @RequestMapping(method = RequestMethod.POST)
    String submit(@ModelAttribute("subscriptionEditForm") SubscriptionEditForm subscriptionEditForm,
                  BindingResult errors, RedirectAttributes flash, Map<String, Object> model) throws Exception {

        validator.validate(subscriptionEditForm, errors);
        if (errors.hasErrors()) {
            model.put("bindingResult", errors);
            return "subscription/edit";
        }

        Set<String> map = new TreeSet<>();

        if(CollectionUtils.isNotEmpty(subscriptionEditForm.getExclusions())) {
            for (final SubscriptionEditForm.Exclusion exclusion : subscriptionEditForm.getExclusions()) {
                map.add(exclusion.getPattern());
            }
        }

        if (subscriptionEditForm.getId() == null) {
            Subscription subscription = subscriptionService.subscribe(userService.getCurrentUser().getId(), subscriptionEditForm.getUrl());
            subscription.setTag(subscriptionEditForm.getTag());
            subscriptionRepository.save(subscription);
            flash.addFlashAttribute("flash", "Subscription created");
        } else {
            Subscription subscription = subscriptionService.findById(subscriptionEditForm.getId());

            if(subscription == null) {
                throw new EntityNotFoundException();
            }

            subscription.setTag(subscriptionEditForm.getTag());
            if(StringUtils.isNotBlank(subscriptionEditForm.getTitle())) {
                subscription.setTitle(subscriptionEditForm.getTitle());
            }

            subscriptionRepository.save(subscription);

            List<ExclusionPattern> patterns = exclusionRepository.findAllSetsBySubscriptionAndUser(subscription.getId(), userService.getCurrentUser().getId());

            OUTER:
            for (final String s : map) {
                for (ExclusionPattern ep : patterns) {
                    if (ep.getPattern().equals(s)) {
                        continue OUTER;
                    }
                }
                ExclusionPattern pattern1 = new ExclusionPattern(s);
                pattern1.setSubscription(subscription);
                exclusionRepository.save(pattern1);
            }

            Map<String, ExclusionPattern> subscriptionPatterns = new HashMap<>();
            for (final ExclusionPattern exclusionPattern : patterns) {
                subscriptionPatterns.put(exclusionPattern.getPattern(), exclusionPattern);
            }

            for (String pattern : map) {
                if (subscriptionPatterns.containsKey(pattern)) {
                    subscriptionPatterns.remove(pattern);
                }
            }
            exclusionRepository.delete(subscriptionPatterns.values());
            flash.addFlashAttribute("flash", "Subscription updated");
        }

        return "redirect:/web/subscription";
    }

    @RequestMapping(method = RequestMethod.GET, params = "delete")
    String delete(@ModelAttribute("subscriptionEditForm") SubscriptionEditForm subscriptionEditForm, RedirectAttributes flash, Authentication authentication) {
        final Subscription subscription = subscriptionRepository.findByIdAndUsername(subscriptionEditForm.getId(), authentication.getName());

        if (subscription == null) {
            throw new EntityNotFoundException();
        }

        subscriptionRepository.delete(subscription);
        flash.addFlashAttribute("flash", "Subscription deleted");
        return "redirect:/web/subscription";
    }
}
