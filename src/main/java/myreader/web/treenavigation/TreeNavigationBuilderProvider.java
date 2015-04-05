package myreader.web.treenavigation;

public interface TreeNavigationBuilderProvider {

    public boolean support(Object object);

    public TreeNavigation build(Object o);

}
