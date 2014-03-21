/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package myreader.fetcher.impl;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;

/**
 * This socket factory will create ssl socket that accepts self signed certificate
 *
 * @author olamy
 */
public class EasySSLSocketFactory extends SSLSocketFactory {

    private SSLContext sslcontext = null;
    private final int connTimeout;
    private final int soTimeout;

    public EasySSLSocketFactory(int soTimeout, int connTimeout) {
        this.soTimeout = soTimeout;
        this.connTimeout = connTimeout;
    }

    public static SSLContext createEasySSLContext() throws IOException {
        try {
            SSLContext context = SSLContext.getInstance("TLS");
            context.init(null, new TrustManager[] { new EasyX509TrustManager(null) }, null);
            return context;
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }

    public SSLContext getSSLContext() throws IOException {
        if (this.sslcontext == null) {
            this.sslcontext = createEasySSLContext();
        }
        return this.sslcontext;
    }

    public Socket connectSocket(String host, int port, InetAddress localAddress, int localPort) throws IOException {
        int connTimeout = 0;
        int soTimeout = 0;

        InetSocketAddress remoteAddress = new InetSocketAddress(host, port);
        SSLSocket sslsock = (SSLSocket) createSocket();

        if ((localAddress != null) || (localPort > 0)) {
            // we need to bind explicitly
            if (localPort < 0) {
                localPort = 0; // indicates "any"
            }
            InetSocketAddress isa = new InetSocketAddress(localAddress, localPort);
            sslsock.bind(isa);
        }

        sslsock.connect(remoteAddress, connTimeout);
        sslsock.setSoTimeout(soTimeout);
        return sslsock;
    }

    @Override
    public Socket createSocket(String s, int i) throws IOException {
        return connectSocket( s,i,null,-1);
    }

    @Override
    public Socket createSocket(String s, int i, InetAddress inetAddress, int i2) throws IOException {
        return connectSocket(s,i,inetAddress,i2);
    }

    @Override
    public Socket createSocket(InetAddress inetAddress, int i) throws IOException {
        return getSSLContext().getSocketFactory().createSocket(inetAddress, i);
    }

    @Override
    public Socket createSocket(InetAddress inetAddress, int i, InetAddress inetAddress2, int i2) throws IOException {
        return getSSLContext().getSocketFactory().createSocket(inetAddress, i, inetAddress2, i2);
    }

    @Override
    public String[] getDefaultCipherSuites() {
        return new String[0];
    }

    @Override
    public String[] getSupportedCipherSuites() {
        return new String[0];
    }

    public Socket createSocket(Socket socket, String host, int port, boolean autoClose) throws IOException {
        return getSSLContext().getSocketFactory().createSocket(socket, host, port, autoClose);
    }
}
