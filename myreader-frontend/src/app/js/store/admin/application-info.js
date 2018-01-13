const noApplicationInfo = {
    git: {
        branch: 'not available',
        commit: {
            id: 'not available'
        }
    },
    build: {
        version: 'not available',
        time: ''
    }
}

export function toApplicationInfo(raw = noApplicationInfo) {
    const {git, build} = raw
    return {
        branch: git.branch,
        commitId: git.commit.id,
        version: build.version,
        buildTime: build.time
    }
}
