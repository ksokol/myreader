<#import "../layout/reader.ftl" as layout>
<#import "error.ftl" as errors>

<@layout.reader>
    <form action="" method="post" class="span8">
        <#if subscriptionEditForm.id??>
            <input name="id" type="hidden" value="${subscriptionEditForm.id?string.computer}">
        </#if>

        <#if isNew>
            <legend>Add</legend>
        <#else>
            <legend>Edit</legend>
        </#if>

        <fieldset>
            <#if !isNew>
                <div class="control-group">
                    <label class="control-label" for="title">Title</label>
                    <div class="controls">
                        <input name="title" value="${subscriptionEditForm.title?html}" class="span5" type="text" autocomplete="off" />
                        <span class="help-inline"><@errors.errors path = "title"></@errors.errors></span>
                    </div>
                </div>
            </#if>

            <#if !isNew>
                <div class="control-group">
                    <label class="control-label" for="url">Url</label>
                    <div class="controls">
                        <input name="url" value="${subscriptionEditForm.url}" class="span5" readonly="true" type="text" autocomplete="off" />
                    </div>
                </div>
            <#else>
                <div class="control-group">
                    <label class="control-label" for="url">Url</label>
                    <div class="controls">
                        <#--<sf:input path="url" class="span5" autocomplete="off" />-->
                        <input name="url" value="" class="span5" type="text" autocomplete="off" />
                        <span class="help-inline"><@errors.errors path = "url" /></span>
                    </div>
                </div>
            </#if>

            <div class="control-group">
                <label class="control-label" for="tag">Tag</label>
                <div class="controls">
                       <#if subscriptionEditForm.tag??>
                        <#assign tag = "${subscriptionEditForm.tag?html}">
                       <#else>
                           <#assign tag></#assign>
                       </#if>
                    <input name="tag" value="${tag}" class="typeahead span5" type="text" data-provide="typeahead" data-source='${myreader.toJSON(tags)}' autocomplete="off" />
                    <span class="help-inline"><@errors.errors path = "tag" /></span>
                </div>
            </div>
            <#if !isNew>
                <div class="control-group">
                    <h4>Exclusions</h4>

                    <table class="table table-exclusions">
                        <colgroup>
                            <col width="85%">
                            <col width="5%">
                            <col width="10%">
                        </colgroup>
                        <thead>
                        <tr>
                            <th></th>
                            <th>hits</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            <#list subscriptionEditForm.exclusions as exclusion>
                                <tr>
                                    <td>
                                        <input type="text" autocomplete="off" name="exclusions[${exclusion_index}].pattern" value="${exclusion.pattern?html}" />
                                    </td>
                                    <td>
                                        ${exclusion.hitCount}
                                    </td>
                                    <td>
                                        <a href="#" class="btn btn-danger btn-delete-exclusion">delete</a>
                                    </td>
                                </tr>
                            </#list>
                        </tbody>
                    </table>

                    <a class="btn btn-add-exclusion" href="#">add</a>
                </div>
            </#if>
            <div class="form-actions">
                <#if !isNew>
                    <div class="pull-left">
                        <a id="delete-subscription" href="${requestContext.getContextUrl("/web/subscription/edit?id=${subscriptionEditForm.id?string.computer}&delete")}" class="btn btn-danger">Delete</a>
                    </div>
                </#if>

                <div class="pull-right">
                    <a href="${requestContext.getContextUrl("/web/subscription")}" class="btn">Close</a>
                    <input type="submit" class="btn btn-primary" value="Save">
                </div>
            </div>
        </fieldset>
    </form>
</@layout.reader>
