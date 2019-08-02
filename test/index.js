const expect = require('chai').expect;
const sinon = require('sinon');

const { transform } = require('../modules/transform');
const { save, stubFirehoseInstance } = require('../modules/save');

let sinonSandbox = sinon.createSandbox();

describe('Test index', () => {
	// disable all types of console
	before(() => {
		['log', 'info', 'debug', 'warn', 'error'].forEach(type => {
			sinon.stub(console, type);
		})
	});
	// test functions
	describe('Testing Transform Function', () => {
		it('all fields are valid', () => {
			const result = transform('flag', 'product', 'user', 'list of messages');

			expect(result).to.be.an('object');

			expect(result).to.have.own.property('createdAt');
			expect(result).to.have.own.property('flag');
			expect(result).to.have.own.property('product');
			expect(result).to.have.own.property('user');
			expect(result).to.have.own.property('message');

			expect(result.createdAt).to.be.a('string');
			expect(result.flag).to.be.a('string');
			expect(result.product).to.be.a('string');
			expect(result.user).to.be.a('string');
			expect(result.message).to.be.an('array');
		});
		it('empty user field', () => {
			const result = transform('flag', 'product', '', 'list of messages');

			expect(result).to.be.an('object');

			expect(result).to.have.own.property('createdAt');
			expect(result).to.have.own.property('flag');
			expect(result).to.have.own.property('product');
			expect(result).to.have.own.property('user');
			expect(result).to.have.own.property('message');

			expect(result.createdAt).to.be.a('string');
			expect(result.flag).to.be.a('string');
			expect(result.product).to.be.a('string');
			expect(result.user).to.equal('root');
			expect(result.message).to.be.an('array');
		});
		it('empty product field', () => {
			const result = transform('flag', '', 'user', 'list of messages');

			expect(result).to.be.an('object');

			expect(result).to.have.own.property('createdAt');
			expect(result).to.have.own.property('flag');
			expect(result).to.not.have.own.property('product');
			expect(result).to.have.own.property('user');
			expect(result).to.have.own.property('message');

			expect(result.createdAt).to.be.a('string');
			expect(result.flag).to.be.a('string');
			expect(result.product).to.equal(undefined);
			expect(result.user).to.be.a('string');
			expect(result.message).to.be.an('array');
		});
	});
	describe('Testing Save Function', () => {
		it('all fields are valid', async () => {
			const testRecord = {
				createdAt: "timestamp",
				flag: "flag",
				product: "productId",
				user: "userId",
				message: ["list of messages"]
			}
			sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createSuccessStub');
			let result = await save(testRecord);
			expect(result).to.be.an('object');
			sinonSandbox.restore();
		});
		it('error in saving', async () => {
			sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createErrorStub');
			let result = await save({});
			expect(result).to.equal(undefined);
			sinonSandbox.restore();
		});
	});
});
