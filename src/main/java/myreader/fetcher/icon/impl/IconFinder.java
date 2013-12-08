package myreader.fetcher.icon.impl;

import myreader.fetcher.icon.IconResult;

import org.springframework.core.Ordered;

public interface IconFinder extends Ordered {

    IconResult find(String url);
}
