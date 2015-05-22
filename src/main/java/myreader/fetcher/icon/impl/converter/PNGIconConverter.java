package myreader.fetcher.icon.impl.converter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.impl.IconConverter;

@Component
class PNGIconConverter implements IconConverter {

    @Override
    public IconResult convert(InputStream in) {
        IconResult result = null;

        try {
            BufferedImage bi = ImageIO.read(in);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "png", baos);
            String base64 = DatatypeConverter.printBase64Binary(baos.toByteArray());

            if (StringUtils.hasText(base64)) {
                result = new IconResult("image/png", base64);
            }
        } catch (Exception e) {
        }

        return result;
    }
}
