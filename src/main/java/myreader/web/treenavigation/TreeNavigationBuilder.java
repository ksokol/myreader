package myreader.web.treenavigation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Deprecated
@Component
public class TreeNavigationBuilder {

    @Autowired
    private List<TreeNavigationBuilderProvider> treeNavigationBuilderProvider = new ArrayList<>();

    public TreeNavigation build(Object object) {
        for (TreeNavigationBuilderProvider provider : this.treeNavigationBuilderProvider) {
            if (provider.support(object)) {
                return provider.build(object);
            }
        }

        return null;
    }

}
