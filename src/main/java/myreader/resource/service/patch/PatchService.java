package myreader.resource.service.patch;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface PatchService {

    <T> T patch(PatchSupport patchable, T toPatch);
}
