package myreader.resource.feed.beans;

import myreader.service.feed.FeedService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public class FeedPatchRequestValidator implements Validator {

    private static final Pattern URL_PATTERN = Pattern.compile("^https?://.*");
    private static final String FIELD_NAME = "url";

    private final FeedService feedService;

    public FeedPatchRequestValidator(FeedService feedService) {
        this.feedService = Objects.requireNonNull(feedService, "feedService is null");
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return FeedPatchRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        FeedPatchRequest request = (FeedPatchRequest) target;

        String title = request.getTitle();
        if (StringUtils.isBlank(title)) {
            errors.rejectValue("title", "NotBlank.title", "may not be empty");
        }

        String url = request.getUrl();
        if (url == null || !URL_PATTERN.matcher(url).matches()) {
            errors.rejectValue(FIELD_NAME, "Pattern.url", "must begin with http(s)://");
            return;
        }
        if (!feedService.valid(url)) {
            errors.rejectValue(FIELD_NAME, "ValidSyndication.url", "invalid syndication feed");
        }
    }
}
