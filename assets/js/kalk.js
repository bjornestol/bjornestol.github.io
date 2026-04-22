var stack = [];
var buttons = [{name: 'C', arity: 0, recipe: "C", effect: clearEffect, css: "key-others"}, {name: 'EML', arity: 2, recipe: "x y EML", effect: emlEffect}, {name: '1', arity: 0, recipe: "1", effect: oneEffect}];
const inputValue = document.getElementById("user-input");
const feilmelding = document.getElementById("fm");
const knapper = document.getElementById("knapper");

const kn = document.getElementById("knapper");
const sortable = new Sortable(kn, {
  group: {
    name: "knapper",
    pull: 'clone',
    push: false
  },
  animation: 150,
  ghostClass: 'dragging',
  onEnd: function() {
    knappelagring();
  }
});

function knappelagring() {
  const alleKnapper = document.getElementById('knapper').childNodes;
  const ordning = Array.from(alleKnapper).map(btn => btn.textContent);
  buttons = ordning.map(navn => buttons.find(x => x.name == navn));
}

async function clickButton(arity, effect) {
  if (stack.length < arity) {
    printFeil("Brukerfeil: Trenger minst " + arity + " tall på stabelen.");
  } else {
    await effect();
    updateDisplay();
  }
}

function makeButtons() {
  const knapper = document.getElementById("knapper"); 
  knapper.innerText = "";
  buttons.forEach(b => {
    knapp = document.createElement("button");
    knapp.innerText = b.name;
    knapp.classList.add("kalk")
    if (b.arity > 0) {
      knapp.classList.add("key-operate");
    }
    if (b.css) {
      knapp.classList.add(b.css)
    }
    knapp.addEventListener("click", e => {
      clickButton(b.arity, b.effect)
    });
    knapper.appendChild(knapp);
  });
}

async function clearEffect() {
  stack = [];
}

async function oneEffect() {
  stack.push({num: math.complex(1, 0), recipe: {name: '1', input: []}});
}

async function emlEffect() {
  function diff(a, b) {
    return math.complex(a.re - b.re, a.im - b.im)
  }
  const y = stack.pop();
  const x = stack.pop();
  const newVal = diff(math.exp(x.num), math.log(y.num));
  const newRecipe = {name: 'EML', input: [x.recipe, y.recipe]}
  stack.push({num: newVal, recipe: newRecipe});
}

makeButtons();

document.getElementById('build-button').addEventListener('click', () => {
  const navn = document.getElementById('opname');
  const oppgave = document.getElementById('knappstreng');
  if (navn.value && oppgave.value) {
    const success = lagKnapp(navn.value, oppgave.value);   
    if (success) {
      navn.value = '';
      oppgave.value = '';
    }
  } else {
    printFeil("Vennligst fyll inn begge verdiene i knappbyggeren.")
  }
});


function lovligKnapp(knappstreng) {
  const stabel = knappstreng.split(' ').filter(x => x != '');
  var ulovlige = stabel.filter(x => !buttons.map(e => e.name).includes(x)).filter(x => !['x', 'y', 'z'].includes(x));
  if (ulovlige.length > 0) {
    printFeil("Knappmakerfeil: Kjenner ikke igjen konstant eller operator " + ulovlige[0]);
    return false;  
  }
  var availvars = 0;
  for (var op in stabel) {
    if (['x', 'y', 'z'].includes(stabel[op])) {
      availvars = availvars + 1;
      continue;
    }
    var btn = buttons.find(b => b.name == stabel[op]);
    if (availvars < btn.arity) {
      printFeil("Knappmakerfeil: Operator " + btn.name + " har ikke nok verdier. Har " + availvars + ", trenger " + btn.arity + ".");
      return false;
    }
    availvars = availvars - btn.arity + 1;
  }
  if (availvars != 1) {
    printFeil("Knappmakerfeil: Operator gir ut flere verdier")
    return false;
  }
  fjernFeil();
  return true;
}

function knappAritet(knappstreng) {
  const stabel = knappstreng.split(' ').filter(x => x != '');
  if (stabel.includes('z')) {
    return 3;
  } else if (stabel.includes('y')) {
    return 2;
  } else if (stabel.includes('x')) {
    return 1;
  } else {
    return 0;
  }
}

