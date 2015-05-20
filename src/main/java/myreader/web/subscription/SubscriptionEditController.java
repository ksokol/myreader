package myreader.web.subscription;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import myreader.dto.SubscriptionDto;
import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.service.EntityNotFoundException;
import myreader.subscription.web.SubscriptionApi;

@Deprecated
@Controller
@RequestMapping("web/subscription/edit")
class SubscriptionEditController {

    private final SubscriptionEditFormValidator validator = new SubscriptionEditFormValidator();

    @Autowired
    private SubscriptionApi subscriptionApi;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @ModelAttribute("isNew")
    boolean model(@RequestParam(required = false) Long id) {
        return (id == null) ? true : false;
    }

    @ModelAttribute("tags")
    Collection<String> model() {
        final Collection<String> tags = subscriptionApi.distinct("tag");

        return tags;
    }

    @RequestMapping(method = RequestMethod.GET)
    String editGet(@RequestParam(required = false) Long id, Map<String, Object> model, Authentication authentication) {

        if (id == null) {
            model.put("subscriptionEditForm", new SubscriptionEditForm());
        } else {

            try {
                final SubscriptionDto subscriptionDto = subscriptionApi.findById(id, authentication);
                SubscriptionEditForm form = new SubscriptionEditForm(subscriptionDto);
                model.put("subscriptionEditForm", form);
            } catch (EntityNotFoundException e) {
                model.put("subscriptionEditForm", new SubscriptionEditForm());
            }
        }

        return "subscription/edit";
    }

    @RequestMapping(method = RequestMethod.POST)
    String submit(@ModelAttribute("subscriptionEditForm") SubscriptionEditForm subscriptionEditForm,
            BindingResult errors, RedirectAttributes flash, Authentication principal, Map<String, Object> model) throws Exception {

        validator.validate(subscriptionEditForm, errors);
        if (errors.hasErrors()) {
            model.put("bindingResult", errors);
            return "subscription/edit";
        }

        Map<String, Object> map = new HashMap<>();

        if(StringUtils.isNotBlank(subscriptionEditForm.getUrl())) {
            map.put("url", subscriptionEditForm.getUrl());
        }

        if(StringUtils.isNotBlank(subscriptionEditForm.getTag())) {
            map.put("tag", subscriptionEditForm.getTag());
        }

        if(StringUtils.isEmpty(subscriptionEditForm.getTag())) {
            map.put("tag", null);
        }

        if(StringUtils.isNotBlank(subscriptionEditForm.getTitle())) {
            map.put("title", subscriptionEditForm.getTitle());
        }

        if(CollectionUtils.isNotEmpty(subscriptionEditForm.getExclusions())) {
            List<Map<String, String>> exclusions = new ArrayList<>();
            for (final SubscriptionEditForm.Exclusion exclusion : subscriptionEditForm.getExclusions()) {
                Map<String, String> pattern = new HashMap<>(3);
                pattern.put("pattern", exclusion.getPattern());
                exclusions.add(pattern);
            }
            map.put("exclusions", exclusions);
        }

        if (subscriptionEditForm.getId() == null) {
            subscriptionApi.post(map, principal);
            flash.addFlashAttribute("flash", "Subscription created");
        } else {
            subscriptionApi.editPost(subscriptionEditForm.getId(), map);
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
