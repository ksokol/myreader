package org.springframework.boot.context.embedded.jetty;

import java.net.InetSocketAddress;

import org.eclipse.jetty.http.HttpVersion;
import org.eclipse.jetty.server.AbstractConnector;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.SecureRequestCustomizer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Kamill Sokol
 */
@Deprecated
@Configuration
public class JettyConfiguration {

    private int port;

    @Bean
    public EmbeddedServletContainerFactory embeddedServletContainerFactory() throws Exception {
        return new JettyEmbeddedServletContainerFactory() {
            @Override
            protected JettyEmbeddedServletContainer getJettyEmbeddedServletContainer(Server server) {
                ServerConnector connector = new ServerConnector(server);
                connector.setPort(port);
                server.addConnector(connector);
                return super.getJettyEmbeddedServletContainer(server);
            }

            // https://github.com/spring-projects/spring-boot/issues/2232
            @Override
            public EmbeddedServletContainer getEmbeddedServletContainer(ServletContextInitializer... initializers) {
                JettyEmbeddedWebAppContext context = new JettyEmbeddedWebAppContext();
                int port = (getPort() >= 0 ? getPort() : 0);
                Server server = new Server(new InetSocketAddress(getAddress(), port));
                configureWebAppContext(context, initializers);
                server.setHandler(context);
                this.logger.info("Server initialized with port: " + port);
                if ( getSsl() != null ) {
                    SslContextFactory sslContextFactory = new SslContextFactory();
                    configureSsl(sslContextFactory, getSsl());
                    AbstractConnector connector = new Jetty9SslServerConnectorFactory().getConnector(server, sslContextFactory, port);
                    server.setConnectors(new Connector[] { connector });
                }
                for ( JettyServerCustomizer customizer : getServerCustomizers() ) {
                    customizer.customize(server);
                }
                return getJettyEmbeddedServletContainer(server);
            }
        };
    };

    @Value("${custom.server.http.port}")
    @Required
    public void setPort(final int port) {
        this.port = port;
    }


    private static interface SslServerConnectorFactory {
        AbstractConnector getConnector(Server server, SslContextFactory sslContextFactory, int port);
    }

    private static class Jetty9SslServerConnectorFactory implements SslServerConnectorFactory {
        @Override
        public ServerConnector getConnector(Server server, SslContextFactory sslContextFactory, int port) {
            HttpConfiguration config = new HttpConfiguration();
            config.setSecureScheme("https");
            config.setSecurePort(port);
            config.addCustomizer(new SecureRequestCustomizer());
            HttpConnectionFactory connectionFactory = new HttpConnectionFactory(config);
            SslConnectionFactory sslConnectionFactory = new SslConnectionFactory(sslContextFactory, HttpVersion.HTTP_1_1.asString());
            ServerConnector serverConnector = new ServerConnector(server, sslConnectionFactory, connectionFactory);
            serverConnector.setPort(port);
            return serverConnector;
        }
    }
}
