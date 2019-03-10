function ColorPicker(node, init) {
  return {
    ...init,
    on: jest.fn(),
    off: jest.fn()
  }
}

export default {
  ColorPicker
}
