package myreader.web.treenavigation;

import myreader.web.SubscriptionDto;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;

@Deprecated
@Component
public class SubscriptionTreeNavigationBuilderProvider implements TreeNavigationBuilderProvider {

    @Override
    public boolean support(Object object) {
        if(object == null) {
            return false;
        }

        List l = (List) object;

        if(CollectionUtils.isEmpty(l)) {
            return true;
        }

        return SubscriptionDto.class.isAssignableFrom(((List) object).get(0).getClass());
    }

    @Override
    public TreeNavigation build(Object o) {
        List<SubscriptionDto> list = (List<SubscriptionDto>) o;
        TreeNavigation root = new TreeNavigation("all");
        Set<String> set = new TreeSet<>();

        for (SubscriptionDto dto : list) {
            if (dto.getTag() != null && !"".equals(dto.getTag())) {
                set.add(dto.getTag());
            }
        }

        for (String tag : set) {
            root.add(new TreeNavigation(tag));
        }

        for (SubscriptionDto dto : list) {
            if (dto.getTag() != null && !"".equals(dto.getTag())) {
                TreeNavigation tn = new TreeNavigation(dto.getTitle());
                tn.setUnseen(dto.getUnseen());

                for (TreeNavigation nav : root) {
                    if (dto.getTag().equals(nav.getName())) {
                        nav.add(tn);
                        continue;
                    }
                }
            } else {
                TreeNavigation tn = new TreeNavigation(dto.getTitle());
                tn.setUnseen(dto.getUnseen());
                root.add(tn);
            }
        }

        return root;
    }
}
