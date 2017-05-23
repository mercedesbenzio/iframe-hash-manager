import test from 'ava'
import F from './fp'

test('compose',    t => t.is( F.compose([ (x => x * x), (x => x - 2) ])(3), 7) )

test('map',        t => t.deepEqual( F.map(x => x * x)([1, 2, 3]), [1, 4, 9]) )

test('map2',       t => t.deepEqual( F.map2((x, y) => x * y)([1, 2, 3])([1, 2, 3]), [1, 4, 9]) )

test('join',       t => t.is( F.join(' ')(['Hello', 'World']), 'Hello World') )

test('log',        t => t.is( F.log('This should be "true" but is not:')('2' == true), false) )

test('tail',       t => t.deepEqual( F.tail([1, 2, 3]), [2,3]) )

test('split',      t => t.deepEqual( F.split(' ')('Hello World'), ['Hello', 'World']) )

test('difference', t => t.deepEqual( F.difference(['a', 'b', 'c', 'd', 'e'])(['a', 'b', 'd']), ['c', 'e'] ) )

test('flatten',    t => t.deepEqual( F.flatten([ ['a', 'b', 'c'], ['d', 'e'] ]), ['a', 'b', 'c', 'd', 'e'] ) )
