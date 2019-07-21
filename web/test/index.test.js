function add(a, b) {
  return a + b;
}

function m(a, b) {
  return a - b;
}

describe('算数测试', () => {
  describe('加法测试', () => {
    it('1 + 1应该等于2', () => {
      expect(add(1, 1)).toBe(2);
    });

    it('1 + 2应该等于3', () => {
      expect(add(1, 2)).toBe(3);
    });
  });

  describe('减法测试', () => {
    it('2 - 1应该等于1', () => {
      expect(m(2, 1)).toBe(1);
    });

    it('3 - 1应该等于2', () => {
      expect(m(3, 1)).toBe(2);
    });
  });
});
