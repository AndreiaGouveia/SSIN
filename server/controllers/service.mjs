'use strict';

const service1 = async (arg1, arg2) => {
    return arg1 + arg2;
}

const service2 = async (arg1, arg2) => {
    return arg1 * arg2;
}

const service3 = async (arg1, arg2) => {
    return arg1 / arg2;
}

export { service1, service2, service3 }
