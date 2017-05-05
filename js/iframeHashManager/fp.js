// FP Primitive helpers
// compose :: List (a -> b) -> (a -> b)
const compose = functions => initial => {
   console.log(functions); functions.reverse().reduceRight(
    (result, fn) => fn(result),
    initial
);}

// map :: (a -> b) -> Array a -> Array b
const map = fn => arr => arr.map(fn)

// map :: (a -> b -> c) -> Array a -> Array b -> Array c
const map2 = fn => arr1 => arr2 => arr1.map((el, index) => fn(el, arr2[index], index))

// join :: Array String -> String
const join = delimiter => arr => arr.join(delimiter)

// log :: a -> a
const log = tag => data => {console.dir(tag, data); return data}

// tail :: Array a -> Array (Maybe a)
const tail = arr => arr.slice(1, arr.length)

// split :: String -> Array String
const split = delim => str => str.split(delim)

export default {compose, map, map2, join, log, tail, split}
