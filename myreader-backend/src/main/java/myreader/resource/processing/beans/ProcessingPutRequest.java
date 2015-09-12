package myreader.resource.processing.beans;

import myreader.resource.processing.validation.ValidProcess;

/**
 * @author Kamill Sokol
 */
public class ProcessingPutRequest {

    @ValidProcess
    private String process;

    public String getProcess() {
        return process;
    }

    public void setProcess(final String process) {
        this.process = process;
    }
}
