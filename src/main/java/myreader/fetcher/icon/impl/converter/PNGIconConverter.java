package myreader.fetcher.icon.impl.converter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import javax.imageio.ImageIO;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.impl.IconConverter;

import org.springframework.stereotype.Component;

@Component
class PNGIconConverter implements IconConverter {

    @Override
    public IconResult convert(InputStream in) {
        IconResult result = null;

        try {
            BufferedImage bi = ImageIO.read(in);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "png", baos);
            byte[] imageInByte = baos.toByteArray();

            if (imageInByte.length > 0) {
                result = new IconResult("image/png", bi);
            }
        } catch (Exception e) {
        }

        return result;
    }
}
