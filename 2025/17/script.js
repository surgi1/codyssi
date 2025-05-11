/*
p1 idea:
steps: 1, 3

0: 1 (jsem tam)
1: 1
2: o 1 z 1 = 1
3: o 1 z 2 = 1 + o 3 z 0 = 1 => 2
4: o 1 z 3 = 2 + o 3 z 1 = 1 => 3
5: o 1 z 4 = 3 + o 3 z 2 = 1 => 4
6: o 1 z 5 = 4 + o 3 z 3 = 2 => 6

steps: 1,2
0: 1
1: 1
2: o 1 z 1 + o 2 z 0 => 2
3: o 1 z 2 = 2 + o 2 z 1 = 1 => 3
4: o 1 z 3 = 3 + o 2 z 2 = 2 => 5
5: o 1 z 4 = 5 + o 2 z 3 = 3 => 8
6: o 1 z 5 = 8 + o 2 z 4 = 5 => 13
*/

const parse = input => {
    let [routesLit, stepsLit] = input.split('\n\n');
    return [
        routesLit.split('\n').map(line => {
            let [_, startStep, endStep, startRoute, endRoute] = line.match(/\d+/g).map(Number);
            return {
                startStep: startStep,
                endStep: endStep,
                startRoute: startRoute-1,
                endRoute: endRoute-1
            }
        }),
        stepsLit.match(/\d+/g).map(Number)
    ]
}

const part1 = (input) => {
    let [routes, steps] = parse(input);
    console.log(routes);
    let paths2step = [];
    paths2step[0] = [1,1];
    for (let i = 2; i <= routes[0].endStep; i++) {
        paths2step[0][i] = steps.reduce((a, v) => {
            if (i-v < 0) return a;
            return a + BigInt(paths2step[0][i-v]);
        }, 0n)
    }
    return paths2step[0][routes[0].endStep];
}

// p2 idea is to use the stack; once entered a step that is a branching step, push pointer to currently processed route and reached step to the stack and progress with the branched path up to its end step (unless another branching occurs)
// what is not clear is what exactly should be done once the end step of the branched path is reached - where to store the result
// if we do nothing, the lookback (by the steps) would have to be able to look through the branched paths as well - this doesn't feel right
// perchance the trick could be to add the routes nr backwards against the flow to the ending route?
// nah, the lookback must be able to fully branch, this is needed cos of the routes lengths being shorter than our allowed step lengths (even +2)
// let's create a directional graph
const part2 = (input) => {
    let [routes, steps] = parse(input);
    console.log(routes);
    let paths2step = [];
    paths2step[0] = [1,1];
    for (let i = 2; i <= routes[0].endStep; i++) {
        paths2step[0][i] = steps.reduce((a, v) => {
            if (i-v < 0) return a;
            return a + BigInt(paths2step[0][i-v]);
        }, 0n)
    }
    return paths2step[0][routes[0].endStep];
}

//console.log('p1', part1(input));

console.log('p2', part2(input));
