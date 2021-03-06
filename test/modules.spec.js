const expect = require('chai').expect;
const sinon = require('sinon');

const general = require('../modules/general');
const { logArray, auditArray } = require('../modules/logger');

describe('Modules Folder ->', () => {
	before(() => {
		// disable all types of console
		['log', 'info', 'debug', 'warn', 'error'].forEach(type => {
			sinon.stub(console, type);
		});
	});
	describe('general.js -> transform(flag, product, user, summary, ...message)', () => {
		it('should return an object when everything is valid', () => {
			const result = general.transform('flag', 'product', 'user', 'summary', 'list of messages');
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
			const result = general.transform('flag', 'product', '', 'summary', 'list of messages');
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
			const result = general.transform('flag', '', 'user', 'summary', 'list of messages');
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
	describe('logger.js -> const logArray', () => {
		it('should return a data type of array', () => {
			const result = logArray;
			expect(result).to.be.an('array');
		})
	});
	describe('logger.js -> const auditArray', () => {
		it('should return a data type of array', () => {
			const result = auditArray;
			expect(result).to.be.an('array');
		})
	});
});
