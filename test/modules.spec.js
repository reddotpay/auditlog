const expect = require('chai').expect;
const sinon = require('sinon');

const { transform } = require('../modules/transform');
const { save, stubFirehoseInstance } = require('../modules/save');
const { logArray } = require('../modules/logger');

let sinonSandbox = sinon.createSandbox();

describe('Modules Folder ->', () => {
	before(() => {
		// disable all types of console
		['log', 'info', 'debug', 'warn', 'error'].forEach(type => {
			sinon.stub(console, type);
		});
	});
	describe('transform.js -> transform(flag, product, user, summary, ...message)', () => {
		it('should return an object when everything is valid', () => {
			const result = transform('flag', 'product', 'user', 'summary', 'list of messages');
			expect(result).to.be.an('object');
			expect(result).to.have.keys(['createdAt', 'flag', 'product', 'user', 'summary', 'message']);
			expect(result.createdAt).to.be.a('string');
			expect(result.flag).to.be.a('string');
			expect(result.product).to.be.a('string');
			expect(result.user).to.be.a('string');
			expect(result.summary).to.be.a('string');
			expect(result.message).to.be.an('array');
		});
		it("should return 'root' user when user field is empty", () => {
			const result = transform('flag', 'product', '', 'summary', 'list of messages');
			expect(result).to.be.an('object');
			expect(result).to.have.keys(['createdAt', 'flag', 'product', 'user', 'summary', 'message']);
			expect(result.createdAt).to.be.a('string');
			expect(result.flag).to.be.a('string');
			expect(result.product).to.be.a('string');
			expect(result.user).to.equal('root');
			expect(result.summary).to.be.a('string');
			expect(result.message).to.be.an('array');
		});
		it('should return undefined product when product field is empty', () => {
			const result = transform('flag', '', 'user', 'summary', 'list of messages');
			expect(result).to.be.an('object');
			expect(result).to.have.keys(['createdAt', 'flag', 'user', 'summary', 'message']);
			expect(result.createdAt).to.be.a('string');
			expect(result.flag).to.be.a('string');
			expect(result.product).to.equal(undefined);
			expect(result.user).to.be.a('string');
			expect(result.summary).to.be.a('string');
			expect(result.message).to.be.an('array');
		});
	});
	describe('save.js -> async save(record)', () => {
		it('should return an object when input is valid', async () => {
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
		it('should return error when input is invalid', async () => {
			sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createErrorStub');
			let result = await save({});
			expect(result).to.equal(undefined);
			sinonSandbox.restore();
		});
	});
	describe('logger.js -> const logArray', () => {
		it('should return a data type of array', () => {
			const result = logArray;
			expect(result).to.be.an('array');
		})
	});
});
