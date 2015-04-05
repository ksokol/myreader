package myreader.web.treenavigation;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

public class TreeNavigationTest {

    TreeNavigation navigation;

    @Before
    public void setUp() throws Exception {
        navigation = new TreeNavigation();
    }

    @Test
    public void testAdd() {
        navigation.add(new TreeNavigation("nav1"));
        navigation.add(new TreeNavigation("nav2"));

        assertTrue(navigation.getNavigationItems().size() == 2);
    }

    @Test
    public void testIsSelected_selectedNavigation() {
        navigation.setSelected(true);

        assertTrue(navigation.isSelected());
    }

    @Test
    public void testIsSelected_selectedChildNavigationItem() {
        navigation.setSelected(true);
        navigation.add(new TreeNavigation("nav1", true));

        assertFalse(navigation.isSelected());
    }

    @Test
    public void testIsSelectedNavigationItems_selectedChildNavigationItem() {
        navigation.add(new TreeNavigation("nav1", true));

        assertTrue(navigation.isHasSelectedNavigationItems());
    }

    @Test
    public void testIsSelectedNavigationItems_selectedChildNavigationItemWithDeselected() {
        navigation.add(new TreeNavigation("nav1", true));
        navigation.add(new TreeNavigation("nav2"));

        assertTrue(navigation.isHasSelectedNavigationItems());
    }

    @Test
    public void testIsSelectedNavigationItems_withoutSelectedChildNavigationItems() {
        navigation.add(new TreeNavigation("nav1"));
        navigation.add(new TreeNavigation("nav2"));

        assertFalse(navigation.isHasSelectedNavigationItems());
    }

}
