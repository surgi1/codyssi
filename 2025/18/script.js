const parse = input => input.split('\n').map(line => line.match(/(\d|-)+/g).map(Number))

const C = {
    ID: 0,
    X: 1,
    Y: 2,
    Z: 3,
    A: 4,
    DIV: 5,
    REM: 6,
    VX: 7,
    VY: 8,
    VZ: 9,
    VA: 10,
}

const k = (x,y,z,a) => [x,y,z,a].join('_');
const mod = (n, m) => ((n % m) + m) % m;

const debrisPosInTime = (init, v, t, dim = [10, 15, 60, 3]) => init.map((p, i) => mod(p+v[i]*t, dim[i]))

const part1 = (input, dim = [10, 15, 60, 3]) => {
    let rules = parse(input);
    console.log(rules);
    let debris = [];
    rules.forEach((r, i) => {
        for (let x = 0; x < dim[0]; x++) for (let y = 0; y < dim[1]; y++) for (let z = 0; z < dim[2]; z++) for (let a = -1; a < -1 + dim[3]; a++) {
            if (mod(r[C.X]*x + r[C.Y]*y + r[C.Z]*z + r[C.A]*a, r[C.DIV]) == r[C.REM]) debris.push({p: [x,y,z,a+1], v: [r[C.VX], r[C.VY], r[C.VZ], r[C.VA]]})
        }
    })
    console.log(debris);
    return debris;
}

//console.log('p1', part1(inputt, [3,3,5,3]));
console.log('p1', part1(input).length);
