package myreader.resource.service.patch;

import org.springframework.util.Assert;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
class PatchServiceImpl implements PatchService {

    @Override
    public <T> T patch(PatchSupport patchable, T toPatch) {
        Assert.notNull(patchable);
        Assert.notNull(toPatch);

        //TODO

        return toPatch;
    }
}
