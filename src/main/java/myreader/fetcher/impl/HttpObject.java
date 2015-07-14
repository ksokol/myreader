package myreader.fetcher.impl;

import java.io.InputStream;

public class HttpObject {
	private String url;
	private String method;
	private int returnCode;
	private String lastModified;
	private InputStream responseBody;

	public HttpObject(String url, String method, String lastModified) {
		this.url = url;
		this.lastModified = lastModified;

		if(method == null) {
			throw new IllegalArgumentException("method must not be null");
		}
		this.method = method.toUpperCase();
	}

	public HttpObject(String url) {
		this.url = url;
		this.method = "GET";
		this.lastModified = "0";
	}

	public int getReturnCode() {
		return returnCode;
	}

	public void setReturnCode(int returnCode) {
		this.returnCode = returnCode;
	}

	public String getLastModified() {
		return lastModified;
	}

	public void setLastModified(String lastModified) {
		this.lastModified = lastModified;
	}

	public InputStream getResponseBody() {
		return responseBody;
	}

	public void setResponseBody(InputStream responseBody) {
		this.responseBody = responseBody;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		if(method == null) {
			throw new IllegalArgumentException("method must not be null");
		}
		this.method = method.toUpperCase();
	}
}
