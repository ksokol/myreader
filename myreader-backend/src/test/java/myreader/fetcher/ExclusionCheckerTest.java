package myreader.fetcher;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class ExclusionCheckerTest {

    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    @Test
    public void testPHPShouldBeExcludedDueToOccurenceInParam1() {
        String param1 = "Free and Open Source PHP Wiki Scripts";
        String param2 = "Unlike many of the Wiki software listed on this page, Dokuwiki does not require you to have MySQL or some other database system for it to work, since it stores its data in plain text files.";

        boolean isExcluded = exclusionChecker.isExcluded(".*php.*", param1, param2);
        assertTrue(isExcluded);
    }

    @Test
    public void testPHPShouldBeExcludedDueToOccurenceInParam2() {
        String param1 = "Free and Open Source Wiki Scripts";
        String param2 = "Unlike many of the PHP Wiki software listed on this page, Dokuwiki does not require you to have MySQL or some other database system for it to work, since it stores its data in plain text files.";

        boolean isExcluded = exclusionChecker.isExcluded(".*php.*", param1, param2);
        assertTrue(isExcluded);
    }

    @Test
    public void testWindows8ShouldBeExcluded() {
        String param1 = "Windows 8: Making VirtualBox and Hyper-V Play Nice";

        boolean isExcluded = exclusionChecker.isExcluded(".*windows 8.*", param1);
        assertTrue(isExcluded);
    }

    @Test
    public void testWindowsPhone8ShouldBeExcluded() {
        String param1 = "Simple Reverse Geocoding - Windows Phone 8 and MVVMLight";

        boolean isExcluded = exclusionChecker.isExcluded(".*windows phone.*", param1);
        assertTrue(isExcluded);

        isExcluded = exclusionChecker.isExcluded(".*windows\\ phone.*", param1);
        assertTrue(isExcluded);
    }

    @Test
    public void testWindowsPhoneShouldNotBeFoundInParam1() {
        String param1 = "Simple Reverse Geocoding - Windows and MVVMLight Phone";

        boolean isExcluded = exclusionChecker.isExcluded(".*windows phone.*", param1);
        assertFalse(isExcluded);
    }

    @Test
    public void testNullParams() {
        boolean isExcluded = exclusionChecker.isExcluded(".*windows phone.*");
        assertFalse(isExcluded);

        isExcluded = exclusionChecker.isExcluded(".*windows phone.*", null);
        assertFalse(isExcluded);

        isExcluded = exclusionChecker.isExcluded(".*windows phone.*", null, null);
        assertFalse(isExcluded);
    }
}
