const R = require('ramda');
const { map } = R;
const Maybe = require('folktale/maybe');
const Result = require('folktale/result');
const Future = require('fluture');

const { log } = console;

let futures = [];
let results = [];
for(let i of [1, 2, 3, 4, 5, 6]){
  futures.push(Future.after(10*i, `${i} resolved`));
  results.push(Result.Ok(i));
}
// results.push(Result.Error('wrong result yo'));
// futures.push(Future.rejectAfter(9999, 'this is WRONG'));

futures= R.sequence(Future.of, futures);
results = R.sequence(Result.of, results);

futures.fork(console.error, console.log);
log(results);
