const parse = (input, secNr = 0) => {
    let sections = input.split('\n\n');
    return sections[secNr].split('\n').map(line => {
        let [name, val] = line.split(' | ');
        return {name: name, val: Number(val)}
    });
}

let nodes = [];
const addNode = (params, parent = false, layer = 1) => {
    let newId = nodes.length;
    nodes.push({
        id: newId,
        name: params.name,
        val: params.val,
        left: false,
        right: false,
        layer: layer,
        parent: parent
    })
    return newId;
}

const place = data => {
    if (nodes.length == 0) {
        addNode(data, false, 1);
        return;
    }
    let cur = 0; // start from root
    let path = '';
    while (true) {
        if (data.val > nodes[cur].val) {
            // go right
            if (nodes[cur].right !== false) {
                path += nodes[cur].name + '-';
                cur = nodes[cur].right;
            } else {
                // add new node, return
                let newId = addNode(data, cur, nodes[cur].layer+1);
                nodes[cur].right = newId;
                return path+nodes[cur].name;
            }
        } else {
            // go left
            if (nodes[cur].left !== false) {
                path += nodes[cur].name + '-';
                cur = nodes[cur].left;
            } else {
                // add new node, return
                let newId = addNode(data, cur, nodes[cur].layer+1);
                nodes[cur].left = newId;
                return path+nodes[cur].name;
            }
        }
    }
}

const part1 = input => {
    let data = parse(input);

    nodes = [];
    data.forEach(dat => place(dat))

    let layers = Math.max(...nodes.map(n => n.layer));
    let maxSum = 0;
    for (let i = 1; i <= layers; i++) {
        let sum = nodes.filter(n => n.layer == i).reduce((a, v) => a+v.val, 0);
        if (sum > maxSum) maxSum = sum;
    }
    return maxSum*layers;
}

const part2 = input => {
    let data = parse(input);
    part1(input);
    return place({name: 'XXX', val: 500000})
}

const part3 = input => {
    let data = parse(input);
    let p3data = parse(input, 1);
    let name1 = p3data[0].name;
    let name2 = p3data[1].name;
    const getPath = name => {
        let cur = nodes.filter(n => n.name == name)[0];
        let res = [];
        while (cur.id != 0) {
            res.push(cur.name);
            cur = nodes[cur.parent];
        }
        return res;
    }
    part1(input);

    let p1 = getPath(name1);
    let p2 = getPath(name2);
    return p1.filter(name => p2.includes(name))[0];
}


console.log('p1', part1(input));
console.log('p2', part2(input));
console.log('p3', part3(input));