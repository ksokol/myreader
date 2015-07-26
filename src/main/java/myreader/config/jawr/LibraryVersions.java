package myreader.config.jawr;

/**
 * @author Kamill Sokol
 */
enum LibraryVersions {

    ANGULAR_MATERIAL("0.9.7"),
    ANGULAR_HOTKEYS("1.4.5");

    private final String version;

    LibraryVersions(final String version) {
        this.version = version;
    }

    public String version() {
        return version;
    }
}
