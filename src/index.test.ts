import LruCache from './index';

interface Person {
  firstName: string;
  lastName: string;
  dob: Date;
}

describe('LruCache', () => {
  it('initializes the cache correctly', () => {
    const c = new LruCache<string, string>();

    expect(c.size).toEqual(0);
    expect(c.getLruValue()).toEqual(undefined);
    expect(c.getMruValue()).toEqual(undefined);
  });

  it('caches max 1 item when cache is initialized with default capacity or sub-minimal capacity', () => {
    const c = new LruCache<string, string>();

    c.put('a', 'aaaaa');
    c.put('b', 'bbbbb');
    expect(c.size).toEqual(1);

    const d = new LruCache<string, string>(0);

    d.put('a', 'aaaaa');
    d.put('b', 'bbbbb');
    expect(d.size).toEqual(1);
  });

  it('caches 1 value correctly', () => {
    const c = new LruCache<string, string>(1);

    c.put('a', 'aaaaa'); // a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(1);

    c.put('b', 'bbbbb'); // b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('bbbbb');
    expect(c.get('a')).toEqual(undefined);
    expect(c.size).toEqual(1);
  });

  it('maintains order correctly after accessing the same key', () => {
    const c = new LruCache<string, string>(3);

    c.put('a', 'aaaaa'); // a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(1);

    c.put('b', 'bbbbb'); // b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('bbbbb');
    expect(c.size).toEqual(2);

    expect(c.get('a')).toEqual('aaaaa'); // a b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(2);

    // Get the same key again
    expect(c.get('a')).toEqual('aaaaa'); // a b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(2);
  });

  it('caches serveral values orderly and correctly', () => {
    const c = new LruCache<string, string>(5);

    c.put('a', 'aaaaa'); // a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('aaaaa');
    c.put('b', 'bbbbb'); // b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('bbbbb');
    c.put('c', 'ccccc'); // c b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('ccccc');
    c.put('d', 'ddddd'); // d c b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('ddddd');
    c.put('e', 'eeeee'); // e d c b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('eeeee');
    expect(c.size).toEqual(5);

    expect(c.get('a')).toEqual('aaaaa'); // a e d c b
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.get('b')).toEqual('bbbbb'); // b a e d c
    expect(c.getMruValue()).toEqual('bbbbb');
    expect(c.getLruValue()).toEqual('ccccc');
    expect(c.get('c')).toEqual('ccccc'); // c b a e d
    expect(c.getMruValue()).toEqual('ccccc');
    expect(c.getLruValue()).toEqual('ddddd');
    expect(c.get('d')).toEqual('ddddd'); // d c b a e
    expect(c.getMruValue()).toEqual('ddddd');
    expect(c.getLruValue()).toEqual('eeeee');
    expect(c.get('e')).toEqual('eeeee'); // e d c b a
    expect(c.getMruValue()).toEqual('eeeee');
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(5);

    c.put('f', 'fffff'); // f e d c b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('fffff');
    expect(c.get('a')).toEqual(undefined);
    c.put('g', 'ggggg'); // g f e d c
    expect(c.getLruValue()).toEqual('ccccc');
    expect(c.getMruValue()).toEqual('ggggg');
    expect(c.get('b')).toEqual(undefined);
    expect(c.size).toEqual(5);
  });

  it('updates cached values correctly', () => {
    const c = new LruCache<string, string>(3);

    c.put('a', 'aaaaa'); // a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(1);

    c.put('b', 'bbbbb'); // b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('bbbbb');
    expect(c.size).toEqual(2);

    c.put('a', 'bbbbb'); // a b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('bbbbb');
    expect(c.size).toEqual(2);

    c.put('c', 'ccccc'); // c a b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('ccccc');
    expect(c.size).toEqual(3);

    c.put('c', 'ddddd'); // c a b
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('ddddd');
    expect(c.size).toEqual(3);

    c.put('b', 'aaaaa'); // b c a
    expect(c.getLruValue()).toEqual('bbbbb');
    expect(c.getMruValue()).toEqual('aaaaa');
    expect(c.size).toEqual(3);

    expect(c.get('c')).toEqual('ddddd');
    expect(c.get('a')).toEqual('bbbbb');
    expect(c.get('b')).toEqual('aaaaa');
  });

  it('clears cache correctly', () => {
    const c = new LruCache<string, string>(5);

    c.put('a', 'aaaaa'); // a
    c.put('b', 'bbbbb'); // b a
    c.put('c', 'ccccc'); // c b a
    expect(c.getLruValue()).toEqual('aaaaa');
    expect(c.getMruValue()).toEqual('ccccc');
    expect(c.size).toEqual(3);

    c.clear();
    expect(c.getLruValue()).toEqual(undefined);
    expect(c.getMruValue()).toEqual(undefined);
    expect(c.get('a')).toEqual(undefined);
    expect(c.get('b')).toEqual(undefined);
    expect(c.get('c')).toEqual(undefined);
    expect(c.size).toEqual(0);
  });

  it('initializes the cache with number key and number value correctly', () => {
    const c = new LruCache<number, number>(1);

    c.put(1, 1);
    expect(c.get(1)).toEqual(1);
  });

  it('initializes the cache with number key and object value correctly', () => {
    const c = new LruCache<number, Person>(5);

    c.put(100, { firstName: 'George', lastName: 'Anderson', dob: new Date('1974-07-29') });
    c.put(101, { firstName: 'Harry', lastName: 'Paterson', dob: new Date('1971-03-29') });
    c.put(102, { firstName: 'Mary', lastName: 'Jane', dob: new Date('1972-09-29') });
    c.put(103, { firstName: 'John', lastName: 'Doe', dob: new Date('1968-09-29') });

    expect(c.get(101)).toEqual({ firstName: 'Harry', lastName: 'Paterson', dob: new Date('1971-03-29') });
    expect(c.size).toEqual(4);
  });
});
