const parse = input => {
    let [mapLit, instructionsLit, actionsLit] = input.split('\n\n');
    let map = mapLit.split('\n').map(line => line.split(' ').map(Number));
    let instructions = instructionsLit.split('\n').map(line => {
        let tmp = line.split(' ');
        if (tmp[0] == 'SHIFT') return {
            op: tmp[0],
            what: tmp[1], // ROW|COL
            id: Number(tmp[2])-1,
            amount: Number(tmp[4])
        }
        return {
            op: tmp[0],
            amount: Number(tmp[1]),
            what: tmp[2], // ROW|COL|ALL
            id: tmp[2] === 'ALL' ? undefined : Number(tmp[3])-1
        }
    })
    let actions = actionsLit.split('\n');
    return [map, instructions, actions];
}

const getRow = (map, id) => map[id].slice();
const setRow = (map, id, data) => map[id] = data.slice();
const getCol = (map, id) => map.map(row => row[id]).slice();
const setCol = (map, id, data) => map.map((row, i) => row[id] = data[i]);
const mod = n => (n+10*1073741824) % 1073741824;
const change = (arr, amount, op) => arr.map(v => mod(doOp(v, amount, op)));
const sum = arr => arr.reduce((a, v) =>a+v, 0);

const doOp = (v, n, op) => {
    switch (op) {
        case 'ADD': return v+n;
        case 'SUB': return v-n;
        case 'MULTIPLY': return v*n;
    }
}

const shift = (arr, amount) => {
    //amount = amount % arr.length;
    amount = -amount;
    return arr.slice(amount, arr.length).concat(arr.slice(0, amount));
}

const runInstruction = (map, ins) => {
    let data;
    switch (ins.op) {
        case 'SHIFT': 
            if (ins.what == 'ROW') {
                setRow(map, ins.id, shift(getRow(map, ins.id), ins.amount));
            } else {
                setCol(map, ins.id, shift(getCol(map, ins.id), ins.amount));
            }
            break;
        default:
            if (ins.what == 'ROW') {
                setRow(map, ins.id, change(getRow(map, ins.id), ins.amount, ins.op));
            } else if (ins.what == 'COL') {
                setCol(map, ins.id, change(getCol(map, ins.id), ins.amount, ins.op));
            } else {
                // ALL
                map = map.map(row => change(row, ins.amount, ins.op));
            }
            break;
    }
    return map;
}

const part1 = input => {
    let [map, instructions, actions] = parse(input);

    console.log(map, instructions, actions);

    instructions.forEach(ins => {
        map = runInstruction(map, ins);
    })

    let max = Math.max(...map.map(row => sum(row)), ...map[0].map((_, i) => sum(map.map(row => row[i]))))

    console.log('res map', map);
    console.log('max', max);
}


const part2 = input => {
    let [map, instructions, actions] = parse(input);

    console.log(map, instructions, actions);

    let taken;
    actions.forEach(act => {
        switch (act) {
            case 'TAKE': taken = instructions.shift(); break;
            case 'CYCLE': instructions.push({...taken}); break;
            case 'ACT': map = runInstruction(map, taken); break;
        }
    })

    let max = Math.max(...map.map(row => sum(row)), ...map[0].map((_, i) => sum(map.map(row => row[i]))))

    console.log('res map', map);
    console.log('max', max);
}

const part3 = input => {
    let [map, instructions, actions] = parse(input);

    console.log(map, instructions, actions);

    let taken = false;
    while (instructions.length > 0) {
        actions.forEach(act => {
            switch (act) {
                case 'TAKE': if (instructions.length > 0) taken = instructions.shift(); else taken = false; break;
                case 'CYCLE': if (taken !== false) instructions.push({...taken}); break;
                case 'ACT': if (taken !== false) map = runInstruction(map, taken); taken = false; break;
            }
        })
    }

    let max = Math.max(...map.map(row => sum(row)), ...map[0].map((_, i) => sum(map.map(row => row[i]))))

    console.log('res map', map);
    console.log('max', max);
}


//part1(input);
//part2(input);
part3(input);