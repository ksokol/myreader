package myreader.fetcher.icon.impl.converter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.impl.IconConverter;
import net.sf.image4j.codec.bmp.BMPDecoder;
import net.sf.image4j.codec.ico.ICOEncoder;

import org.springframework.stereotype.Component;

@Component
class BMPIconConverter implements IconConverter {

    @Override
    public IconResult convert(InputStream in) {
        IconResult result = null;

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            BufferedImage decoded = BMPDecoder.read(in);
            ICOEncoder.write(decoded, out);
            byte[] imageInByte = out.toByteArray();

            if (imageInByte.length > 0) {
                result = new IconResult("image/bmp", decoded);
            }
        } catch (Exception e) {
        }

        return result;
    }
}
