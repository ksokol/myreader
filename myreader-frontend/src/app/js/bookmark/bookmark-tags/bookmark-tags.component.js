import template from './bookmark-tags.component.html'
import './bookmark-tags.component.css'

export const BookmarkTagsComponent = {
    template,
    bindings: {
        myTags: '<',
        mySelected: '<',
        myOnSelect: '&'
    }
}
