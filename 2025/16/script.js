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
                id: parseInt(tmp[1]),
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

const doOp = (op, cur, box) => {
    let size = box.A.data.length;
    let side = cur[0];
    let power = op.val*size;
    if (op.code === 'FACE') power *= size;
    box[side].absorbtion += power;
}

const part1 = (input, size) => {
    console.log(xf);
    let box = initBox(size);
    console.log(box);
    let [ops, rots] = parse(input);
    console.log(ops, rots);
    let cur = 'A1';
    ops.forEach((op, i) => {
        doOp(op, cur, box);
        if (rots[i] !== undefined) cur = xf[rots[i]][cur];
        //console.log(cur);
    })
    let abs = Object.values(box).map(b => b.absorbtion).sort((a, b) => b-a).slice(0, 2).reduce((a, v) => a*v, 1);
    return abs;

}

//console.log('p1', part1(inputt, 3));
//console.log('p1', part1(inputt2, 80));
console.log('p1', part1(input, 80));
// 116553312537600 inc
