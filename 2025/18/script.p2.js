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
const debrisPosInTime = (deb, t, dim = [10, 15, 60, 3]) => deb.p.map((pos, i) => mod(pos+deb.v[i]*t, dim[i]))

const initMap = (dim = [10, 15, 60]) => {
    let map = [];
    for (let x = 0; x < dim[0]; x++) {
        map[x] = [];
        for (let y = 0; y < dim[1]; y++) {
            map[x][y] = [];
            for (let z = 0; z < dim[2]; z++) map[x][y][z] = 0;
        }
    }
    return map;
}

let memo = {};
const mapInTime = (init, t, dim = [10, 15, 60]) => {
    if (memo[t] !== undefined) return memo[t];
    let map = initMap(dim);
    init.forEach(deb => {
        let pos = debrisPosInTime(deb, t, dim);
        if (pos[3] == 1) map[pos[0]][pos[1]][pos[2]] = map[pos[0]][pos[1]][pos[2]]-1;
    })
    map[0][0][0] = 0; // simulate no harm at 0,0,0
    for (let x = 0; x < dim[0]; x++) for (let y = 0; y < dim[1]; y++) for (let z = 0; z < dim[2]; z++) {
        if (map[x][y][z] == 0) map[x][y][z] = Number.POSITIVE_INFINITY;
    }
    memo[t] = map;
    return map;
}

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

const MOVES = [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1], [0,0,0]]; // submarine moves

const dist = (a, b) => a.reduce((a, v, i) => a + Math.abs(v-b[i]), 0);

const part2B = (input, dim = [10, 15, 60, 3]) => {
    let tmod = dim[0]*dim[1]*dim[2]*dim[3];
    let debris = part1(input, dim);
    let byT = [];
    //for (let t = 0; t < 300; t++) byT[t] = mapInTime(debris, t, dim);
    console.log('by t', byT);
    //let mapT1 = mapInTime(debris, 1, dim);
    //console.log(mapT1);
    let i = 0;
    //let queue= new FastPriorityQueue((a, b) => b.pos[0]+b.pos[1]+b.pos[2]+100*b.t < a.pos[0]+a.pos[1]+a.pos[2]+100*a.t),
    let queue= new FastPriorityQueue((a, b) => dist(b.pos, dim) > dist(a.pos, dim)),
    //let queue= new FastPriorityQueue((a, b) => a.t < b.t),
        min = Number.POSITIVE_INFINITY;

    let maxpos = 0, maxt = 0;
    queue.add({pos: [0,0,0], t: 0});
    while (!queue.isEmpty()) {
        let cur = queue.poll();
        //console.log(cur);
        let posReached = dist(cur.pos, [0,0,0]);
        if (posReached > maxpos) {
            console.log('max dist reached', maxpos, cur.pos, cur.t);
            maxpos = posReached;
        }
        if (cur.t > maxt) {
            //console.log('max t reached', maxt, cur.pos);
            maxt = cur.t;
        }
        if (cur.t > min) continue;
        if (cur.pos[0] == dim[0]-1 && cur.pos[1] == dim[1]-1 && cur.pos[2] == dim[2]-1) {
            if (cur.t < min) {
                min = cur.t;
                console.log('****** new minimum path', min);
            }
            continue;
        }
        //if (cur.t > 300) continue;
        let map = mapInTime(debris, (cur.t+1)/* % tmod*/, dim);
        MOVES.forEach((move) => {
            let pos = [cur.pos[0]+move[0], cur.pos[1]+move[1], cur.pos[2]+move[2]];
            if (pos[0] >= 0 && pos[1] >= 0 && pos[2] >= 0 && pos[0] < dim[0] && pos[1] < dim[1] && pos[2] < dim[2] && map[pos[0]][pos[1]][pos[2]] == 0) queue.add({
                pos: pos, t: cur.t+1
            })
        })
        i++;if (i > 10000000) {console.log('em break');break;}
    }
    console.log('memo', memo);
    return min;
}

const part2 = (input, dim = [10, 15, 60, 3]) => {
    let tMax = 220;
    let tmod = dim[0]*dim[1]*dim[2]*dim[3];
    let debris = part1(input, dim);
    let byT = [];
    for (let t = 0; t <= tMax+1; t++) byT[t] = mapInTime(debris, t, dim);
    console.log('by t', byT);

    let min = Number.POSITIVE_INFINITY;

    const spread = (pos, t, d) => {
        /*let posReached = dist(pos, [0,0,0]);
        if (posReached > maxpos) {
            console.log('max dist reached', maxpos, pos, t, d);
            maxpos = posReached;
        }*/

        if (d > min) return;
        if (d > tMax) return;
        if (byT[t][pos[0]][pos[1]][pos[2]] == -1) return;
        if (byT[t][pos[0]][pos[1]][pos[2]] <= d) return;
        byT[t][pos[0]][pos[1]][pos[2]] = d;

        if (pos[0] == dim[0]-1 && pos[1] == dim[1]-1 && pos[2] == dim[2]-1) {
            if (d < min) {
                min = d;
                console.log('****** new minimum path', min);
            }
            return;
        }

        // and respread
        MOVES.forEach((move) => {
            let npos = [pos[0]+move[0], pos[1]+move[1], pos[2]+move[2]];
            if (npos[0] >= 0 && npos[1] >= 0 && npos[2] >= 0 &&
                npos[0] < dim[0] && npos[1] < dim[1] && npos[2] < dim[2] && 
                byT[t+1][npos[0]][npos[1]][npos[2]] > -1) spread(npos, t+1, d+1);
        })
    }

    spread([0,0,0], 0, 0)

    //console.log('memo', memo);
    return min;
}

//console.log('p1', part1(inputt, [3,3,5,3]));
//console.log('p1', part1(input).length);

//console.log('p2', part2(inputt, [3,3,5,3]));
//console.log('p2', part2(inputt2));
console.log('p2', part2(input));
