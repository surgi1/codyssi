const parse = input => input.split('\n').map((line, i) => {
    let [nr, code, _1, _2, _3, quality, _4, _5, cost, _6, _7, _8, mats] = line.split(' ');
    return {id: i, code: code, quality: parseInt(quality), cost: parseInt(cost), ef: parseInt(quality)/parseInt(cost), mats: parseInt(mats)}
});

const part1 = input => {
    let items = parse(input);
    console.log(items);
    //console.log(items.sort((a, b) => b.quality - a.quality).slice(0, 5));
    return items.sort((a, b) => {
        if (b.quality != a.quality) return b.quality - a.quality;
        return b.cost - a.cost;
    }).slice(0, 5).map(item => item.mats).reduce((a, v) =>a+v, 0);

}

const part2 = input => {
    let items = parse(input);
    let len = items.length;
    console.log(items);

    let stack = items.map(item => ({
        usedIds: [item.id],
        quality: item.quality,
        mats: item.mats,
        costLeft: 30-item.cost,
    }))
    //console.log(stack);
    let ptr = 0;

    while (ptr < stack.length-1) {
        let p = stack[ptr];
        for (let i = p.usedIds[p.usedIds.length-1]+1; i < len; i++) {
            if (items[i].cost <= p.costLeft) {
                stack.push({
                    usedIds: [...p.usedIds, items[i].id],
                    quality: p.quality + items[i].quality,
                    mats: p.mats + items[i].mats,
                    costLeft: p.costLeft - items[i].cost
                })
            }
        }
        ptr++;
        if (ptr > 10000000) {console.log('em break'); break;}
    }

    stack.sort((a, b) => {
        if (b.quality != a.quality) return b.quality - a.quality;
        return a.mats - b.mats;
    })

    console.log(stack);
    return stack[0].quality*stack[0].mats;
}

const part3 = (input, budget = 150) => {
    let items = parse(input);
    items.sort((a, b) => {
        //if (b.quality != a.quality)
        return b.ef - a.ef
        //return b.cost - a.cost;
    })
    items.forEach((item, i) => item.id = i);
    let len = items.length;
    console.log(items);

    let start = {
        usedIds: [],
        quality: 0,
        mats: 0,
        costLeft: budget
    }

    for (let i = 0; i < 28; i++) {
        start.usedIds.push(i);
        start.quality += items[i].quality;
        start.mats += items[i].mats;
        start.costLeft -= items[i].cost;
    }

    let queue = new FastPriorityQueue((a, b) => b.costLeft > a.costLeft);

    /*items.map(item => queue.add({
        usedIds: [item.id],
        quality: item.quality,
        mats: item.mats,
        costLeft: budget-item.cost,
    }))*/
    queue.add(start);
    //console.log(stack);
    let ptr = 0;

    let finals = [];
    let max = {
        quality: 0,
        mats: 0,
        usedIds: [],
        costLeft: 0,
    };

    //while (ptr < stack.length-1) {
    while (!queue.isEmpty()) {
        let p = queue.poll();
        let isFinal = true;
        for (let i = p.usedIds[p.usedIds.length-1]+1; i < len; i++) {
            if (items[i].cost <= p.costLeft) {
                isFinal = false;
                let newUsedIds = p.usedIds.slice();
                newUsedIds.push(items[i].id);
                queue.add({
                    usedIds: newUsedIds,
                    quality: p.quality + items[i].quality,
                    mats: p.mats + items[i].mats,
                    costLeft: p.costLeft - items[i].cost
                })
            }
        }
        if (isFinal && p.quality > max.quality || (p.quality == max.quality && p.mats < max.mats) ) {
            max = {quality: p.quality, mats: p.mats, usedIds: p.usedIds, costLeft: p.costLeft};
            console.log('new max', max.quality*max.mats, 'reached quality', max.quality, max);
        }
        //ptr++;if (ptr > 1000000000) {console.log('em break'); break;}
    }

    //console.log('finals length', finals.length);

    /*finals.sort((a, b) => {
        if (b.quality != a.quality) return b.quality - a.quality;
        return a.mats - b.mats;
    })*/

    //console.log(finals);
    return max;
    //return max.quality*max.mats;
}

//console.log('p1', part1(input));

//console.log('p2', part2(input));

part3(input, 300)
// 176700, 246370, 259291 incorrect
// 260625 inc
// 260813, 228800 inc
// new max 456411 reached quality 911 incorrect
// quality 929 * mats 545 = 506305 incorrect :(