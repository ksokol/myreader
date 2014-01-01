package myreader.fetcher.impl;


/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
public class EntryLinkSanitizer {

    public static String sanitize(String entryLink, String feedLink) {
        if(entryLink == null || feedLink == null) {
            return "";
        }

        if(entryLink.matches("^http(s)?://.*")) {
            return entryLink;
        }

        String sep = (entryLink.startsWith("/") || feedLink.startsWith("/")) ? "" : "/";

        return String.format("%s%s%s", feedLink, sep, entryLink);
    }

}