function stringToTree(buttonstring, x, y, z) {
  if (!x) {
    x = {name: 'x', input: []}
  }
  if (!y) {
    y = {name: 'y', input: []}
  }
  if (!z) {
    z = {name: 'z', input: []}
  }
  const stabel = buttonstring.split(' ').filter(x => x != '');
  const treeList = [];
  for (var i in stabel) {
    var op = stabel[i];
    if (op == 'x') {
      treeList.push(x);
    } else if (op == 'y') {
      treeList.push(y);
    } else if (op == 'z') {
      treeList.push(z);
    } else if (op == '1') {
      treeList.push({name: '1', input: []});
    } else if (op == 'EML') {
      var yInp = treeList.pop();
      var xInp = treeList.pop();
      treeList.push({name: 'EML', input: [xInp, yInp]});
    } else {
      var btn = buttons.find(b => b.name == op);
      var newInput = [];
      for (var i = 0; i < btn.arity; i++) {
        newInput.push(treeList.pop());
      }
      newInput.reverse();
      treeList.push(stringToTree(btn.recipe, ...newInput));
    }
  }
  return treeList[0]
}

function treeToString(tree) {
  const treeArr = tree.input.map(x => treeToString(x));
  treeArr.push(tree.name);
  return treeArr.join(' ')
}

async function kjørKnapp(aritet, knappstreng) {
  var input = [];
  var wait = 200;
  for (var i = 0; i < aritet; i++) {
    input.push(stack.pop());
    updateDisplay();
    await new Promise(r => setTimeout(r, wait));
  }
  input.reverse();
  console.log(input)
  const stabel = knappstreng.split(' ').filter(x => x!= '');
  for (var i in stabel) {
    var op = stabel[i];  
    if (op == 'x') {
      stack.push(input[0]);
      updateDisplay();
    } else if (op == 'y') {
      stack.push(input[1]);
      updateDisplay();
    } else if (op == 'z') {
      stack.push(input[2]);
      updateDisplay();
    } else {
      var btn = buttons.find(b => b.name == op);
      await clickButton(btn.arity, btn.effect);
    }
    await new Promise(r => setTimeout(r, wait));
  }
}

function lovligNavn(navn) {
  const splittet = navn.split(' ');
  if (splittet.length != 1) {
    printFeil("Ikke lov med mellomrom i navn på knapp");
    return false;
  }
  if (navn.length > 4) {
    printFeil("Knappenavn kan maksimalt ha 4 tegn");
    return false;
  }
  if (buttons.map(x => x.name).includes(navn)) {
    printFeil("Allerede en knapp med dette navnet");
    return false;
  }
  return true;
}

function lagKnapp(navn, knappstreng) {
  if (!lovligNavn(navn)) {return false;}
  if (!lovligKnapp(knappstreng)) {return false;}
  var aritet = knappAritet(knappstreng);
  fiksetStreng = treeToString(stringToTree(knappstreng));
  buttons.push({name: navn, arity: aritet, recipe: fiksetStreng, effect: e => kjørKnapp(aritet, fiksetStreng)})
  makeButtons();
  return true;
}

function printFeil(feil) {
  feilmelding.innerText = feil;
  feilmelding.classList.add('vis');
}
function fjernFeil() {
  feilmelding.innerText = "";
  feilmelding.classList.remove('vis');
}


function formatNum(value, digits) {
  if (value.re == Infinity) {
    return "∞";
  } else if (value.re == -Infinity) {
    return "-∞";
  } else {
    return value.format(digits);
  }
}
function updateDisplay(digits = 4) {
  fjernFeil();
  if (stack.length == 0) {
    inputValue.innerText = "Ø";
  } else {
    inputValue.innerText = "";
    stack.forEach(num => {
      let formatted = formatNum(num.num, digits);
      const line = document.createElement('div');
      line.className = 'stackelem';
      line.textContent = formatted;

      if (formatted.length > 6) {
        line.classList.add('longnum');
      }
      inputValue.appendChild(line);
    });
  }
}

