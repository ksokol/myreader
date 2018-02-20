import {toApplicationInfo} from './application-info'

describe('src/app/js/store/admin/application-info.spec.js', () => {

    it('should return default application data when raw data is undefined', () => {
        expect(toApplicationInfo()).toEqual({
            branch: 'not available',
            commitId: 'not available',
            version: 'not available',
            buildTime: ''
        })
    })

    it('should convert raw data', () => {
        const raw = {
            git: {
                commit: {
                    id: 'aec45'
                },
                branch: 'a-branch-name'
            },
            build: {
                version: '1.0',
                time: '2017-05-16T12:07:26Z'
            }
        }

        expect(toApplicationInfo(raw)).toEqual({
            branch: 'a-branch-name',
            commitId: 'aec45',
            version: '1.0',
            buildTime: '2017-05-16T12:07:26Z'
        })
    })
})
