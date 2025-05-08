const parse = input => input.split('\n').map(line => {
    let [from, _1, to, _2, len] = line.split(' ');
    return {from:from, to:to, len: Number(len)}
});

let cycles = [];

const minPath = (from, to, init) => {
    if (from == to) return 0;
    let stack = init.filter(p => p.from == from).map(p => ({visited: [p.from, p.to], len: p.len}));
    let min = Number.POSITIVE_INFINITY;
    let i = 0;
    
    while (stack.length > 0) {
        let path = stack.pop();
        
        if (path.visited[path.visited.length-1] == to) {
            if (path.len < min) min = path.len;
            continue;
        }

        init.filter(p => p.from == path.visited[path.visited.length-1] && path.visited.includes(p.to)).forEach(p => {
            let cycle = [...path.visited.slice(path.visited.indexOf(p.to)), p.to];
            let cycleK = cycle.join(',');
            if (!cycles.includes(cycleK)) {
                cycles.push(cycleK);
                console.log('cycle detected', cycle);
            }
        })
        init.filter(p => p.from == path.visited[path.visited.length-1] && !path.visited.includes(p.to)).forEach(p => {
            stack.push({
                visited: [...path.visited, p.to],
                len: path.len + p.len
            });
            //console.log('added to stack', stack.slice());
        })

        i++;if (i > 10000) {console.log('em break'); break;}
    }
    return min;
}

const part1 = input => {
    let initPaths = parse(input);

    console.log(initPaths);

    // different locs
    let o = {};
    initPaths.forEach(p => {
        o[p.from] = 1;
        o[p.to] = 1;
    })
    let dests = Object.keys(o);

    let p2res = dests.map(dest => minPath('STT', dest, initPaths)).sort((a, b) => b-a).slice(0, 3).reduce((a, v) =>a*v, 1)

    // solve cycles
    let p3res = Math.max(
        ...cycles.map(cycleLit => {
            let cycle = cycleLit.split(',');
            let res = 0;
            for (let i = 1; i < cycle.length; i++) res += initPaths.filter(p => p.from == cycle[i-1] && p.to == cycle[i])[0].len;
            return res;
        })
    )

    console.log('longest cycle', p3res);

    return p2res;
}


//console.log('p1', part1(input));
console.log('p2', part1(input));
