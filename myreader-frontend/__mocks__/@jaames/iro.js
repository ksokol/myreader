const on = jest.fn()
const off = jest.fn()

beforeEach(() => {
  on.mockReset()
  off.mockReset()
})

function ColorPicker(node, init) {
  return {
    ...init,
    on,
    off
  }
}

export default {
  ColorPicker,
  mock: {
    onChange: hexString => on.mock.calls[0][1]({hexString}),
  }
}
