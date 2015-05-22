package myreader.fetcher.icon;

public class IconResult {

    private final String mimeType;
    private final String icon;

    public IconResult(String mimeType, String icon) {
        this.mimeType = mimeType;
        this.icon = icon;
    }

    public String getMimeType() {
        return mimeType;
    }

    public String getIcon() {
        return icon;
    }

    public String asDataUrl() {
        return "data:" + mimeType + ";base64,"+icon;
    }
}
