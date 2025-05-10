/*
idea:
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

//const steps = [1, 2, 3, 5, 8]

const part1 = (input) => {
    let [routes, steps] = parse(input);
    console.log(routes);
    let paths2step = [1,1];
    for (let i = 2; i <= 99; i++) {
        paths2step[i] = steps.reduce((a, v) => {
            if (i-v < 0) return a;
            return a + BigInt(paths2step[i-v]);
        }, 0n)
    }
    return paths2step[99];
}

console.log('p1', part1(input));
