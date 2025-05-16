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
            let [id, startStep, endStep, startRoute, endRoute] = line.match(/\d+/g).map(Number);
            return {
                id: id-1,
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
// the lookback must be able to fully branch, this is needed cos of the routes lengths being shorter than our allowed step lengths (even +2)
const part2 = (input) => {

    let [routes, steps] = parse(input);
    let maxStep = Math.max(...steps); // 8
    console.log(routes);
    let paths2step = [];
    routes.forEach((r, i) => {
        paths2step[i] = [];
        routes[i].lastReachedStep = -1;
    });
    paths2step[0] = [1n];

    const runRoute = (routeId) => {
        //console.log('**** running route for routeId', routeId);
        for (let i = routes[routeId].lastReachedStep+1; i <= routes[routeId].endStep; i++) {

            //console.log('running route for routeId', routeId, 'step', i);
            // lookback 1 by 1 step up to max steps, fully aware of backwards branching
            // add unique from points [routeId, step], then sum them up
            // if a forward branching is encountered, call that route's runRoute
            let stack = [{routeId: routeId, step: i, len: 0}];
            let res = {}, cur;

            while (cur = stack.pop()) {
                if (cur.len > maxStep) continue;
                if (cur.step < routes[cur.routeId].startStep) continue;
                
                // if we are exactly at the available step length, add it to the res
                if (steps.includes(cur.len)) {
                    if (paths2step[cur.routeId][cur.step] == undefined) runRoute(cur.routeId);
                    let v = paths2step[cur.routeId][cur.step];
                    if (v !== undefined) res[cur.routeId + '_' + cur.step] = BigInt(v); else {
                        console.log('------------ exception');
                    }
                }
                // by default, continue down the current route
                stack.push({routeId: cur.routeId, step: cur.step-1, len: cur.len+1});

                // if at the start of my route, go upstream
                if (routes[cur.routeId].startStep == cur.step && !isNaN(routes[cur.routeId].startRoute)) {
                    //console.log('going upstream to', routes[cur.routeId].startRoute, 'step', cur.step);
                    stack.push({
                        routeId: routes[cur.routeId].startRoute,
                        step: cur.step,
                        len: cur.len+1
                    })
                }

                // if some route ends here, go that way too
                routes.filter(r => r.endRoute == cur.routeId && r.endStep == cur.step).forEach(r => {
                    //console.log('branching back to route', r.id, 'step', cur.step);
                    stack.push({
                        routeId: r.id,
                        step: cur.step,
                        len: cur.len+1
                    })
                });
            }
            // sum res into paths2step[routeId][i]
            let newVal = Object.values(res).reduce((a, v) => a + v, 0n);
            paths2step[routeId][i] = paths2step[routeId][i] !== undefined ? BigInt(paths2step[routeId][i]) : 0n + BigInt(newVal);
            routes[routeId].lastReachedStep = i;

            // if any route spans from routeId, step, runRoute
            routes.filter(r => r.startRoute == routeId && r.startStep == i).forEach(r => runRoute(r.id));
        }
    }
    runRoute(0);
    console.log(paths2step);
    return paths2step[0][routes[0].endStep];
}

// p3 idea: compute how many parts total lead from given step (on given path)
// then the resulting path will be from those allowed steps that still have > 10^n ranked lower
// do not forget to reduce the 10^n by taken steps as we progress

const part3 = input => {
    let [routes, steps] = parse(input);
    let maxStep = Math.max(...steps); // 8

    let nextStepsCache = {};
    const target = 100000000000000000000000000000n;

    const getNextSteps = (routeId, step) => {
        let k = routeId+','+step;
        if (nextStepsCache[k] !== undefined) return nextStepsCache[k];

        let stack = [{routeId: routeId, step: step, len: 0}];
        let res = {}, cur;

        while (cur = stack.pop()) {
            if (cur.len > maxStep) continue;
            if (cur.step < routes[cur.routeId].startStep) continue;
            if (cur.step > routes[cur.routeId].endStep) continue;
            
            // if we are exactly at the available step length, add it to the res
            if (steps.includes(cur.len)) res[cur.routeId + ',' + cur.step] = 1;

            // by default, continue up the current route
            stack.push({routeId: cur.routeId, step: cur.step+1, len: cur.len+1});

            // if we're at the start of any other route, go downstream
            routes.filter(r => r.startRoute == cur.routeId && r.startStep == cur.step).forEach(r => stack.push({
                routeId: r.id,
                step: cur.step,
                len: cur.len+1
            }));

            // if at the end of my route, go upstream
            if (routes[cur.routeId].endStep == cur.step && !isNaN(routes[cur.routeId].endRoute)) stack.push({
                routeId: routes[cur.routeId].endRoute,
                step: cur.step,
                len: cur.len+1
            })
        }

        res = Object.keys(res);
        res.sort((a, b) => {
            let [ra, sa] = a.split(',').map(Number);
            let [rb, sb] = b.split(',').map(Number);
            if (ra != rb) return ra-rb;
            return sa-sb;
        })

        nextStepsCache[k] = res;
        return nextStepsCache[k];
    }

    const allPathsCache = {};

    const getAllPathsFrom = (routeId, step) => {
        let k = routeId+','+step;
        if (allPathsCache[k] !== undefined) return allPathsCache[k];
        if (step == routes[0].endStep) return 1n;
        if (step >= routes[0].endStep) return 0n;
        let nextSteps = getNextSteps(routeId, step);
        let res = 0n;
        res = nextSteps.reduce((a, v) => {
            return a + getAllPathsFrom(...v.split(',').map(Number))
        }, res);
        allPathsCache[k] = res;
        return allPathsCache[k];
    }

    const formatPath = cur => 'S'+(cur[0]+1)+'_'+(cur[1]);

    console.log('p2', getAllPathsFrom(0,0)); // p2 result

    // skim options from the first onwards and if we are within reach, pick that way. If we're not in the reach yet (allpaths[n] is lower than reached, deduce the reached and move on)
    let cur = [0, 0], reached = target, path = [];

    while (cur[0] != 0 || cur[1] != routes[cur[0]].endStep) {
        path.push(formatPath(cur));
        let nextSteps = getNextSteps(cur[0], cur[1]);
        let pathPicked = false;
        for (let i = 0; i < nextSteps.length; i++) {
            let k = nextSteps[i].split(',').map(Number);
            let v = getAllPathsFrom(...k);
            if (v >= reached) {
                cur = k;
                pathPicked = true;
                break;
            }
            reached -= v;
        }
    }

    path.push(formatPath(cur));

    return path.join('-');
}

//console.log('p1', part1(input));
//console.log('p2', part2(input));
//console.log('p2', part2(inputt2));

console.log('p3', part3(input));
