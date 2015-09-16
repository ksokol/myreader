package myreader.resource.service.patch;

import java.util.HashSet;
import java.util.Set;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class PatchSupport {

    private final Set<String> patchedFields = new HashSet<String>();

    protected void addPatchedField(String fieldName) {
        patchedFields.add(fieldName);
    }

    public boolean isFieldPatched(String fieldName) {
        return patchedFields.contains(fieldName);
    }
}
