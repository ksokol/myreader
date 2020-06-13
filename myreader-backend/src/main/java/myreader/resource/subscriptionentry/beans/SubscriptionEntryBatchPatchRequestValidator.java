package myreader.resource.subscriptionentry.beans;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.List;
import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryBatchPatchRequestValidator implements Validator {

    private static final String MESSAGE = "numeric value out of bounds (<2147483647 digits>.<0 digits> expected)";
    private static final Pattern UUID_PATTERN = Pattern.compile("^[0-9]+$");

    @Override
    public boolean supports(Class<?> clazz) {
        return SubscriptionEntryBatchPatchRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SubscriptionEntryBatchPatchRequest batchRequest = (SubscriptionEntryBatchPatchRequest) target;

        List<SubscriptionEntryPatchRequest> content = batchRequest.getContent();
        if (content == null) {
            errors.rejectValue("content", "NotNull.content", "may not be null");
            return;
        }

        for (int i = 0; i < content.size(); i++) {
            String uuid = content.get(i).getUuid();

            if (!validNumber(uuid))  {
                errors.rejectValue(String.format("content[%d].uuid", i), "Number.uuid", MESSAGE);
            }
        }
    }

    private boolean validNumber(String uuid) {
        if (uuid == null || !UUID_PATTERN.matcher(uuid).matches()) {
            return false;
        }
        try {
            return Integer.parseInt(uuid) >= 0;
        } catch (NumberFormatException exception) {
            return false;
        }
    }
}
