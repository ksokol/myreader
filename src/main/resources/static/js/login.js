$(document).ready(function() {
    $.getJSON("/myreader/api/2/")
    .success(function() {
        window.location.pathname ="/myreader/reader"
    })
});
