package myreader.fetcher.icon.impl.converter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.impl.IconConverter;
import net.sf.image4j.codec.ico.ICODecoder;
import net.sf.image4j.codec.ico.ICOEncoder;

import org.springframework.stereotype.Component;

@Component
class ICOIconConverter implements IconConverter {

    @Override
    public IconResult convert(InputStream in) {
        IconResult result = null;

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            List<BufferedImage> decoded = ICODecoder.read(in);
            ICOEncoder.write(decoded, out);
            byte[] imageInByte = out.toByteArray();

            if (imageInByte.length > 0) {
                BufferedImage selected = decoded.get(0);

                int w = Integer.MAX_VALUE;
                int h = Integer.MAX_VALUE;

                for (BufferedImage bi : decoded) {
                    if (bi.getWidth() < w || bi.getHeight() < h) {
                        selected = bi;
                    }
                }

                result = new IconResult("image/png", selected);
            }
        } catch (Exception e) {
        }

        return result;
    }
}
