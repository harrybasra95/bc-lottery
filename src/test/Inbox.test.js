import ganache from 'ganache';
import assert from 'assert';
import { beforeEach, describe, it } from 'mocha';
import Web3 from 'web3';
import contract from '../compile';

const web3 = new Web3(ganache.provider());
let accounts;
let inbox;
const INITIAL_MESSAGE = 'Harry';
beforeEach(async () => {
    // get a list of all account
    accounts = await web3.eth.getAccounts();

    // Use one of those to deploy the contract
    inbox = await new web3.eth.Contract(contract.abi)
        .deploy({
            data: contract.evm.bytecode.object,
            arguments: [INITIAL_MESSAGE],
        })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const newMessage = await inbox.methods.message().call();
        assert.equal(newMessage, INITIAL_MESSAGE);
    });

    it('setMessage is working', async () => {
        const newMessage = 'new message';
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
        const updatedMessage = await inbox.methods.message().call();
        assert.equal(newMessage, updatedMessage);
    });
});
