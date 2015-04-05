package myreader.web.subscription;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;

import myreader.dto.ExclusionPatternDto;
import myreader.dto.SubscriptionDto;

@Deprecated
public class SubscriptionEditForm {

    private Long id;
    private String url;
    private String title;
    private String tag;
    private List<Exclusion> exclusions = new ArrayList<>();

    public SubscriptionEditForm() {}

    public SubscriptionEditForm(SubscriptionDto subscriptionDto) {
        id = subscriptionDto.getId();
        url = subscriptionDto.getUrl();
        title = subscriptionDto.getTitle();
        tag = subscriptionDto.getTag();

        if(CollectionUtils.isNotEmpty(subscriptionDto.getExclusions())) {
            for (final ExclusionPatternDto exclusionPatternDto : subscriptionDto.getExclusions()) {
                exclusions.add(new Exclusion(exclusionPatternDto));
            }
        }
    }

    public static class Exclusion {
        private String pattern;
        private int hitCount;

        public Exclusion() {}

        public Exclusion(final ExclusionPatternDto exclusionPatternDto) {
            pattern = exclusionPatternDto.getPattern();
            hitCount = exclusionPatternDto.getHitCount();
        }

        public String getPattern() {
            return pattern;
        }

        public void setPattern(String pattern) {
            this.pattern = pattern;
        }

        public int getHitCount() {
            return hitCount;
        }

        public void setHitCount(int hitCount) {
            this.hitCount = hitCount;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public List<Exclusion> getExclusions() {
        return exclusions;
    }

    public void setExclusions(List<Exclusion> exclusions) {
        this.exclusions = exclusions;
    }
}
