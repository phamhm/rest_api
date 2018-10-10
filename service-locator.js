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
  './Routes/accountRouter',
];

const defaultOr = R.ifElse(R.has('default'), R.prop('default'), R.identity);
const acquireModule = R.compose(defaultOr, require);
const makeGetter = (path)=>(sLocator)=>acquireModule(path)(sLocator);
const makeLazyLoader = R.converge(R.assoc(R.__, R.__, {}),
                                  [R.unary(basename), makeGetter]);
const transducer = R.map(makeLazyLoader);
const reducer = R.flip(R.merge);


const store = R.transduce(transducer, reducer, {}, modulePaths);

function serviceLocator(baseName, modudleStore = store){
  const hasProp = R.has(baseName);
  const notHasProp = R.compose(R.not, hasProp);

  if(notHasProp(modudleStore))
    throw new Error(`module ${baseName} not found`);

  const factory = R.prop(baseName, modudleStore);
  const module = factory(serviceLocator);

  return module;
}

export default serviceLocator;
