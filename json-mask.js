var obj = {
  name: 'rk',
  person: {
    age: 1,
    no: 2,
    key: {
      k1: 1,
      k2: 2
    }
  },
  arr1: [{
      k: 0,
      a: 'a'
    },
    {
      k: 1,
      b: 'b'
    }
  ],
  arr2: [{
      k: 0,
      k1: '00'
    },
    {
      k: 1,
      k1: '01'
    }
  ],
  deep: {
    depth1: {
      no: 'no'
    },
    depth2: {
      depth: null
    },
    depth3: {
      depth2: [
        {
          k1: 'k1',
          k2: 'k2'
        }
      ]
    }
  }
}

const filter = ['arr1.k', 'arr2.k1', 'deep.depth3.depth2.k2']

function mask (json, filter) {
  filter.forEach((field) => {
    maskKeys(json, field.split('.'), 0)
  })
}

function maskKeys(json, arr, pos) {
  const key = arr[pos]
  if (json.hasOwnProperty(key)) {
    if (pos === arr.length - 1) {
      delete json[key]
    } else {
      pos++
      maskKeys(json[key], arr, pos)
    }
  } else if (typeof json === 'object' && json instanceof Array && json.length) {
    json.forEach((sub) => {
      maskKeys(sub, arr, pos)
    })
  }
}
mask(obj, filter)
console.log(JSON.stringify(obj, null, 1))