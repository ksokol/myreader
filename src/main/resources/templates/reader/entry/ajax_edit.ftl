<form method="post" action="" class="form-horizontal">
    <p class="lead">${entry.title?html}</p>
    <input type="hidden" name="id" value="${entry.id?string.computer}">

    <div class="control-group">
        <label class="control-label" for="tag">Tag</label>
        <div class="controls">
            <#if entry.tag??>
                <#assign tag = "${entry.tag?html}">
            <#else>
                <#assign tag></#assign>
            </#if>
            <input name="tag" value="${tag}" class="typeahead" type="text" data-provide="typeahead" data-source="${myreader.toJSON(tags)}" autocomplete="off" />
        </div>
    </div>

    <div class="control-group">
        <label class="control-label" for="unseen"></label>
        <div class="controls">
            <div class="btn-group" data-toggle="buttons-radio">
            <#if entry.unseen == "true">
                <button type="button" class="btn active reader-read-button" data-unseen="true"><i class="icon-eye-open"></i></button>
                <button type="button" class="btn reader-read-button" data-unseen="false"><i class="icon-eye-close"></i></button>
            </#if>
            <#if entry.unseen == "false">
                <button type="button" class="btn reader-read-button" data-unseen="true"><i class="icon-eye-open"></i></button>
                <button type="button" class="btn active reader-read-button" data-unseen="false"><i class="icon-eye-close"></i></button>
            </#if>
            </div>

            <input id="unseen" name="unseen" value="${entry.unseen}" type="hidden" />
        </div>
    </div>
</form>
