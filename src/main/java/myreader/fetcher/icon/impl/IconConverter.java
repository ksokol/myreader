package myreader.fetcher.icon.impl;

import java.io.InputStream;

import myreader.fetcher.icon.IconResult;

public interface IconConverter {

    IconResult convert(InputStream in);

}
