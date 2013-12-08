package myreader.fetcher.icon;

import java.awt.image.BufferedImage;

public class IconResult {

    private final String mimeType;
    private final BufferedImage icon;

    public IconResult(String mimeType, BufferedImage icon) {
        this.mimeType = mimeType;
        this.icon = icon;
    }

    public String getMimeType() {
        return mimeType;
    }

    public BufferedImage getIcon() {
        return icon;
    }
}
