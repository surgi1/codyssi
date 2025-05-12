const parse = input => input.split('\n').map(line => line.match(/(\d|-)+/g).map(Number))
const mod = (n, m) => ((n % m) + m) % m;
const debrisPosInTime = (deb, t, dim = [10, 15, 60, 3]) => deb.p.map((pos, i) => mod(pos+deb.v[i]*t, dim[i]))
const MOVES = [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1], [0,0,0]]; // submarine moves

const initMap = (dim = [10, 15, 60], def = 0) => {
    let map = [];
    for (let x = 0; x < dim[0]; x++) {
        map[x] = [];
        for (let y = 0; y < dim[1]; y++) {
            map[x][y] = [];
            for (let z = 0; z < dim[2]; z++) map[x][y][z] = structuredClone(def);
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
        if (pos[3] == 1) map[pos[0]][pos[1]][pos[2]]--;
    })
    map[0][0][0] = 0; // simulate no harm at 0,0,0
    memo[t] = map;
    return map;
}

const part1 = (input, dim = [10, 15, 60, 3]) => {
    let rules = parse(input);
    let debris = [];
    rules.forEach(([id, cx, cy, cz, ca, div, rem, vx, vy, vz, va], i) => {
        for (let x = 0; x < dim[0]; x++) for (let y = 0; y < dim[1]; y++) for (let z = 0; z < dim[2]; z++) for (let a = -1; a < -1 + dim[3]; a++) {
            if (mod(cx*x + cy*y + cz*z + ca*a, div) == rem) debris.push({p: [x,y,z,a+1], v: [vx, vy, vz, va]})
        }
    })
    return debris;
}

// p2+p3 floodfill all the way
// idea for p3 is to have each pt on the initial map [inf, inf, inf, inf] - reflecting nr of hits and alter the spread fnc to allow into those coords too
// need to introduce separate map set for distances, can't be stored into the 1 set as for p2

const part23 = (input, dim = [10, 15, 60, 3], maxHits = 1) => {
    let tMax = 220;
    let debris = part1(input, dim);
    let maps = [], dmaps = [];
    for (let t = 0; t <= tMax+1; t++) {
        maps[t] = mapInTime(debris, t, dim);
        dmaps[t] = initMap(dim, [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]);
    }

    let min = Number.POSITIVE_INFINITY;

    const spread = (pos, t, d, hits = 0) => {
        if (d > min) return;
        if (d > tMax) return;

        if (dmaps[t][pos[0]][pos[1]][pos[2]][hits] <= d) return;
        dmaps[t][pos[0]][pos[1]][pos[2]][hits] = d;

        if (pos[0] == dim[0]-1 && pos[1] == dim[1]-1 && pos[2] == dim[2]-1) {
            if (d < min) min = d;
            return;
        }

        // and respread
        MOVES.forEach((move) => {
            let npos = [pos[0]+move[0], pos[1]+move[1], pos[2]+move[2]];
            if (npos[0] >= 0 && npos[1] >= 0 && npos[2] >= 0 &&
                npos[0] < dim[0] && npos[1] < dim[1] && npos[2] < dim[2]) {
                    let debriePcs = maps[t+1][npos[0]][npos[1]][npos[2]];
                    if (hits - debriePcs < maxHits && hits - debriePcs >= 0) spread(npos, t+1, d+1, hits - debriePcs);
                } 
        })
    }

    spread([0,0,0], 0, 0, 0)

    return min;
}

console.log('p1', part1(input).length);
console.log('p2', part23(input));
console.log('p3', part23(input, [10, 15, 60, 3], 4));
