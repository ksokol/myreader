package myreader.web.treenavigation;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class TreeNavigation implements Iterable<TreeNavigation> {

    private String name;
    private long unseen;
    private boolean selected;
    private boolean show = true;
    private List<TreeNavigation> navigationItems = new ArrayList<TreeNavigation>();

    public TreeNavigation() {
        this.name = "root";
    }

    public TreeNavigation(String name) {
        this.name = name;
    }

    public TreeNavigation(String name, boolean selected) {
        this.name = name;
        this.selected = selected;
    }

    public boolean isSelected() {
        if (this.isHasSelectedNavigationItems()) return false;
        return this.selected;
    }

    public boolean isHasSelectedNavigationItems() {
        for (TreeNavigation item : this.navigationItems) {
            if (item.isSelected()) return true;
        }

        return false;
    }

    public boolean isHasNavigationItems() {
        return this.navigationItems.size() == 0 ? false : true;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public void add(TreeNavigation tn) {
        this.navigationItems.add(tn);
    }

    public String getTitle() {
        long tmp = this.getUnseen();

        if (tmp > 0) {
            return this.name + " (" + tmp + ")";
        } else {
            return this.name;
        }
    }

    public long getUnseen() {
        long tmp = 0;
        for (TreeNavigation tn : this.navigationItems) {
            tmp += tn.getUnseen();
        }

        return tmp + this.unseen;
    }

    public void setUnseen(long unseen) {
        this.unseen = unseen;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isShow() {
        return show;
    }

    public void setShow(boolean show) {
        this.show = show;
    }

    public void setNavigationItems(List<TreeNavigation> navigationItems) {
        this.navigationItems = navigationItems;
    }

    public List<TreeNavigation> getNavigationItems() {
        return navigationItems;
    }

    @Override
    public Iterator<TreeNavigation> iterator() {
        return this.navigationItems.iterator();
    }

    public Iterator<TreeNavigation> getIterator() {
        return this.navigationItems.iterator();
    }
}
