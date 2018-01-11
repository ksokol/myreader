import {createMockStore} from '../../shared/test-utils'
import {installMediaBreakpointActionDispatcher} from './media-breakpoints'

describe('src/app/js/store/common/media-breakpoints.spec.js', () => {

    let store, originalMatchMediaFn, mediaMatchListeners

    const mql = media => {
        return {
            matches: true,
            media
        }
    }

    beforeEach(() => {
        mediaMatchListeners = []
        originalMatchMediaFn = window.matchMedia

        window.matchMedia = mediaQueryString => {
            return {
                matches: false,
                media: mediaQueryString,
                addListener: fn => mediaMatchListeners.push(fn)
            }
        }

        expect(mediaMatchListeners.length).toEqual(0)
        store = createMockStore()
        installMediaBreakpointActionDispatcher(store)
    })

    afterEach(() => window.matchMedia = originalMatchMediaFn)

    it('should dispatch action with media breakpoint set to "phone"', () => {
        mediaMatchListeners[0](mql('(max-width: 599px)'))

        expect(store.getActions()[0]).toEqual({type: 'MEDIA_BREAKPOINT_CHANGED', mediaBreakpoint: 'phone'})
    })

    it('should dispatch action with media breakpoint set to "tablet"', () => {
        mediaMatchListeners[1](mql('(min-width: 600px) and (max-width: 1279px)'))

        expect(store.getActions()[0]).toEqual({type: 'MEDIA_BREAKPOINT_CHANGED', mediaBreakpoint: 'tablet'})
    })

    it('should dispatch action with media breakpoint set to "desktop"', () => {
        mediaMatchListeners[2](mql('(min-width: 1280px)'))

        expect(store.getActions()[0]).toEqual({type: 'MEDIA_BREAKPOINT_CHANGED', mediaBreakpoint: 'desktop'})
    })
})
