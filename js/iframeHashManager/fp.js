// FP Primitive helpers
// Some primitive utility function for handling functions and arrays
// use log to debug compose()

// compose :: List (a -> b) -> (a -> b)
const compose = functions => initial =>
   functions.reverse().reduceRight(
    (result, fn) => fn(result),
    initial )

// map :: (a -> b) -> Array a -> Array b
// map(x => x * x)([1, 2, 3]) -> [1, 4, 9]
const map = fn => arr => arr.map(fn)

// map2 :: (a -> b -> c) -> Array a -> Array b -> Array c
// map2((x, y) => x * y)([1, 2, 3])([1, 2, 3]) -> [1, 4, 9]
const map2 = fn => arr1 => arr2 => arr1.map((el, index) => fn(el, arr2[index], index))

// join :: Array String -> String
// join(['Hello'], ['World']) -> ['Hello World']
const join = delimiter => arr => arr.join(delimiter)

// log :: a -> a
// log('ThisShouldBeTrue')('2' == true) -> false
// debug helper for composed functions
const log = tag => data => {console.dir(tag, data); return data}

// tail :: Array a -> Array (Maybe a)
// tail([1, 2, 3]) -> [2,3]
const tail = arr => arr.slice(1, arr.length)

// split :: String -> String -> Array String
// split(' ')('Hello World') -> ['Hello', 'World']
const split = delim => str => str.split(delim)

export default {compose, map, map2, join, log, tail, split}
