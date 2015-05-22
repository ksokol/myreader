package myreader.fetcher.icon.impl.converter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import javax.xml.bind.DatatypeConverter;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.impl.IconConverter;
import net.sf.image4j.codec.bmp.BMPDecoder;
import net.sf.image4j.codec.ico.ICOEncoder;

@Component
class BMPIconConverter implements IconConverter {

    @Override
    public IconResult convert(InputStream in) {
        IconResult result = null;

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            BufferedImage decoded = BMPDecoder.read(in);

            ICOEncoder.write(decoded, baos);
            String base64 = DatatypeConverter.printBase64Binary(baos.toByteArray());

            if ( StringUtils.hasText(base64) ) {
                result = new IconResult("image/bmp", base64);
            }
        } catch ( Exception e ) {
        }

        return result;
    }
}
