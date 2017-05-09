// FP Primitive helpers
// Some primitive utility function for handling functions and arrays
// All functions in here are curried. https://www.sitepoint.com/currying-in-functional-javascript/
// use the log to debug compose

// compose :: List (a -> b) -> (a -> b)
// compose([ (x => x * x), (x => x - 2) ])(3), 7)
// Compose a list of unary functions.
// Unary means that the function has only one parameter
const compose = functions => initial =>
   functions.reverse().reduceRight(
    (result, fn) => fn(result),
    initial )

// map :: (a -> b) -> Array a -> Array b
// map(x => x * x)([1, 2, 3]) -> [1, 4, 9]
// Takes an unary function, and returns a function
// which takes an array. The first function is then
// executed on each item of the array, returning an array.
const map = fn => arr => arr.map(fn)

// map2 :: (a -> b -> c) -> Array a -> Array b -> Array c
// map2((x, y) => x * y)([1, 2, 3])([1, 2, 3]) -> [1, 4, 9]
// Like map, but takes two arrays and a binary function.
// Binary means that the function takes two parameters.
const map2 = fn => arr1 => arr2 => arr1.map((el, index) => fn(el, arr2[index], index))

// filter :: (a -> Boolean) -> Array a -> Array a
// filter(x => x > 1)([1, 2, 3]) -> [2, 3]
// Takes a predicate which is an unary returning a boolean value, and returns a function.
// The second function takes an array. The first function is then
// used to filter the items of the array, returning a subset.
const filter = fn => arr => arr.filter(fn)

// join :: Array String -> String
// join(' ')(['Hello', 'World']) -> 'Hello World'
// Takes a delimiter, an array and joins the latter using the delimiter.
const join = delimiter => arr => arr.join(delimiter)

// log :: a -> a
// log('ThisShouldBeTrue')('2' == true) -> false
// A debug helper for composed functions.
const log = tag => data => {console.log(tag); console.dir(data); return data}

// tail :: Array a -> Array (Maybe a)
// tail([1, 2, 3]) -> [2,3]
// Takes an array and returns the array minus the first item.
const tail = arr => arr.slice(1, arr.length)

// split :: String -> String -> Array String
// split(' ')('Hello World') -> ['Hello', 'World']
// Like tail. Takes a delimiter, a string and returns an array of strings split using the delimiter
const split = delim => str => str.split(delim)

export default {compose, map, map2, filter, join, log, tail, split}
