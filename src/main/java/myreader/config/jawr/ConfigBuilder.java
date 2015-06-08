package myreader.config.jawr;

import static net.jawr.web.JawrConstant.BASE64_MAX_IMG_FILE_SIZE;
import static net.jawr.web.config.JawrConfig.JAWR_CSS_CLASSPATH_HANDLE_IMAGE;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
class ConfigBuilder {

    private static final String JAWR_FACTORY_USE_ORPHANS_MAPPER = "jawr.factory.use.orphans.mapper";
    private static final String JAWR_DEBUG_ON = "jawr.debug.on";
    private static final String FALSE_STRING = "false";
    private static final String TRUE_STRING = "true";
    private String currentId;
    private String currentMapping;
    private final Map<String,Properties> propertiesMap;

    ConfigBuilder(boolean debug) {
        this();
        if(debug) {
            add(JAWR_DEBUG_ON, TRUE_STRING);
        }
    }
    ConfigBuilder() {
        this.propertiesMap = new HashMap<>(25);
        add(JAWR_FACTORY_USE_ORPHANS_MAPPER, FALSE_STRING);
    }

    private ConfigBuilder(final ConfigBuilder configBuilder) {
        this.propertiesMap = configBuilder.propertiesMap;
    }

    public ConfigBuilderMappingStep cssBundle(final String value) {
        return bundle(value , Type.CSS);
    }

    public ConfigBuilderMappingStep jsBundle(final String value) {
        return bundle(value , Type.JAVASCRIPT);
    }

    ConfigBuilderMappingStep bundle(final String value, final Type type) {
        Assert.hasText(value);
        Assert.notNull(type);
        currentId = String.format("jawr.%s.bundle.%s.id", type.getType(), value);
        currentMapping = String.format("jawr.%s.bundle.%s.mappings", type.getType(), value);
        add(currentId, String.format("/%s.%s", value, type.getType()));
        add(JAWR_CSS_CLASSPATH_HANDLE_IMAGE, "true");
        add(BASE64_MAX_IMG_FILE_SIZE, "30000000");
        return new ConfigBuilderMappingStep();
    }

    private void add(final String key, final Object value) {
        Assert.notNull(value);

        Properties properties = propertiesMap.get(currentId);

        if(properties == null) {
            properties = new Properties();
            propertiesMap.put(currentId, properties);
        }

        final Object propertyValue = properties.get(key);

        if(propertyValue == null) {
            properties.put(key, value);
        } else {
            properties.put(key, propertyValue.toString() + "," + value);
        }
    }

    public class ConfigBuilderMappingStep {

        public ConfigBuilder and() {
            return new ConfigBuilder(ConfigBuilder.this);
        }

        public ConfigBuilderMappingStep webjar(final String path) {
            Assert.hasText(path);
            mapping("webjars:" + path);
            return this;
        }

        public ConfigBuilderMappingStep jar(final String path) {
            Assert.hasText(path);
            mapping("jar:" + path);
            return this;
        }

        public Properties build() {
            final Properties properties = new Properties();
            for (final Map.Entry<String, Properties> stringPropertiesEntry : propertiesMap.entrySet()) {
                properties.putAll(stringPropertiesEntry.getValue());
            }
            return properties;
        }

        private void mapping(final String value) {
            Assert.hasText(value);
            add(ConfigBuilder.this.currentMapping, value);
        }
    }

    public enum Type {

        CSS("css"), JAVASCRIPT("js");

        private final String type;

        Type(final String type) {
            this.type = type;
        }

        String getType() {
            return type;
        }
    }

}
