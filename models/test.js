const R = require('ramda');


function createWithRefs(data){
  const subNames = ['Shares', 'Names'];
  const subObjs = R.pick(subNames, data);
  const mainObj = R.omit(subNames, data);

  for (let [key, value] of R.toPairs(subObjs)){
    const makeObj = (val)=>[{[R.init(key)]:val}];
    const res = R.chain(makeObj, value);
    console.log(res);
  }
}

const testData = {
  Shares:[{type:1}, {type:2}],
  Names:[{first:"hello"}, {last:"hi there"}],
};

createWithRefs(testData);
