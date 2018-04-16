import brain from 'brain.js';

let net = new brain.NeuralNetwork();

net.train([
    {
        input: 5,
        output: {odd: 1}
    },
    {
        input: 3,
        output: {odd: 1}
    },
    {
        input: 1,
        output: {odd: 1}
    },
    {
        input: 7,
        output: {odd: 1}
    },
    {
        input: 9,
        output: {odd: 1}
    },
    {
        input: 11,
        output: {even: 1}
    },
    {
        input: 2,
        output: {even: 1}
    },
    {
        input: 4,
        output: {even: 1}
    },
    {
        input: 6,
        output: {even: 1}
    },
    {
        input: 8,
        output: {even: 1}
    },
    {
        input: 12,
        output: {even: 1}
    },
    {
        input: 14,
        output: {even: 1}
    },
    {
        input: 16,
        output: {even: 1}
    },
    {
        input: 18,
        output: {even: 1}
    },
    {
        input: 20,
        output: {even: 1}
    },
    {
        input: 22,
        output: {even: 1}
    },
    {
        input: 21,
        output: {odd: 1}
    },
    {
        input: 23,
        output: {odd: 1}
    },
    {
        input: 25,
        output: {odd: 1}
    },
    {
        input: 27,
        output: {odd: 1}
    },
    {
        input: 29,
        output: {odd: 1}
    },
    {
        input: 31,
        output: {odd: 1}
    },
])

let result = net.run(1);
console.log(result);