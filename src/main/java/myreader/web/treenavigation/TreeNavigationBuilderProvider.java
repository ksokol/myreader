package myreader.web.treenavigation;

@Deprecated
public interface TreeNavigationBuilderProvider {

    public boolean support(Object object);

    public TreeNavigation build(Object o);

}
