package myreader.config;

import static java.nio.file.StandardOpenOption.TRUNCATE_EXISTING;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.ClassPathResource;

/**
 * @author Kamill Sokol
 */
public class SolrHomeUtil {

    private static final String SOLR_HOME_FOLDER_NAME = "myreader-solr";

    public static File loadSolrHomeFromClasspath() throws IOException {
        return new ClassPathResource("/solr/solr.xml").getFile();
    }

    public static File createSolrHomeInFileSystem() throws IOException {
        Path baseHome = getBaseDir();
        Path solrHome = createDirIfNotPresent(baseHome, SOLR_HOME_FOLDER_NAME);
        Path core1 = createDirIfNotPresent(solrHome, "core1");
        Path conf = createDirIfNotPresent(core1, "conf");

        writeToFile(solrHome, "solr.xml", "/solr/solr.xml");
        writeToFile(conf, "schema.xml", "/solr/core1/conf/schema.xml");
        writeToFile(conf, "solrconfig.xml", "/solr/core1/conf/solrconfig.xml");

        return solrHome.resolve("solr.xml").toFile();
    }

    private static Path getBaseDir() {
        Path currentRelativePath = Paths.get("");
        return currentRelativePath.toAbsolutePath();
    }

    private static Path createDirIfNotPresent(Path parent, String dir) throws IOException {
        Path path = parent.resolve(dir);
        if(!Files.exists(path)) {
            Files.createDirectory(path);
        }
        return path;
    }

    private static void writeToFile(final Path path, String toFile, String fromResource) throws IOException {
        Path resolvedPath = path.resolve(toFile);
        if(!Files.exists(resolvedPath)) {
            resolvedPath = Files.createFile(resolvedPath);
        }
        Files.write(resolvedPath, toByteArray(SolrHomeUtil.class.getClass().getResourceAsStream(fromResource)), TRUNCATE_EXISTING);
    }

    private static byte[] toByteArray(InputStream in) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        while (true) {
            int r = in.read(buffer);
            if (r == -1) break;
            out.write(buffer, 0, r);
        }
        return out.toByteArray();
    }
}
