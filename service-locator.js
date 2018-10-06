/*
  Motivation: moving files around required massive code rewrite to locate the
private modules. This little lazyServiceLocator stores a list of those modules.
When rewriting code,  I can just change the list of modules here.

  const lazyServiceLocator = require('service-locator');
  lazyServiceLocator.bookRouter
  lazyServiceLocator.bookModel
*/
import { basename } from 'path';
import R from 'ramda';

const modulePaths = [
  './Routes/bookRouter',
  './models/bookModel',
];
const defaultOr = R.ifElse(R.has('default'), R.prop('default'), R.identity);
const acquireModule = R.compose(defaultOr, require);
const makeGetter = (path)=>()=>acquireModule(path);
const assoc = R.assoc(R.__, R.__, {});
const makeLazyLoader = R.converge(assoc, [R.unary(basename), makeGetter]);
const transducer = R.map(makeLazyLoader);
const reducer = R.flip(R.merge);

export default R.transduce(transducer, reducer,
                           {}, modulePaths);
