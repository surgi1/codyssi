const parse = input => {
    let sections = input.split('\n\n');
    return [
        sections[0].split('\n').map(line => {
            let tmp = line.split(' ');
            if (tmp[0] == 'FACE') return {
                code: tmp[0], // FACE
                val: parseInt(tmp[3])
            }; else return {
                code: tmp[0], // ROW|COL
                id: parseInt(tmp[1]) - 1,
                val: parseInt(tmp[4])
            }
        }),
        sections[1].split('')
    ]
}

let xf = {U: {}, D: {}, L: {}, R: {}}

const initXF = () => {
    UDPairsLit.split('\n').forEach(line => {
        let [from, to] = line.split('-');
        xf.U[from] = to;
        xf.D[to] = from;
    })
    RLPairsLit.split('\n').forEach(line => {
        let [from, to] = line.split('-');
        xf.R[from] = to;
        xf.L[to] = from;
    })
}

initXF();

const init2dArr = (size, init = 1) => {
    let res = [];
    for (let y = 0; y < size; y++) {
        res[y] = [];
        for (let x = 0; x < size; x++) res[y][x] = 1;
    }
    return res;
}

const initBox = (size = 3) => {
    let box = {};
    'ABCDEF'.split('').forEach(b => {
        box[b] = {
            data: init2dArr(size),
            absorbtion: 0,

        }
    })
    return box;
}

const sum = arr => arr.reduce((a, v) =>a+v, 0);
const maxRowOrCol = map => Math.max(...map.map(row => sum(row)), ...map[0].map((_, i) => sum(map.map(row => row[i]))))
const rotateCW = map => map[0].map((val, index) => map.map(row => row[index]).reverse());
const rotateCCW = map => map[0].map((val, index) => map.map(row => row[row.length-1-index]));

const sanitize = n => (n > 100) ? n-100 : n;

const doOp = (op, cur, box) => {
    let size = box.A.data.length;
    let side = cur[0];
    let power = op.val*size;
    if (op.code === 'FACE') power *= size;
    box[side].absorbtion += power;
    if (op.code == 'FACE') {
        box[side].data = box[side].data.map(row => row.map(v => sanitize(v+op.val)))
        return;
    }
    let data = structuredClone(box[side].data);
    for (let i = 1; i < Number(cur[1]); i++) data = rotateCCW(data);
    // do the op with data
    if (op.code == 'ROW') {
        data[op.id] = data[op.id].map(v => sanitize(v+op.val));
    } else {
        data.forEach(row => row[op.id] = sanitize(row[op.id]+op.val));
    }
    for (let i = 1; i < Number(cur[1]); i++) data = rotateCW(data);

    box[side].data = data;
}

const part1 = (input, size) => {
    let box = initBox(size);
    console.log(box);
    let [ops, rots] = parse(input);
    let cur = 'A1';

    ops.forEach((op, i) => {
        doOp(op, cur, box);
        if (rots[i] !== undefined) cur = xf[rots[i]][cur];
    })

    let abs = Object.values(box).map(b => b.absorbtion).sort((a, b) => b-a).slice(0, 2).reduce((a, v) => a*v, 1);
    console.log('p1', abs);

    let p2 = Object.values(box).map(b => maxRowOrCol(b.data)).reduce((a, v) => a*BigInt(v), 1n);
    console.log('p2', p2)

    return abs;
}

const part3 = (input, size) => {
    let box = initBox(size);
    console.log(box);
    let [ops, rots] = parse(input);
    let cur = 'A1';

    ops.forEach((op, i) => {
        doOp(op, cur, box);
        // p3 twist; instructions run around the box, let's simulate that
        if (op.code === 'ROW') {
            for (let j = 0; j < 3; j++) {
                // rot right
                cur = xf.R[cur];
                // run the same op
                doOp(op, cur, box);
            }
            // extra rot right to come back to origin
            cur = xf.R[cur];
        } else if (op.code === 'COL') {
            for (let j = 0; j < 3; j++) {
                // rot right
                cur = xf.D[cur];
                // run the same op
                doOp(op, cur, box);
            }
            // extra rot right to come back to origin
            cur = xf.D[cur];
        }
        if (rots[i] !== undefined) cur = xf[rots[i]][cur];
    })

    //let abs = Object.values(box).map(b => b.absorbtion).sort((a, b) => b-a).slice(0, 2).reduce((a, v) => a*v, 1);
    //console.log('p1', abs);

    let p3 = Object.values(box).map(b => maxRowOrCol(b.data)).reduce((a, v) => a*BigInt(v), 1n);
    //console.log('p3', p3)

    return p3;
}

//console.log('p1', part1(inputt, 3));
//console.log('p1', part1(inputt2, 80));
//console.log('p1', part1(input, 80));

//console.log('p3', part3(inputt, 3));
console.log('p3', part3(input, 80));
