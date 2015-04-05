package myreader.web.treenavigation;

import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Component;

@Deprecated
@Component
public class TagsTreeNavigationBuilderProvider implements TreeNavigationBuilderProvider {

    @Override
    public boolean support(Object object) {
        if(object == null) {
            return false;
        }

        List l = (List) object;

        if(CollectionUtils.isEmpty(l)) {
            return true;
        }

        return String.class.isAssignableFrom(l.get(0).getClass());
    }

    @Override
    public TreeNavigation build(Object o) {
        TreeNavigation root = new TreeNavigation("all");
        root.setShow(false);

        List<String> tags = (List<String>) o;

        for (String tag : tags) {
            root.add(new TreeNavigation(tag));
        }

        return root;
    }

}
