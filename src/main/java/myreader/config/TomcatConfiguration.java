package myreader.config;

import org.apache.catalina.connector.Connector;
import org.apache.catalina.valves.RemoteIpValve;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Kamill Sokol
 */
@Configuration
public class TomcatConfiguration {

    private static final String X_FORWARDED_FOR = "x-forwarded-for";
    private static final String X_FORWARDED_PROTOCOL = "x-forwarded-protocol";
    private static final String AJP = "ajp";
    private static final String AJP_VERSION = "AJP/1.3";
    private int port;

    @Bean
    public EmbeddedServletContainerFactory servletContainer() {
        TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory();
        tomcat.addAdditionalTomcatConnectors(createConnector());
        tomcat.addContextValves(createRemoteIpValves());
        return tomcat;
    }

    private RemoteIpValve createRemoteIpValves() {
        RemoteIpValve remoteIpValve = new RemoteIpValve();
        remoteIpValve.setRemoteIpHeader(X_FORWARDED_FOR);
        remoteIpValve.setProtocolHeader(X_FORWARDED_PROTOCOL);
        return remoteIpValve;
    }

    private Connector createConnector() {
        Connector connector = new Connector(org.apache.coyote.http11.Http11NioProtocol.class.getName());
        connector.setScheme(AJP);
        connector.setProtocol(AJP_VERSION);
        connector.setPort(port);
        return connector;
    }

    public int getPort() {
        return port;
    }

    @Value("${custom.server.ajp.port}")
    @Required
    public void setPort(final int port) {
        this.port = port;
    }
}
